import type { Metadata } from 'next'
import { Toaster } from 'react-hot-toast'
import BlobBackground from '@/components/BlobBackground'
import Navbar from '@/components/Navbar'
import '@fontsource/noto-sans-kr/300.css'
import '@fontsource/noto-sans-kr/400.css'
import '@fontsource/noto-sans-kr/500.css'
import '@fontsource/noto-sans-kr/700.css'
import '@fontsource/gowun-dodum/400.css'
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
        <BlobBackground />
        <Navbar />
        <main className="relative z-10 pt-24">{children}</main>
        <Toaster
          toastOptions={{
            style: {
              background: '#231545',
              color: '#FFB5E8',
              border: '1px solid rgba(255,181,232,0.3)',
              borderRadius: '1rem',
            },
          }}
        />
      </body>
    </html>
  )
}
