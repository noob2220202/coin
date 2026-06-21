'use client'

import { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { Trash2, ImagePlus } from 'lucide-react'
import GlassCard from '@/components/ui/GlassCard'
import CandyButton from '@/components/ui/CandyButton'
import type { BannerAd, SiteConfig } from '@/types'

export default function AdminPage() {
  const [authed, setAuthed] = useState<boolean | null>(null)
  const [password, setPassword] = useState('')
  const [loggingIn, setLoggingIn] = useState(false)
  const [config, setConfig] = useState<SiteConfig | null>(null)
  const [saving, setSaving] = useState(false)
  const [uploadingId, setUploadingId] = useState<string | null>(null)
  const fileInputs = useRef<Record<string, HTMLInputElement | null>>({})

  useEffect(() => {
    axios
      .get('/api/admin/check')
      .then(() => setAuthed(true))
      .catch(() => setAuthed(false))
  }, [])

  useEffect(() => {
    if (authed) {
      axios
        .get('/api/site-config')
        .then(({ data }) => setConfig(data))
        .catch(() => toast.error('설정을 불러오지 못했어요'))
    }
  }, [authed])

  const handleLogin = async () => {
    setLoggingIn(true)
    try {
      await axios.post('/api/admin/login', { password })
      setAuthed(true)
    } catch {
      toast.error('비밀번호가 일치하지 않아요')
    } finally {
      setLoggingIn(false)
    }
  }

  const handleSave = async () => {
    if (!config) return
    setSaving(true)
    try {
      const { data } = await axios.post('/api/site-config', config)
      setConfig(data)
      toast.success('저장됐어요 🍭')
    } catch {
      toast.error('저장 실패')
    } finally {
      setSaving(false)
    }
  }

  const addBanner = () => {
    if (!config) return
    const id = Date.now().toString(36) + Math.random().toString(36).slice(2)
    const banner: BannerAd = { id, image: '', href: '', alt: '광고' }
    setConfig({ ...config, banners: [...config.banners, banner] })
  }

  const updateBanner = (id: string, field: keyof BannerAd, value: string) => {
    if (!config) return
    setConfig({
      ...config,
      banners: config.banners.map((b) => (b.id === id ? { ...b, [field]: value } : b)),
    })
  }

  const removeBanner = (id: string) => {
    if (!config) return
    setConfig({ ...config, banners: config.banners.filter((b) => b.id !== id) })
  }

  const handlePickImage = async (id: string, file: File) => {
    setUploadingId(id)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const { data } = await axios.post('/api/admin/upload', formData)
      updateBanner(id, 'image', data.url)
    } catch {
      toast.error('이미지 업로드 실패')
    } finally {
      setUploadingId(null)
    }
  }

  if (authed === null) return null

  if (!authed) {
    return (
      <div className="mx-auto max-w-sm px-6 pb-24 flex flex-col gap-4">
        <h1 className="font-gowun text-2xl text-candy text-center">관리자 로그인</h1>
        <GlassCard glow="lav" className="p-6 flex flex-col gap-4">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            placeholder="비밀번호"
            className="candy-input w-full px-4 py-3"
          />
          <CandyButton onClick={handleLogin} disabled={loggingIn} className="w-full">
            로그인
          </CandyButton>
        </GlassCard>
      </div>
    )
  }

  if (!config) return null

  return (
    <div className="mx-auto max-w-2xl px-6 pb-24 flex flex-col gap-8">
      <h1 className="font-gowun text-2xl text-candy text-center">관리자</h1>

      <GlassCard glow="mint" className="p-6 flex flex-col gap-4">
        <h2 className="font-quick text-lg text-secondary">기능 온오프</h2>
        <label className="flex items-center justify-between">
          <span className="font-noto">스왑</span>
          <input
            type="checkbox"
            checked={config.swapEnabled}
            onChange={(e) => setConfig({ ...config, swapEnabled: e.target.checked })}
            className="w-5 h-5 accent-candy-lav"
          />
        </label>
        <label className="flex items-center justify-between">
          <span className="font-noto">에너지 임대</span>
          <input
            type="checkbox"
            checked={config.energyEnabled}
            onChange={(e) => setConfig({ ...config, energyEnabled: e.target.checked })}
            className="w-5 h-5 accent-candy-lav"
          />
        </label>
      </GlassCard>

      <GlassCard glow="pink" className="p-6 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="font-quick text-lg text-secondary">배너 광고</h2>
          <button
            type="button"
            onClick={addBanner}
            className="font-quick text-sm text-candy-lav hover:text-candy-pink"
          >
            + 배너 추가
          </button>
        </div>

        {config.banners.length === 0 && (
          <p className="font-noto text-xs text-muted text-center py-2">등록된 배너가 없어요</p>
        )}

        {config.banners.map((b) => (
          <div key={b.id} className="flex flex-col gap-2 candy-input p-3">
            <div className="flex items-center gap-2">
              <input
                value={b.image}
                onChange={(e) => updateBanner(b.id, 'image', e.target.value)}
                placeholder="이미지/GIF URL (또는 /ads/파일명)"
                className="bg-transparent outline-none text-sm font-noto border-b border-soft pb-1 flex-1"
              />
              <input
                ref={(el) => {
                  fileInputs.current[b.id] = el
                }}
                type="file"
                accept="image/png,image/jpeg,image/gif,image/webp,image/svg+xml"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  e.target.value = ''
                  if (file) handlePickImage(b.id, file)
                }}
              />
              <button
                type="button"
                onClick={() => fileInputs.current[b.id]?.click()}
                disabled={uploadingId === b.id}
                className="text-candy-lav/80 hover:text-candy-lav disabled:opacity-40"
                title="갤러리에서 선택"
              >
                <ImagePlus size={18} />
              </button>
            </div>
            {b.image && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={b.image}
                alt={b.alt}
                className="h-20 w-full object-cover rounded-lg"
              />
            )}
            <input
              value={b.href}
              onChange={(e) => updateBanner(b.id, 'href', e.target.value)}
              placeholder="클릭 시 이동할 링크"
              className="bg-transparent outline-none text-sm font-noto border-b border-soft pb-1"
            />
            <div className="flex items-center gap-2">
              <input
                value={b.alt}
                onChange={(e) => updateBanner(b.id, 'alt', e.target.value)}
                placeholder="설명(alt)"
                className="bg-transparent outline-none text-sm font-noto flex-1"
              />
              <button
                type="button"
                onClick={() => removeBanner(b.id)}
                className="text-candy-pink/70 hover:text-candy-pink"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </GlassCard>

      <CandyButton onClick={handleSave} disabled={saving} className="w-full">
        {saving ? '저장 중...' : '저장하기'}
      </CandyButton>
    </div>
  )
}
