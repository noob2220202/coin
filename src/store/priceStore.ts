import { create } from 'zustand'

interface PriceState {
  // 업비트
  usdtKrw: number | null
  btcKrw: number | null
  // 환율 (테더 프리미엄 기준값)
  usdKrw: number | null
  // 계산값 (테더 기준 김프/역프)
  kimpPercent: number | null
  lastUpdated: Date | null
  // 연결 상태
  upbitConnected: boolean
  // 세터
  setUpbit: (usdt: number, btc: number) => void
  setUsdKrw: (rate: number) => void
  setUpbitConnected: (connected: boolean) => void
}

function calcKimp(usdtKrw: number, usdKrw: number): number {
  return ((usdtKrw - usdKrw) / usdKrw) * 100
}

export const usePriceStore = create<PriceState>((set, get) => ({
  usdtKrw: null,
  btcKrw: null,
  usdKrw: null,
  kimpPercent: null,
  lastUpdated: null,
  upbitConnected: false,

  setUpbit: (usdt, btc) => {
    set({ usdtKrw: usdt, btcKrw: btc, lastUpdated: new Date() })
    const { usdKrw } = get()
    if (usdKrw) {
      set({ kimpPercent: calcKimp(usdt, usdKrw) })
    }
  },

  setUsdKrw: (rate) => {
    set({ usdKrw: rate })
    const { usdtKrw } = get()
    if (usdtKrw) {
      set({ kimpPercent: calcKimp(usdtKrw, rate) })
    }
  },

  setUpbitConnected: (connected) => set({ upbitConnected: connected }),
}))
