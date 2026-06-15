import { describe, it, expect, beforeEach } from 'vitest'
import { useFavorites } from '@/composables/useFavorites'
import type { Coin } from '@/types/coin'

const mockCoin: Coin = {
  id: 'coin-001',
  name: '开元通宝',
  dynasty: '唐朝',
  obverse: '开元通宝',
  reverse: '',
  diameter: 25,
  material: '铜',
  imageUrl: '/images/coin-001.jpg',
  description: '唐代开元通宝钱币',
}

const mockCoin2: Coin = {
  id: 'coin-002',
  name: '半两钱',
  dynasty: '秦朝',
  obverse: '半两',
  reverse: '',
  diameter: 30,
  material: '铜',
  imageUrl: '/images/coin-002.jpg',
  description: '秦代半两钱',
}

describe('useFavorites', () => {
  beforeEach(() => {
    localStorage.clear()
    const { clearFavorites } = useFavorites()
    clearFavorites()
  })

  it('should initialize with empty favorites', () => {
    const { count, favoriteIdsList } = useFavorites()
    expect(count.value).toBe(0)
    expect(favoriteIdsList.value).toEqual([])
  })

  it('should add a coin to favorites', () => {
    const { addFavorite, isFavorite, count } = useFavorites()
    const result = addFavorite(mockCoin)
    expect(result).toBe(true)
    expect(isFavorite(mockCoin.id)).toBe(true)
    expect(count.value).toBe(1)
  })

  it('should not add the same coin twice', () => {
    const { addFavorite, count } = useFavorites()
    addFavorite(mockCoin)
    const result = addFavorite(mockCoin)
    expect(result).toBe(false)
    expect(count.value).toBe(1)
  })

  it('should remove a coin from favorites', () => {
    const { addFavorite, removeFavorite, isFavorite, count } = useFavorites()
    addFavorite(mockCoin)
    const result = removeFavorite(mockCoin.id)
    expect(result).toBe(true)
    expect(isFavorite(mockCoin.id)).toBe(false)
    expect(count.value).toBe(0)
  })

  it('should return false when removing a non-existent coin', () => {
    const { removeFavorite } = useFavorites()
    const result = removeFavorite('non-existent')
    expect(result).toBe(false)
  })

  it('should toggle favorite status', () => {
    const { toggleFavorite, isFavorite } = useFavorites()
    const addResult = toggleFavorite(mockCoin)
    expect(addResult).toBe(true)
    expect(isFavorite(mockCoin.id)).toBe(true)
    const removeResult = toggleFavorite(mockCoin)
    expect(removeResult).toBe(false)
    expect(isFavorite(mockCoin.id)).toBe(false)
  })

  it('should clear all favorites', () => {
    const { addFavorite, clearFavorites, count, favoriteIdsList } = useFavorites()
    addFavorite(mockCoin)
    addFavorite(mockCoin2)
    expect(count.value).toBe(2)
    clearFavorites()
    expect(count.value).toBe(0)
    expect(favoriteIdsList.value).toEqual([])
  })

  it('should get favorite coins from all coins list', () => {
    const { addFavorite, getFavoriteCoins } = useFavorites()
    addFavorite(mockCoin)
    const allCoins = [mockCoin, mockCoin2]
    const favorites = getFavoriteCoins(allCoins)
    expect(favorites).toHaveLength(1)
    expect(favorites[0].id).toBe(mockCoin.id)
  })
})
