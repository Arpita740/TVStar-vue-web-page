<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import { useShowStore } from '@/stores/showStore'
import { useGenreLabel } from '@/composables/useGenreLabel'
import { useLazyList } from '@/composables/useLazyList'
import { sortShows, type SortKey } from '@/utils/genreUtils'
import ShowGrid from '@/components/shows/ShowGrid.vue'
import SortSelect from '@/components/common/SortSelect.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import ErrorMessage from '@/components/common/ErrorMessage.vue'

const props = defineProps<{ genre: string }>()

const { t } = useI18n()
const genreLabel = useGenreLabel()
const store = useShowStore()
const { loading, error, showsByGenre } = storeToRefs(store)

const sortBy = ref<SortKey>('rating')
const shows = computed(() => sortShows(showsByGenre.value[props.genre] ?? [], sortBy.value))

const { visible, hasMore, sentinel } = useLazyList(shows, 24)

onMounted(() => store.loadShows())
</script>

<template>
  <h1>{{ genreLabel(genre) }}</h1>

  <LoadingSpinner v-if="loading" :label="t('home.loading')" />
  <ErrorMessage v-else-if="error" :message="t('home.error')" @retry="store.loadShows()" />
  <p v-else-if="!shows.length" class="status">{{ t('genre.empty') }}</p>
  <template v-else>
    <div class="toolbar">
      <p class="sub">{{ t('genre.count', { count: shows.length }) }}</p>
      <SortSelect v-model="sortBy" />
    </div>
    <ShowGrid :shows="visible" />
    <div v-if="hasMore" ref="sentinel" class="sentinel" />
  </template>
</template>

<style scoped>
h1 {
  margin: 0 0 0.25rem;
  font-size: 2rem;
}
.toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  margin: 0.25rem 0 1.5rem;
}
.sub {
  color: var(--muted);
  margin: 0;
}
.status {
  color: var(--muted);
  padding: 2rem 0;
}
.sentinel {
  height: 1px;
}
</style>