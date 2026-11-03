import { createI18n } from 'vue-i18n'
import en from './locales/en.json'
import nl from './locales/nl.json'

export type Locale = 'en' | 'nl'

export const i18n = createI18n({
  legacy: false, // enable the Composition API usage
  locale: 'en', // the preferences store sets the saved language
  fallbackLocale: 'en', // a missing Dutch key falls back to English
  messages: { en, nl },
})
