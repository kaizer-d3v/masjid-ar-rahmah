import './../styles/globals.css'
import { Playfair_Display, Syne } from 'next/font/google'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
})

const syne = Syne({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

export const metadata = {
  title: 'Masjid Ar Rahmah | Rumah Rahmat',
  description: 'Tempat yang aman untuk beribadah dan bermasyarakat di tengah kota',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ms" className={`${playfair.variable} ${syne.variable}`}>
      <body className="bg-ivory min-h-screen flex flex-col font-sans grain-overlay">
        {children}
      </body>
    </html>
  )
}
