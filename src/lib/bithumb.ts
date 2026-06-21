// 서버 전용 모듈 — 빗썸 공개 API는 키가 필요없지만 브라우저에서 직접 호출 시
// CORS/차단 위험이 있어 서버에서만 호출한다 (src/app/api/bithumb-rate 라우트 전용)
export async function fetchBithumbUsdtKrw(): Promise<number> {
  const res = await fetch('https://api.bithumb.com/public/ticker/USDT_KRW', {
    cache: 'no-store',
  })
  if (!res.ok) throw new Error(`bithumb HTTP ${res.status}`)
  const json = await res.json()
  if (json?.status !== '0000') {
    throw new Error(`bithumb API 오류 (status ${json?.status})`)
  }
  const price = Number(json?.data?.closing_price)
  if (!price || Number.isNaN(price)) {
    throw new Error('bithumb 응답 형식 오류')
  }
  return price
}
