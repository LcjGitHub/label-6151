import { computed, reactive, ref } from 'vue'
import type { Coin } from '@/types/coin'

/** 最多对比数量 */
export const MAX_COMPARE_COUNT = 3

const compareCoinIds = ref<string[]>([])
const compareCoinMap = reactive<Map<string, Coin>>(new Map())

export function useCompare() {
  /** 是否已选满 */
  const isFull = computed(() => compareCoinIds.value.length >= MAX_COMPARE_COUNT)

  /** 已选数量 */
  const count = computed(() => compareCoinIds.value.length)

  /** 已选钱币列表（保持加入顺序） */
  const selectedCoins = computed(() =>
    compareCoinIds.value
      .map((id) => compareCoinMap.get(id))
      .filter((coin): coin is Coin => !!coin),
  )

  /**
   * 检查某枚钱币是否已加入对比
   */
  function isSelected(id: string): boolean {
    return compareCoinIds.value.includes(id)
  }

  /**
   * 加入对比
   * @returns 是否成功加入
   */
  function addToCompare(coin: Coin): boolean {
    if (compareCoinIds.value.includes(coin.id)) return false
    if (compareCoinIds.value.length >= MAX_COMPARE_COUNT) return false
    compareCoinIds.value.push(coin.id)
    compareCoinMap.set(coin.id, coin)
    return true
  }

  /**
   * 从对比中移除
   */
  function removeFromCompare(id: string): void {
    const idx = compareCoinIds.value.indexOf(id)
    if (idx !== -1) {
      compareCoinIds.value.splice(idx, 1)
      compareCoinMap.delete(id)
    }
  }

  /**
   * 切换选中状态
   * @returns 加入成功返回 true，移除返回 false，无法加入返回 undefined
   */
  function toggleCompare(coin: Coin): boolean | undefined {
    if (isSelected(coin.id)) {
      removeFromCompare(coin.id)
      return false
    }
    const added = addToCompare(coin)
    return added ? true : undefined
  }

  /**
   * 清空对比
   */
  function clearCompare(): void {
    compareCoinIds.value.length = 0
    compareCoinMap.clear()
  }

  return {
    isFull,
    count,
    selectedCoins,
    isSelected,
    addToCompare,
    removeFromCompare,
    toggleCompare,
    clearCompare,
  }
}
