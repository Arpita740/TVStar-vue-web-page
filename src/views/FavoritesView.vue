<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useFavoritesStore } from '@/stores/favoritesStore'
import ShowGrid from '@/components/shows/ShowGrid.vue'

const { t } = useI18n()
const favorites = useFavoritesStore()
</script>

<template>
  <h1>{{ t('favorites.title') }}</h1>
  <p class="sub">{{ t('favorites.count', { count: favorites.count }) }}</p>

  <p v-if="!favorites.count" class="empty">{{ t('favorites.empty') }}</p>
  <ShowGrid v-else :shows="favorites.favorites" />
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
.empty {
  color: var(--muted);
  padding: 2rem 0;
}
</style>
