'use client'

import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

interface NumberTickerProps {
  value: number
  decimals?: number
  prefix?: string
  suffix?: string
  className?: string
}

export default function NumberTicker({
  value,
  decimals = 0,
  prefix = '',
  suffix = '',
  className = '',
}: NumberTickerProps) {
  const prevValue = useRef(value)
  const [direction, setDirection] = useState<'up' | 'down'>('up')

  useEffect(() => {
    if (value > prevValue.current) setDirection('up')
    else if (value < prevValue.current) setDirection('down')
    prevValue.current = value
  }, [value])

  const formatted = value.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })
  const chars = formatted.split('')

  return (
    <span className={`num inline-flex ${className}`}>
      {prefix && <span>{prefix}</span>}
      {chars.map((char, i) => (
        <span key={i} className="relative inline-block overflow-hidden" style={{ height: '1.2em' }}>
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={char}
              initial={{ y: direction === 'up' ? '100%' : '-100%', opacity: 0 }}
              animate={{ y: '0%', opacity: 1 }}
              exit={{ y: direction === 'up' ? '-100%' : '100%', opacity: 0 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="inline-block"
            >
              {char}
            </motion.span>
          </AnimatePresence>
        </span>
      ))}
      {suffix && <span>{suffix}</span>}
    </span>
  )
}
