// 서버 전용 모듈 — API 키는 process.env.CHANGENOW_API_KEY (NEXT_PUBLIC 미사용)
// src/app/api/swap/** 라우트 핸들러에서만 import 할 것
const BASE = 'https://api.changenow.io/v2'

function getKey(): string {
  const key = process.env.CHANGENOW_API_KEY
  if (!key) throw new Error('CHANGENOW_API_KEY가 설정되지 않았습니다')
  return key
}

// ChangeNow는 에러여도 200이 아닌 상태코드 + JSON 바디로 응답하므로
// res.ok를 확인하지 않으면 에러 응답을 정상 데이터처럼 통과시키게 된다
async function changeNowFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: {
      'x-changenow-api-key': getKey(),
      ...init?.headers,
    },
  })
  const json = await res.json().catch(() => null)
  if (!res.ok) {
    const message =
      (json && typeof json.message === 'string' && json.message) ||
      (json && typeof json.error === 'string' && json.error) ||
      `ChangeNow API 오류 (HTTP ${res.status})`
    throw new Error(message)
  }
  return json as T
}

// 지원 코인 목록
export async function getCurrencies() {
  return changeNowFetch('/exchange/currencies?active=true&flow=standard')
}

// USDT 등 여러 네트워크에 동시 존재하는 코인은 network를 안 주면
// ChangeNow가 "Please specify network for currency xxx" 에러를 반환한다
function networkParams(fromNetwork?: string, toNetwork?: string): string {
  let qs = ''
  if (fromNetwork) qs += `&fromNetwork=${fromNetwork}`
  if (toNetwork) qs += `&toNetwork=${toNetwork}`
  return qs
}

// 최소 교환 금액
export async function getMinAmount(
  fromCurrency: string,
  toCurrency: string,
  fromNetwork?: string,
  toNetwork?: string
) {
  return changeNowFetch(
    `/exchange/min-amount?fromCurrency=${fromCurrency}&toCurrency=${toCurrency}&flow=standard${networkParams(fromNetwork, toNetwork)}`
  )
}

// 예상 수령량
export async function getEstimatedAmount(
  fromCurrency: string,
  toCurrency: string,
  fromAmount: number,
  fromNetwork?: string,
  toNetwork?: string
) {
  return changeNowFetch(
    `/exchange/estimated-amount?fromCurrency=${fromCurrency}&toCurrency=${toCurrency}&fromAmount=${fromAmount}&flow=standard${networkParams(fromNetwork, toNetwork)}`
  )
}

// 교환 생성
export async function createExchange(body: {
  fromCurrency: string
  toCurrency: string
  fromAmount: number
  address: string
  flow: 'standard'
  fromNetwork?: string
  toNetwork?: string
}) {
  return changeNowFetch('/exchange', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

// 거래 상태 조회
export async function getExchangeStatus(id: string) {
  return changeNowFetch(`/exchange/by-id?id=${id}`)
}
