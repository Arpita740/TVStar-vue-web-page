import type { Show } from '@/types/show'

const BASE_URL = 'https://api.tvmaze.com'

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
