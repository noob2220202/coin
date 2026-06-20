// 서버 전용 모듈 — API 키는 process.env.TRONNRG_API_KEY (NEXT_PUBLIC 미사용)
// src/app/api/energy/** 라우트 핸들러에서만 import 할 것
// 공식 문서: https://tronnrg.com/api
const BASE = 'https://tronnrg.com/api/v1'

function getKey(): string {
  const key = process.env.TRONNRG_API_KEY
  if (!key) throw new Error('TRONNRG_API_KEY가 설정되지 않았습니다')
  return key
}

// 현재 에너지 가격 (TRX / 에너지 단위)
export async function getEnergyPrice() {
  const res = await fetch(`${BASE}/price`, {
    headers: { Authorization: `Bearer ${getKey()}` },
  })
  return res.json()
  // { price_trx: number, price_sun: number, available: number }
}

// 임대 견적 계산 (duration: 1일 단위)
export async function getEnergyQuote(energyAmount: number, duration: number) {
  const res = await fetch(`${BASE}/quote?energy=${energyAmount}&duration=${duration}`, {
    headers: { Authorization: `Bearer ${getKey()}` },
  })
  return res.json()
  // { total_trx: number, total_sun: number }
}

// 에너지 임대 실행
export async function rentEnergy(body: {
  receiver: string // 받을 트론 주소
  energy: number // 에너지 양
  duration: number // 일수
  payer: string // 지불자 주소
}) {
  const res = await fetch(`${BASE}/rent`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getKey()}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })
  return res.json()
}

// 트랜잭션 상태
export async function getRentStatus(txHash: string) {
  const res = await fetch(`${BASE}/status/${txHash}`, {
    headers: { Authorization: `Bearer ${getKey()}` },
  })
  return res.json()
}
