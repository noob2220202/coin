import { NextResponse } from 'next/server'
import { getEnergyPrice } from '@/lib/feee'

export async function GET() {
  try {
    const data = await getEnergyPrice()
    return NextResponse.json(data)
  } catch (err) {
    console.error('[에너지] 가격 조회 실패', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : '에너지 가격 조회 실패' },
      { status: 500 }
    )
  }
}
