<script setup lang="ts">
import { computed, onUnmounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import type { Show } from '@/types/show'
import { fetchShowsByPerson, searchPeople, searchShows } from '@/services/tvmazeService'
import { useShowStore } from '@/stores/showStore'
import { sortByRating } from '@/utils/genreUtils'
import ShowGrid from '@/components/shows/ShowGrid.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import ErrorMessage from '@/components/common/ErrorMessage.vue'

const MAX_PEOPLE = 3 // how many matching actors we load shows for

const { t } = useI18n()
const route = useRoute()
const { shows } = storeToRefs(useShowStore())

const query = computed(() => route.query.q?.toString().trim() ?? '')
const results = ref<Show[]>([])
const matchedPeople = ref<string[]>([]) // actors whose shows are included in the results
const loading = ref(false)
const failed = ref(false)

const topRated = computed(() => sortByRating(shows.value).slice(0, 40)) // top 40 shows by rating, for when there's no search query

const visibleShows = computed(() => (query.value ? results.value : topRated.value))

const subtitle = computed(() => {
  if (!query.value) return t('discover.topRated')
  if (matchedPeople.value.length) {
    return t('discover.includesCast', { names: matchedPeople.value.join(', ') })
  }
  return t('discover.sortedBy')
})

// Same show can come from the title search and from an actor: keep the first one
function uniqueById(list: Show[]): Show[] {
  const seen = new Set<number>()
  return list.filter((show) => {
    if (seen.has(show.id)) return false
    seen.add(show.id)
    return true
  })
}

let controller: AbortController | null = null // to cancel the previous request if a new one is made

async function runSearch(q: string) {
  controller?.abort() // the previous request is outdated now
  results.value = []
  matchedPeople.value = []
  failed.value = false
  if (!q) {
    loading.value = false
    return
  }

  controller = new AbortController()
  const { signal } = controller
  loading.value = true

  try {
    // 1) search by show title and by actor name at the same time
    const [byTitle, people] = await Promise.all([searchShows(q, signal), searchPeople(q, signal)])

    // 2) keep only actors whose name really contains the text, then load their shows
    const matched = people
      .filter((p) => p.name.toLowerCase().includes(q.toLowerCase()))
      .slice(0, MAX_PEOPLE)
    const byCast = (await Promise.all(matched.map((p) => fetchShowsByPerson(p.id, signal)))).flat()

    // 3) title matches first, then actor matches; each group sorted by rating
    results.value = uniqueById([...sortByRating(byTitle), ...sortByRating(byCast)])
    matchedPeople.value = matched.map((p) => p.name)
  } catch (e) {
    if ((e as Error).name === 'AbortError') return // we cancelled it on purpose
    failed.value = true
  } finally {
    if (!signal.aborted) loading.value = false
  }
}

watch(query, runSearch, { immediate: true })
onUnmounted(() => controller?.abort())
</script>

<template>
  <h1>{{ query ? t('discover.resultsFor', { query }) : t('discover.title') }}</h1>
  <p class="sub">{{ subtitle }}</p>

  <LoadingSpinner v-if="loading" :label="t('discover.searching')" />
  <ErrorMessage v-else-if="failed" :message="t('discover.failed')" @retry="runSearch(query)" />
  <p v-else-if="query && !results.length" class="status">{{ t('discover.none') }}</p>
  <ShowGrid v-else :shows="visibleShows" />
</template>

<style scoped>
h1 {
  margin: 0;
  font-size: 2rem;
}
.sub {
  color: var(--muted);
  margin: 0.25rem 0 1.5rem;
}
.status {
  color: var(--muted);
  padding: 2rem 0;
}
</style>