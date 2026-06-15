import { useQuery } from '@tanstack/vue-query'
import { computed, type Ref } from 'vue'
import {
  fetchCoinById,
  fetchCoins,
  fetchDynasties,
  fetchDynastyTimeline,
  fetchSimilarCoins,
  searchCoins,
} from '@/api/coins'
import type { Coin } from '@/types/coin'

/** Query Key 常量 */
export const coinKeys = {
  all: ['coins'] as const,
  dynasties: ['dynasties'] as const,
  timeline: ['dynasties', 'timeline'] as const,
  detail: (id: string) => ['coins', id] as const,
  similar: (id: string) => ['coins', id, 'similar'] as const,
  search: (keyword: string) => ['coins', 'search', keyword] as const,
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

export function useSearchQuery(keyword: Ref<string>) {
  return useQuery({
    queryKey: computed(() => coinKeys.search(keyword.value)),
    queryFn: () => searchCoins(keyword.value),
    enabled: computed(() => keyword.value.trim().length > 0),
  })
}
