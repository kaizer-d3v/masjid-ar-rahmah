import { imgSrc } from '@/lib/images'

interface AnnouncementCardProps {
  title: string
  date: string
  content: string
  image?: string
  index?: number
}

export default function AnnouncementCard({ title, date, content, image, index = 0 }: AnnouncementCardProps) {
  const src = imgSrc(image)
  return (
    <div
      className="bg-white p-8 border-l-2 border-copper hover:shadow-lg transition-all duration-500 animate-slide-up"
      style={{ animationDelay: `${index * 150}ms` }}
    >
      {src && (
        <div className="mb-6 overflow-hidden">
          <img src={src} alt={title} className="w-full h-48 object-cover" />
        </div>
      )}

      <div className="flex items-center gap-3 mb-4">
        <div className="w-2 h-2 rotate-45 bg-copper" />
        <p className="text-xs font-sans uppercase tracking-widest text-copper/80">{date}</p>
      </div>

      <h3 className="font-serif text-xl font-bold text-charcoal mb-4 hover:text-copper transition-colors duration-300">
        {title}
      </h3>

      <p className="text-slate font-sans font-light leading-relaxed">
        {content}
      </p>
    </div>
  )
}
