// 서버 전용 모듈 — Node 파일시스템을 사용하므로 API 라우트 핸들러에서만 import 할 것
import { promises as fs } from 'fs'
import path from 'path'
import type { SiteConfig } from '@/types'

const CONFIG_PATH = path.join(process.cwd(), 'data', 'site-config.json')

const DEFAULT_CONFIG: SiteConfig = {
  swapEnabled: true,
  energyEnabled: true,
  banners: [],
}

export async function readSiteConfig(): Promise<SiteConfig> {
  try {
    const raw = await fs.readFile(CONFIG_PATH, 'utf-8')
    return { ...DEFAULT_CONFIG, ...JSON.parse(raw) }
  } catch {
    return DEFAULT_CONFIG
  }
}

export async function writeSiteConfig(config: SiteConfig): Promise<void> {
  await fs.mkdir(path.dirname(CONFIG_PATH), { recursive: true })
  await fs.writeFile(CONFIG_PATH, JSON.stringify(config, null, 2), 'utf-8')
}
