import { redirect } from 'next/navigation'
import { readContent } from '@/lib/content'
import AdminApp from './AdminApp'

export const dynamic = 'force-dynamic'

export default async function AdminPage() {
  let announcements, events
  try {
    ;[announcements, events] = await Promise.all([
      readContent('announcements'),
      readContent('events'),
    ])
  } catch {
    redirect('/admin/login')
  }
  return <AdminApp initial={{ announcements, events }} />
}
