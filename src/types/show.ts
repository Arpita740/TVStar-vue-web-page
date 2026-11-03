export interface CastMember {
  person: { id: number; name: string; image: { medium: string } | null }
  character: { name: string }
}

export interface Show {
  id: number
  name: string
  genres: string[]
  rating: { average: number | null }
  image: { medium: string; original: string } | null
  summary: string | null
  premiered: string | null
  language: string | null
  // only present on the details request
  status?: string
  runtime?: number | null
  network?: { name: string } | null
  webChannel?: { name: string } | null
  _embedded?: { cast: CastMember[] }
}