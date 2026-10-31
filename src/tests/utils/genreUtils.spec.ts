import { describe, it, expect } from 'vitest'
import { groupByGenre, sortByRating } from '@/utils/genreUtils'
import type { Show } from '@/types/show'

const make = (id: number, genres: string[], avg: number | null): Show => ({
  id,
  name: `Show ${id}`,
  genres,
  rating: { average: avg },
  image: null,
  summary: null,
  premiered: null,
  language: null,
})

describe('genreUtils', () => {
  it('groups a show under every one of its genres', () => {
    const grouped = groupByGenre([make(1, ['Drama', 'Comedy'], 8), make(2, ['Drama'], 7)])
    expect(grouped.Drama).toHaveLength(2)
    expect(grouped.Comedy).toHaveLength(1)
  })

  it('sorts by rating descending and treats null as 0', () => {
    const sorted = sortByRating([make(1, [], null), make(2, [], 9), make(3, [], 7)])
    expect(sorted.map((s) => s.id)).toEqual([2, 3, 1])
  })
})
