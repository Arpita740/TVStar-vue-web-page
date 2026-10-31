<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { Show } from '@/types/show'
import { useFavoritesStore } from '@/stores/favoritesStore'

const props = defineProps<{ show: Show; labelled?: boolean }>()
const { t } = useI18n()
const favorites = useFavoritesStore()
const active = computed(() => favorites.isFavorite(props.show.id))
</script>

<template>
  <button
    type="button"
    class="fav"
    :class="{ active, labelled }"
    :aria-pressed="active"
    :aria-label="t('favorites.toggle', { name: show.name })"
    @click="favorites.toggle(show)"
  >
    <span aria-hidden="true">{{ active ? '♥' : '♡' }}</span>
    <span v-if="labelled" aria-hidden="true">{{ t('favorites.label') }}</span>
  </button>
</template>

<style scoped>
.fav {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  width: 2.1rem;
  height: 2.1rem;
  border: 0;
  border-radius: 999px;
  cursor: pointer;
  background: rgba(10, 6, 18, 0.65);
  color: #fff;
  font-size: 1.1rem;
}
.fav.active {
  color: #ea2727;
}
.fav.labelled {
  width: auto;
  height: auto;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  background: var(--surface-strong);
  border: 1px solid var(--border);
}
</style>
