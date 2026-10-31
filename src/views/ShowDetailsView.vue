<script setup lang="ts">
import { computed, onUnmounted, ref, watch } from 'vue'
import { RouterLink } from 'vue-router'
import { useI18n } from 'vue-i18n'
import type { Show } from '@/types/show'
import { fetchShowById } from '@/services/tvmazeService'
import { formatRating } from '@/utils/ratingUtils'
import { stripHtml } from '@/utils/textUtils'
import { useGenreLabel } from '@/composables/useGenreLabel'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import ErrorMessage from '@/components/common/ErrorMessage.vue'
import FavoriteButton from '@/components/common/FavoriteButton.vue'

const props = defineProps<{ id: string }>() // comes from the route (props: true)
const { t } = useI18n()
const genreLabel = useGenreLabel()

const show = ref<Show | null>(null)
const loading = ref(false)
const failed = ref(false)
let controller: AbortController | null = null

async function load() {
  controller?.abort() // cancel the previous request
  controller = new AbortController()
  const { signal } = controller
  loading.value = true
  failed.value = false
  show.value = null

  try {
    show.value = await fetchShowById(Number(props.id), signal)
  } catch (e) {
    if ((e as Error).name === 'AbortError') return
    failed.value = true
  } finally {
    if (!signal.aborted) loading.value = false
  }
}

// Load now, and again whenever the id in the URL changes
watch(() => props.id, load, { immediate: true })
onUnmounted(() => controller?.abort())

// Browser tab title
watch(show, (s) => (document.title = s ? `${s.name} · TVStar` : 'TVStar'))
onUnmounted(() => (document.title = 'TVStar'))

const summary = computed(() => stripHtml(show.value?.summary ?? null))
const cast = computed(() => show.value?._embedded?.cast.slice(0, 12) ?? [])
const year = computed(() => show.value?.premiered?.slice(0, 4) ?? '—')
const channel = computed(() => show.value?.network?.name ?? show.value?.webChannel?.name ?? '—')
const runtime = computed(() =>
  show.value?.runtime ? t('details.minutes', { n: show.value.runtime }) : '—',
)
</script>

<template>
  <LoadingSpinner v-if="loading" :label="t('common.loading')" />
  <ErrorMessage v-else-if="failed" :message="t('details.error')" @retry="load" />

  <article v-else-if="show" class="details">
    <img
      v-if="show.image"
      :src="show.image.original"
      :alt="t('card.poster', { name: show.name })"
      class="poster"
    />
    <div v-else class="poster placeholder">{{ t('card.noImage') }}</div>

    <div class="info">
      <RouterLink to="/" class="back">← {{ t('details.back') }}</RouterLink>
      <h1>{{ show.name }}</h1>
      <p class="rating">★ {{ formatRating(show.rating.average) }}</p>

      <ul class="chips">
        <li v-for="genre in show.genres" :key="genre">{{ genreLabel(genre) }}</li>
      </ul>

      <FavoriteButton :show="show" labelled />

      <p class="summary">{{ summary || t('details.noSummary') }}</p>

      <dl class="facts">
        <div>
          <dt>{{ t('details.premiered') }}</dt>
          <dd>{{ year }}</dd>
        </div>
        <div>
          <dt>{{ t('details.language') }}</dt>
          <dd>{{ show.language ?? '—' }}</dd>
        </div>
        <div>
          <dt>{{ t('details.status') }}</dt>
          <dd>{{ show.status ?? '—' }}</dd>
        </div>
        <div>
          <dt>{{ t('details.runtime') }}</dt>
          <dd>{{ runtime }}</dd>
        </div>
        <div>
          <dt>{{ t('details.network') }}</dt>
          <dd>{{ channel }}</dd>
        </div>
      </dl>
    </div>

    <section v-if="cast.length" class="cast-section" aria-labelledby="cast-title">
      <h2 id="cast-title">{{ t('details.cast') }}</h2>
      <ul class="cast">
        <li v-for="member in cast" :key="`${member.person.id}-${member.character.name}`">
          <img v-if="member.person.image" :src="member.person.image.medium" alt="" loading="lazy" />
          <span v-else class="avatar" aria-hidden="true" />
          <strong>{{ member.person.name }}</strong>
          <span>{{ member.character.name }}</span>
        </li>
      </ul>
    </section>
  </article>
</template>

<style scoped>
.details {
  display: grid;
  gap: 1.5rem;
}
.poster {
  width: 100%;
  max-width: 280px;
  height: auto;
  aspect-ratio: 210 / 295;
  object-fit: cover;
  border-radius: 14px;
  border: 1px solid var(--border);
  justify-self: center;
}
.placeholder {
  display: grid;
  place-items: center;
  background: var(--surface);
  color: var(--muted);
}
.back {
  color: var(--accent);
}
h1 {
  margin: 0.5rem 0 0.25rem;
  font-size: clamp(1.75rem, 5vw, 2.5rem);
}
.rating {
  color: var(--star);
  font-weight: 700;
  margin: 0 0 0.75rem;
}
.chips {
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  padding: 0;
  margin: 0 0 1rem;
}
.chips li {
  padding: 0.25rem 0.75rem;
  border-radius: 999px;
  background: var(--surface-strong);
  border: 1px solid var(--border);
  font-size: 0.85rem;
}
.summary {
  margin: 1.25rem 0;
  max-width: 65ch;
}
.facts {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 0.75rem 1rem;
  margin: 0;
}
dt {
  color: var(--muted);
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}
dd {
  margin: 0;
  font-weight: 600;
}
.cast-section {
  grid-column: 1 / -1;
}
h2 {
  margin: 0 0 1rem;
}
.cast {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
}
.cast li {
  display: grid;
  justify-items: center;
  text-align: center;
  gap: 0.15rem;
  font-size: 0.85rem;
}
.cast img,
.avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  background: var(--surface-strong);
  margin-bottom: 0.4rem;
}
.cast span {
  color: var(--muted);
}
@media (min-width: 768px) {
  .details {
    grid-template-columns: 280px 1fr;
    align-items: start;
  }
  .poster {
    justify-self: start;
  }
}
</style>
