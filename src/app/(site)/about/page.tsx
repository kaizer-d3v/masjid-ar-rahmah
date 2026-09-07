export default function About() {
  const team = [
    {
      name: 'Imam Abdullah',
      role: 'Imam Utama',
      bio: 'Berdedikasi membimbing masyarakat dengan kebijaksanaan, belas kasihan, dan kefahaman mendalam tentang ajaran Islam.',
    },
    {
      name: 'Saudara Ahmed',
      role: 'Koordinator Masyarakat',
      bio: 'Bersemangat membina jambatan dalam masyarakat dan memupuk persekitaran yang menyambut semua orang.',
    },
  ]

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
      {/* Page Header */}
      <div className="mb-16 md:mb-20">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-8 h-[1px] bg-copper/60" />
          <span className="font-sans text-xs uppercase tracking-widest text-copper/80">Kisah Kami</span>
        </div>
        <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-charcoal mb-6">
          Tentang Masjid Ar Rahmah
        </h1>
        <p className="text-slate font-sans font-light text-lg max-w-2xl">
          مسجد الرحمة — Rumah rahmat yang berdedikasi untuk melayani masyarakat Muslim dengan penuh belas kasihan.
        </p>
      </div>

      {/* Mission Section */}
      <div className="bg-white p-10 md:p-12 mb-16 md:mb-20">
        <div className="max-w-3xl">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-charcoal mb-8">
            Misi Kami
          </h2>
          <div className="space-y-6 font-sans font-light text-slate leading-relaxed text-lg">
            <p>
              Masjid Ar Rahmah yang bermaksud "Masjid Rahmat" berdedikasi untuk melayani masyarakat Muslim
              dan menyebarkan mesej keamanan, belas kasihan, dan kefahaman.
            </p>
            <p>
              Kami berusaha mewujudkan persekitaran di mana semua orang dialu-alukan untuk belajar, bersolat, dan berkembang
              dalam iman sambil membina ikatan kemasyarakatan yang kukuh.
            </p>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div>
        <h2 className="font-serif text-3xl md:text-4xl font-bold text-charcoal mb-12">
          Pasukan Kami
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {team.map((member, i) => (
            <div
              key={member.name}
              className="bg-white p-8 md:p-10 animate-slide-up"
              style={{ animationDelay: `${i * 200}ms` }}
            >
              {/* Avatar placeholder */}
              <div className="w-20 h-20 bg-charcoal/5 border-2 border-copper/30 flex items-center justify-center mb-6">
                <span className="text-charcoal/40 text-2xl">👤</span>
              </div>

              <h3 className="font-serif text-2xl font-bold text-charcoal mb-2">
                {member.name}
              </h3>
              <p className="text-copper font-sans text-sm uppercase tracking-wider mb-4">
                {member.role}
              </p>
              <p className="text-slate font-sans font-light leading-relaxed">
                {member.bio}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
