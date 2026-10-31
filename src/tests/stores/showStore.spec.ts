import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import type { Show } from '@/types/show'
import { fetchShowsPage } from '@/services/tvmazeService'
import { useShowStore } from '@/stores/showStore'
import { makeShow } from '../helpers'

// Replace the real API with a fake: tests must not call the internet
vi.mock('@/services/tvmazeService', () => ({
  fetchShowsPage: vi.fn<(page?: number) => Promise<Show[]>>(),
}))

describe('showStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.mocked(fetchShowsPage).mockReset()
  })

  it('groups shows by genre and sorts each group by rating', async () => {
    vi.mocked(fetchShowsPage)
      .mockResolvedValueOnce([
        makeShow({ id: 1, genres: ['Drama'], rating: { average: 7 } }),
        makeShow({ id: 2, genres: ['Drama', 'Comedy'], rating: { average: 9 } }),
      ])
      .mockResolvedValueOnce([]) // second page

    const store = useShowStore()
    await store.loadShows()

    expect(store.showsByGenre.Drama?.map((s) => s.id)).toEqual([2, 1])
    expect(store.showsByGenre.Comedy).toHaveLength(1)
  })

  it('does not fetch again once shows are loaded', async () => {
    vi.mocked(fetchShowsPage).mockResolvedValue([makeShow({ genres: ['Drama'] })])

    const store = useShowStore()
    await store.loadShows()
    await store.loadShows()

    expect(fetchShowsPage).toHaveBeenCalledTimes(2) // 2 pages, for ONE load
  })

  it('stores the error message when the request fails', async () => {
    vi.mocked(fetchShowsPage).mockRejectedValue(new Error('boom'))

    const store = useShowStore()
    await store.loadShows()

    expect(store.error).toBe('boom')
    expect(store.shows).toEqual([])
    expect(store.loading).toBe(false)
  })
})