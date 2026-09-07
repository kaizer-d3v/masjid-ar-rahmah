import EventCard from '@/components/EventCard'
import { readContent, type EventItem } from '@/lib/content'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Acara | Masjid Ar Rahmah',
  description: 'Perhimpunan, bengkel, dan acara kemasyarakatan akan datang',
}

export default async function Events() {
  const events = (await readContent('events')) as EventItem[]

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
      {/* Page Header */}
      <div className="mb-16 md:mb-20">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-8 h-[1px] bg-copper/60" />
          <span className="font-sans text-xs uppercase tracking-widest text-copper/80">Masyarakat</span>
        </div>
        <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-charcoal mb-4">
          Acara Akan Datang
        </h1>
        <p className="text-slate font-sans font-light text-lg max-w-2xl">
          Sertailah kami untuk perhimpunan, bengkel, dan acara kemasyarakatan yang akan datang ini.
        </p>
      </div>

      {/* Events List */}
      <div className="space-y-8">
        {events.length === 0 && (
          <p className="text-slate font-sans">Tiada acara buat masa ini.</p>
        )}
        {events.map((event, index) => (
          <EventCard key={event.id || index} {...event} index={index} />
        ))}
      </div>
    </div>
  )
}
