import { describe, expect, it } from 'vitest'
import { formatRating } from '@/utils/ratingUtils'

describe('formatRating', () => {
  it('rounds to one decimal', () => expect(formatRating(9.234)).toBe('9.2'))
  it('shows N/A when there is no rating', () => {
    expect(formatRating(null)).toBe('N/A')
    expect(formatRating(undefined)).toBe('N/A')
  })
})
