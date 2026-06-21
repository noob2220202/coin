import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'
import { randomUUID } from 'crypto'
import { isAdminAuthed } from '@/lib/adminAuth'

const ADS_DIR = path.join(process.cwd(), 'public', 'ads')
const MAX_SIZE = 5 * 1024 * 1024

const EXT_BY_MIME: Record<string, string> = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/gif': 'gif',
  'image/webp': 'webp',
  'image/svg+xml': 'svg',
}

export async function POST(req: NextRequest) {
  if (!isAdminAuthed(req)) {
    return NextResponse.json({ error: '인증이 필요합니다' }, { status: 401 })
  }

  const formData = await req.formData().catch(() => null)
  const file = formData?.get('file')
  if (!(file instanceof File)) {
    return NextResponse.json({ error: '파일이 없습니다' }, { status: 400 })
  }

  const ext = EXT_BY_MIME[file.type]
  if (!ext) {
    return NextResponse.json({ error: '지원하지 않는 이미지 형식입니다 (PNG/JPG/GIF/WEBP/SVG)' }, { status: 400 })
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: '파일은 5MB 이하여야 합니다' }, { status: 400 })
  }

  await fs.mkdir(ADS_DIR, { recursive: true })
  const filename = `${randomUUID()}.${ext}`
  const buffer = Buffer.from(await file.arrayBuffer())
  await fs.writeFile(path.join(ADS_DIR, filename), buffer)

  return NextResponse.json({ url: `/ads/${filename}` })
}
