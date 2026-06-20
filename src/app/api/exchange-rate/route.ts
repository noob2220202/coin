import { NextResponse } from 'next/server'
import { fetchUsdKrw } from '@/lib/exchangeRate'

export async function GET() {
  try {
    const rate = await fetchUsdKrw()
    return NextResponse.json({ rate })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : '환율 조회 실패' },
      { status: 500 }
    )
  }
}
