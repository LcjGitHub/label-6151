import type { Coin } from '@/types/coin'
import type { DynastyItem } from '@/types/dynasty'
import coinsData from '@/mock/coins.json'
import dynastiesData from '@/mock/dynasties.json'

/** 模拟网络延迟（毫秒） */
const MOCK_DELAY = 300

/**
 * 模拟异步请求延迟
 * @param ms - 延迟毫秒数
 */
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * 获取全部钱币数据
 */
export async function fetchCoins(): Promise<Coin[]> {
  await delay(MOCK_DELAY)
  return coinsData as Coin[]
}

/**
 * 根据 ID 获取单枚钱币
 * @param id - 钱币 ID
 */
export async function fetchCoinById(id: string): Promise<Coin | undefined> {
  await delay(MOCK_DELAY)
  return (coinsData as Coin[]).find((coin) => coin.id === id)
}

/**
 * 获取同朝代相似形制推荐（排除当前钱币，最多 limit 条）
 * @param coin - 当前钱币
 * @param limit - 推荐数量，默认 3
 */
export async function fetchSimilarCoins(coin: Coin, limit = 3): Promise<Coin[]> {
  await delay(MOCK_DELAY)
  return (coinsData as Coin[])
    .filter((c) => c.dynasty === coin.dynasty && c.id !== coin.id)
    .slice(0, limit)
}

/**
 * 获取所有朝代列表（去重排序）
 */
export async function fetchDynasties(): Promise<string[]> {
  await delay(MOCK_DELAY)
  const dynasties = [...new Set((coinsData as Coin[]).map((c) => c.dynasty))]
  return dynasties.sort((a, b) => a.localeCompare(b, 'zh-CN'))
}

/**
 * 获取朝代年表（按历史先后顺序排列，含钱币数量统计）
 */
export async function fetchDynastyTimeline(): Promise<DynastyItem[]> {
  await delay(MOCK_DELAY)
  const coinCounts: Record<string, number> = {}
  for (const coin of coinsData as Coin[]) {
    coinCounts[coin.dynasty] = (coinCounts[coin.dynasty] || 0) + 1
  }
  return (dynastiesData as Omit<DynastyItem, 'coinCount'>[]).map((d) => ({
    ...d,
    coinCount: coinCounts[d.name] || 0,
  }))
}
