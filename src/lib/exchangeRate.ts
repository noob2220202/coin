// 서버 전용 모듈 — Yahoo Finance는 브라우저 CORS를 막아서 서버에서만 호출 가능
// src/app/api/exchange-rate 라우트 핸들러에서만 import 할 것

// Yahoo Finance 실시간 시세 (구글이 보여주는 환율과 가장 비슷한 실시간 시장가, 무료/키 불필요)
async function fetchFromYahoo(): Promise<number> {
  const res = await fetch('https://query1.finance.yahoo.com/v8/finance/chart/KRW=X', {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    },
    cache: 'no-store',
  })
  if (!res.ok) throw new Error(`yahoo HTTP ${res.status}`)
  const data = await res.json()
  const rate = data?.chart?.result?.[0]?.meta?.regularMarketPrice
  if (typeof rate !== 'number') {
    throw new Error('yahoo 응답 형식 오류')
  }
  return rate
}

// Frankfurter (ECB 환율 기반, 무료/키 불필요): https://www.frankfurter.app
async function fetchFromFrankfurter(): Promise<number> {
  const res = await fetch('https://api.frankfurter.app/latest?from=USD&to=KRW', {
    cache: 'no-store',
  })
  if (!res.ok) throw new Error(`frankfurter HTTP ${res.status}`)
  const data = await res.json()
  const rate = data?.rates?.KRW
  if (typeof rate !== 'number') {
    throw new Error('frankfurter 응답 형식 오류')
  }
  return rate
}

// jsDelivr CDN에 미러링된 무료/키 불필요 환율 데이터 (위 두 곳이 모두 실패할 때의 최종 대체용)
async function fetchFromJsdelivr(): Promise<number> {
  const res = await fetch(
    'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json',
    { cache: 'no-store' }
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
    return await fetchFromYahoo()
  } catch (err) {
    console.error('[환율] yahoo 실패, frankfurter 시도', err)
  }
  try {
    return await fetchFromFrankfurter()
  } catch (err) {
    console.error('[환율] frankfurter 실패, jsdelivr 시도', err)
    return await fetchFromJsdelivr()
  }
}
