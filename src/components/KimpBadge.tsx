'use client'

import { motion } from 'framer-motion'
import NumberTicker from '@/components/ui/NumberTicker'

interface KimpBadgeProps {
  percent: number | null
}

export default function KimpBadge({ percent }: KimpBadgeProps) {
  if (percent === null) {
    return (
      <motion.div
        layout
        className="inline-flex items-center gap-2 rounded-full border border-soft bg-bg-card px-6 py-3 font-quick text-muted"
      >
        김프 계산 중...
      </motion.div>
    )
  }

  const isPositive = percent >= 0

  return (
    <motion.div
      layout
      className={`inline-flex items-center gap-2 rounded-full border px-6 py-3 font-quick font-medium ${
        isPositive
          ? 'bg-candy-mint/10 border-candy-mint text-candy-mint'
          : 'bg-candy-pink/10 border-candy-pink text-candy-pink'
      }`}
    >
      <span>{isPositive ? '🟢 김프' : '🔴 역프'}</span>
      <NumberTicker
        value={percent}
        decimals={2}
        prefix={isPositive ? '+' : ''}
        suffix="%"
        className="font-space"
      />
    </motion.div>
  )
}
