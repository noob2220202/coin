export interface UpbitTickerMessage {
  type: 'ticker'
  code: string
  trade_price: number
  signed_change_rate: number
  change: 'RISE' | 'FALL' | 'EVEN'
}

export interface CurrencyInfo {
  ticker: string
  name: string
  image: string
  network?: string
  isFiat?: boolean
}

export type ExchangeStatus =
  | 'new'
  | 'waiting'
  | 'confirming'
  | 'exchanging'
  | 'sending'
  | 'finished'
  | 'failed'
  | 'refunded'
  | 'verifying'

export interface ExchangeEstimate {
  toAmount: number
  fromCurrency: string
  toCurrency: string
}

export interface CreateExchangeResult {
  id: string
  payinAddress: string
  payoutAddress: string
  fromCurrency: string
  toCurrency: string
  amount: number
  toAmount?: number
}

export interface EnergyPriceInfo {
  price_trx: number
  price_sun: number
  available: number
  reference_energy: number
}

export interface EnergyQuote {
  total_trx: number
  total_sun: number
}

export interface RentEnergyResult {
  orderNo: string
  payAmount: number
  status: string
}

export interface BannerAd {
  id: string
  image: string
  href: string
  alt: string
}

export interface SiteConfig {
  swapEnabled: boolean
  energyEnabled: boolean
  banners: BannerAd[]
}
