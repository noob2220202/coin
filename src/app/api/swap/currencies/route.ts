import { NextResponse } from 'next/server'
import { getCurrencies } from '@/lib/changenow'

export async function GET() {
  try {
    const data = await getCurrencies()
    return NextResponse.json(data)
  } catch (err) {
    console.error('[스왑] 코인 목록 조회 실패', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : '코인 목록 조회 실패' },
      { status: 500 }
    )
  }
}
