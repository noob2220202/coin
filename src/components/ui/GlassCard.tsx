'use client'

import { ReactNode } from 'react'
import { motion, HTMLMotionProps } from 'framer-motion'

type Glow = 'pink' | 'lav' | 'mint'

interface GlassCardProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  glow?: Glow
  children: ReactNode
}

const glowClass: Record<Glow, string> = {
  pink: 'shadow-candy-pink',
  lav: 'shadow-candy-lav',
  mint: 'shadow-candy-mint',
}

export default function GlassCard({ glow, children, className = '', ...props }: GlassCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.01, y: -2 }}
      transition={{ duration: 0.2 }}
      className={`glass-card ${glow ? glowClass[glow] : ''} ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  )
}
