import { NextRequest, NextResponse } from 'next/server'
import { getEstimatedAmount } from '@/lib/changenow'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const fromCurrency = searchParams.get('fromCurrency')
  const toCurrency = searchParams.get('toCurrency')
  const fromAmount = Number(searchParams.get('fromAmount'))

  if (!fromCurrency || !toCurrency || !fromAmount) {
    return NextResponse.json(
      { error: 'fromCurrency, toCurrency, fromAmount가 필요합니다' },
      { status: 400 }
    )
  }

  try {
    const data = await getEstimatedAmount(fromCurrency, toCurrency, fromAmount)
    return NextResponse.json(data)
  } catch (err) {
    console.error('[스왑] 예상 수령량 조회 실패', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : '예상 수령량 조회 실패' },
      { status: 500 }
    )
  }
}
