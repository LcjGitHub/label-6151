import { describe, it, expect } from 'vitest'
import { ref } from 'vue'
import { useCoinFilter } from '@/composables/useCoinFilter'
import type { Coin } from '@/types/coin'
import type { DiameterRange } from '@/api/coins'

const mockCoins: Coin[] = [
  {
    id: 'coin-001',
    name: '开元通宝',
    dynasty: '唐朝',
    obverse: '开元通宝',
    reverse: '',
    diameter: 25,
    material: '铜',
    imageUrl: '/images/coin-001.jpg',
    description: '唐代开元通宝钱币',
  },
  {
    id: 'coin-002',
    name: '半两钱',
    dynasty: '秦朝',
    obverse: '半两',
    reverse: '',
    diameter: 30,
    material: '铜',
    imageUrl: '/images/coin-002.jpg',
    description: '秦代半两钱',
  },
  {
    id: 'coin-003',
    name: '五铢钱',
    dynasty: '汉朝',
    obverse: '五铢',
    reverse: '',
    diameter: 26,
    material: '铜',
    imageUrl: '/images/coin-003.jpg',
    description: '汉代五铢钱',
  },
  {
    id: 'coin-004',
    name: '开元通宝金币',
    dynasty: '唐朝',
    obverse: '开元通宝',
    reverse: '吉祥',
    diameter: 24,
    material: '金',
    imageUrl: '/images/coin-004.jpg',
    description: '唐代开元通宝金币，背文吉祥',
  },
  {
    id: 'coin-005',
    name: '宣和通宝',
    dynasty: '宋朝',
    obverse: '宣和通宝',
    reverse: '',
    diameter: 28,
    material: '铜',
    imageUrl: '/images/coin-005.jpg',
    description: '宋代宣和通宝钱币',
  },
  {
    id: 'coin-006',
    name: '宣和元宝银钱',
    dynasty: '宋朝',
    obverse: '宣和元宝',
    reverse: '',
    diameter: 27,
    material: '银',
    imageUrl: '/images/coin-006.jpg',
    description: '宋代宣和元宝银质钱币',
  },
]

const mockDiameterExtremes: DiameterRange = { min: 24, max: 30 }

function createDiameterExtremesRef(value: DiameterRange | undefined = mockDiameterExtremes) {
  return ref<DiameterRange | undefined>(value)
}

