import SwapWidget from '@/components/SwapWidget'
import FeatureGate from '@/components/FeatureGate'

export default function SwapPage() {
  return (
    <div className="mx-auto max-w-xl px-6 pb-24">
      <FeatureGate feature="swapEnabled">
        <SwapWidget />
      </FeatureGate>
    </div>
  )
}
