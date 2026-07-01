// ── Patterns that OLD regex-based detection would MISS ──────────────
// 1. Arrow functions as object properties: { method: () => {} }
// 2. Generator functions: function* gen() {}
// 3. Named export specifiers: export { name }
// ────────────────────────────────────────────────────────────────────

const heroAnimations = {
  fadeIn: (delay: number) => ({
    opacity: 0,
    animation: `fadeIn 0.6s ease-out ${delay}ms forwards`,
  }),
  slideUp: (delay: number) => ({
    opacity: 0,
    transform: 'translateY(20px)',
    animation: `slideUp 0.6s ease-out ${delay}ms forwards`,
  }),
}

function* generateAnimationDelays(count: number): Generator<number> {
  for (let i = 0; i < count; i++) {
    yield i * 200
  }
}

export { heroAnimations, generateAnimationDelays }

export default function Hero() {
  return (
    <div className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-charcoal">
      {/* Background with gradient mesh */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-charcoal via-charcoal-light to-charcoal opacity-95" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-copper/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-copper/5 rounded-full blur-3xl animate-pulse animation-delay-1000" />
        {/* Subtle pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23c9a96e' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Arabic title - large, decorative */}
        <div className="mb-6 animate-fade-in">
          <span className="font-arabic text-6xl md:text-8xl lg:text-9xl text-copper/90 leading-none block text-shadow-lg">
            مسجد الرحمة
          </span>
        </div>

        {/* English title with editorial typography */}
        <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight tracking-tight animate-slide-up">
          Masjid Ar Rahmah
        </h1>

        {/* Subtitle */}
        <p className="text-lg md:text-xl text-copper-light mb-8 max-w-2xl mx-auto font-sans font-light tracking-wide animate-slide-up animation-delay-200">
          Rumah Rahmat, Keamanan, dan Kemasyarakatan
        </p>

        {/* CTA Button - editorial style */}
        <div className="animate-slide-up animation-delay-400">
          <a
            href="/about"
            className="inline-block bg-transparent border-2 border-copper text-copper hover:bg-copper hover:text-charcoal font-sans font-semibold px-10 py-4 transition-all duration-300 tracking-wider uppercase text-sm md:text-base"
          >
            Baca Kisah Kami
          </a>
        </div>

        {/* Decorative line */}
        <div className="mt-16 flex items-center justify-center gap-4 animate-fade-in animation-delay-600">
          <div className="w-12 h-[1px] bg-copper/40" />
          <div className="w-2 h-2 rotate-45 bg-copper/60" />
          <div className="w-12 h-[1px] bg-copper/40" />
        </div>
      </div>
    </div>
  )
}
