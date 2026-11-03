import type { CastMember, Show } from '@/types/show'

const BASE_URL = 'https://api.tvmaze.com'
type Person = CastMember['person'] // an actor: same shape we already use for the cast list

async function request<T>(path: string, signal?: AbortSignal): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, { signal })
  if (!res.ok) throw new Error(`TVMaze request failed (${res.status})`)
  return res.json() as Promise<T>
}

export const fetchShowsPage = (page = 0, signal?: AbortSignal) =>
  request<Show[]>(`/shows?page=${page}`, signal)

// embed=cast returns the cast in the same request
export const fetchShowById = (id: number, signal?: AbortSignal) =>
  request<Show>(`/shows/${id}?embed=cast`, signal)

export async function searchShows(query: string, signal?: AbortSignal): Promise<Show[]> {
  const data = await request<{ show: Show }[]>(
    `/search/shows?q=${encodeURIComponent(query)}`,
    signal,
  )
  return data.map((d) => d.show)
}

// Actors whose name matches the text
export async function searchPeople(query: string, signal?: AbortSignal): Promise<Person[]> {
  const data = await request<{ person: Person }[]>(
    `/search/people?q=${encodeURIComponent(query)}`,
    signal,
  )
  return data.map((d) => d.person)
}

// Shows an actor appeared in. embed=show puts the full show inside each credit.
// "self" credits (the person appearing as themselves, e.g. on talk shows) are skipped.
export async function fetchShowsByPerson(personId: number, signal?: AbortSignal): Promise<Show[]> {
  const data = await request<{ self: boolean; _embedded: { show: Show } }[]>(
    `/people/${personId}/castcredits?embed=show`,
    signal,
  )
  return data.filter((d) => !d.self).map((d) => d._embedded.show)
}