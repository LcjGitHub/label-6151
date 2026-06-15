import { computed, ref, watch } from 'vue'

const STORAGE_KEY = 'coin-recent-views'
const MAX_RECORDS = 10

export interface RecentViewRecord {
  id: string
  viewedAt: string
}

function loadRecentViews(): RecentViewRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) {
        return parsed.filter(
          (r: unknown) =>
            typeof r === 'object' &&
            r !== null &&
            typeof (r as RecentViewRecord).id === 'string' &&
            typeof (r as RecentViewRecord).viewedAt === 'string',
        ) as RecentViewRecord[]
      }
    }
  } catch (e) {
    console.warn('Failed to load recent views from localStorage', e)
  }
  return []
}

function saveRecentViews(records: RecentViewRecord[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records))
  } catch (e) {
    console.warn('Failed to save recent views to localStorage', e)
  }
}

const recentViews = ref<RecentViewRecord[]>(loadRecentViews())

watch(
  recentViews,
  (records) => {
    saveRecentViews(records)
  },
  { deep: true },
)

export function useRecentViews() {
  const count = computed(() => recentViews.value.length)

  const recentViewsList = computed(() => [...recentViews.value])

  function addView(id: string): void {
    const now = new Date().toISOString()
    const idx = recentViews.value.findIndex((r) => r.id === id)
    if (idx !== -1) {
      recentViews.value.splice(idx, 1)
    }
    recentViews.value.unshift({ id, viewedAt: now })
    if (recentViews.value.length > MAX_RECORDS) {
      recentViews.value.splice(MAX_RECORDS)
    }
  }

  function removeView(id: string): boolean {
    const idx = recentViews.value.findIndex((r) => r.id === id)
    if (idx !== -1) {
      recentViews.value.splice(idx, 1)
      return true
    }
    return false
  }

  function clearAll(): void {
    recentViews.value.length = 0
  }

  return {
    count,
    recentViewsList,
    addView,
    removeView,
    clearAll,
  }
}
