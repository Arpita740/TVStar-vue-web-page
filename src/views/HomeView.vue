<script setup lang="ts">
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import { useShowStore } from '@/stores/showStore'
import HeroBanner from '@/components/shows/HeroBanner.vue'
import GenreSection from '@/components/shows/GenreSection.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import ErrorMessage from '@/components/common/ErrorMessage.vue'

const { t } = useI18n()
const store = useShowStore()
const { loading, error, featuredShow, showsByGenre } = storeToRefs(store)

onMounted(() => store.loadShows())
</script>

<template>
  <LoadingSpinner v-if="loading" :label="t('home.loading')" />
  <ErrorMessage v-else-if="error" :message="t('home.error')" @retry="store.loadShows()" />
  <template v-else>
    <HeroBanner v-if="featuredShow" :show="featuredShow" />
    <GenreSection
      v-for="(shows, genre) in showsByGenre"
      :key="genre"
      :genre="String(genre)"
      :shows="shows.slice(0, 20)"
    />
  </template>
</template>