describe('useCoinFilter', () => {
  it('should return all coins when no filters are applied', () => {
    const coins = ref(mockCoins)
    const { filteredCoins, hasActiveFilters } = useCoinFilter(coins, createDiameterExtremesRef())

    expect(filteredCoins.value).toHaveLength(mockCoins.length)
    expect(hasActiveFilters.value).toBe(false)
  })

  it('should return empty array when coins is undefined', () => {
    const coins = ref<Coin[] | undefined>(undefined)
    const { filteredCoins } = useCoinFilter(coins, createDiameterExtremesRef())

    expect(filteredCoins.value).toEqual([])
  })

  it('should filter by dynasty only', () => {
    const coins = ref(mockCoins)
    const { filteredCoins, selectedDynasty, hasActiveFilters } = useCoinFilter(
      coins,
      createDiameterExtremesRef(),
    )

    selectedDynasty.value = '唐朝'

    expect(filteredCoins.value).toHaveLength(2)
    expect(filteredCoins.value.map((c) => c.id)).toEqual(['coin-001', 'coin-004'])
    expect(hasActiveFilters.value).toBe(true)
  })

  it('should filter by single material only', () => {
    const coins = ref(mockCoins)
    const { filteredCoins, selectedMaterials, hasActiveFilters } = useCoinFilter(
      coins,
      createDiameterExtremesRef(),
    )

    selectedMaterials.value = ['金']

    expect(filteredCoins.value).toHaveLength(1)
    expect(filteredCoins.value[0].id).toBe('coin-004')
    expect(hasActiveFilters.value).toBe(true)
  })

  it('should filter by multiple materials', () => {
    const coins = ref(mockCoins)
    const { filteredCoins, selectedMaterials } = useCoinFilter(coins, createDiameterExtremesRef())

    selectedMaterials.value = ['金', '银']

    expect(filteredCoins.value).toHaveLength(2)
    expect(filteredCoins.value.map((c) => c.id)).toEqual(['coin-004', 'coin-006'])
  })

  it('should filter by keyword matching name (case insensitive)', () => {
    const coins = ref(mockCoins)
    const { filteredCoins, keyword, hasActiveFilters } = useCoinFilter(
      coins,
      createDiameterExtremesRef(),
    )

    keyword.value = '开元'

    expect(filteredCoins.value).toHaveLength(2)
    expect(filteredCoins.value.map((c) => c.id)).toEqual(['coin-001', 'coin-004'])
    expect(hasActiveFilters.value).toBe(true)
  })

  it('should filter by keyword with case insensitivity', () => {
    const coins = ref(mockCoins)
    const { filteredCoins, keyword } = useCoinFilter(coins, createDiameterExtremesRef())

    keyword.value = 'KAIYUAN'

    expect(filteredCoins.value).toHaveLength(0)
  })

  it('should filter by keyword matching obverse text', () => {
    const coins = ref(mockCoins)
    const { filteredCoins, keyword } = useCoinFilter(coins, createDiameterExtremesRef())

    keyword.value = '半两'

    expect(filteredCoins.value).toHaveLength(1)
    expect(filteredCoins.value[0].id).toBe('coin-002')
  })

  it('should filter by keyword matching reverse text', () => {
    const coins = ref(mockCoins)
    const { filteredCoins, keyword } = useCoinFilter(coins, createDiameterExtremesRef())

    keyword.value = '吉祥'

    expect(filteredCoins.value).toHaveLength(1)
    expect(filteredCoins.value[0].id).toBe('coin-004')
  })

  it('should filter by keyword with surrounding whitespace trimmed', () => {
    const coins = ref(mockCoins)
    const { filteredCoins, keyword } = useCoinFilter(coins, createDiameterExtremesRef())

    keyword.value = '  五铢  '

    expect(filteredCoins.value).toHaveLength(1)
    expect(filteredCoins.value[0].id).toBe('coin-003')
  })

  it('should combine dynasty and material filters', () => {
    const coins = ref(mockCoins)
    const { filteredCoins, selectedDynasty, selectedMaterials } = useCoinFilter(
      coins,
      createDiameterExtremesRef(),
    )

    selectedDynasty.value = '唐朝'
    selectedMaterials.value = ['金']

    expect(filteredCoins.value).toHaveLength(1)
    expect(filteredCoins.value[0].id).toBe('coin-004')
  })

  it('should combine dynasty and keyword filters', () => {
    const coins = ref(mockCoins)
    const { filteredCoins, selectedDynasty, keyword } = useCoinFilter(
      coins,
      createDiameterExtremesRef(),
    )

    selectedDynasty.value = '宋朝'
    keyword.value = '元宝'

    expect(filteredCoins.value).toHaveLength(1)
    expect(filteredCoins.value[0].id).toBe('coin-006')
  })

  it('should combine material and keyword filters', () => {
    const coins = ref(mockCoins)
    const { filteredCoins, selectedMaterials, keyword } = useCoinFilter(
      coins,
      createDiameterExtremesRef(),
    )

    selectedMaterials.value = ['银']
    keyword.value = '宣和'

    expect(filteredCoins.value).toHaveLength(1)
    expect(filteredCoins.value[0].id).toBe('coin-006')
  })

  it('should combine all three filters (dynasty + material + keyword)', () => {
    const coins = ref(mockCoins)
    const { filteredCoins, selectedDynasty, selectedMaterials, keyword, hasActiveFilters } =
      useCoinFilter(coins, createDiameterExtremesRef())

    selectedDynasty.value = '唐朝'
    selectedMaterials.value = ['金']
    keyword.value = '开元'

    expect(filteredCoins.value).toHaveLength(1)
    expect(filteredCoins.value[0].id).toBe('coin-004')
    expect(hasActiveFilters.value).toBe(true)
  })

  it('should return empty array when no coins match filters', () => {
    const coins = ref(mockCoins)
    const { filteredCoins, selectedDynasty } = useCoinFilter(coins, createDiameterExtremesRef())

    selectedDynasty.value = '明朝'

    expect(filteredCoins.value).toHaveLength(0)
    expect(filteredCoins.value).toEqual([])
  })

  it('should return empty array when keyword matches nothing', () => {
    const coins = ref(mockCoins)
    const { filteredCoins, keyword } = useCoinFilter(coins, createDiameterExtremesRef())

    keyword.value = '不存在的钱币'

    expect(filteredCoins.value).toHaveLength(0)
  })

  it('should reset all filters and restore all coins', () => {
    const coins = ref(mockCoins)
    const diameterExtremes = createDiameterExtremesRef()
    const {
      filteredCoins,
      selectedDynasty,
      selectedMaterials,
      keyword,
      diameterRange,
      resetFilters,
      hasActiveFilters,
    } = useCoinFilter(coins, diameterExtremes)

    selectedDynasty.value = '唐朝'
    selectedMaterials.value = ['金']
    keyword.value = '开元'
    diameterRange.value = [24, 25]
    expect(filteredCoins.value).toHaveLength(1)
    expect(hasActiveFilters.value).toBe(true)

    resetFilters()

    expect(selectedDynasty.value).toBe('')
    expect(selectedMaterials.value).toEqual([])
    expect(keyword.value).toBe('')
    expect(diameterRange.value).toEqual([24, 30])
    expect(filteredCoins.value).toHaveLength(mockCoins.length)
    expect(hasActiveFilters.value).toBe(false)
  })

  it('should apply initial state filters correctly', () => {
    const coins = ref(mockCoins)
    const { filteredCoins, hasActiveFilters } = useCoinFilter(coins, createDiameterExtremesRef(), {
      dynasty: '唐朝',
      materials: ['铜'],
      keyword: '通宝',
    })

    expect(hasActiveFilters.value).toBe(true)
    expect(filteredCoins.value).toHaveLength(1)
    expect(filteredCoins.value[0].id).toBe('coin-001')
  })

  it('should handle empty initial state correctly', () => {
    const coins = ref(mockCoins)
    const { filteredCoins, hasActiveFilters } = useCoinFilter(
      coins,
      createDiameterExtremesRef(),
      {},
    )

    expect(filteredCoins.value).toHaveLength(mockCoins.length)
    expect(hasActiveFilters.value).toBe(false)
  })

  it('hasActiveFilters should be true with only dynasty filter', () => {
    const coins = ref(mockCoins)
    const { selectedDynasty, hasActiveFilters } = useCoinFilter(coins, createDiameterExtremesRef())

    selectedDynasty.value = '唐朝'
    expect(hasActiveFilters.value).toBe(true)
  })

  it('hasActiveFilters should be true with only material filter', () => {
    const coins = ref(mockCoins)
    const { selectedMaterials, hasActiveFilters } = useCoinFilter(
      coins,
      createDiameterExtremesRef(),
    )

    selectedMaterials.value = ['铜']
    expect(hasActiveFilters.value).toBe(true)
  })

  it('hasActiveFilters should be true with only keyword filter', () => {
    const coins = ref(mockCoins)
    const { keyword, hasActiveFilters } = useCoinFilter(coins, createDiameterExtremesRef())

    keyword.value = '半两'
    expect(hasActiveFilters.value).toBe(true)
  })

  it('hasActiveFilters should be false with whitespace-only keyword', () => {
    const coins = ref(mockCoins)
    const { keyword, hasActiveFilters } = useCoinFilter(coins, createDiameterExtremesRef())

    keyword.value = '   '
    expect(hasActiveFilters.value).toBe(false)
  })

  it('should filter by diameter range', () => {
    const coins = ref(mockCoins)
    const { filteredCoins, diameterRange, hasActiveFilters } = useCoinFilter(
      coins,
      createDiameterExtremesRef(),
    )

    diameterRange.value = [28, 30]

    expect(filteredCoins.value).toHaveLength(2)
    expect(filteredCoins.value.map((c) => c.id)).toEqual(['coin-002', 'coin-005'])
    expect(hasActiveFilters.value).toBe(true)
  })

  it('should filter by narrow diameter range', () => {
    const coins = ref(mockCoins)
    const { filteredCoins, diameterRange } = useCoinFilter(coins, createDiameterExtremesRef())

    diameterRange.value = [24, 25]

    expect(filteredCoins.value).toHaveLength(2)
    expect(filteredCoins.value.map((c) => c.id)).toEqual(['coin-001', 'coin-004'])
  })

  it('should not filter when diameter range equals extremes', () => {
    const coins = ref(mockCoins)
    const { filteredCoins, hasActiveFilters } = useCoinFilter(coins, createDiameterExtremesRef())

    expect(filteredCoins.value).toHaveLength(mockCoins.length)
    expect(hasActiveFilters.value).toBe(false)
  })

  it('should combine diameter range with other filters', () => {
    const coins = ref(mockCoins)
    const { filteredCoins, selectedDynasty, diameterRange } = useCoinFilter(
      coins,
      createDiameterExtremesRef(),
    )

    selectedDynasty.value = '宋朝'
    diameterRange.value = [27, 30]

    expect(filteredCoins.value).toHaveLength(2)
    expect(filteredCoins.value.map((c) => c.id)).toEqual(['coin-005', 'coin-006'])
  })

  it('should return empty when diameter range excludes all coins', () => {
    const coins = ref(mockCoins)
    const { filteredCoins, diameterRange } = useCoinFilter(coins, createDiameterExtremesRef())

    diameterRange.value = [24, 24]

    expect(filteredCoins.value).toHaveLength(1)
    expect(filteredCoins.value[0].id).toBe('coin-004')
  })

  it('should not activate diameter filter when extremes are undefined', () => {
    const coins = ref(mockCoins)
    const { hasActiveFilters, filteredCoins } = useCoinFilter(
      coins,
      ref<DiameterRange | undefined>(undefined),
    )

    expect(hasActiveFilters.value).toBe(false)
    expect(filteredCoins.value).toHaveLength(mockCoins.length)
  })
})
