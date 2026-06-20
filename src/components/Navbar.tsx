'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'

const MENU = [
  { label: '시세', href: '/' },
  { label: '스왑', href: '/swap' },
  { label: '에너지 임대', href: '/energy' },
  { label: '계산기', href: '/calculator' },
]

export default function Navbar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 border-b border-soft"
      style={{ background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(20px)' }}
    >
      <nav className="mx-auto max-w-6xl flex items-center justify-between px-5 py-4">
        <Link href="/" className="font-gowun text-xl text-candy">
          🍭 솜사탕
        </Link>

        <ul className="hidden md:flex items-center gap-8 font-quick font-medium">
          {MENU.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`transition-colors ${
                  pathname === item.href ? 'text-candy-pink' : 'text-candy-lav/70'
                } hover:text-candy-pink`}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        <button
          className="md:hidden text-candy-lav"
          onClick={() => setOpen((v) => !v)}
          aria-label="메뉴 열기"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden flex flex-col gap-4 px-5 pb-5 font-quick font-medium overflow-hidden"
          >
            {MENU.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`block ${
                    pathname === item.href ? 'text-candy-pink' : 'text-candy-lav/70'
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </header>
  )
}
