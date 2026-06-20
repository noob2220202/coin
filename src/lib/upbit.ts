export function connectUpbitWS(
  onPrice: (market: string, price: number) => void,
  onStatusChange?: (connected: boolean) => void
): WebSocket {
  const ws = new WebSocket('wss://api.upbit.com/websocket/v1')

  ws.onopen = () => {
    onStatusChange?.(true)
    ws.send(
      JSON.stringify([
        { ticket: 'candy-crypto' },
        { type: 'ticker', codes: ['KRW-USDT', 'KRW-BTC'] },
      ])
    )
  }

  ws.onmessage = async (e) => {
    const text = await (e.data as Blob).text()
    const data = JSON.parse(text)
    onPrice(data.code, data.trade_price)
  }

  ws.onclose = () => {
    onStatusChange?.(false)
    setTimeout(() => connectUpbitWS(onPrice, onStatusChange), 3000)
  }

  ws.onerror = () => {
    onStatusChange?.(false)
    ws.close()
  }

  return ws
}
