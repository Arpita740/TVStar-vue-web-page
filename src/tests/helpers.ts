import type { Show } from '@/types/show'

export const makeShow = (overrides: Partial<Show> = {}): Show => ({
  id: 1,
  name: 'Show 1',
  genres: [],
  rating: { average: null },
  image: null,
  summary: null,
  premiered: null,
  language: null,
  ...overrides,
})
