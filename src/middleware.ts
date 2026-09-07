import { NextRequest, NextResponse } from 'next/server'
import { COOKIE_NAME } from './lib/env'

// Mirror of src/lib/auth.ts sessionToken() using edge-safe Web Crypto.
async function expectedToken(): Promise<string> {
  const secret = process.env.ADMIN_SECRET || 'dev-insecure-secret'
  const key = await crypto.subtle.importKey(
    'raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'],
  )
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode('masjid-ar-rahmah-admin-v1'))
  let hex = ''
  new Uint8Array(sig).forEach(b => { hex += b.toString(16).padStart(2, '0') })
  return hex
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const isLogin = pathname === '/admin/login' || pathname === '/api/admin/login'
  if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) {
    if (isLogin) return NextResponse.next()
    const token = await expectedToken()
    if (req.cookies.get(COOKIE_NAME)?.value === token) return NextResponse.next()
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const url = req.nextUrl.clone()
    url.pathname = '/admin/login'
    return NextResponse.redirect(url)
  }
  return NextResponse.next()
}

export const config = { matcher: ['/admin/:path*', '/api/admin/:path*'] }
