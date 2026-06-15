import { computed, ref, watch } from 'vue'
import type { Coin } from '@/types/coin'

const STORAGE_KEY = 'coin-favorites'

function loadFavorites(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) {
        return parsed.filter((id) => typeof id === 'string')
      }
    }
  } catch (e) {
    console.warn('Failed to load favorites from localStorage', e)
  }
  return []
}

function saveFavorites(ids: string[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids))
  } catch (e) {
    console.warn('Failed to save favorites to localStorage', e)
  }
}

const favoriteIds = ref<string[]>(loadFavorites())
const favoriteCoinMap = new Map<string, Coin>()

watch(
  favoriteIds,
  (ids) => {
    saveFavorites(ids)
  },
  { deep: true },
)

export function useFavorites() {
  const count = computed(() => favoriteIds.value.length)

  const favoriteIdsList = computed(() => [...favoriteIds.value])

  function isFavorite(id: string): boolean {
    return favoriteIds.value.includes(id)
  }

  function addFavorite(coin: Coin): boolean {
    if (favoriteIds.value.includes(coin.id)) return false
    favoriteIds.value.push(coin.id)
    favoriteCoinMap.set(coin.id, coin)
    return true
  }

  function removeFavorite(id: string): boolean {
    const idx = favoriteIds.value.indexOf(id)
    if (idx !== -1) {
      favoriteIds.value.splice(idx, 1)
      favoriteCoinMap.delete(id)
      return true
    }
    return false
  }

  function toggleFavorite(coin: Coin): boolean {
    if (isFavorite(coin.id)) {
      removeFavorite(coin.id)
      return false
    }
    addFavorite(coin)
    return true
  }

  function clearFavorites(): void {
    favoriteIds.value.length = 0
    favoriteCoinMap.clear()
  }

  function getFavoriteCoins(allCoins: Coin[]): Coin[] {
    return favoriteIds.value
      .map((id) => allCoins.find((c) => c.id === id))
      .filter((coin): coin is Coin => !!coin)
  }

  return {
    count,
    favoriteIdsList,
    isFavorite,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    clearFavorites,
    getFavoriteCoins,
  }
}
