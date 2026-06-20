'use client'

import { useEffect, useMemo, useState } from 'react'
import { usePriceStore } from '@/store/priceStore'
import { connectUpbitWS } from '@/lib/upbit'
import { connectBinanceWS } from '@/lib/binance'
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
  const { usdtKrw, btcKrw, btcUsdt, kimpPercent, setUpbit, setBinance } = usePriceStore()

  useEffect(() => {
    let usdt = 0
    let btc = 0
    const upbitWs = connectUpbitWS((market, price) => {
      if (market === 'KRW-USDT') usdt = price
      if (market === 'KRW-BTC') btc = price
      if (usdt && btc) setUpbit(usdt, btc)
    })
    const binanceWs = connectBinanceWS((symbol, price) => {
      if (symbol === 'BTCUSDT') setBinance(price)
    })
    return () => {
      upbitWs.close()
      binanceWs.close()
    }
  }, [setUpbit, setBinance])

  const [amount, setAmount] = useState('1')
  const [fromUnit, setFromUnit] = useState<Unit>('USDT')
  const [toUnit, setToUnit] = useState<Unit>('KRW')
  const [buyPrice, setBuyPrice] = useState('')

  const result = useMemo(() => {
    const num = Number(amount)
    if (!num || !usdtKrw || !btcKrw) return null
    const krw = toKrw(num, fromUnit, usdtKrw, btcKrw)
    return fromKrw(krw, toUnit, usdtKrw, btcKrw)
  }, [amount, fromUnit, toUnit, usdtKrw, btcKrw])

  const overseasKrw = btcUsdt && usdtKrw ? btcUsdt * usdtKrw : null

  const profitPercent = useMemo(() => {
    const buy = Number(buyPrice)
    if (!buy || !btcKrw) return null
    return ((btcKrw - buy) / buy) * 100
  }, [buyPrice, btcKrw])

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

      <div className="border-t border-soft" />

      <GlassCard glow="pink" className="p-6 flex flex-col gap-4">
        <h2 className="font-gowun text-lg text-candy">🍬 김프/역프 기준 손익 계산 (BTC)</h2>

        <div>
          <span className="font-quick text-xs text-muted">내 매수가 (KRW)</span>
          <input
            type="number"
            value={buyPrice}
            onChange={(e) => setBuyPrice(e.target.value)}
            placeholder="0"
            className="candy-input w-full px-4 py-3 mt-1 num"
          />
        </div>

        <div className="flex justify-between font-noto text-sm">
          <span className="text-muted">현재 국내가</span>
          <span className="num text-candy-lav">{btcKrw ? btcKrw.toLocaleString() : '--'} KRW</span>
        </div>

        <div className="flex justify-between font-noto text-sm">
          <span className="text-muted">현재 해외가 (환산)</span>
          <span className="num text-candy-sky">
            {overseasKrw ? Math.round(overseasKrw).toLocaleString() : '--'} KRW
          </span>
        </div>

        <div className="flex justify-between font-noto text-sm">
          <span className="text-muted">현재 김프/역프</span>
          <span className={`num ${kimpPercent !== null && kimpPercent >= 0 ? 'text-candy-mint' : 'text-candy-pink'}`}>
            {kimpPercent !== null ? `${kimpPercent >= 0 ? '+' : ''}${kimpPercent.toFixed(2)}%` : '--'}
          </span>
        </div>

        <div className="flex justify-between font-noto text-base pt-2 border-t border-soft">
          <span className="text-secondary">예상 수익</span>
          <span className={`num font-medium ${profitPercent !== null && profitPercent >= 0 ? 'text-candy-mint' : 'text-candy-pink'}`}>
            {profitPercent !== null ? `${profitPercent >= 0 ? '+' : ''}${profitPercent.toFixed(2)}%` : '--'}
          </span>
        </div>
      </GlassCard>
    </div>
  )
}
