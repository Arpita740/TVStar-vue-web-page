<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { useI18n } from 'vue-i18n'
import type { Show } from '@/types/show'
import { formatRating } from '@/utils/ratingUtils'
import FavoriteButton from '@/components/common/FavoriteButton.vue'

defineProps<{ show: Show }>()
const { t } = useI18n()
</script>

<template>
  <article class="card">
    <RouterLink :to="`/shows/${show.id}`" class="link">
      <img
        v-if="show.image"
        :src="show.image.medium"
        :alt="t('card.poster', { name: show.name })"
        loading="lazy"
        width="210"
        height="295"
      />
      <div v-else class="placeholder" aria-hidden="true">{{ t('card.noImage') }}</div>
      <div class="info">
        <span class="name">{{ show.name }}</span>
        <span
          class="rating"
          :aria-label="t('card.rating', { value: formatRating(show.rating.average) })"
        >
          ★ {{ formatRating(show.rating.average) }}
        </span>
      </div>
    </RouterLink>
    <FavoriteButton :show="show" class="fav-pos" />
  </article>
</template>

<style scoped>
.card {
  position: relative;
  flex: 0 0 150px;
  scroll-snap-align: start;
  overflow: hidden;
  border-radius: 12px;
  background: var(--surface);
  border: 1px solid var(--border);
  transition:
    transform 0.2s,
    box-shadow 0.2s;
}
.card:hover,
.card:focus-within {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(210, 237, 58, 0.35);
}
.link {
  display: block;
  color: var(--text);
}
img,
.placeholder {
  width: 100%;
  height: auto;
  aspect-ratio: 210 / 295;
  object-fit: cover;
  display: block;
}
.placeholder {
  display: grid;
  place-items: center;
  background: var(--surface-strong);
  color: var(--muted);
}
.info {
  padding: 0.5rem 0.6rem 0.7rem;
  display: grid;
  gap: 0.2rem;
}
.name {
  font-size: 0.85rem;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.rating {
  font-size: 0.8rem;
  color: var(--star);
}
.fav-pos {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
}
@media (min-width: 768px) {
  .card {
    flex-basis: 180px;
  }
}
</style>