import { imgSrc } from '@/lib/images'

interface EventCardProps {
  title: string
  date: string
  time: string
  location: string
  description: string
  image?: string
  index?: number
}

export default function EventCard({ title, date, time, location, description, image, index = 0 }: EventCardProps) {
  const src = imgSrc(image)
  return (
    <div
      className="glass p-8 hover:border-copper/40 transition-all duration-500 group animate-fade-in"
      style={{ animationDelay: `${index * 150}ms` }}
    >
      {src && (
        <div className="mb-6 -mx-8 -mt-8 overflow-hidden">
          <img src={src} alt={title} className="w-full h-48 object-cover" />
        </div>
      )}

      {/* Decorative top accent */}
      <div className="w-12 h-[2px] bg-copper/60 mb-6 group-hover:w-20 transition-all duration-500" />

      <h3 className="font-serif text-2xl font-bold text-charcoal mb-4 group-hover:text-copper transition-colors duration-300">
        {title}
      </h3>

      <div className="space-y-3 text-sm font-sans font-light text-slate mb-6">
        <div className="flex items-center gap-3">
          <span className="text-copper">📅</span>
          <span>{date}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-copper">🕐</span>
          <span>{time}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-copper">📍</span>
          <span>{location}</span>
        </div>
      </div>

      <p className="text-slate font-sans font-light leading-relaxed">
        {description}
      </p>
    </div>
  )
}
