<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import SearchBar from '@/components/common/SearchBar.vue'
import LanguageToggle from '@/components/common/LanguageToggle.vue'
import { useDebounce } from '@/composables/useDebounce'

defineProps<{ menuOpen: boolean }>()
const emit = defineEmits<{ toggleMenu: [] }>()

const { t } = useI18n()
const route = useRoute()
const router = useRouter()

const term = ref(route.query.q?.toString() ?? '')
const debouncedTerm = useDebounce(term, 400)

function search(value: string) {
  const q = value.trim()
  const go = route.name === 'discover' ? router.replace : router.push

  if (q.length >= 2) go({ name: 'discover', query: { q } })
  else if (q === '' && route.name === 'discover') go({ name: 'discover' })
}

watch(debouncedTerm, search)
const submit = () => search(term.value)
</script>

<template>
  <header class="header">
    <button
      type="button"
      class="menu"
      aria-controls="sidebar"
      :aria-expanded="menuOpen"
      :aria-label="menuOpen ? t('app.closeMenu') : t('app.menu')"
      @click="emit('toggleMenu')"
    >
      ☰
    </button>
    <SearchBar v-model="term" @submit="submit" />
    <LanguageToggle />
  </header>
</template>

<style scoped>
.header {
  display: flex;
  gap: 0.75rem;
  align-items: center;
  padding: 1rem 0 1.5rem;
}
.menu {
  border: 1px solid var(--border);
  background: var(--surface);
  color: var(--text);
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 10px;
  font-size: 1.2rem;
  cursor: pointer;
}
@media (min-width: 900px) {
  .menu {
    display: none;
  }
}
</style>
