import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Image from 'next/image'
import myChattanoogaDark from '../../public/myChattanooga_long-dark.png'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'myChattanooga Hub',
  description: 'Community, but like online',
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <header>
          <picture>
            <Image src={myChattanoogaDark} alt="myChattanooga Logo" />
          </picture>
        </header>
        <main>{children}</main>
      </body>
    </html>
  )
}
