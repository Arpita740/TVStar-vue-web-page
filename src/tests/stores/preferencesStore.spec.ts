import { beforeEach, describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import { createPinia, setActivePinia } from 'pinia'
import { usePreferencesStore } from '@/stores/preferencesStore'

describe('preferencesStore', () => {
  beforeEach(() => {
    localStorage.clear()
    setActivePinia(createPinia())
  })

  it('starts in English by default', () => {
    expect(usePreferencesStore().locale).toBe('en')
  })

  it('switches language and saves it in localStorage', async () => {
    const prefs = usePreferencesStore()
    prefs.setLocale('nl')
    await nextTick() // the watcher runs after the next tick

    expect(prefs.locale).toBe('nl')
    expect(localStorage.getItem('tvstar-locale')).toBe('nl')
  })

  it('restores the saved language', () => {
    localStorage.setItem('tvstar-locale', 'nl')
    expect(usePreferencesStore().locale).toBe('nl')
  })
})
