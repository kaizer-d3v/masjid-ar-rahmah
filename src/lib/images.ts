// Resolve image src for rendering:
// - external URLs (http/https, incl. Supabase Storage public URLs) pass through untouched
// - legacy local /images/x.jpg paths are proxied via /api/images/x.jpg
export function imgSrc(src?: string): string | undefined {
  if (!src) return undefined
  if (src.startsWith('http://') || src.startsWith('https://')) return src
  if (src.startsWith('/images/')) return `/api/images/${src.slice('/images/'.length)}`
  return src
}
