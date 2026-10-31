import { describe, expect, it } from 'vitest'
import { stripHtml } from '@/utils/textUtils'

describe('stripHtml', () => {
  it('removes tags and keeps the text', () => {
    expect(stripHtml('<p>Hello <b>world</b></p>')).toBe('Hello world')
  })
  it('returns an empty string for null', () => expect(stripHtml(null)).toBe(''))
})
