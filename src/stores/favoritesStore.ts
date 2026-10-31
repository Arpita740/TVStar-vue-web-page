import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'
import type { Show } from '@/types/show'

const STORAGE_KEY = 'tvstar-favorites'

function load(): Show[] {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return [] // corrupted or blocked storage
  }
}

export const useFavoritesStore = defineStore('favorites', () => {
  const favorites = ref<Show[]>(load())
  const count = computed(() => favorites.value.length)

  const isFavorite = (id: number) => favorites.value.some((s) => s.id === id)

  function toggle(show: Show) {
    if (isFavorite(show.id)) {
      favorites.value = favorites.value.filter((s) => s.id !== show.id)
    } else {
      // _embedded (the cast) is dropped to keep what we save small
      favorites.value = [...favorites.value, { ...show, _embedded: undefined }]
    }
  }

  // Save after every change
  watch(
    favorites,
    (value) => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(value))
      } catch {
        /* ignore */
      }
    },
    { deep: true },
  )

  return { favorites, count, isFavorite, toggle }
})
