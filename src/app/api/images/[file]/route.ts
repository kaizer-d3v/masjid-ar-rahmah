import { RAW_BASE } from '@/lib/env'

export const runtime = 'nodejs'

// Serve images committed at runtime (admin uploads) that are not baked into the deployment bundle.
// /api/images/<filename> -> raw.githubusercontent.com/.../public/images/<filename>
const MIME: Record<string, string> = {
  jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', webp: 'image/webp',
  gif: 'image/gif', svg: 'image/svg+xml', avif: 'image/avif',
}

export async function GET(_req: Request, { params }: { params: { file: string } }) {
  const file = params.file.replace(/[^a-z0-9._-]/gi, '')
  if (!file || file.startsWith('.')) return new Response('Bad request', { status: 400 })
  const ext = file.split('.').pop()?.toLowerCase() || ''
  const ct = MIME[ext]
  if (!ct) return new Response('Unsupported type', { status: 400 })

  try {
    const upstream = await fetch(`${RAW_BASE}/public/images/${file}`, {
      headers: { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` },
      cache: 'no-store',
    })
    if (!upstream.ok) return new Response('Not found', { status: 404 })
    const buf = await upstream.arrayBuffer()
    return new Response(buf, {
      status: 200,
      headers: {
        'Content-Type': ct,
        'Cache-Control': 'public, max-age=60, stale-while-revalidate=300',
      },
    })
  } catch {
    return new Response('Upstream error', { status: 502 })
  }
}
