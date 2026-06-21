'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'
import { AnimatePresence, motion } from 'framer-motion'
import type { BannerAd } from '@/types'

const SLIDE_MS = 4500

export default function AdBanner() {
  const [banners, setBanners] = useState<BannerAd[]>([])
  const [index, setIndex] = useState(0)

  useEffect(() => {
    axios
      .get('/api/site-config')
      .then(({ data }) => setBanners(Array.isArray(data.banners) ? data.banners : []))
      .catch(() => setBanners([]))
  }, [])

  useEffect(() => {
    if (banners.length <= 1) return
    const interval = setInterval(() => {
      setIndex((i) => (i + 1) % banners.length)
    }, SLIDE_MS)
    return () => clearInterval(interval)
  }, [banners.length])

  if (banners.length === 0) return null

  const current = banners[index % banners.length]

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-soft"
      style={{ background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(16px)' }}
    >
      <div className="mx-auto max-w-6xl px-6 py-2">
        <a
          href={current.href}
          target="_blank"
          rel="noopener noreferrer sponsored"
          className="relative block h-16 overflow-hidden rounded-xl"
        >
          <span className="absolute top-1 left-1 z-10 rounded-full bg-black/50 px-2 py-0.5 font-quick text-[10px] text-white">
            광고
          </span>
          <AnimatePresence mode="wait">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <motion.img
              key={current.id}
              src={current.image}
              alt={current.alt}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </AnimatePresence>
        </a>
      </div>
    </div>
  )
}
