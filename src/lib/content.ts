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

// ---------- Supabase config ----------

const SUPA_URL = process.env.SUPABASE_URL || ''
const SUPA_KEY = process.env.SUPABASE_SERVICE_KEY || ''

const TABLE: Record<ContentKind, string> = { announcements: 'announcements', events: 'events' }

function supaHeaders(extra: Record<string, string> = {}): Record<string, string> {
  if (!SUPA_URL || !SUPA_KEY) throw new Error('SUPABASE_URL / SUPABASE_SERVICE_KEY not configured')
  return {
    apikey: SUPA_KEY,
    Authorization: `Bearer ${SUPA_KEY}`,
    'Content-Type': 'application/json',
    ...extra,
  }
}

async function supa(path: string, init: { method?: string; body?: unknown; headers?: Record<string, string> } = {}) {
  const res = await fetch(`${SUPA_URL}${path}`, {
    method: init.method || 'GET',
    headers: supaHeaders(init.headers),
    body: init.body !== undefined ? JSON.stringify(init.body) : undefined,
    cache: 'no-store',
  })
  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Supabase ${init.method || 'GET'} ${path}: HTTP ${res.status} ${err.slice(0, 200)}`)
  }
  return res
}

// ---------- READ ----------

// Bundled fallback so pages never fail even if Supabase is unreachable.
import seedAnnouncements from '../../content/announcements.json'
import seedEvents from '../../content/events.json'

export async function readContent(kind: ContentKind): Promise<ContentItem[]> {
  if (SUPA_URL && SUPA_KEY) {
    try {
      const res = await supa(`/rest/v1/${TABLE[kind]}?select=*&order=sort_order.asc,id.asc`)
      const rows = (await res.json()) as Array<Record<string, unknown>>
      return rows.map(r => {
        if (kind === 'announcements') {
          return {
            id: String(r.id), title: String(r.title), date: String(r.date_label),
            content: String(r.content), image: (r.image as string) || undefined,
          }
        }
        return {
          id: String(r.id), title: String(r.title), date: String(r.date_label),
          time: String(r.time_label ?? ''), location: String(r.location ?? ''),
          description: String(r.description), image: (r.image as string) || undefined,
        }
      })
    } catch {
      /* fall through to seed */
    }
  }
  return (kind === 'announcements' ? seedAnnouncements : seedEvents) as ContentItem[]
}

// ---------- WRITE ----------

export async function writeContent(kind: ContentKind, items: ContentItem[], _message?: string) {
  const table = TABLE[kind]
  const rows = items.map((it, i) => {
    const base: Record<string, unknown> = {
      id: it.id, title: it.title, date_label: it.date,
      image: it.image || null, sort_order: i, updated_at: new Date().toISOString(),
    }
    if (kind === 'announcements') {
      base.content = (it as Announcement).content
    } else {
      base.time_label = (it as EventItem).time || ''
      base.location = (it as EventItem).location || ''
      base.description = (it as EventItem).description
    }
    return base
  })

  // 1) upsert everything (insert new / update existing), order via sort_order
  await supa(`/rest/v1/${table}`, {
    method: 'POST',
    headers: { Prefer: 'resolution=merge-duplicates,return=minimal' },
    body: rows,
  })
  // 2) delete rows that are no longer in the payload
  if (rows.length > 0) {
    const keep = rows.map(r => `"${r.id}"`).join(',')
    await supa(`/rest/v1/${table}?id=not.in.(${keep})`, { method: 'DELETE' })
  } else {
    // payload empty -> clear table
    await supa(`/rest/v1/${table}?id=neq.__none__`, { method: 'DELETE' })
  }
}

// ---------- IMAGE UPLOAD (Supabase Storage, public bucket "images") ----------

export async function uploadImage(file: File): Promise<string> {
  if (!file.type.startsWith('image/')) throw new Error('Only image files are allowed')
  if (file.size > 3 * 1024 * 1024) throw new Error('Image too large (max 3MB)')
  const ext = (file.name.split('.').pop() || 'jpg').toLowerCase().replace(/[^a-z0-9]/g, '') || 'jpg'
  const safe = file.name.toLowerCase().replace(/\.[^.]+$/, '').replace(/[^a-z0-9._-]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60)
  const path = `${Date.now()}-${safe}.${ext}`
  const buf = await file.arrayBuffer()
  const res = await fetch(`${SUPA_URL}/storage/v1/object/images/${path}`, {
    method: 'POST',
    headers: {
      apikey: SUPA_KEY,
      Authorization: `Bearer ${SUPA_KEY}`,
      'Content-Type': file.type || 'application/octet-stream',
      'x-upsert': 'true',
    },
    body: buf,
    cache: 'no-store',
  })
  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Storage upload: HTTP ${res.status} ${err.slice(0, 200)}`)
  }
  return `${SUPA_URL}/storage/v1/object/public/images/${path}`
}

// ---------- CACHE REVALIDATION ----------

export function revalidateKind(kind: ContentKind) {
  // no ISR anymore — pages are force-dynamic, nothing to revalidate
  void kind
  void RAW_BASE
  void REPO
  void BRANCH
}
