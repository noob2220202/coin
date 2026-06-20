import type { Metadata } from 'next'
import { Noto_Sans_KR, Gowun_Dodum, Space_Grotesk, Quicksand } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
import BlobBackground from '@/components/BlobBackground'
import Navbar from '@/components/Navbar'
import './globals.css'

const notoSansKR = Noto_Sans_KR({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
  variable: '--font-noto',
  display: 'swap',
})

const gowunDodum = Gowun_Dodum({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-gowun',
  display: 'swap',
})

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-space',
  display: 'swap',
})

const quicksand = Quicksand({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-quick',
  display: 'swap',
})

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
      <body
        className={`${notoSansKR.variable} ${gowunDodum.variable} ${spaceGrotesk.variable} ${quicksand.variable} antialiased`}
      >
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
