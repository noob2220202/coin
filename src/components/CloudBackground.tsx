'use client'

import {
  Sparkles,
  Star,
  Heart,
  Candy,
  Lollipop,
  IceCream2,
  Cherry,
  Donut,
  Rainbow,
  Gem,
} from 'lucide-react'

function CloudShape({ size }: { size: number }) {
  return (
    <div className="cloud-shape" style={{ width: size, height: size * 0.62 }}>
      <div
        className="absolute bg-candy-cloud rounded-full"
        style={{ width: '72%', height: '70%', left: '14%', bottom: 0 }}
      />
      <div
        className="absolute bg-candy-cloud rounded-full"
        style={{ width: '46%', height: '62%', left: 0, bottom: '8%' }}
      />
      <div
        className="absolute bg-candy-cloud rounded-full"
        style={{ width: '50%', height: '66%', right: 0, bottom: '6%' }}
      />
      <div
        className="absolute bg-candy-cloud rounded-full"
        style={{ width: '40%', height: '52%', left: '30%', top: 0 }}
      />
    </div>
  )
}

const CLOUDS = [
  { size: 160, top: '6%', left: '4%', anim: 'animate-float', opacity: 0.9 },
  { size: 110, top: '14%', right: '8%', anim: 'animate-float-rev', opacity: 0.8 },
  { size: 130, top: '62%', left: '10%', anim: 'animate-float-rev', opacity: 0.85 },
  { size: 90, top: '78%', right: '14%', anim: 'animate-float', opacity: 0.75 },
  { size: 70, top: '40%', right: '30%', anim: 'animate-float', opacity: 0.6 },
] as const

const SPARKLES = [
  { Icon: Sparkles, top: '10%', left: '30%', color: 'text-candy-pink', delay: '0s' },
  { Icon: Star, top: '22%', left: '70%', color: 'text-candy-butter', delay: '-1s' },
  { Icon: Sparkles, top: '50%', left: '88%', color: 'text-candy-sky', delay: '-2s' },
  { Icon: Star, top: '70%', left: '40%', color: 'text-candy-lav', delay: '-1.5s' },
  { Icon: Sparkles, top: '85%', left: '70%', color: 'text-candy-mint', delay: '-3s' },
  { Icon: Star, top: '34%', left: '6%', color: 'text-candy-pink', delay: '-2.5s' },
] as const

const CANDY_ICONS = [
  { Icon: Candy, top: '18%', left: '50%', color: 'text-candy-pink/70', size: 30 },
  { Icon: Lollipop, top: '46%', left: '20%', color: 'text-candy-lav/70', size: 34 },
  { Icon: IceCream2, top: '64%', left: '60%', color: 'text-candy-peach/70', size: 32 },
  { Icon: Cherry, top: '30%', left: '85%', color: 'text-candy-pink/70', size: 26 },
  { Icon: Donut, top: '80%', left: '24%', color: 'text-candy-butter/80', size: 30 },
  { Icon: Rainbow, top: '8%', left: '78%', color: 'text-candy-sky/70', size: 36 },
  { Icon: Gem, top: '56%', left: '6%', color: 'text-candy-mint/70', size: 24 },
  { Icon: Heart, top: '90%', left: '50%', color: 'text-candy-pink/70', size: 22 },
] as const

export default function CloudBackground() {
  return (
    <div className="blob-bg">
      <div
        className="blob w-[500px] h-[500px] bg-candy-sky-soft top-[-100px] left-[-100px]"
        style={{ animationDelay: '0s' }}
      />
      <div
        className="blob w-[600px] h-[600px] bg-candy-lav-soft top-[30%] right-[-150px]"
        style={{ animationDelay: '-4s' }}
      />
      <div
        className="blob w-[400px] h-[400px] bg-candy-mint-soft bottom-[10%] left-[20%]"
        style={{ animationDelay: '-8s' }}
      />
      <div
        className="blob w-[350px] h-[350px] bg-candy-peach-soft bottom-[-50px] right-[30%]"
        style={{ animationDelay: '-2s' }}
      />

      {CLOUDS.map((c, i) => (
        <div
          key={i}
          className={c.anim}
          style={{
            position: 'absolute',
            top: c.top,
            left: 'left' in c ? c.left : undefined,
            right: 'right' in c ? c.right : undefined,
            opacity: c.opacity,
          }}
        >
          <CloudShape size={c.size} />
        </div>
      ))}

      {SPARKLES.map(({ Icon, top, left, color, delay }, i) => (
        <div
          key={i}
          className={`absolute animate-twinkle ${color}`}
          style={{ top, left, animationDelay: delay }}
        >
          <Icon size={20} fill="currentColor" />
        </div>
      ))}

      {CANDY_ICONS.map(({ Icon, top, left, color, size }, i) => (
        <div
          key={i}
          className={`absolute animate-bounce-soft ${color}`}
          style={{ top, left, animationDelay: `${-(i * 1.3)}s` }}
        >
          <Icon size={size} strokeWidth={1.5} />
        </div>
      ))}
    </div>
  )
}
