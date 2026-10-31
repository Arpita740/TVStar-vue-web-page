<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import { useI18n } from 'vue-i18n'
import type { Show } from '@/types/show'
import ShowCard from './ShowCard.vue'
import { toGenreId } from '@/utils/genreUtils'
import { useGenreLabel } from '@/composables/useGenreLabel'

const props = defineProps<{ genre: string; shows: Show[] }>()

const { t } = useI18n()
const genreLabel = useGenreLabel()
const scroller = ref<HTMLElement | null>(null)
const headingId = `${toGenreId(props.genre)}-title`

function scroll(direction: 1 | -1) {
  const el = scroller.value
  if (el) el.scrollBy({ left: direction * el.clientWidth * 0.8, behavior: 'smooth' })
}
</script>

<template>
  <section :aria-labelledby="headingId" class="genre">
    <div class="head">
      <h2 :id="headingId">{{ genreLabel(genre) }}</h2>
      <div class="controls">
        <RouterLink :to="{ name: 'genre', params: { genre } }" class="see-all">{{
          t('genre.seeAll')
        }}</RouterLink>
        <button
          type="button"
          class="arrow"
          :aria-label="t('genre.scrollLeft', { genre: genreLabel(genre) })"
          @click="scroll(-1)"
        >
          ‹
        </button>
        <button
          type="button"
          class="arrow"
          :aria-label="t('genre.scrollRight', { genre: genreLabel(genre) })"
          @click="scroll(1)"
        >
          ›
        </button>
      </div>
    </div>

    <div ref="scroller" class="row">
      <ShowCard v-for="show in shows" :key="show.id" :show="show" />
    </div>
  </section>
</template>

<style scoped>
.genre {
  margin-bottom: 2rem;
}
.head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}
h2 {
  font-size: 1.25rem;
  margin: 0;
}

.controls {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}
.see-all {
  color: var(--accent);
  margin-right: 0.5rem;
}
.arrow {
  display: none;
  width: 2rem;
  height: 2rem;
  border: 0;
  border-radius: 50%;
  background: var(--surface);
  color: var(--text);
  font-size: 1.2rem;
  cursor: pointer;
}
@media (hover: hover) {
  .arrow {
    display: block;
  }
}

.row {
  display: flex;
  gap: 1rem;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scrollbar-width: none;
}
.row::-webkit-scrollbar {
  display: none;
}
</style>
