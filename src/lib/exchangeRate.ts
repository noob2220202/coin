// ExchangeRate-API: https://v6.exchangerate-api.com
export async function fetchUsdKrw(): Promise<number> {
  const key = process.env.NEXT_PUBLIC_EXCHANGERATE_API_KEY
  const res = await fetch(`https://v6.exchangerate-api.com/v6/${key}/pair/USD/KRW`)
  const data = await res.json()
  if (typeof data.conversion_rate !== 'number') {
    throw new Error(data['error-type'] ?? '환율 조회 실패')
  }
  return data.conversion_rate
}
