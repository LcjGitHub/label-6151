import { computed, ref, watch, type Ref } from 'vue'
import type { Coin } from '@/types/coin'
import type { DiameterRange } from '@/api/coins'

export interface CoinFilterState {
  selectedDynasty: Ref<string>
  selectedMaterials: Ref<string[]>
  keyword: Ref<string>
  diameterRange: Ref<[number, number]>
}

export function useCoinFilter(
  coins: Ref<Coin[] | undefined>,
  diameterExtremes: Ref<DiameterRange | undefined>,
  initialState: Partial<{
    dynasty: string
    materials: string[]
    keyword: string
    diameterRange: [number, number]
  }> = {},
) {
  const selectedDynasty = ref<string>(initialState.dynasty || '')
  const selectedMaterials = ref<string[]>(initialState.materials || [])
  const keyword = ref<string>(initialState.keyword || '')
  const diameterRange = ref<[number, number]>(initialState.diameterRange || [0, 0])

  const isDiameterInitialized = ref(false)

  watch(
    () => diameterExtremes.value,
    (extremes) => {
      if (!extremes || isDiameterInitialized.value) return
      if (initialState.diameterRange) {
        isDiameterInitialized.value = true
        return
      }
      diameterRange.value = [extremes.min, extremes.max]
      isDiameterInitialized.value = true
    },
    { immediate: true },
  )

  const isDiameterFilterActive = computed(() => {
    if (!diameterExtremes.value || !isDiameterInitialized.value) return false
    const [min, max] = diameterRange.value
    return min !== diameterExtremes.value.min || max !== diameterExtremes.value.max
  })

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

      if (isDiameterFilterActive.value) {
        const [min, max] = diameterRange.value
        if (coin.diameter < min || coin.diameter > max) return false
      }

      return true
    })
  })

  const hasActiveFilters = computed(
    () =>
      !!selectedDynasty.value ||
      selectedMaterials.value.length > 0 ||
      keyword.value.trim().length > 0 ||
      isDiameterFilterActive.value,
  )

  function resetFilters() {
    selectedDynasty.value = ''
    selectedMaterials.value = []
    keyword.value = ''
    if (diameterExtremes.value) {
      diameterRange.value = [diameterExtremes.value.min, diameterExtremes.value.max]
    }
  }

  return {
    selectedDynasty,
    selectedMaterials,
    keyword,
    diameterRange,
    filteredCoins,
    hasActiveFilters,
    resetFilters,
  }
}
