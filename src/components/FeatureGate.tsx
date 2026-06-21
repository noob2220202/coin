'use client'

import { ReactNode, useEffect, useState } from 'react'
import axios from 'axios'

interface FeatureGateProps {
  feature: 'swapEnabled' | 'energyEnabled'
  children: ReactNode
}

export default function FeatureGate({ feature, children }: FeatureGateProps) {
  const [enabled, setEnabled] = useState<boolean | null>(null)

  useEffect(() => {
    axios
      .get('/api/site-config')
      .then(({ data }) => setEnabled(data[feature] ?? true))
      .catch(() => setEnabled(true))
  }, [feature])

  if (enabled === null) return null

  if (!enabled) {
    return (
      <div className="glass-card p-8 text-center font-noto text-secondary">
        현재 점검 중이에요. 잠시 후 다시 시도해주세요 🍭
      </div>
    )
  }

  return <>{children}</>
}
