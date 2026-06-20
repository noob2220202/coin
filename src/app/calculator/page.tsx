'use client'

import { useEffect, useMemo, useState } from 'react'
import { usePriceStore } from '@/store/priceStore'
import { connectUpbitWS } from '@/lib/upbit'
import GlassCard from '@/components/ui/GlassCard'
import NumberTicker from '@/components/ui/NumberTicker'

type Unit = 'USDT' | 'BTC' | 'KRW'

function toKrw(amount: number, unit: Unit, usdtKrw: number, btcKrw: number): number {
  if (unit === 'KRW') return amount
  if (unit === 'USDT') return amount * usdtKrw
  return amount * btcKrw
}

function fromKrw(krw: number, unit: Unit, usdtKrw: number, btcKrw: number): number {
  if (unit === 'KRW') return krw
  if (unit === 'USDT') return krw / usdtKrw
  return krw / btcKrw
}

export default function CalculatorPage() {
  const { usdtKrw, btcKrw, setUpbit } = usePriceStore()

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

  const [amount, setAmount] = useState('1')
  const [fromUnit, setFromUnit] = useState<Unit>('USDT')
  const [toUnit, setToUnit] = useState<Unit>('KRW')

  const result = useMemo(() => {
    const num = Number(amount)
    if (!num || !usdtKrw || !btcKrw) return null
    const krw = toKrw(num, fromUnit, usdtKrw, btcKrw)
    return fromKrw(krw, toUnit, usdtKrw, btcKrw)
  }, [amount, fromUnit, toUnit, usdtKrw, btcKrw])

  return (
    <div className="mx-auto max-w-xl px-5 pb-24 flex flex-col gap-8">
      <h1 className="font-gowun text-2xl text-candy text-center">환산 계산기 🍭</h1>

      <GlassCard glow="lav" className="p-6 flex flex-col gap-4">
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
    </div>
  )
}
