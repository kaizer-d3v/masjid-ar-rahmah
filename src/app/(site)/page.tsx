import Hero from '@/components/Hero'
import AnnouncementCard from '@/components/AnnouncementCard'

export default function Home() {
  const features = [
    {
      icon: '🕌',
      title: 'Lima Waktu Solat',
      description: 'Sertailah kami untuk solat berjemaah lima waktu, mempererat hubungan spiritual dan kemasyarakatan.',
    },
    {
      icon: '📚',
      title: 'Kelas Al-Quran',
      description: 'Belajar Al-Quran dengan tajwid yang betul dan fahaman melalui program pendidikan berstruktur kami.',
    },
    {
      icon: '🤝',
      title: 'Perkhidmatan Masyarakat',
      description: 'Berkhidmat kepada masyarakat dengan penuh belas kasihan melalui inisiatif jangkauan dan amal.',
    },
  ]

  const announcements = [
    {
      title: 'Solat Jumaat',
      date: '5 Mei 2026',
      content: 'Solat Jumaat akan diadakan pada pukul 12:30 PM. Sila hadir awal.',
      image: '/images/announcement-jumaat.jpg',
    },
    {
      title: 'Kelas Al-Quran',
      date: '10 Mei 2026',
      content: 'Kelas Al-Quran untuk kanak-kanak akan bermula minggu hadapan. Pendaftaran dibuka.',
    },
    {
      title: 'Gotong Royong',
      date: '15 Mei 2026',
      content: 'Gotong royong membersihkan kawasan masjid. Mari kita bersama-sama.',
      image: '/images/announcement-gotong.jpg',
    },
  ]

  return (
    <>
      <Hero />

      {/* Editorial Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
        {/* Section Header */}
        <div className="mb-16 md:mb-20 max-w-2xl">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-8 h-[1px] bg-copper/60" />
            <span className="font-sans text-xs uppercase tracking-widest text-copper/80">Apa yang Kami Tawarkan</span>
          </div>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-charcoal leading-tight text-balance">
            Tempat Ibadah,<br />
            <span className="text-copper">Pembelajaran & Kemasyarakatan</span>
          </h2>
        </div>

        {/* Asymmetric Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6">
          {features.map((feature, i) => (
            <div
              key={feature.title}
              className={`group p-8 bg-white hover:shadow-xl transition-all duration-500 animate-slide-up ${
                i === 1 ? 'md:translate-y-8' : ''
              }`}
              style={{ animationDelay: `${i * 200}ms` }}
            >
              {/* Icon with decorative border */}
              <div className="relative mb-6 inline-block">
                <div className="w-16 h-16 flex items-center justify-center border-2 border-copper/30 group-hover:border-copper/60 transition-colors duration-300">
                  <span className="text-3xl">{feature.icon}</span>
                </div>
                <div className="absolute -bottom-2 -right-2 w-4 h-4 rotate-45 bg-copper/20" />
              </div>

              <h3 className="font-serif text-2xl font-bold text-charcoal mb-4 group-hover:text-copper transition-colors duration-300">
                {feature.title}
              </h3>

              <p className="text-slate font-sans font-light leading-relaxed">
                {feature.description}
              </p>

              {/* Hover line */}
              <div className="w-8 h-[2px] bg-copper/40 mt-6 group-hover:w-16 transition-all duration-500" />
            </div>
          ))}
        </div>
      </section>

      {/* Decorative Divider */}
      <div className="flex items-center justify-center py-12">
        <div className="w-24 h-[1px] bg-copper/30" />
        <div className="mx-4 w-3 h-3 rotate-45 bg-copper/40" />
        <div className="w-24 h-[1px] bg-copper/30" />
      </div>

      {/* Announcements Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 md:pb-32">
        <div className="mb-16 md:mb-20 max-w-2xl">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-8 h-[1px] bg-copper/60" />
            <span className="font-sans text-xs uppercase tracking-widest text-copper/80">Pengumuman</span>
          </div>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-charcoal leading-tight text-balance">
            Pengumuman <span className="text-copper">Terbaru</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {announcements.map((announcement, i) => (
            <AnnouncementCard
              key={announcement.title}
              title={announcement.title}
              date={announcement.date}
              content={announcement.content}
              index={i}
            />
          ))}
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 md:pb-32 text-center">
        <h2 className="font-serif text-3xl md:text-4xl font-bold text-charcoal mb-6">
          Sertai Masyarakat Kami
        </h2>
        <p className="text-slate font-sans font-light leading-relaxed mb-10 max-w-2xl mx-auto">
          Sama ada anda mencari pertumbuhan spiritual, peluang pendidikan, atau cara untuk berbakti,
          Masjid Ar Rahmah menyambut anda dengan tangan terbuka.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="/events"
            className="inline-block bg-charcoal text-white px-10 py-4 font-sans text-sm font-semibold tracking-wider uppercase hover:bg-charcoal-light transition-colors duration-300"
          >
            Lihat Acara
          </a>
          <a
            href="/contact"
            className="inline-block bg-transparent border-2 border-charcoal text-charcoal px-10 py-4 font-sans text-sm font-semibold tracking-wider uppercase hover:bg-charcoal hover:text-white transition-all duration-300"
          >
            Hubungi Kami
          </a>
        </div>
      </section>
    </>
  )
}
