'use client'

import { ReactNode } from 'react'
import { motion, HTMLMotionProps } from 'framer-motion'

type Glow = 'pink' | 'lav' | 'mint' | 'sky' | 'peach' | 'butter'

interface GlassCardProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  glow?: Glow
  children: ReactNode
}

const glowClass: Record<Glow, string> = {
  pink: 'shadow-candy-pink',
  lav: 'shadow-candy-lav',
  mint: 'shadow-candy-mint',
  sky: 'shadow-candy-sky',
  peach: 'shadow-candy-peach',
  butter: 'shadow-candy-butter',
}

export default function GlassCard({ glow, children, className = '', ...props }: GlassCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.015, y: -3 }}
      whileTap={{ scale: 0.99 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className={`glass-card ${glow ? glowClass[glow] : ''} ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  )
}
