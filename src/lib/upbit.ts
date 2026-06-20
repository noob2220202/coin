const THROTTLE_MS = 3000

export function connectUpbitWS(
  onPrice: (market: string, price: number) => void,
  onStatusChange?: (connected: boolean) => void
): WebSocket {
  const ws = new WebSocket('wss://api.upbit.com/websocket/v1')
  const latest = new Map<string, number>()
  const emitted = new Set<string>()
  let timer: ReturnType<typeof setInterval> | undefined

  ws.onopen = () => {
    onStatusChange?.(true)
    ws.send(
      JSON.stringify([
        { ticket: 'candy-crypto' },
        { type: 'ticker', codes: ['KRW-USDT', 'KRW-BTC'] },
      ])
    )
    timer = setInterval(() => {
      latest.forEach((price, market) => onPrice(market, price))
    }, THROTTLE_MS)
  }

  ws.onmessage = async (e) => {
    const text = await (e.data as Blob).text()
    const data = JSON.parse(text)
    latest.set(data.code, data.trade_price)
    if (!emitted.has(data.code)) {
      emitted.add(data.code)
      onPrice(data.code, data.trade_price)
    }
  }

  ws.onclose = () => {
    onStatusChange?.(false)
    clearInterval(timer)
    setTimeout(() => connectUpbitWS(onPrice, onStatusChange), 3000)
  }

  ws.onerror = () => {
    onStatusChange?.(false)
    ws.close()
  }

  return ws
}
