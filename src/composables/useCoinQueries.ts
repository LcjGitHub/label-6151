import { useQuery } from '@tanstack/vue-query'
import { computed, type Ref } from 'vue'
import {
  fetchAdjacentCoinIds,
  fetchCoinById,
  fetchCoins,
  fetchCoinsByDynasty,
  fetchDiameterRange,
  fetchDynasties,
  fetchDynastyByName,
  fetchDynastyTimeline,
  fetchMaterials,
  fetchRandomCoin,
  fetchSameMaterialCoins,
  fetchSimilarCoins,
  fetchStatistics,
  searchCoins,
} from '@/api/coins'
import type { Coin } from '@/types/coin'

/** Query Key 常量 */
export const coinKeys = {
  all: ['coins'] as const,
  dynasties: ['dynasties'] as const,
  materials: ['materials'] as const,
  timeline: ['dynasties', 'timeline'] as const,
  statistics: ['statistics'] as const,
  diameterRange: ['diameterRange'] as const,
  detail: (id: string) => ['coins', id] as const,
  adjacent: (id: string) => ['coins', id, 'adjacent'] as const,
  similar: (id: string) => ['coins', id, 'similar'] as const,
  sameMaterial: (id: string) => ['coins', id, 'sameMaterial'] as const,
  search: (keyword: string) => ['coins', 'search', keyword] as const,
  dynastyDetail: (name: string) => ['dynasties', 'detail', name] as const,
  dynastyCoins: (dynasty: string) => ['coins', 'dynasty', dynasty] as const,
  random: (excludeId?: string) => ['coins', 'random', excludeId ?? 'none'] as const,
}

/**
 * 获取钱币列表
 */
export function useCoinsQuery() {
  return useQuery({
    queryKey: coinKeys.all,
    queryFn: fetchCoins,
  })
}

/**
 * 获取朝代列表
 */
export function useDynastiesQuery() {
  return useQuery({
    queryKey: coinKeys.dynasties,
    queryFn: fetchDynasties,
  })
}

/**
 * 获取材质列表
 */
export function useMaterialsQuery() {
  return useQuery({
    queryKey: coinKeys.materials,
    queryFn: fetchMaterials,
  })
}

/**
 * 获取朝代年表
 */
export function useDynastyTimelineQuery() {
  return useQuery({
    queryKey: coinKeys.timeline,
    queryFn: fetchDynastyTimeline,
  })
}

/**
 * 获取单枚钱币详情
 * @param id - 钱币 ID（响应式）
 */
export function useCoinDetailQuery(id: Ref<string>) {
  return useQuery({
    queryKey: computed(() => coinKeys.detail(id.value)),
    queryFn: () => fetchCoinById(id.value),
    enabled: computed(() => !!id.value),
  })
}

/**
 * 获取相邻钱币 ID
 * 根据模拟数据中的默认顺序，返回前一枚和后一枚的钱币 ID
 * @param id - 当前钱币 ID（响应式）
 */
export function useAdjacentCoinsQuery(id: Ref<string>) {
  return useQuery({
    queryKey: computed(() => coinKeys.adjacent(id.value)),
    queryFn: () => fetchAdjacentCoinIds(id.value),
    enabled: computed(() => !!id.value),
  })
}

/**
 * 获取相似形制推荐
 * @param coin - 当前钱币（响应式）
 */
export function useSimilarCoinsQuery(coin: Ref<Coin | undefined>) {
  return useQuery({
    queryKey: computed(() =>
      coin.value ? coinKeys.similar(coin.value.id) : ['coins', 'similar', 'empty'],
    ),
    queryFn: () => fetchSimilarCoins(coin.value!),
    enabled: computed(() => !!coin.value),
  })
}

/**
 * 获取同材质推荐
 * @param coin - 当前钱币（响应式）
 */
export function useSameMaterialCoinsQuery(coin: Ref<Coin | undefined>) {
  return useQuery({
    queryKey: computed(() =>
      coin.value ? coinKeys.sameMaterial(coin.value.id) : ['coins', 'sameMaterial', 'empty'],
    ),
    queryFn: () => fetchSameMaterialCoins(coin.value!),
    enabled: computed(() => !!coin.value),
  })
}

/**
 * 模糊搜索钱币
 * 按名称、面文、背文进行不区分大小写的包含匹配
 * @param keyword - 搜索关键词（响应式）
 */
export function useSearchQuery(keyword: Ref<string>) {
  return useQuery({
    queryKey: computed(() => coinKeys.search(keyword.value)),
    queryFn: () => searchCoins(keyword.value),
    enabled: computed(() => keyword.value.trim().length > 0),
  })
}

/**
 * 获取钱币统计概览数据
 */
export function useStatisticsQuery() {
  return useQuery({
    queryKey: coinKeys.statistics,
    queryFn: fetchStatistics,
  })
}

export function useDiameterRangeQuery() {
  return useQuery({
    queryKey: coinKeys.diameterRange,
    queryFn: fetchDiameterRange,
  })
}

/**
 * 根据朝代名称获取朝代详情
 * @param name - 朝代名称（响应式）
 */
export function useDynastyByNameQuery(name: Ref<string>) {
  return useQuery({
    queryKey: computed(() => coinKeys.dynastyDetail(name.value)),
    queryFn: () => fetchDynastyByName(name.value),
    enabled: computed(() => !!name.value),
  })
}

/**
 * 按朝代获取钱币列表
 * @param dynasty - 朝代名称（响应式）
 */
export function useCoinsByDynastyQuery(dynasty: Ref<string>) {
  return useQuery({
    queryKey: computed(() => coinKeys.dynastyCoins(dynasty.value)),
    queryFn: () => fetchCoinsByDynasty(dynasty.value),
    enabled: computed(() => !!dynasty.value),
  })
}

/**
 * 随机获取一枚钱币
 * @param excludeId - 需要排除的钱币 ID（响应式，用于避免连续随机到同一枚）
 */
export function useRandomCoinQuery(excludeId?: Ref<string | undefined>) {
  return useQuery({
    queryKey: computed(() => coinKeys.random(excludeId?.value)),
    queryFn: () => fetchRandomCoin(excludeId?.value),
  })
}
