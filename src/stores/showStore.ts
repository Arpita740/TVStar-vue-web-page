import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type { Show } from '@/types/show'
import { fetchShowsPage } from '@/services/tvmazeService'
import { groupByGenre, sortByRating } from '@/utils/genreUtils'

export const useShowStore = defineStore('shows', () => {
  const shows = ref<Show[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const showsByGenre = computed(() => {
    const grouped = groupByGenre(shows.value)
    return Object.fromEntries(
      Object.entries(grouped)
        .sort(([, a], [, b]) => b.length - a.length) // biggest genres first
        .map(([genre, list]) => [genre, sortByRating(list)]),
    )
  })

  const genres = computed(() => Object.keys(showsByGenre.value))

  const featuredShow = computed(
    () => sortByRating(shows.value.filter((s) => s.image)).at(0) ?? null,
  )

  async function loadShows() {
    if (shows.value.length || loading.value) return // simple cache
    loading.value = true
    error.value = null
    try {
      const pages = await Promise.all([fetchShowsPage(0), fetchShowsPage(1)])
      shows.value = pages.flat()
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Something went wrong'
    } finally {
      loading.value = false
    }
  }

  return { shows, loading, error, showsByGenre, genres, featuredShow, loadShows }
})
