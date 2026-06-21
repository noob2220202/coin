import { NextResponse } from 'next/server'
import { fetchBithumbUsdtKrw } from '@/lib/bithumb'

export async function GET() {
  try {
    const rate = await fetchBithumbUsdtKrw()
    return NextResponse.json({ rate })
  } catch (err) {
    console.error('[빗썸] 시세 조회 실패', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : '빗썸 시세 조회 실패' },
      { status: 500 }
    )
  }
}
