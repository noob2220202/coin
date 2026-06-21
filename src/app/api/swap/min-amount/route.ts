import { NextRequest, NextResponse } from 'next/server'
import { getMinAmount } from '@/lib/changenow'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const fromCurrency = searchParams.get('fromCurrency')
  const toCurrency = searchParams.get('toCurrency')

  if (!fromCurrency || !toCurrency) {
    return NextResponse.json(
      { error: 'fromCurrency, toCurrency가 필요합니다' },
      { status: 400 }
    )
  }

  try {
    const data = await getMinAmount(fromCurrency, toCurrency)
    return NextResponse.json(data)
  } catch (err) {
    console.error('[스왑] 최소 금액 조회 실패', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : '최소 금액 조회 실패' },
      { status: 500 }
    )
  }
}
