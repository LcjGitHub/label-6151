import { computed, ref, type Ref } from 'vue'
import type { Coin } from '@/types/coin'

/**
 * 钱币筛选状态接口 */
export interface CoinFilterState {
  selectedDynasty: Ref<string>
  selectedMaterials: Ref<string[]>
  keyword: Ref<string>
}

/**
 * 钱币筛选组合式函数
 * 统一处理朝代、材质、关键词三类筛选的组合逻辑，支持按名称、面文、背文进行不区分大小写的包含匹配
 * @param coins - 钱币列表（响应式）
 * @param initialState - 初始筛选状态
 * @returns 筛选状态与方法
 */
export function useCoinFilter(
  coins: Ref<Coin[] | undefined>,
  initialState: Partial<{
    dynasty: string
    materials: string[]
    keyword: string
  }> = {},
) {
  const selectedDynasty = ref<string>(initialState.dynasty || '')
  const selectedMaterials = ref<string[]>(initialState.materials || [])
  const keyword = ref<string>(initialState.keyword || '')

  /**
   * 组合筛选后的钱币列表
   */
  const filteredCoins = computed(() => {
    if (!coins.value) return []

    const kw = keyword.value.trim().toLowerCase()

    return coins.value.filter((coin) => {
      if (selectedDynasty.value && coin.dynasty !== selectedDynasty.value) return false

      if (selectedMaterials.value.length > 0 && !selectedMaterials.value.includes(coin.material)) {
        return false
      }

      if (kw) {
        const matchName = coin.name.toLowerCase().includes(kw)
        const matchObverse = coin.obverse.toLowerCase().includes(kw)
        const matchReverse = coin.reverse.toLowerCase().includes(kw)
        if (!matchName && !matchObverse && !matchReverse) return false
      }

      return true
    })
  })

  /**
   * 是否存在活跃的筛选条件
   */
  const hasActiveFilters = computed(
    () =>
      !!selectedDynasty.value ||
      selectedMaterials.value.length > 0 ||
      keyword.value.trim().length > 0,
  )

  /**
   * 重置所有筛选条件
   */
  function resetFilters() {
    selectedDynasty.value = ''
    selectedMaterials.value = []
    keyword.value = ''
  }

  return {
    selectedDynasty,
    selectedMaterials,
    keyword,
    filteredCoins,
    hasActiveFilters,
    resetFilters,
  }
}
