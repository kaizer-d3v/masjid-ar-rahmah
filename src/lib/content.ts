import { REPO, BRANCH, RAW_BASE, type ContentKind } from './env'

export interface Announcement {
  id: string
  title: string
  date: string
  content: string
  image?: string
}

export interface EventItem {
  id: string
  title: string
  date: string
  time: string
  location: string
  description: string
  image?: string
}

export type ContentItem = Announcement | EventItem

function githubHeaders(): Record<string, string> {
  const token = process.env.GITHUB_TOKEN
  if (!token) throw new Error('GITHUB_TOKEN is not set — cannot commit content changes')
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
    'X-GitHub-Api-Version': '2022-11-28',
  }
}

// ---------- READ (raw.githubusercontent, no rate limit, cached 30s) ----------

// Bundled fallback so pages never fail even if content/*.json is not yet pushed to GitHub.
import seedAnnouncements from '../../content/announcements.json'
import seedEvents from '../../content/events.json'

export async function readContent(kind: ContentKind): Promise<ContentItem[]> {
  try {
    const url = `${RAW_BASE}/content/${kind}.json`
    const res = await fetch(url, { next: { tags: [kind, 'home'], revalidate: 30 } })
    if (res.ok) {
      const data = await res.json()
      if (Array.isArray(data)) return data
    }
  } catch {
    /* fall through to seed */
  }
  return (kind === 'announcements' ? seedAnnouncements : seedEvents) as ContentItem[]
}

// ---------- WRITE (GitHub Contents API = git commit) ----------

async function getFileMeta(path: string): Promise<{ sha: string } | null> {
  const res = await fetch(
    `https://api.github.com/repos/${REPO}/contents/${encodeURIComponent(path)}?ref=${BRANCH}`,
    { headers: { ...githubHeaders(), Accept: 'application/vnd.github+json' }, cache: 'no-store' },
  )
  if (res.status === 404) return null
  if (!res.ok) throw new Error(`GitHub lookup ${path}: HTTP ${res.status}`)
  const j = await res.json()
  return { sha: j.sha }
}

async function putFile(path: string, base64: string, message: string, sha?: string | null) {
  const body: Record<string, unknown> = { message, content: base64, branch: BRANCH }
  if (sha) body.sha = sha
  const res = await fetch(
    `https://api.github.com/repos/${REPO}/contents/${encodeURIComponent(path)}`,
    { method: 'PUT', headers: githubHeaders(), body: JSON.stringify(body) },
  )
  if (!res.ok) {
    const err = await res.text()
    throw new Error(`GitHub commit ${path}: HTTP ${res.status} ${err.slice(0, 200)}`)
  }
  return res.json()
}

export async function writeContent(kind: ContentKind, items: ContentItem[], message: string) {
  const path = `content/${kind}.json`
  const meta = await getFileMeta(path)
  const base64 = Buffer.from(JSON.stringify(items, null, 2) + '\n', 'utf8').toString('base64')
  await putFile(path, base64, message, meta?.sha ?? null)
  revalidateKind(kind)
}

export async function uploadImage(file: File): Promise<string> {
  if (!file.type.startsWith('image/')) throw new Error('Only image files are allowed')
  if (file.size > 3 * 1024 * 1024) throw new Error('Image too large (max 3MB)')
  const safe = file.name.toLowerCase().replace(/[^a-z0-9._-]+/g, '-').replace(/^-+|-+$/g, '') || 'image.jpg'
  const path = `public/images/${Date.now()}-${safe}`
  const buf = Buffer.from(await file.arrayBuffer()).toString('base64')
  const meta = await getFileMeta(path)
  await putFile(path, buf, `admin: upload ${path}`, meta?.sha ?? null)
  return `/images/${path.split('/').pop()}`
}

// ---------- CACHE REVALIDATION ----------

export function revalidateKind(kind: ContentKind) {
  // best-effort: tell Vercel the tagged routes are fresh now
  import('next/cache')
    .then(({ revalidateTag }) => {
      revalidateTag(kind)
      revalidateTag('home')
    })
    .catch(() => {})
}
