<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import type { SortKey } from '@/utils/genreUtils'

const { t } = useI18n()
const model = defineModel<SortKey>({ required: true })
const options: SortKey[] = ['rating', 'name', 'year']
</script>

<template>
  <div class="sort">
    <label for="sort">{{ t('genre.sortLabel') }}</label>
    <select id="sort" v-model="model">
      <option v-for="key in options" :key="key" :value="key">{{ t(`genre.sort.${key}`) }}</option>
    </select>
  </div>
</template>

<style scoped>
.sort {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
label {
  color: var(--muted);
  font-size: 0.9rem;
}
select {
  font: inherit;
  color: var(--text);
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 0.45rem 0.75rem;
  cursor: pointer;
}
option {
  background: var(--bg-mid);
  color: var(--text);
}
</style>