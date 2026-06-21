import { NextRequest, NextResponse } from 'next/server'
import { getOrderStatus } from '@/lib/feee'

export async function GET(req: NextRequest, { params }: { params: { orderNo: string } }) {
  try {
    const data = await getOrderStatus(params.orderNo)
    return NextResponse.json(data)
  } catch (err) {
    console.error('[에너지] 상태 조회 실패', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : '상태 조회 실패' },
      { status: 500 }
    )
  }
}
