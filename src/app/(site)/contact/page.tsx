import ContactForm from '@/components/ContactForm'

export default function Contact() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
      {/* Page Header */}
      <div className="mb-16 md:mb-20">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-8 h-[1px] bg-copper/60" />
          <span className="font-sans text-xs uppercase tracking-widest text-copper/80">Hubungi Kami</span>
        </div>
        <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-charcoal mb-6">
          Hubungi Kami
        </h1>
        <p className="text-slate font-sans font-light text-lg max-w-2xl">
          Kami ingin mendengar dari anda. Hubungilah kami dengan sebarang pertanyaan, cadangan, atau sekadar menyapa.
        </p>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16 mb-16">
        {/* Left Column - Contact Info */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-8">
            <h2 className="font-serif text-2xl font-bold text-charcoal mb-6">Get in Touch</h2>
              <div className="space-y-5 font-sans font-light text-slate">
                <div>
                  <p className="text-copper text-sm uppercase tracking-wider mb-2">Alamat</p>
                  <p>Kampung Sungai Buaya<br/>48010 Rawang, Selangor</p>
                </div>
                <div>
                  <p className="text-copper text-sm uppercase tracking-wider mb-2">Telefon</p>
                  <p>03-6028 1822</p>
                </div>
                <div>
                  <p className="text-copper text-sm uppercase tracking-wider mb-2">Emel</p>
                  <p>info@masjidarrahmah.org</p>
                </div>
                <div>
                  <p className="text-copper text-sm uppercase tracking-wider mb-2">Waktu Pejabat</p>
                  <p>Isnin - Jumaat: 9:00 AM - 5:00 PM</p>
                </div>
              </div>
          </div>

          {/* Prayer Times Card */}
          <div className="bg-charcoal text-white p-8">
            <h3 className="font-serif text-xl font-bold mb-4">Waktu Solat</h3>
            <p className="font-sans font-light text-white/70 text-sm">
              Sila semak papan kenyataan atau hubungi kami untuk waktu solat semasa.
            </p>
          </div>

          {/* Visit Card */}
          <div className="border-2 border-copper/30 p-8">
            <h3 className="font-serif text-xl font-bold text-charcoal mb-4">Lawati Kami</h3>
            <p className="font-sans font-light text-slate text-sm">
              Semua dialu-alukan untuk melawat dan bersolat bersama kami. Masjid dibuka setiap hari dari Fajr hingga Isha.
            </p>
          </div>
        </div>

        {/* Right Column - Contact Form */}
        <div className="lg:col-span-3">
          <div className="bg-white p-8 md:p-10">
            <h2 className="font-serif text-2xl font-bold text-charcoal mb-8">Hantar Mesej</h2>
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  )
}
