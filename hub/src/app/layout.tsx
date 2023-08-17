import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Image from 'next/image'
import myChattanoogaDark from '../../public/myChattanooga_long-dark.png'

import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'

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
