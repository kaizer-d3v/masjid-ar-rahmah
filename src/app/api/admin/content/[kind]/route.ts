import { NextRequest, NextResponse } from 'next/server'
import { readContent, writeContent, type ContentItem } from '@/lib/content'
import { KINDS, type ContentKind } from '@/lib/env'

export const runtime = 'nodejs'

function bad(msg: string, status = 400) {
  return NextResponse.json({ error: msg }, { status })
}

function validate(kind: ContentKind, items: unknown): ContentItem[] | string {
  if (!Array.isArray(items)) return 'Payload must be a JSON array'
  const out: ContentItem[] = []
  for (const raw of items) {
    if (!raw || typeof raw !== 'object') return 'Each item must be an object'
    const it = raw as Record<string, unknown>
    if (typeof it.title !== 'string' || !it.title.trim()) return 'Item missing title'
    if (typeof it.date !== 'string' || !it.date.trim()) return 'Item missing date'
    const base = {
      id: typeof it.id === 'string' && it.id ? it.id : Math.random().toString(36).slice(2, 10),
      title: String(it.title).slice(0, 200),
      date: String(it.date).slice(0, 100),
      image: typeof it.image === 'string' && it.image.trim() ? it.image.slice(0, 500) : undefined,
    }
    if (kind === 'announcements') {
      const content = typeof it.content === 'string' ? it.content.slice(0, 5000) : ''
      if (!content) return 'Announcement missing content'
      out.push({ ...base, content })
    } else {
      const ev = {
        ...base,
        time: typeof it.time === 'string' ? it.time.slice(0, 100) : '',
        location: typeof it.location === 'string' ? it.location.slice(0, 200) : '',
        description: typeof it.description === 'string' ? it.description.slice(0, 5000) : '',
      }
      if (!ev.description) return 'Event missing description'
      out.push(ev)
    }
  }
  return out
}

export async function GET(_req: NextRequest, { params }: { params: { kind: string } }) {
  const kind = params.kind as ContentKind
  if (!KINDS.includes(kind)) return bad('Unknown kind', 404)
  try {
    return NextResponse.json(await readContent(kind))
  } catch (e) {
    return bad(String((e as Error).message), 500)
  }
}

export async function PUT(req: NextRequest, { params }: { params: { kind: string } }) {
  const kind = params.kind as ContentKind
  if (!KINDS.includes(kind)) return bad('Unknown kind', 404)
  const body = await req.json().catch(() => null)
  if (!body || !Array.isArray(body.items)) return bad('Body must be { items: [...] }')
  const result = validate(kind, body.items)
  if (typeof result === 'string') return bad(result)
  try {
    const verb = typeof body.message === 'string' && body.message ? body.message.slice(0, 100) : `admin: update ${kind}`
    await writeContent(kind, result, verb)
    return NextResponse.json({ ok: true })
  } catch (e) {
    return bad(String((e as Error).message), 500)
  }
}
