import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { i18n, type Locale } from '@/i18n'

const STORAGE_KEY = 'tvstar-locale'

function loadSavedLocale(): Locale {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'nl' ? 'nl' : 'en'
  } catch {
    return 'en' // localStorage can be blocked
  }
}

export const usePreferencesStore = defineStore('preferences', () => {
  const locale = ref<Locale>(loadSavedLocale())

  function setLocale(value: Locale) {
    locale.value = value
  }

  // Whenever the language changes: update the UI language, save it, tell the browser
  watch(
    locale,
    (value) => {
      i18n.global.locale.value = value
      document.documentElement.lang = value
      try {
        localStorage.setItem(STORAGE_KEY, value)
      } catch {
        /* ignore */
      }
    },
    { immediate: true },
  )

  return { locale, setLocale }
})
