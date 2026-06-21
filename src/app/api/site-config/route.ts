import { NextRequest, NextResponse } from 'next/server'
import { readSiteConfig, writeSiteConfig } from '@/lib/adminConfig'
import { isAdminAuthed } from '@/lib/adminAuth'
import { randomUUID } from 'crypto'
import type { BannerAd, SiteConfig } from '@/types'

// 배너 목록/기능 온오프 상태 — 공개 조회 (AdBanner, 스왑/에너지 페이지에서 사용)
export async function GET() {
  try {
    const config = await readSiteConfig()
    return NextResponse.json(config)
  } catch (err) {
    console.error('[설정] 조회 실패', err)
    return NextResponse.json({ error: '설정 조회 실패' }, { status: 500 })
  }
}

function sanitizeBanners(input: unknown): BannerAd[] {
  if (!Array.isArray(input)) return []
  return input
    .filter((b): b is Record<string, unknown> => typeof b === 'object' && b !== null)
    .filter((b) => typeof b.image === 'string' && typeof b.href === 'string')
    .map((b) => ({
      id: typeof b.id === 'string' ? b.id : randomUUID(),
      image: b.image as string,
      href: b.href as string,
      alt: typeof b.alt === 'string' ? b.alt : '광고',
    }))
}

// 설정 변경 — 관리자 인증 필요
export async function POST(req: NextRequest) {
  if (!isAdminAuthed(req)) {
    return NextResponse.json({ error: '인증이 필요합니다' }, { status: 401 })
  }

  const body = await req.json().catch(() => null)
  if (!body) {
    return NextResponse.json({ error: '잘못된 요청입니다' }, { status: 400 })
  }

  const config: SiteConfig = {
    swapEnabled: Boolean(body.swapEnabled),
    energyEnabled: Boolean(body.energyEnabled),
    banners: sanitizeBanners(body.banners),
  }

  try {
    await writeSiteConfig(config)
    return NextResponse.json(config)
  } catch (err) {
    console.error('[설정] 저장 실패', err)
    return NextResponse.json({ error: '설정 저장 실패' }, { status: 500 })
  }
}
