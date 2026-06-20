// 서버 전용 모듈 — API 키는 process.env.CHANGENOW_API_KEY (NEXT_PUBLIC 미사용)
// src/app/api/swap/** 라우트 핸들러에서만 import 할 것
const BASE = 'https://api.changenow.io/v2'

function getKey(): string {
  const key = process.env.CHANGENOW_API_KEY
  if (!key) throw new Error('CHANGENOW_API_KEY가 설정되지 않았습니다')
  return key
}

// 지원 코인 목록
export async function getCurrencies() {
  const res = await fetch(`${BASE}/exchange/currencies?active=true&flow=standard`, {
    headers: { 'x-changenow-api-key': getKey() },
  })
  return res.json()
}

// 최소 교환 금액
export async function getMinAmount(fromCurrency: string, toCurrency: string) {
  const res = await fetch(
    `${BASE}/exchange/min-amount?fromCurrency=${fromCurrency}&toCurrency=${toCurrency}&flow=standard`,
    { headers: { 'x-changenow-api-key': getKey() } }
  )
  return res.json()
}

// 예상 수령량
export async function getEstimatedAmount(
  fromCurrency: string,
  toCurrency: string,
  fromAmount: number
) {
  const res = await fetch(
    `${BASE}/exchange/estimated-amount?fromCurrency=${fromCurrency}&toCurrency=${toCurrency}&fromAmount=${fromAmount}&flow=standard`,
    { headers: { 'x-changenow-api-key': getKey() } }
  )
  return res.json()
}

// 교환 생성
export async function createExchange(body: {
  fromCurrency: string
  toCurrency: string
  fromAmount: number
  address: string
  flow: 'standard'
}) {
  const res = await fetch(`${BASE}/exchange`, {
    method: 'POST',
    headers: {
      'x-changenow-api-key': getKey(),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })
  return res.json()
}

// 거래 상태 조회
export async function getExchangeStatus(id: string) {
  const res = await fetch(`${BASE}/exchange/by-id?id=${id}`, {
    headers: { 'x-changenow-api-key': getKey() },
  })
  return res.json()
}
