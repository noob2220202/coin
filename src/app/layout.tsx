import type { Metadata } from 'next'
import { Toaster } from 'react-hot-toast'
import CloudBackground from '@/components/CloudBackground'
import Navbar from '@/components/Navbar'
import AdBanner from '@/components/AdBanner'
import '@fontsource/jua/400.css'
import '@fontsource/space-grotesk/300.css'
import '@fontsource/space-grotesk/400.css'
import '@fontsource/space-grotesk/500.css'
import '@fontsource/space-grotesk/600.css'
import '@fontsource/space-grotesk/700.css'
import '@fontsource/quicksand/400.css'
import '@fontsource/quicksand/500.css'
import '@fontsource/quicksand/600.css'
import './globals.css'

export const metadata: Metadata = {
  title: '🍭 솜사탕 크립토 — 실시간 시세 · 스왑 · 에너지',
  description: '김프/역프 실시간 계산, USDT 시세, 코인 스왑, 트론 에너지 임대',
  openGraph: {
    title: '🍭 솜사탕 크립토',
    description: '달콤한 크립토 유틸리티',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko">
      <body className="antialiased">
        <CloudBackground />
        <Navbar />
        <main className="relative z-10 pt-24">
          <AdBanner />
          {children}
        </main>
        <Toaster
          toastOptions={{
            style: {
              background: '#FFFFFF',
              color: '#8B6BFF',
              border: '1px solid rgba(139,107,255,0.25)',
              borderRadius: '1rem',
              boxShadow: '0 8px 24px rgba(139,107,255,0.15)',
            },
          }}
        />
      </body>
    </html>
  )
}
