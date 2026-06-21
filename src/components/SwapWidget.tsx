'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import axios from 'axios'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Repeat, Search, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import CandyButton from '@/components/ui/CandyButton'
import type { CurrencyInfo, ExchangeStatus } from '@/types'

const POPULAR_TICKERS = ['btc', 'eth', 'usdttrc20', 'usdterc20', 'trx']

const STATUS_STEPS: { key: ExchangeStatus[]; label: string; icon: string }[] = [
  { key: ['new', 'waiting'], label: '대기중', icon: '⚪' },
  { key: ['confirming'], label: '입금확인중', icon: '🟡' },
  { key: ['exchanging', 'sending'], label: '교환중', icon: '🔵' },
  { key: ['finished'], label: '완료', icon: '🟢' },
]

function statusStepIndex(status: ExchangeStatus | null): number {
  if (!status) return 0
  const idx = STATUS_STEPS.findIndex((s) => s.key.includes(status))
  return idx === -1 ? 0 : idx
}

interface CurrencySelectProps {
  label: string
  currencies: CurrencyInfo[]
  value: CurrencyInfo | null
  onChange: (c: CurrencyInfo) => void
}

function CurrencySelect({ label, currencies, value, onChange }: CurrencySelectProps) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')

  const sorted = useMemo(() => {
    const popular = currencies.filter((c) => POPULAR_TICKERS.includes(c.ticker.toLowerCase()))
    const rest = currencies.filter((c) => !POPULAR_TICKERS.includes(c.ticker.toLowerCase()))
    return [...popular, ...rest]
  }, [currencies])

  const filtered = useMemo(() => {
    if (!query) return sorted
    const q = query.toLowerCase()
    return sorted.filter((c) => c.ticker.toLowerCase().includes(q) || c.name.toLowerCase().includes(q))
  }, [sorted, query])

  return (
    <div className="relative">
      <span className="font-quick text-xs text-muted">{label}</span>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="candy-input w-full flex items-center justify-between px-4 py-3 mt-1"
      >
        <span className="font-noto flex items-center gap-2">
          {value ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={value.image}
                alt=""
                className="w-5 h-5 rounded-full"
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                }}
              />
              {`${value.name} (${value.ticker.toUpperCase()})`}
            </>
          ) : (
            '코인 선택'
          )}
        </span>
        <ChevronDown size={18} className="text-candy-lav" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute z-20 mt-2 w-full max-h-80 overflow-y-auto glass-card p-2"
          >
            <div className="flex items-center gap-2 candy-input px-3 py-2 mb-2">
              <Search size={16} className="text-muted" />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="코인 검색..."
                className="bg-transparent outline-none w-full font-noto text-sm"
              />
            </div>
            {filtered.slice(0, 50).map((c) => (
              <button
                key={`${c.ticker}-${c.network ?? ''}`}
                type="button"
                onClick={() => {
                  onChange(c)
                  setOpen(false)
                  setQuery('')
                }}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-candy-lav/10 text-left"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={c.image}
                  alt=""
                  className="w-5 h-5 rounded-full shrink-0"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'
                  }}
                />
                <span className="font-quick text-sm">{c.ticker.toUpperCase()}</span>
                <span className="font-noto text-xs text-muted">{c.name}</span>
              </button>
            ))}
            {filtered.length === 0 && (
              <p className="font-noto text-xs text-muted text-center py-4">검색 결과 없음</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function SwapWidget() {
  const [currencies, setCurrencies] = useState<CurrencyInfo[]>([])
  const [fromCurrency, setFromCurrency] = useState<CurrencyInfo | null>(null)
  const [toCurrency, setToCurrency] = useState<CurrencyInfo | null>(null)
  const [fromAmount, setFromAmount] = useState('')
  const [toAmount, setToAmount] = useState<number | null>(null)
  const [minAmount, setMinAmount] = useState<number | null>(null)
  const [address, setAddress] = useState('')
  const [estimating, setEstimating] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [exchange, setExchange] = useState<{ id: string; payinAddress: string } | null>(null)
  const [exchangeStatus, setExchangeStatus] = useState<ExchangeStatus | null>(null)

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    axios
      .get('/api/swap/currencies')
      .then((res) => {
        const list: CurrencyInfo[] = Array.isArray(res.data) ? res.data : res.data?.currencies ?? []
        setCurrencies(list)
        const btc = list.find((c) => c.ticker.toLowerCase() === 'btc')
        const usdt = list.find((c) => c.ticker.toLowerCase().startsWith('usdt'))
        if (btc) setFromCurrency(btc)
        if (usdt) setToCurrency(usdt)
      })
      .catch(() => toast.error('코인 목록을 불러오지 못했어요 🍭'))
  }, [])

  useEffect(() => {
    if (!fromCurrency || !toCurrency) {
      setMinAmount(null)
      return
    }
    let cancelled = false
    axios
      .get('/api/swap/min-amount', {
        params: {
          fromCurrency: fromCurrency.ticker,
          toCurrency: toCurrency.ticker,
          fromNetwork: fromCurrency.network,
          toNetwork: toCurrency.network,
        },
      })
      .then(({ data }) => {
        if (!cancelled) setMinAmount(data.minAmount ?? null)
      })
      .catch(() => {
        if (!cancelled) setMinAmount(null)
      })
    return () => {
      cancelled = true
    }
  }, [fromCurrency, toCurrency])

  useEffect(() => {
    if (!fromCurrency || !toCurrency || !fromAmount || Number(fromAmount) <= 0) {
      setToAmount(null)
      return
    }

    // ChangeNow는 최소 금액 미달 시 estimated-amount 호출 자체를 에러로 반환하므로
    // minAmount를 먼저 확인해 미달이면 호출하지 않는다 (불필요한 에러 토스트 방지)
    if (minAmount !== null && Number(fromAmount) < minAmount) {
      setToAmount(null)
      return
    }

    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(async () => {
      setEstimating(true)
      try {
        const { data: estData } = await axios.get('/api/swap/estimate', {
          params: {
            fromCurrency: fromCurrency.ticker,
            toCurrency: toCurrency.ticker,
            fromAmount: Number(fromAmount),
            fromNetwork: fromCurrency.network,
            toNetwork: toCurrency.network,
          },
        })
        setToAmount(estData.toAmount ?? null)
      } catch {
        toast.error('예상 수령량을 계산할 수 없어요 🍭')
      } finally {
        setEstimating(false)
      }
    }, 500)

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [fromCurrency, toCurrency, fromAmount, minAmount])

  useEffect(() => {
    if (!exchange) return
    const interval = setInterval(async () => {
      try {
        const { data } = await axios.get(`/api/swap/status/${exchange.id}`)
        setExchangeStatus(data.status)
        if (data.status === 'finished') clearInterval(interval)
      } catch {
        // 무시하고 다음 폴링에서 재시도
      }
    }, 5000)
    return () => clearInterval(interval)
  }, [exchange])

  const handleFlip = () => {
    setFromCurrency(toCurrency)
    setToCurrency(fromCurrency)
    setFromAmount('')
    setToAmount(null)
  }

  const handleSwap = async () => {
    if (!fromCurrency || !toCurrency || !fromAmount || !address) {
      toast.error('모든 항목을 입력해주세요 🍭')
      return
    }
    if (minAmount && Number(fromAmount) < minAmount) {
      toast.error(`최소 ${minAmount} ${fromCurrency.ticker.toUpperCase()} 이상 입력해주세요`)
      return
    }

    setSubmitting(true)
    try {
      const { data } = await axios.post('/api/swap/create', {
        fromCurrency: fromCurrency.ticker,
        toCurrency: toCurrency.ticker,
        fromAmount: Number(fromAmount),
        address,
        fromNetwork: fromCurrency.network,
        toNetwork: toCurrency.network,
      })
      setExchange({ id: data.id, payinAddress: data.payinAddress })
      setExchangeStatus('new')
      toast.success('스왑이 생성되었어요 🍭')
    } catch {
      toast.error('스왑 생성에 실패했어요 🍭')
    } finally {
      setSubmitting(false)
    }
  }

  if (exchange) {
    const stepIdx = statusStepIndex(exchangeStatus)
    return (
      <div className="glass-card p-8 flex flex-col gap-6">
        <h3 className="font-gowun text-xl text-candy">입금 안내</h3>
        <p className="font-noto text-sm text-secondary">
          아래 주소로 {fromCurrency?.ticker.toUpperCase()}를 입금해주세요. 입금 확인 후 자동으로 교환됩니다.
        </p>
        <div className="candy-input px-4 py-3 break-all text-sm">{exchange.payinAddress}</div>

        <div className="flex items-center justify-between">
          {STATUS_STEPS.map((step, i) => (
            <div key={step.label} className="flex-1 flex flex-col items-center gap-2">
              <motion.div
                animate={{ scale: i === stepIdx ? 1.2 : 1, opacity: i <= stepIdx ? 1 : 0.4 }}
                className="text-2xl"
              >
                {step.icon}
              </motion.div>
              <span className="font-quick text-xs text-muted">{step.label}</span>
            </div>
          ))}
        </div>

        <div className="h-2 rounded-full bg-bg-card overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-candy-pink to-candy-lav"
            animate={{ width: `${(stepIdx / (STATUS_STEPS.length - 1)) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        <p className="font-noto text-xs text-muted text-center">예상 도착: ~30초 · 수수료: 네트워크 수수료만</p>
      </div>
    )
  }

  return (
    <div className="glass-card p-8 flex flex-col gap-5">
      <h3 className="font-gowun text-2xl text-candy text-center">코인 스왑 🍬</h3>

      <CurrencySelect label="보낼 코인" currencies={currencies} value={fromCurrency} onChange={setFromCurrency} />
      <input
        type="number"
        value={fromAmount}
        onChange={(e) => setFromAmount(e.target.value)}
        placeholder="금액 입력"
        className="candy-input w-full px-4 py-3 num"
      />
      {minAmount !== null && (
        <p className="font-noto text-xs text-muted -mt-3">
          최소 {minAmount} {fromCurrency?.ticker.toUpperCase()} 이상 입력해주세요
        </p>
      )}

      <div className="flex justify-center">
        <button
          type="button"
          onClick={handleFlip}
          className="rounded-full bg-bg-card border border-soft p-3 hover:border-candy-pink/50 transition-colors"
        >
          <Repeat size={20} className="text-candy-lav" />
        </button>
      </div>

      <CurrencySelect label="받을 코인" currencies={currencies} value={toCurrency} onChange={setToCurrency} />
      <div className="candy-input w-full px-4 py-3 num text-candy-mint flex items-center gap-2">
        {estimating ? <Loader2 size={16} className="animate-spin" /> : null}
        {toAmount !== null ? toAmount : '예상 수령액'}
      </div>

      <div>
        <span className="font-quick text-xs text-muted">받을 주소</span>
        <input
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="지갑 주소를 입력하세요"
          className="candy-input w-full px-4 py-3 mt-1"
        />
      </div>

      <CandyButton onClick={handleSwap} disabled={submitting} className="w-full">
        {submitting ? '처리 중...' : '🍭 지금 스왑하기'}
      </CandyButton>

      <p className="font-noto text-xs text-muted text-center">예상 도착: ~30초 · 수수료: 네트워크 수수료만</p>
    </div>
  )
}
