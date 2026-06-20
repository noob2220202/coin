'use client'

import GlassCard from '@/components/ui/GlassCard'
import NumberTicker from '@/components/ui/NumberTicker'

interface PriceCardProps {
  label: string
  value: number | null
  decimals?: number
  unit?: string
  source: string
}

export default function PriceCard({ label, value, decimals = 0, unit = '원', source }: PriceCardProps) {
  return (
    <GlassCard glow="lav" className="p-6 flex flex-col gap-3">
      <span className="font-quick text-sm text-muted">{label}</span>

      <div className="font-space text-3xl text-candy-lav">
        {value !== null ? (
          <NumberTicker value={value} decimals={decimals} suffix={unit} />
        ) : (
          <span className="text-muted">--</span>
        )}
      </div>

      <span className="inline-block self-start rounded-full bg-candy-lav/10 border border-candy-lav/30 px-3 py-1 font-quick text-xs text-candy-lav">
        {source}
      </span>
    </GlassCard>
  )
}
