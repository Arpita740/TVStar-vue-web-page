<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { usePreferencesStore } from '@/stores/preferencesStore'

const { t } = useI18n()
const prefs = usePreferencesStore()
const languages = ['en', 'nl'] as const
</script>

<template>
  <div class="toggle" role="group" :aria-label="t('language.label')">
    <button
      v-for="code in languages"
      :key="code"
      type="button"
      :class="{ active: prefs.locale === code }"
      :aria-pressed="prefs.locale === code"
      :lang="code"
      @click="prefs.setLocale(code)"
    >
      {{ code.toUpperCase() }}
    </button>
  </div>
</template>

<style scoped>
.toggle {
  display: flex;
  background: var(--surface);
  border-radius: 999px;
  padding: 0.2rem;
}
button {
  border: 0;
  background: transparent;
  color: var(--muted);
  font-weight: 700;
  padding: 0.4rem 0.8rem;
  border-radius: 999px;
  cursor: pointer;
}
button.active {
  background: var(--accent);
  color: #111;
}
</style>
