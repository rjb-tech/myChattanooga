import './styles/globals.scss'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { SpeedInsights } from '@vercel/speed-insights/next'

import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import styles from './layout.module.scss'
import { NewsContextProvider } from '@/context/news.context'
import MyChattanoogaTheme from '@/components/Theme'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'myChattanooga News',
  description: 'Real-time Chattanoga news aggregation',
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <SpeedInsights />
      <MyChattanoogaTheme>
        <body className={inter.className}>
          <main className={styles.contentSection}>
            <NewsContextProvider>{children}</NewsContextProvider>
          </main>
        </body>
      </MyChattanoogaTheme>
    </html>
  )
}
