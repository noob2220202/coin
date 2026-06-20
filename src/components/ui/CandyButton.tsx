'use client'

import { ReactNode } from 'react'
import { motion, HTMLMotionProps } from 'framer-motion'

type Variant = 'primary' | 'ghost' | 'danger'

interface CandyButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  variant?: Variant
  children: ReactNode
}

const variantClass: Record<Variant, string> = {
  primary:
    'bg-gradient-to-br from-candy-pink to-candy-lav text-bg-void shadow-candy-lav',
  ghost:
    'bg-transparent border border-candy-lav/40 text-candy-lav hover:border-candy-pink/60 hover:text-candy-pink',
  danger: 'bg-gradient-to-br from-candy-peach to-candy-pink text-bg-void',
}

export default function CandyButton({
  variant = 'primary',
  children,
  className = '',
  disabled,
  ...props
}: CandyButtonProps) {
  return (
    <motion.button
      whileHover={disabled ? undefined : { scale: 1.05, y: -2, rotate: 1 }}
      whileTap={disabled ? undefined : { scale: 0.96, rotate: -1 }}
      disabled={disabled}
      className={`rounded-full px-8 py-3 font-quick font-semibold transition-shadow ${
        disabled
          ? 'bg-bg-card text-muted opacity-50'
          : variantClass[variant]
      } ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  )
}
