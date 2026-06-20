// Frankfurter (ECB 환율 기반, 무료/키 불필요): https://www.frankfurter.app
export async function fetchUsdKrw(): Promise<number> {
  const res = await fetch('https://api.frankfurter.app/latest?from=USD&to=KRW')
  const data = await res.json()
  const rate = data?.rates?.KRW
  if (typeof rate !== 'number') {
    throw new Error('환율 조회 실패')
  }
  return rate
}
