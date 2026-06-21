import { NextRequest, NextResponse } from 'next/server'
import { createExchange } from '@/lib/changenow'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { fromCurrency, toCurrency, fromAmount, address } = body

  if (!fromCurrency || !toCurrency || !fromAmount || !address) {
    return NextResponse.json(
      { error: 'fromCurrency, toCurrency, fromAmount, address가 필요합니다' },
      { status: 400 }
    )
  }

  try {
    const data = await createExchange({
      fromCurrency,
      toCurrency,
      fromAmount,
      address,
      flow: 'standard',
    })
    return NextResponse.json(data)
  } catch (err) {
    console.error('[스왑] 교환 생성 실패', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : '교환 생성 실패' },
      { status: 500 }
    )
  }
}
