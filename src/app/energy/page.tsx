import EnergyWidget from '@/components/EnergyWidget'
import FeatureGate from '@/components/FeatureGate'

export default function EnergyPage() {
  return (
    <div className="mx-auto max-w-xl px-6 pb-24">
      <FeatureGate feature="energyEnabled">
        <EnergyWidget />
      </FeatureGate>
    </div>
  )
}
