export function connectBinanceWS(
  onPrice: (symbol: string, price: number) => void,
  onStatusChange?: (connected: boolean) => void
): WebSocket {
  const streams = 'btcusdt@miniTicker'
  const ws = new WebSocket(`wss://stream.binance.com:9443/ws/${streams}`)

  ws.onopen = () => {
    onStatusChange?.(true)
  }

  ws.onmessage = (e) => {
    const data = JSON.parse(e.data)
    onPrice(data.s, parseFloat(data.c))
  }

  ws.onclose = () => {
    onStatusChange?.(false)
    setTimeout(() => connectBinanceWS(onPrice, onStatusChange), 3000)
  }

  ws.onerror = () => {
    onStatusChange?.(false)
    ws.close()
  }

  return ws
}
