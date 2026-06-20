import { create } from 'zustand'

interface PriceState {
  // 업비트
  usdtKrw: number | null
  btcKrw: number | null
  // 바이낸스
  usdtUsdt: number | null
  btcUsdt: number | null
  // 환율
  usdKrw: number | null
  // 계산값
  kimpPercent: number | null
  lastUpdated: Date | null
  // 연결 상태
  upbitConnected: boolean
  binanceConnected: boolean
  // 세터
  setUpbit: (usdt: number, btc: number) => void
  setBinance: (btc: number) => void
  setUsdKrw: (rate: number) => void
  setUpbitConnected: (connected: boolean) => void
  setBinanceConnected: (connected: boolean) => void
}

export const usePriceStore = create<PriceState>((set, get) => ({
  usdtKrw: null,
  btcKrw: null,
  usdtUsdt: 1,
  btcUsdt: null,
  usdKrw: null,
  kimpPercent: null,
  lastUpdated: null,
  upbitConnected: false,
  binanceConnected: false,

  setUpbit: (usdt, btc) => {
    set({ usdtKrw: usdt, btcKrw: btc, lastUpdated: new Date() })
    const { btcUsdt, usdKrw } = get()
    if (btcUsdt && usdKrw) {
      const fair = btcUsdt * usdKrw
      const kimp = ((btc - fair) / fair) * 100
      set({ kimpPercent: kimp })
    }
  },

  setBinance: (btcUsdt) => {
    set({ btcUsdt })
    const { btcKrw, usdKrw } = get()
    if (btcKrw && usdKrw) {
      const fair = btcUsdt * usdKrw
      const kimp = ((btcKrw - fair) / fair) * 100
      set({ kimpPercent: kimp })
    }
  },

  setUsdKrw: (rate) => set({ usdKrw: rate }),
  setUpbitConnected: (connected) => set({ upbitConnected: connected }),
  setBinanceConnected: (connected) => set({ binanceConnected: connected }),
}))
