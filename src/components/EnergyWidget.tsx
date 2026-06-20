'use client'

import { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import { motion, AnimatePresence } from 'framer-motion'
import { Zap, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import CandyButton from '@/components/ui/CandyButton'
import type { EnergyPriceInfo } from '@/types'

const USDT_TRANSFER_ENERGY = 65000
const DURATIONS = [1, 3, 7, 14, 30]
const PRESETS = [
  { label: 'USDT 1회 전송', energy: USDT_TRANSFER_ENERGY },
  { label: 'USDT 5회', energy: USDT_TRANSFER_ENERGY * 5 },
  { label: 'USDT 10회', energy: USDT_TRANSFER_ENERGY * 10 },
]

const CONFETTI_EMOJI = ['🍬', '🎊', '🍭', '✨']

export default function EnergyWidget() {
  const [priceInfo, setPriceInfo] = useState<EnergyPriceInfo | null>(null)
  const [receiver, setReceiver] = useState('')
  const [energy, setEnergy] = useState('')
  const [duration, setDuration] = useState(1)
  const [quoting, setQuoting] = useState(false)
  const [quote, setQuote] = useState<number | null>(null)
  const [renting, setRenting] = useState(false)
  const [rentResult, setRentResult] = useState<{ txHash: string } | null>(null)
  const [rentStatus, setRentStatus] = useState<string | null>(null)
  const [showConfetti, setShowConfetti] = useState(false)

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    axios
      .get('/api/energy/price')
      .then((res) => setPriceInfo(res.data))
      .catch(() => toast.error('에너지 가격을 불러오지 못했어요 🍭'))
  }, [])

  useEffect(() => {
    const energyNum = Number(energy)
    if (!energyNum || energyNum <= 0) {
      setQuote(null)
      return
    }

    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(async () => {
      setQuoting(true)
      try {
        const { data } = await axios.get('/api/energy/quote', {
          params: { energy: energyNum, duration },
        })
        setQuote(data.total_trx ?? null)
      } catch {
        toast.error('견적을 계산할 수 없어요 🍭')
      } finally {
        setQuoting(false)
      }
    }, 500)

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [energy, duration])

  useEffect(() => {
    if (!rentResult) return
    const interval = setInterval(async () => {
      try {
        const { data } = await axios.get(`/api/energy/status/${rentResult.txHash}`)
        setRentStatus(data.status)
        if (data.status === 'completed' || data.status === 'success') {
          clearInterval(interval)
          setShowConfetti(true)
          setTimeout(() => setShowConfetti(false), 2000)
        }
      } catch {
        // 무시하고 다음 폴링에서 재시도
      }
    }, 5000)
    return () => clearInterval(interval)
  }, [rentResult])

  const handleRent = async () => {
    const energyNum = Number(energy)
    if (!receiver || !energyNum || energyNum <= 0) {
      toast.error('지갑 주소와 에너지 양을 입력해주세요 🍭')
      return
    }

    setRenting(true)
    try {
      const { data } = await axios.post('/api/energy/rent', {
        receiver,
        energy: energyNum,
        duration,
        payer: receiver,
      })
      setRentResult({ txHash: data.txHash })
      setRentStatus(data.status ?? 'pending')
      toast.success('에너지 임대 요청이 접수되었어요 🍭')
    } catch {
      toast.error('에너지 임대에 실패했어요 🍭')
    } finally {
      setRenting(false)
    }
  }

  return (
    <div className="glass-card p-8 flex flex-col gap-5 relative overflow-hidden">
      <AnimatePresence>
        {showConfetti && (
          <div className="absolute inset-0 pointer-events-none z-30">
            {Array.from({ length: 24 }).map((_, i) => (
              <motion.span
                key={i}
                className="absolute text-2xl"
                style={{ left: `${Math.random() * 100}%`, top: '50%' }}
                initial={{ opacity: 1, y: 0, scale: 0.6 }}
                animate={{
                  opacity: 0,
                  y: (Math.random() - 0.5) * 300,
                  x: (Math.random() - 0.5) * 200,
                  scale: 1.2,
                  rotate: Math.random() * 360,
                }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
              >
                {CONFETTI_EMOJI[i % CONFETTI_EMOJI.length]}
              </motion.span>
            ))}
          </div>
        )}
      </AnimatePresence>

      <h3 className="font-gowun text-2xl text-candy text-center flex items-center justify-center gap-2">
        트론 에너지 임대 <Zap className="text-candy-butter" size={22} />
      </h3>

      <p className="font-noto text-sm text-secondary text-center">
        현재 에너지 가격:{' '}
        <span className="num text-candy-lav">
          {priceInfo ? `${priceInfo.price_trx} TRX / 1만` : '불러오는 중...'}
        </span>
      </p>

      <div>
        <span className="font-quick text-xs text-muted">받을 지갑 주소</span>
        <input
          value={receiver}
          onChange={(e) => setReceiver(e.target.value)}
          placeholder="T..."
          className="candy-input w-full px-4 py-3 mt-1"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {PRESETS.map((p) => (
          <button
            key={p.label}
            type="button"
            onClick={() => setEnergy(String(p.energy))}
            className="rounded-full border border-candy-lav/30 px-4 py-2 font-quick text-xs text-candy-lav hover:border-candy-pink/60 hover:text-candy-pink transition-colors"
          >
            {p.label}
          </button>
        ))}
        <button
          type="button"
          onClick={() => setEnergy('')}
          className="rounded-full border border-candy-lav/30 px-4 py-2 font-quick text-xs text-candy-lav hover:border-candy-pink/60 hover:text-candy-pink transition-colors"
        >
          직접입력
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <span className="font-quick text-xs text-muted">에너지 양</span>
          <input
            type="number"
            value={energy}
            onChange={(e) => setEnergy(e.target.value)}
            placeholder="0"
            className="candy-input w-full px-4 py-3 mt-1 num"
          />
        </div>
        <div>
          <span className="font-quick text-xs text-muted">임대 기간</span>
          <select
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            className="candy-input w-full px-4 py-3 mt-1"
          >
            {DURATIONS.map((d) => (
              <option key={d} value={d}>
                {d}일
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="candy-input w-full px-4 py-3 num text-candy-mint flex items-center gap-2">
        {quoting ? <Loader2 size={16} className="animate-spin" /> : null}
        예상 비용: {quote !== null ? `${quote} TRX` : '--'}
      </div>

      <CandyButton onClick={handleRent} disabled={renting} className="w-full">
        {renting ? '처리 중...' : '⚡ 에너지 임대하기'}
      </CandyButton>

      {rentResult && (
        <div className="rounded-2xl border border-candy-mint/30 bg-candy-mint/10 p-4 font-noto text-sm text-candy-mint text-center">
          상태: {rentStatus ?? '확인 중...'}
        </div>
      )}

      <p className="font-noto text-xs text-muted text-center">
        💡 USDT 전송 1회 = 약 {USDT_TRANSFER_ENERGY.toLocaleString()} 에너지
      </p>
    </div>
  )
}
