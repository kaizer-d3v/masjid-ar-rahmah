import AnnouncementCard from '@/components/AnnouncementCard'
import { readContent, type Announcement } from '@/lib/content'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Pengumuman | Masjid Ar Rahmah',
  description: 'Berita terkini dan pengumuman dari komuniti Masjid Ar-Rahmah',
}

export default async function Announcements() {
  const announcements = (await readContent('announcements')) as Announcement[]

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
      {/* Page Header */}
      <div className="mb-16 md:mb-20">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-8 h-[1px] bg-copper/60" />
          <span className="font-sans text-xs uppercase tracking-widest text-copper/80">Berita Terkini</span>
        </div>
        <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-charcoal mb-4">
          Pengumuman
        </h1>
        <p className="text-slate font-sans font-light text-lg max-w-2xl">
          Dapatkan berita terkini dan pengumuman dari komuniti kami.
        </p>
      </div>

      {/* Announcements List */}
      <div className="space-y-8">
        {announcements.length === 0 && (
          <p className="text-slate font-sans">Tiada pengumuman buat masa ini.</p>
        )}
        {announcements.map((announcement, index) => (
          <AnnouncementCard key={announcement.id || index} {...announcement} index={index} />
        ))}
      </div>
    </div>
  )
}
