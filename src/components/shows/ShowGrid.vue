<script setup lang="ts">
import type { Show } from '@/types/show'
import ShowCard from './ShowCard.vue'

defineProps<{ shows: Show[] }>()
</script>

<template>
  <ul class="grid">
    <li v-for="show in shows" :key="show.id"><ShowCard :show="show" /></li>
  </ul>
</template>

<style scoped>
.grid {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
}
@media (min-width: 768px) {
  .grid {
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  }
}
</style>
