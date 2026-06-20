// Frankfurter (ECB 환율 기반, 무료/키 불필요): https://www.frankfurter.app
async function fetchFromFrankfurter(): Promise<number> {
  const res = await fetch('https://api.frankfurter.app/latest?from=USD&to=KRW')
  if (!res.ok) throw new Error(`frankfurter HTTP ${res.status}`)
  const data = await res.json()
  const rate = data?.rates?.KRW
  if (typeof rate !== 'number') {
    throw new Error('frankfurter 응답 형식 오류')
  }
  return rate
}

// jsDelivr CDN에 미러링된 무료/키 불필요 환율 데이터 (Frankfurter 장애 시 대체용)
async function fetchFromJsdelivr(): Promise<number> {
  const res = await fetch(
    'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json'
  )
  if (!res.ok) throw new Error(`jsdelivr HTTP ${res.status}`)
  const data = await res.json()
  const rate = data?.usd?.krw
  if (typeof rate !== 'number') {
    throw new Error('jsdelivr 응답 형식 오류')
  }
  return rate
}

export async function fetchUsdKrw(): Promise<number> {
  try {
    return await fetchFromFrankfurter()
  } catch (err) {
    console.error('[환율] frankfurter 실패, 대체 API 시도', err)
    return await fetchFromJsdelivr()
  }
}
