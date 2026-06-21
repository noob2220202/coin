'use client'

import { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import { usePriceStore } from '@/store/priceStore'
import { connectUpbitWS } from '@/lib/upbit'
import GlassCard from '@/components/ui/GlassCard'
import NumberTicker from '@/components/ui/NumberTicker'

type Unit = 'USDT' | 'BTC' | 'KRW'
type RateSource = 'google' | 'bithumb'

function toKrw(amount: number, unit: Unit, usdtRate: number, btcKrw: number): number {
  if (unit === 'KRW') return amount
  if (unit === 'USDT') return amount * usdtRate
  return amount * btcKrw
}

function fromKrw(krw: number, unit: Unit, usdtRate: number, btcKrw: number): number {
  if (unit === 'KRW') return krw
  if (unit === 'USDT') return krw / usdtRate
  return krw / btcKrw
}

export default function CalculatorPage() {
  const { btcKrw, usdKrw, setUpbit, setUsdKrw } = usePriceStore()
  const [bithumbUsdtKrw, setBithumbUsdtKrw] = useState<number | null>(null)
  const [rateSource, setRateSource] = useState<RateSource>('google')

  useEffect(() => {
    let usdt = 0
    let btc = 0
    const upbitWs = connectUpbitWS((market, price) => {
      if (market === 'KRW-USDT') usdt = price
      if (market === 'KRW-BTC') btc = price
      if (usdt && btc) setUpbit(usdt, btc)
    })
    return () => {
      upbitWs.close()
    }
  }, [setUpbit])

  // 구글가 (실시간 환율) — 홈을 거치지 않고 계산기로 바로 들어와도 채워지도록 직접 조회
  useEffect(() => {
    let retryTimer: ReturnType<typeof setTimeout>
    const loadRate = () => {
      axios
        .get('/api/exchange-rate')
        .then(({ data }) => setUsdKrw(data.rate))
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

  // 빗썸가 (빗썸 USDT/KRW 시세)
  useEffect(() => {
    let retryTimer: ReturnType<typeof setTimeout>
    const loadRate = () => {
      axios
        .get('/api/bithumb-rate')
        .then(({ data }) => setBithumbUsdtKrw(data.rate))
        .catch((err) => {
          console.error('[빗썸] 불러오기 실패', err)
          retryTimer = setTimeout(loadRate, 10 * 1000)
        })
    }
    loadRate()
    const interval = setInterval(loadRate, 5 * 60 * 1000)
    return () => {
      clearInterval(interval)
      clearTimeout(retryTimer)
    }
  }, [])

  const [amount, setAmount] = useState('1')
  const [fromUnit, setFromUnit] = useState<Unit>('USDT')
  const [toUnit, setToUnit] = useState<Unit>('KRW')

  const usdtRate = rateSource === 'google' ? usdKrw : bithumbUsdtKrw

  const result = useMemo(() => {
    const num = Number(amount)
    if (!num || !usdtRate || !btcKrw) return null
    const krw = toKrw(num, fromUnit, usdtRate, btcKrw)
    return fromKrw(krw, toUnit, usdtRate, btcKrw)
  }, [amount, fromUnit, toUnit, usdtRate, btcKrw])

  return (
    <div className="mx-auto max-w-xl px-6 pb-24 flex flex-col gap-8">
      <h1 className="font-gowun text-2xl text-candy text-center">환산 계산기 🍭</h1>

      <div className="flex items-center justify-center gap-2">
        {(['google', 'bithumb'] as const).map((src) => (
          <button
            key={src}
            type="button"
            onClick={() => setRateSource(src)}
            className={`rounded-full border px-5 py-2 font-quick text-sm font-medium transition-colors ${
              rateSource === src
                ? 'bg-candy-lav/10 border-candy-lav text-candy-lav'
                : 'border-soft text-muted hover:border-candy-lav/40'
            }`}
          >
            {src === 'google' ? '구글가' : '빗썸가'}
          </button>
        ))}
      </div>

      <GlassCard glow="lav" className="p-7 flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="candy-input flex-1 min-w-[100px] px-4 py-3 num"
          />
          <select
            value={fromUnit}
            onChange={(e) => setFromUnit(e.target.value as Unit)}
            className="candy-input px-3 py-3"
          >
            <option value="USDT">USDT</option>
            <option value="BTC">BTC</option>
            <option value="KRW">KRW</option>
          </select>
          <span className="font-quick text-candy-lav">=</span>
          <div className="candy-input flex-1 min-w-[100px] px-4 py-3 num text-candy-mint">
            {result !== null ? <NumberTicker value={result} decimals={toUnit === 'KRW' ? 0 : 6} /> : '--'}
          </div>
          <select
            value={toUnit}
            onChange={(e) => setToUnit(e.target.value as Unit)}
            className="candy-input px-3 py-3"
          >
            <option value="KRW">KRW</option>
            <option value="USDT">USDT</option>
            <option value="BTC">BTC</option>
          </select>
        </div>
      </GlassCard>

      <p className="font-noto text-xs text-muted text-center">
        USDT ↔ KRW 기준: {rateSource === 'google' ? '구글가 (실시간 환율)' : '빗썸가 (빗썸 USDT/KRW 시세)'} · BTC ↔ KRW는
        업비트 시세 고정
      </p>
    </div>
  )
}
