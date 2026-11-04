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
      <RouterLink to="/" class="brand"><svg xmlns="http://www.w3.org/2000/svg" viewBox="1 1 18 18" height="18px" width="18px" fill="#FFFFFF"><path d="M7.25,13h1.5V8.5H9.92L11.6,13h1.15L15,7H13.4l-1.21,3.25L10.96,7H5V8.5H7.25V13ZM4.5,17q-0.62,0-1.06-0.44T3,15.5V4.5Q3,3.88 3.44,3.44T4.5,3h11q0.62,0 1.06,0.44T17,4.5v11q0,0.62-0.44,1.06T15.5,17H4.5Zm0-1.5h11V4.5H4.5v11Zm0-11v11V4.5Z"/></svg> TVStar</RouterLink>
      <button type="button" class="close" :aria-label="t('app.closeMenu')" @click="emit('close')">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="1 1 18 18" height="18px" width="18px" fill="#EA3323"><path d="M6.06,15L5,13.94L8.94,10L5,6.06L6.06,5L10,8.94L13.94,5L15,6.06L11.06,10L15,13.94L13.94,15L10,11.06L6.06,15Z"/></svg>
      </button>
    </div>

    <nav :aria-label="t('nav.main')">
      <ul>
        <li>
          <RouterLink :to="{ name: 'home' }"><svg xmlns="http://www.w3.org/2000/svg" viewBox="1 1 18 18" height="18px" width="18px" fill="#FFFFFF"><path d="M5.5,15.5h2v-5h5v5h2V8.25L10,4.88L5.5,8.25V15.5ZM4,17V7.5L10,3l6,4.5V17H11V12H9v5H4Zm6-6.81Z"/></svg> {{ t('nav.home') }}</RouterLink>
        </li>
        <li>
          <RouterLink :to="{ name: 'favorites' }">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="1 1 18 18" height="18px" width="18px" fill="#EA3323"><path d="M10,17L8.96,16.06q-2.08-1.85-3.44-3.18T3.39,10.53T2.3,8.65T2,6.9Q2,5.04 3.27,3.77T6.4,2.5q1.02,0 1.98,0.44T10,4.17q0.67-0.79 1.63-1.23T13.6,2.5q1.85,0 3.12,1.27T18,6.9q0,0.9-0.29,1.73t-1.07,1.85t-2.15,2.36Q13.13,14.19 11,16.1L10,17Zm0-2.02q1.94-1.73 3.19-2.95t1.99-2.13t1.03-1.61T16.5,6.9q0-1.23-0.83-2.06T13.6,4q-0.73,0-1.36,0.3T11.15,5.15L10.42,6H9.58L8.85,5.15Q8.4,4.6 7.74,4.3T6.4,4Q5.17,4 4.33,4.83T3.5,6.9q0,0.69 0.27,1.36T4.76,9.83t1.98,2.13T10,14.98Zm0-5.5Z"/></svg> {{ t('nav.favorites') }}
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
