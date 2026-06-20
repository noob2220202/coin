import { NextRequest, NextResponse } from 'next/server'
import { getExchangeStatus } from '@/lib/changenow'

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const data = await getExchangeStatus(params.id)
    return NextResponse.json(data)
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : '거래 상태 조회 실패' },
      { status: 500 }
    )
  }
}
