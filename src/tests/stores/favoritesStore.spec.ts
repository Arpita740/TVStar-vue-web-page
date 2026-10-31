import { beforeEach, describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import { createPinia, setActivePinia } from 'pinia'
import { useFavoritesStore } from '@/stores/favoritesStore'
import { makeShow } from '../helpers'

describe('favoritesStore', () => {
  beforeEach(() => {
    localStorage.clear()
    setActivePinia(createPinia())
  })

  it('adds a show, then removes it when toggled again', () => {
    const store = useFavoritesStore()
    const show = makeShow({ id: 7 })

    store.toggle(show)
    expect(store.isFavorite(7)).toBe(true)
    expect(store.count).toBe(1)

    store.toggle(show)
    expect(store.isFavorite(7)).toBe(false)
  })

  it('saves favorites in localStorage', async () => {
    const store = useFavoritesStore()
    store.toggle(makeShow({ id: 3 }))
    await nextTick() // the watcher runs after the next tick

    const saved = JSON.parse(localStorage.getItem('tvstar-favorites') ?? '[]')
    expect(saved).toHaveLength(1)
    expect(saved[0].id).toBe(3)
  })

  it('restores favorites after a "refresh"', () => {
    localStorage.setItem('tvstar-favorites', JSON.stringify([makeShow({ id: 5 })]))
    expect(useFavoritesStore().isFavorite(5)).toBe(true)
  })

  it('ignores corrupted storage instead of crashing', () => {
    localStorage.setItem('tvstar-favorites', 'not json')
    expect(useFavoritesStore().count).toBe(0)
  })
})
