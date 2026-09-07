import { NextRequest, NextResponse } from 'next/server'
import { sessionToken } from '@/lib/auth'
import { COOKIE_NAME } from '@/lib/env'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  const { password } = await req.json().catch(() => ({}) as { password?: string })
  const expected = process.env.ADMIN_PASSWORD
  if (!expected) {
    return NextResponse.json({ error: 'ADMIN_PASSWORD not configured on server' }, { status: 500 })
  }
  // constant-time-ish compare
  const a = new TextEncoder().encode(String(password ?? ''))
  const b = new TextEncoder().encode(expected)
  let diff = a.length ^ b.length
  for (let i = 0; i < Math.min(a.length, b.length); i++) diff |= a[i] ^ b[i]
  if (diff !== 0) {
    return NextResponse.json({ error: 'Password salah' }, { status: 401 })
  }
  const res = NextResponse.json({ ok: true })
  res.cookies.set(COOKIE_NAME, sessionToken(), {
    httpOnly: true, sameSite: 'lax', secure: true, path: '/', maxAge: 60 * 60 * 24 * 7,
  })
  return res
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true })
  res.cookies.set(COOKIE_NAME, '', { httpOnly: true, path: '/', maxAge: 0 })
  return res
}
