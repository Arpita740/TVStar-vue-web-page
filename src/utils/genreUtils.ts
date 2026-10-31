import type { Show } from '@/types/show'

export type SortKey = 'rating' | 'name' | 'year'

export function groupByGenre(shows: Show[]): Record<string, Show[]> {
  const grouped: Record<string, Show[]> = {}
  for (const show of shows) {
    for (const genre of show.genres) {
      ;(grouped[genre] ??= []).push(show)
    }
  }
  return grouped
}

export const sortByRating = (shows: Show[]): Show[] =>
  [...shows].sort((a, b) => (b.rating.average ?? 0) - (a.rating.average ?? 0))

// Returns a sorted copy; the original array is never changed
export function sortShows(shows: Show[], key: SortKey): Show[] {
  if (key === 'name') return [...shows].sort((a, b) => a.name.localeCompare(b.name))
  // premiered is "YYYY-MM-DD", so comparing as text works; missing dates go last
  if (key === 'year')
    return [...shows].sort((a, b) => (b.premiered ?? '').localeCompare(a.premiered ?? ''))
  return sortByRating(shows)
}

export const toGenreId = (genre: string) => `genre-${genre.toLowerCase().replace(/\s+/g, '-')}`