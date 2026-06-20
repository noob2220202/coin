const THROTTLE_MS = 3000

export function connectBinanceWS(
  onPrice: (symbol: string, price: number) => void,
  onStatusChange?: (connected: boolean) => void
): WebSocket {
  const streams = 'btcusdt@miniTicker'
  const ws = new WebSocket(`wss://stream.binance.com:9443/ws/${streams}`)
  let latestSymbol: string | null = null
  let latestPrice: number | null = null
  let emitted = false
  let timer: ReturnType<typeof setInterval> | undefined

  ws.onopen = () => {
    onStatusChange?.(true)
    timer = setInterval(() => {
      const symbol = latestSymbol
      const price = latestPrice
      if (symbol && price !== null) onPrice(symbol, price)
    }, THROTTLE_MS)
  }

  ws.onmessage = (e) => {
    const data = JSON.parse(e.data)
    const symbol: string = data.s
    const price = parseFloat(data.c)
    latestSymbol = symbol
    latestPrice = price
    if (!emitted) {
      emitted = true
      onPrice(symbol, price)
    }
  }

  ws.onclose = () => {
    onStatusChange?.(false)
    clearInterval(timer)
    setTimeout(() => connectBinanceWS(onPrice, onStatusChange), 3000)
  }

  ws.onerror = () => {
    onStatusChange?.(false)
    ws.close()
  }

  return ws
}
