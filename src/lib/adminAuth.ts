// 서버 전용 모듈 — 관리자 비밀번호는 process.env.ADMIN_PASSWORD (NEXT_PUBLIC 미사용)
import { NextRequest } from 'next/server'
import { createHash } from 'crypto'

export const ADMIN_COOKIE = 'admin_token'

// 비밀번호 원문을 쿠키에 그대로 담지 않기 위해 해시값을 토큰으로 사용
function tokenFor(password: string): string {
  return createHash('sha256').update(password).digest('hex')
}

export function adminTokenForCurrentPassword(): string | null {
  const password = process.env.ADMIN_PASSWORD
  return password ? tokenFor(password) : null
}

export function isAdminAuthed(req: NextRequest): boolean {
  const expected = adminTokenForCurrentPassword()
  if (!expected) return false
  return req.cookies.get(ADMIN_COOKIE)?.value === expected
}
