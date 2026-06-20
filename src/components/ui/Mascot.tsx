'use client'

import { motion } from 'framer-motion'

interface MascotProps {
  size?: number
  className?: string
}

export default function Mascot({ size = 140, className = '' }: MascotProps) {
  return (
    <motion.div
      className={className}
      style={{ width: size, height: size }}
      animate={{ y: [0, -10, 0], rotate: [-3, 3, -3] }}
      transition={{ duration: 3.4, repeat: Infinity, ease: 'easeInOut' }}
      whileHover={{ scale: 1.08 }}
    >
      <svg viewBox="0 0 200 200" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="mascotBody" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFD6F2" />
            <stop offset="55%" stopColor="#E3D9FF" />
            <stop offset="100%" stopColor="#D6EEFF" />
          </linearGradient>
        </defs>

        {/* 몽글몽글 구름 몸체 */}
        <circle cx="60" cy="120" r="34" fill="url(#mascotBody)" />
        <circle cx="140" cy="120" r="34" fill="url(#mascotBody)" />
        <circle cx="100" cy="95" r="46" fill="url(#mascotBody)" />
        <circle cx="100" cy="135" r="50" fill="url(#mascotBody)" />

        {/* 볼터치 */}
        <ellipse cx="68" cy="138" rx="10" ry="6" fill="#FF6FCF" opacity="0.35" />
        <ellipse cx="132" cy="138" rx="10" ry="6" fill="#FF6FCF" opacity="0.35" />

        {/* 눈 */}
        <circle cx="82" cy="120" r="5" fill="#4A3470" />
        <circle cx="118" cy="120" r="5" fill="#4A3470" />
        <circle cx="84" cy="118" r="1.6" fill="#FFFFFF" />
        <circle cx="120" cy="118" r="1.6" fill="#FFFFFF" />

        {/* 웃는 입 */}
        <path
          d="M90 134 Q100 142 110 134"
          stroke="#4A3470"
          strokeWidth="3.5"
          strokeLinecap="round"
          fill="none"
        />

        {/* 머리 위 별 장식 */}
        <path
          d="M100 38 L104 50 L116 50 L106 58 L110 70 L100 62 L90 70 L94 58 L84 50 L96 50 Z"
          fill="#FFC93D"
        />
      </svg>
    </motion.div>
  )
}
