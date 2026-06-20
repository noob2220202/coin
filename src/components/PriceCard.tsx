'use client'

import GlassCard from '@/components/ui/GlassCard'
import NumberTicker from '@/components/ui/NumberTicker'

type Glow = 'pink' | 'lav' | 'mint' | 'sky' | 'peach' | 'butter'

interface PriceCardProps {
  label: string
  value: number | null
  decimals?: number
  unit?: string
  source: string
  glow?: Glow
}

const textClass: Record<Glow, string> = {
  pink: 'text-candy-pink',
  lav: 'text-candy-lav',
  mint: 'text-candy-mint',
  sky: 'text-candy-sky',
  peach: 'text-candy-peach',
  butter: 'text-candy-butter',
}

const badgeClass: Record<Glow, string> = {
  pink: 'bg-candy-pink/10 border-candy-pink/30 text-candy-pink',
  lav: 'bg-candy-lav/10 border-candy-lav/30 text-candy-lav',
  mint: 'bg-candy-mint/10 border-candy-mint/30 text-candy-mint',
  sky: 'bg-candy-sky/10 border-candy-sky/30 text-candy-sky',
  peach: 'bg-candy-peach/10 border-candy-peach/30 text-candy-peach',
  butter: 'bg-candy-butter/10 border-candy-butter/30 text-candy-butter',
}

export default function PriceCard({
  label,
  value,
  decimals = 0,
  unit = '원',
  source,
  glow = 'lav',
}: PriceCardProps) {
  return (
    <GlassCard glow={glow} className="p-6 flex flex-col gap-3">
      <span className="font-quick text-sm text-muted">{label}</span>

      <div className={`font-space text-3xl ${textClass[glow]}`}>
        {value !== null ? (
          <NumberTicker value={value} decimals={decimals} suffix={unit} />
        ) : (
          <span className="text-muted">--</span>
        )}
      </div>

      <span
        className={`inline-block self-start rounded-full border px-3 py-1 font-quick text-xs ${badgeClass[glow]}`}
      >
        {source}
      </span>
    </GlassCard>
  )
}
