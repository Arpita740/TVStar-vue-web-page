<script setup lang="ts">
import { computed, onUnmounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import type { Show } from '@/types/show'
import { searchShows } from '@/services/tvmazeService'
import { useShowStore } from '@/stores/showStore'
import { sortByRating } from '@/utils/genreUtils'
import ShowGrid from '@/components/shows/ShowGrid.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import ErrorMessage from '@/components/common/ErrorMessage.vue'

const { t } = useI18n()
const route = useRoute()
const { shows } = storeToRefs(useShowStore())

const query = computed(() => route.query.q?.toString().trim() ?? '')
const results = ref<Show[]>([])
const loading = ref(false)
const failed = ref(false)

const topRated = computed(() => sortByRating(shows.value).slice(0, 40))
const visibleShows = computed(() => (query.value ? results.value : topRated.value))

let controller: AbortController | null = null

async function runSearch(q: string) {
  controller?.abort() // the previous request is outdated now
  results.value = []
  failed.value = false
  if (!q) {
    loading.value = false
    return
  }

  controller = new AbortController()
  const { signal } = controller
  loading.value = true

  try {
    results.value = sortByRating(await searchShows(q, signal))
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
  <p class="sub">{{ query ? t('discover.sortedBy') : t('discover.topRated') }}</p>

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
