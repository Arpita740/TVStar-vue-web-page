<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useGenreLabel } from '@/composables/useGenreLabel'
import { useFavoritesStore } from '@/stores/favoritesStore'

defineProps<{ genres: string[]; open: boolean }>()
const emit = defineEmits<{ close: [] }>()

const { t } = useI18n()
const genreLabel = useGenreLabel()
const favorites = useFavoritesStore()
</script>

<template>
  <aside id="sidebar" class="sidebar" :class="{ open }" @keydown.esc="emit('close')">
    <div class="top">
      <RouterLink to="/" class="brand">📺 TVStar</RouterLink>
      <button type="button" class="close" :aria-label="t('app.closeMenu')" @click="emit('close')">
        ✕
      </button>
    </div>

    <nav :aria-label="t('nav.main')">
      <ul>
        <li>
          <RouterLink :to="{ name: 'home' }">🏠 {{ t('nav.home') }}</RouterLink>
        </li>
        <li>
          <RouterLink :to="{ name: 'favorites' }">
            ♥ {{ t('nav.favorites') }}
            <span v-if="favorites.count" class="badge">{{ favorites.count }}</span>
          </RouterLink>
        </li>
      </ul>

      <h2>{{ t('nav.genres') }}</h2>
      <ul>
        <li v-for="genre in genres.slice(0, 12)" :key="genre">
          <RouterLink :to="{ name: 'genre', params: { genre } }">{{
            genreLabel(genre)
          }}</RouterLink>
        </li>
      </ul>
    </nav>
  </aside>
</template>

<style scoped>
/* Phone: a drawer that slides in. visibility:hidden also removes it from the tab order */
.sidebar {
  position: fixed;
  inset: 0 auto 0 0;
  width: 260px;
  z-index: 40;
  overflow-y: auto;
  padding: 1.5rem 1rem;
  background: rgba(12, 7, 24, 0.96);
  border-right: 1px solid var(--border);
  transform: translateX(-100%);
  visibility: hidden;
  transition:
    transform 0.25s ease,
    visibility 0.25s;
  scrollbar-width: none;
}
.sidebar::-webkit-scrollbar {
  display: none;
}
.sidebar.open {
  transform: none;
  visibility: visible;
}

.top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
}
.brand {
  font-size: 1.4rem;
  font-weight: 800;
  color: var(--text);
}
.close {
  border: 0;
  background: var(--surface);
  color: var(--text);
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  cursor: pointer;
}

h2 {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--muted);
  margin: 1.25rem 0 0.5rem;
}
ul {
  list-style: none;
  padding: 0;
  margin: 0;
}
li a {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.45rem 0.6rem;
  border-radius: 8px;
  color: var(--text);
}
li a:hover,
li a:focus-visible {
  background: var(--surface);
}
li a.router-link-exact-active {
  background: var(--surface-strong);
  color: var(--accent);
  font-weight: 700;
}
.badge {
  margin-left: auto;
  background: var(--gradient);
  color: #fff;
  border-radius: 999px;
  padding: 0 0.5rem;
  font-size: 0.75rem;
}

/* Desktop: always visible, sticks while the page scrolls */
@media (min-width: 900px) {
  .sidebar {
    position: sticky;
    top: 0;
    height: 100vh;
    width: auto;
    transform: none;
    visibility: visible;
    background: rgba(12, 7, 24, 0.55);
    backdrop-filter: blur(12px);
  }
  .close {
    display: none;
  }
}
</style>
