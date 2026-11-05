<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { RouterLink } from 'vue-router'
import { useI18n } from 'vue-i18n'
import type { Show } from '@/types/show'
import ShowCard from './ShowCard.vue'
import { toGenreId } from '@/utils/genreUtils'
import { useGenreLabel } from '@/composables/useGenreLabel'
import { useThrottleFn } from '@/composables/useThrottle'

const props = defineProps<{ genre: string; shows: Show[] }>()

const { t } = useI18n()
const genreLabel = useGenreLabel()
const scroller = ref<HTMLElement | null>(null)
const headingId = `${toGenreId(props.genre)}-title`

// Is the row scrolled to its very start / very end? Used for arrows and edge fades
const atStart = ref(true)
const atEnd = ref(true)

function updateEdges() { 
  const el = scroller.value
  if (!el) return
  atStart.value = el.scrollLeft <= 1
  atEnd.value = el.scrollLeft + el.clientWidth >= el.scrollWidth - 1
}

// Throttle: check at most every 100 ms while scrolling.
// The throttle can skip the very last scroll event, so a short timer
// does one final check when scrolling has stopped.
const throttledUpdate = useThrottleFn(updateEdges, 100)
let settleTimer: ReturnType<typeof setTimeout> | undefined

function refreshEdges() {
  throttledUpdate()
  clearTimeout(settleTimer)
  settleTimer = setTimeout(updateEdges, 150)
}

function scroll(direction: 1 | -1) {
  const el = scroller.value
  if (el) el.scrollBy({ left: direction * el.clientWidth * 0.8, behavior: 'smooth' })
}

onMounted(() => {
  updateEdges()
  window.addEventListener('resize', refreshEdges)
})
onBeforeUnmount(() => {
  window.removeEventListener('resize', refreshEdges)
  clearTimeout(settleTimer)
})
watch(
  () => props.shows,
  () => nextTick(updateEdges),
)
</script>

<template>
  <section :aria-labelledby="headingId" class="genre">
    <div class="head">
      <h2 :id="headingId">{{ genreLabel(genre) }}</h2>
      <RouterLink :to="{ name: 'genre', params: { genre } }" class="see-all">{{
        t('genre.seeAll')
      }}</RouterLink>
    </div>

    <div class="row-wrap" :class="{ 'has-left': !atStart, 'has-right': !atEnd }">
      <button
        type="button"
        class="arrow left"
        :disabled="atStart"
        :aria-label="t('genre.scrollLeft', { genre: genreLabel(genre) })"
        @click="scroll(-1)"
      >
        ‹
      </button>

      <div ref="scroller" class="row" @scroll="refreshEdges">
        <ShowCard v-for="show in shows" :key="show.id" :show="show" />
      </div>

      <button
        type="button"
        class="arrow right"
        :disabled="atEnd"
        :aria-label="t('genre.scrollRight', { genre: genreLabel(genre) })"
        @click="scroll(1)"
      >
        ›
      </button>
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
.see-all {
  color: var(--accent);
}

.row-wrap {
  position: relative;
}

/* Soft fade on the left/right edge: tells the user there is more to scroll to */
.row-wrap::before,
.row-wrap::after {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  width: 3rem;
  z-index: 1;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.2s;
}
.row-wrap::before {
  left: 0;
  background: linear-gradient(to right, var(--bg-to), transparent);
}
.row-wrap::after {
  right: 0;
  background: linear-gradient(to left, var(--bg-to), transparent);
}
.row-wrap.has-left::before,
.row-wrap.has-right::after {
  opacity: 1;
}

/* Arrows sit on top of the row (only on devices with a mouse) */
.arrow {
  display: grid;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 2;
  width: 2.5rem;
  height: 2.5rem;
  place-items: center;
  border: 1px solid var(--border);
  border-radius: 50%;
  background: color-mix(in srgb, var(--bg-to) 80%, transparent);
  color: var(--text);
  font-size: 1.5rem;
  line-height: 1;
  cursor: pointer;
  transition: opacity 0.2s;
}
.arrow.left {
  left: 0.25rem;
}
.arrow.right {
  right: 0.25rem;
}
.arrow:disabled {
  opacity: 0;
  pointer-events: none;
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