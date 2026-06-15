import type { Coin } from '@/types/coin'
import type { DynastyItem } from '@/types/dynasty'
import type { CoinStatistics, DynastyCoinCount, MaterialRatio } from '@/types/statistics'
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
 * 按编号获取相邻钱币 ID
 * 根据模拟数据中的默认顺序，返回前一枚和后一枚的 ID
 * @param id - 当前钱币 ID
 */
export interface AdjacentCoinIds {
  prevId: string | null
  nextId: string | null
}

export async function fetchAdjacentCoinIds(id: string): Promise<AdjacentCoinIds> {
  await delay(MOCK_DELAY)
  const coins = coinsData as Coin[]
  const index = coins.findIndex((c) => c.id === id)
  if (index === -1) {
    return { prevId: null, nextId: null }
  }
  return {
    prevId: index > 0 ? coins[index - 1].id : null,
    nextId: index < coins.length - 1 ? coins[index + 1].id : null,
  }
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
 * 获取同材质推荐（排除当前钱币，最多 limit 条）
 * @param coin - 当前钱币
 * @param limit - 推荐数量，默认 3
 */
export async function fetchSameMaterialCoins(coin: Coin, limit = 3): Promise<Coin[]> {
  await delay(MOCK_DELAY)
  return (coinsData as Coin[])
    .filter((c) => c.material === coin.material && c.id !== coin.id)
    .slice(0, limit)
}

/**
 * 获取所有朝代列表（按历史先后顺序排列）
 */
export async function fetchDynasties(): Promise<string[]> {
  await delay(MOCK_DELAY)
  const availableDynasties = new Set((coinsData as Coin[]).map((c) => c.dynasty))
  return (dynastiesData as Omit<DynastyItem, 'coinCount'>[])
    .map((d) => d.name)
    .filter((name) => availableDynasties.has(name))
}

/**
 * 获取所有材质列表（从钱币数据中去重提取）
 */
export interface DiameterRange {
  min: number
  max: number
}

export async function fetchDiameterRange(): Promise<DiameterRange> {
  await delay(MOCK_DELAY)
  const coins = coinsData as Coin[]
  const diameters = coins.map((c) => c.diameter)
  return { min: Math.min(...diameters), max: Math.max(...diameters) }
}

export async function fetchMaterials(): Promise<string[]> {
  await delay(MOCK_DELAY)
  const materialSet = new Set((coinsData as Coin[]).map((c) => c.material))
  return Array.from(materialSet)
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

/**
 * 模糊搜索钱币
 * 按名称、面文、背文进行不区分大小写的包含匹配
 * @param keyword - 搜索关键词
 */
export async function searchCoins(keyword: string): Promise<Coin[]> {
  await delay(MOCK_DELAY)
  const kw = keyword.trim().toLowerCase()
  if (!kw) return []
  return (coinsData as Coin[]).filter(
    (c) =>
      c.name.toLowerCase().includes(kw) ||
      c.obverse.toLowerCase().includes(kw) ||
      c.reverse.toLowerCase().includes(kw),
  )
}

/**
 * 根据朝代名称获取朝代详情
 * @param name - 朝代名称
 */
export async function fetchDynastyByName(name: string): Promise<DynastyItem | undefined> {
  await delay(MOCK_DELAY)
  const coinCounts: Record<string, number> = {}
  for (const coin of coinsData as Coin[]) {
    coinCounts[coin.dynasty] = (coinCounts[coin.dynasty] || 0) + 1
  }
  const dynasty = (dynastiesData as Omit<DynastyItem, 'coinCount'>[]).find((d) => d.name === name)
  if (!dynasty) return undefined
  return {
    ...dynasty,
    coinCount: coinCounts[dynasty.name] || 0,
  }
}

/**
 * 按朝代获取钱币列表
 * @param dynasty - 朝代名称
 */
export async function fetchCoinsByDynasty(dynasty: string): Promise<Coin[]> {
  await delay(MOCK_DELAY)
  return (coinsData as Coin[]).filter((c) => c.dynasty === dynasty)
}

/**
 * 获取钱币统计概览数据
 * 聚合计算总钱币数量、朝代数量、材质种类数，
 * 以及各朝代钱币数量分布和各材质占比
 */
export async function fetchStatistics(): Promise<CoinStatistics> {
  await delay(MOCK_DELAY)
  const coins = coinsData as Coin[]

  const totalCoins = coins.length

  const dynastySet = new Set(coins.map((c) => c.dynasty))
  const totalDynasties = dynastySet.size

  const materialSet = new Set(coins.map((c) => c.material))
  const totalMaterials = materialSet.size

  const dynastyCountMap: Record<string, number> = {}
  const dynastyOrder = (dynastiesData as Omit<DynastyItem, 'coinCount'>[]).map((d) => d.name)
  for (const coin of coins) {
    dynastyCountMap[coin.dynasty] = (dynastyCountMap[coin.dynasty] || 0) + 1
  }
  const dynastyCounts: DynastyCoinCount[] = dynastyOrder
    .filter((name) => dynastySet.has(name))
    .map((name) => ({
      dynasty: name,
      count: dynastyCountMap[name] || 0,
    }))

  const materialCountMap: Record<string, number> = {}
  for (const coin of coins) {
    materialCountMap[coin.material] = (materialCountMap[coin.material] || 0) + 1
  }
  const materialRatios: MaterialRatio[] = Object.entries(materialCountMap)
    .map(([material, count]) => ({
      material,
      count,
      ratio: Number(((count / totalCoins) * 100).toFixed(1)),
    }))
    .sort((a, b) => b.count - a.count)

  return {
    totalCoins,
    totalDynasties,
    totalMaterials,
    dynastyCounts,
    materialRatios,
  }
}
