export const REPO = process.env.CONTENT_REPO || 'kaizer-d3v/masjid-ar-rahmah'
export const BRANCH = process.env.CONTENT_BRANCH || 'main'
export const RAW_BASE = `https://raw.githubusercontent.com/${REPO}/${BRANCH}`
export const COOKIE_NAME = 'arrahmah_admin'
export const SESSION_MSG = 'masjid-ar-rahmah-admin-v1'
export type ContentKind = 'announcements' | 'events'
export const KINDS: ContentKind[] = ['announcements', 'events']
