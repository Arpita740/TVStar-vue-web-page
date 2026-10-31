import { describe, expect, it } from 'vitest'
import { sortShows } from '@/utils/genreUtils'
import { makeShow } from '../helpers'

const shows = [
  makeShow({ id: 1, name: 'Breaking Bad', rating: { average: 9.2 }, premiered: '2008-01-20' }),
  makeShow({ id: 2, name: 'Arrow', rating: { average: 7.4 }, premiered: '2012-10-10' }),
  makeShow({ id: 3, name: 'Chuck', rating: { average: null }, premiered: null }),
]

describe('sortShows', () => {
  it('sorts by rating, highest first', () => {
    expect(sortShows(shows, 'rating').map((s) => s.id)).toEqual([1, 2, 3])
  })
  it('sorts by name, A to Z', () => {
    expect(sortShows(shows, 'name').map((s) => s.id)).toEqual([2, 1, 3])
  })
  it('sorts by year, newest first, unknown year last', () => {
    expect(sortShows(shows, 'year').map((s) => s.id)).toEqual([2, 1, 3])
  })
  it('does not change the original array', () => {
    const before = shows.map((s) => s.id)
    sortShows(shows, 'name')
    expect(shows.map((s) => s.id)).toEqual(before)
  })
})