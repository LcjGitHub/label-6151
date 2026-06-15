import { computed, ref, type Ref } from 'vue'
import type { Coin } from '@/types/coin'

export interface CoinFilterState {
  selectedDynasty: Ref<string>
  selectedMaterials: Ref<string[]>
  keyword: Ref<string>
}

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

  const hasActiveFilters = computed(
    () =>
      !!selectedDynasty.value ||
      selectedMaterials.value.length > 0 ||
      keyword.value.trim().length > 0,
  )

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
