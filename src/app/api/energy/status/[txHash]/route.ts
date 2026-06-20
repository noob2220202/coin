import { NextRequest, NextResponse } from 'next/server'
import { getRentStatus } from '@/lib/tronnrg'

export async function GET(req: NextRequest, { params }: { params: { txHash: string } }) {
  try {
    const data = await getRentStatus(params.txHash)
    return NextResponse.json(data)
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : '상태 조회 실패' },
      { status: 500 }
    )
  }
}
