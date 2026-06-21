'use client'

// 광고 교체 시 이 값만 바꾸면 됨 — image는 public/ads/ 안에 넣은 gif/이미지 경로
const AD = {
  image: '/ads/placeholder-banner.svg',
  href: 'https://example.com',
  alt: '광고',
}

export default function AdBanner() {
  return (
    <div className="mx-auto max-w-6xl px-6 pt-4">
      <a
        href={AD.href}
        target="_blank"
        rel="noopener noreferrer sponsored"
        className="relative block overflow-hidden rounded-2xl border border-soft"
      >
        <span className="absolute top-2 left-2 z-10 rounded-full bg-black/50 px-2 py-0.5 font-quick text-[10px] text-white">
          광고
        </span>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={AD.image} alt={AD.alt} className="w-full h-auto" />
      </a>
    </div>
  )
}
