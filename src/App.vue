<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useShowStore } from '@/stores/showStore'
import { usePreferencesStore } from '@/stores/preferencesStore'
import AppSidebar from '@/components/layout/AppSidebar.vue'
import AppHeader from '@/components/layout/AppHeader.vue'
import BackToTop from '@/components/common/BackToTop.vue'

const { t } = useI18n()
const route = useRoute() //current route
const store = useShowStore()
usePreferencesStore() // initializes access to the preferences store.

const menuOpen = ref(false) //for mobile..conside it as drawer..if open then show the sidebar and overlay..if closed then hide the sidebar and overlay
watch(
  () => route.fullPath,
  () => (menuOpen.value = false),
) // close the drawer after navigating..whenever url changes, close the drawer

onMounted(() => store.loadShows())
</script>

<template>
  <a href="#main" class="skip-link">{{ t('app.skipLink') }}</a>
  <div class="layout">
    <AppSidebar :genres="store.genres" :open="menuOpen" @close="menuOpen = false" />
    <div v-if="menuOpen" class="overlay" @click="menuOpen = false" />

    <div class="content">
      <AppHeader :menu-open="menuOpen" @toggle-menu="menuOpen = !menuOpen" />
      <main id="main" tabindex="-1">
        <RouterView />
      </main>
    </div>
  </div>
  <BackToTop />
</template>

<style scoped>
.layout {
  min-height: 100vh;
}
.content {
  padding: 0 1rem 3rem;
  min-width: 0;
}
.overlay {
  position: fixed;
  inset: 0;
  z-index: 30;
  background: rgba(5, 3, 10, 0.6);
}
main:focus {
  outline: none;
}
@media (min-width: 900px) {
  .layout {
    display: grid;
    grid-template-columns: 220px 1fr;
  }
  .content {
    padding: 0 2rem 3rem;
  }
  .overlay {
    display: none;
  }
}
</style>
