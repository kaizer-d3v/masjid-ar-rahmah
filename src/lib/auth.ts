import { createHmac } from 'node:crypto'
import { SESSION_MSG } from './env'

// Deterministic session token: HMAC-SHA256(ADMIN_SECRET, SESSION_MSG)
// Must produce identical output to src/middleware.ts (edge Web Crypto version).
export function sessionToken(): string {
  const secret = process.env.ADMIN_SECRET || 'dev-insecure-secret'
  return createHmac('sha256', secret).update(SESSION_MSG).digest('hex')
}
