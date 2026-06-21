import { NextRequest, NextResponse } from 'next/server'
import { getEnergyQuote } from '@/lib/feee'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const energy = Number(searchParams.get('energy'))
  const duration = Number(searchParams.get('duration'))

  if (!energy || !duration) {
    return NextResponse.json({ error: 'energy, duration 파라미터가 필요합니다' }, { status: 400 })
  }

  try {
    const data = await getEnergyQuote(energy, duration)
    return NextResponse.json(data)
  } catch (err) {
    console.error('[에너지] 견적 조회 실패', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : '견적 조회 실패' },
      { status: 500 }
    )
  }
}
