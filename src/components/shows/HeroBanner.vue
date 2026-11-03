<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useI18n } from 'vue-i18n'
import type { Show } from '@/types/show'
import { formatRating } from '@/utils/ratingUtils'
import { stripHtml } from '@/utils/textUtils'
import { useGenreLabel } from '@/composables/useGenreLabel'

const props = defineProps<{ show: Show }>()
const { t } = useI18n()
const genreLabel = useGenreLabel()

const summary = computed(() => stripHtml(props.show.summary))
const genres = computed(() => props.show.genres.map(genreLabel).join(' • '))
</script>

<template>
  <section class="hero" aria-labelledby="hero-title">
    <img v-if="show.image" :src="show.image.original" alt="" class="bg" />
    <div class="shade" />
    <div class="content">
      <p class="badge">★ {{ formatRating(show.rating.average) }} · {{ t('hero.topRated') }}</p>
      <h1 id="hero-title">{{ show.name }}</h1>
      <p class="genres">{{ genres }}</p>
      <p class="summary">{{ summary }}</p>
      <RouterLink :to="`/shows/${show.id}`" class="cta">{{ t('hero.viewDetails') }}</RouterLink>
    </div>
  </section>
</template>

<style scoped>
.hero {
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  min-height: 320px;
  margin-bottom: 2rem;
  border: 1px solid var(--border);
  background: linear-gradient(135deg, #d21e66, #0a0612);
}
.bg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.55;
}
/* dark-violet fade so the text stays readable over any poster */
.shade {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    90deg,
    rgba(10, 6, 18, 0.98) 0%,
    rgba(26, 15, 51, 0.82) 55%,
    rgba(10, 6, 18, 0.3) 100%
  );
}
.content {
  position: relative;
  padding: 2rem 1.25rem;
  max-width: 640px;
}
.badge {
  color: var(--star);
  font-weight: 600;
  margin: 0 0 0.5rem;
}
h1 {
  font-size: clamp(1.75rem, 5vw, 2.75rem);
  margin: 0 0 0.5rem;
}
.genres {
  color: #fcd2d2;
  font-weight: 600;
  margin: 0 0 1rem;
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.8);
}
.summary {
  display: -webkit-box;
  -webkit-line-clamp: 4;
  line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin: 0 0 1.25rem;
}
.cta {
  display: inline-block;
  background: var(--gradient);
  color: #fff;
  padding: 0.6rem 1.2rem;
  border-radius: 8px;
  font-weight: 700;
  box-shadow: 0 6px 20px rgba(237, 58, 94, 0.45);
}
</style>
