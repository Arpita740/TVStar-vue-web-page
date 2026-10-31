<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import { useShowStore } from '@/stores/showStore'
import { useLazyList } from '@/composables/useLazyList'
import HeroBanner from '@/components/shows/HeroBanner.vue'
import GenreSection from '@/components/shows/GenreSection.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import ErrorMessage from '@/components/common/ErrorMessage.vue'

const ROWS_PER_CHUNK = 3
const MAX_SHOWS_PER_ROW = 12

const { t } = useI18n()
const store = useShowStore()
const { loading, error, featuredShow, showsByGenre } = storeToRefs(store)

// showsByGenre is already ordered biggest genre first
const homeRows = computed(() =>
  Object.entries(showsByGenre.value).map(([genre, shows]) => ({
    genre,
    shows: shows.slice(0, MAX_SHOWS_PER_ROW),
  })),
)

const { visible: visibleRows, hasMore, sentinel } = useLazyList(homeRows, ROWS_PER_CHUNK)

onMounted(() => store.loadShows())
</script>

<template>
  <LoadingSpinner v-if="loading" :label="t('home.loading')" />
  <ErrorMessage v-else-if="error" :message="t('home.error')" @retry="store.loadShows()" />
  <template v-else>
    <HeroBanner v-if="featuredShow" :show="featuredShow" />
    <GenreSection
      v-for="row in visibleRows"
      :key="row.genre"
      :genre="row.genre"
      :shows="row.shows"
    />
    <div v-if="hasMore" ref="sentinel" class="sentinel" />
  </template>
</template>

<style scoped>
.sentinel {
  height: 1px;
}
</style>