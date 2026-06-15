import { computed, ref, watch } from 'vue'
import type { Coin } from '@/types/coin'

const STORAGE_KEY = 'coin-notes'

export interface CoinNote {
  coinId: string
  content: string
  updatedAt: number
}

function loadNotes(): CoinNote[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) {
        return parsed.filter(
          (n) =>
            n &&
            typeof n.coinId === 'string' &&
            typeof n.content === 'string' &&
            typeof n.updatedAt === 'number',
        )
      }
    }
  } catch (e) {
    console.warn('Failed to load notes from localStorage', e)
  }
  return []
}

function saveNotes(notes: CoinNote[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes))
  } catch (e) {
    console.warn('Failed to save notes to localStorage', e)
  }
}

const notesList = ref<CoinNote[]>(loadNotes())

watch(
  notesList,
  (notes) => {
    saveNotes(notes)
  },
  { deep: true },
)

export function useNotes() {
  const count = computed(() => notesList.value.length)

  const notes = computed(() => [...notesList.value])

  function getNote(coinId: string): CoinNote | undefined {
    return notesList.value.find((n) => n.coinId === coinId)
  }

  function hasNote(coinId: string): boolean {
    return notesList.value.some((n) => n.coinId === coinId)
  }

  function saveNote(coinId: string, content: string): CoinNote {
    const existingIndex = notesList.value.findIndex((n) => n.coinId === coinId)
    const note: CoinNote = {
      coinId,
      content: content.trim(),
      updatedAt: Date.now(),
    }
    if (existingIndex !== -1) {
      notesList.value[existingIndex] = note
    } else {
      notesList.value.push(note)
    }
    return note
  }

  function removeNote(coinId: string): boolean {
    const idx = notesList.value.findIndex((n) => n.coinId === coinId)
    if (idx !== -1) {
      notesList.value.splice(idx, 1)
      return true
    }
    return false
  }

  function clearNotes(): void {
    notesList.value.length = 0
  }

  function getNotesWithCoins(allCoins: Coin[]): Array<{ coin: Coin; note: CoinNote }> {
    return notesList.value
      .map((note) => {
        const coin = allCoins.find((c) => c.id === note.coinId)
        return coin ? { coin, note } : null
      })
      .filter((item): item is { coin: Coin; note: CoinNote } => !!item)
      .sort((a, b) => b.note.updatedAt - a.note.updatedAt)
  }

  return {
    count,
    notes,
    getNote,
    hasNote,
    saveNote,
    removeNote,
    clearNotes,
    getNotesWithCoins,
  }
}
