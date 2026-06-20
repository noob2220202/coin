import { NextRequest, NextResponse } from 'next/server'
import { rentEnergy } from '@/lib/tronnrg'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { receiver, energy, duration, payer } = body

  if (!receiver || !energy || !duration || !payer) {
    return NextResponse.json(
      { error: 'receiver, energy, duration, payer가 필요합니다' },
      { status: 400 }
    )
  }

  try {
    const data = await rentEnergy({ receiver, energy, duration, payer })
    return NextResponse.json(data)
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : '에너지 임대 실패' },
      { status: 500 }
    )
  }
}
