<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import { useShowStore } from '@/stores/showStore'
import { useGenreLabel } from '@/composables/useGenreLabel'
import ShowGrid from '@/components/shows/ShowGrid.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import ErrorMessage from '@/components/common/ErrorMessage.vue'

const props = defineProps<{ genre: string }>()

const { t } = useI18n()
const genreLabel = useGenreLabel()
const store = useShowStore()
const { loading, error, showsByGenre } = storeToRefs(store)
const shows = computed(() => showsByGenre.value[props.genre] ?? [])

onMounted(() => store.loadShows())
</script>

<template>
  <h1>{{ genreLabel(genre) }}</h1>
  <p class="sub">{{ t('genre.sortedBy') }} · {{ t('genre.count', { count: shows.length }) }}</p>

  <LoadingSpinner v-if="loading" :label="t('home.loading')" />
  <ErrorMessage v-else-if="error" :message="t('home.error')" @retry="store.loadShows()" />
  <p v-else-if="!shows.length" class="status">{{ t('genre.empty') }}</p>
  <ShowGrid v-else :shows="shows" />
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
