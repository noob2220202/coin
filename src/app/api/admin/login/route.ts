import { NextRequest, NextResponse } from 'next/server'
import { ADMIN_COOKIE, adminTokenForCurrentPassword } from '@/lib/adminAuth'

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null)
  const password = body?.password
  const adminPassword = process.env.ADMIN_PASSWORD
  const token = adminTokenForCurrentPassword()

  if (!adminPassword || !token || password !== adminPassword) {
    return NextResponse.json({ error: '비밀번호가 일치하지 않습니다' }, { status: 401 })
  }

  const res = NextResponse.json({ ok: true })
  res.cookies.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  })
  return res
}
