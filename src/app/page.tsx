'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeftRight, Zap, Calculator } from 'lucide-react'
import { usePriceStore } from '@/store/priceStore'
import { connectUpbitWS } from '@/lib/upbit'
import { fetchUsdKrw } from '@/lib/exchangeRate'
import NumberTicker from '@/components/ui/NumberTicker'
import KimpBadge from '@/components/KimpBadge'
import PriceCard from '@/components/PriceCard'
import GlassCard from '@/components/ui/GlassCard'

const SHORTCUTS = [
  { label: '스왑', href: '/swap', icon: ArrowLeftRight, glow: 'pink' as const },
  { label: '에너지 임대', href: '/energy', icon: Zap, glow: 'lav' as const },
  { label: '계산기', href: '/calculator', icon: Calculator, glow: 'mint' as const },
]

export default function Home() {
  const { usdtKrw, btcKrw, usdKrw, kimpPercent, upbitConnected, setUpbit, setUsdKrw, setUpbitConnected } =
    usePriceStore()

  useEffect(() => {
    let usdt = 0
    let btc = 0

    const upbitWs = connectUpbitWS((market, price) => {
      if (market === 'KRW-USDT') usdt = price
      if (market === 'KRW-BTC') btc = price
      if (usdt && btc) setUpbit(usdt, btc)
    }, setUpbitConnected)

    return () => {
      upbitWs.close()
    }
  }, [setUpbit, setUpbitConnected])

  useEffect(() => {
    let retryTimer: ReturnType<typeof setTimeout>
    const loadRate = () => {
      fetchUsdKrw()
        .then(setUsdKrw)
        .catch((err) => {
          console.error('[환율] 불러오기 실패', err)
          retryTimer = setTimeout(loadRate, 10 * 1000)
        })
    }
    loadRate()
    const interval = setInterval(loadRate, 5 * 60 * 1000)
    return () => {
      clearInterval(interval)
      clearTimeout(retryTimer)
    }
  }, [setUsdKrw])

  return (
    <div className="mx-auto max-w-6xl px-5 pb-24">
      {/* 히어로 */}
      <section className="flex flex-col items-center text-center gap-4 py-16">
        <span className="font-noto text-sm text-muted">실시간 환율 (USD/KRW)</span>
        <div className="font-space text-candy-pink" style={{ fontSize: 'clamp(48px, 10vw, 96px)', fontWeight: 300 }}>
          {usdKrw !== null ? (
            <NumberTicker value={usdKrw} decimals={2} suffix="원" />
          ) : (
            <span className="text-muted">불러오는 중...</span>
          )}
        </div>
        <div className="mt-2">
          <KimpBadge percent={kimpPercent} />
        </div>
        {!upbitConnected && (
          <span className="font-noto text-xs text-candy-peach">재연결 중...</span>
        )}
      </section>

      {/* 가격 카드 3개 */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0 }}>
          <PriceCard label="USDT/KRW" value={usdtKrw} unit="원" source="업비트" />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.1 }}>
          <PriceCard label="BTC/KRW" value={btcKrw} unit="원" source="업비트" />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.2 }}>
          <PriceCard label="USD/KRW" value={usdKrw} decimals={2} unit="원" source="실시간환율" />
        </motion.div>
      </section>

      {/* 바로가기 */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-16">
        {SHORTCUTS.map((item, i) => (
          <motion.div
            key={item.href}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 * i }}
          >
            <Link href={item.href}>
              <GlassCard glow={item.glow} className="p-6 flex items-center gap-4 cursor-pointer">
                <item.icon className="text-candy-lav" size={28} />
                <span className="font-quick font-medium text-lg">{item.label}</span>
              </GlassCard>
            </Link>
          </motion.div>
        ))}
      </section>
    </div>
  )
}
