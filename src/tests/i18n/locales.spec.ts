import { describe, expect, it } from 'vitest'
import en from '@/i18n/locales/en.json'
import nl from '@/i18n/locales/nl.json'

function keysOf(obj: Record<string, unknown>, prefix = ''): string[] {
  return Object.entries(obj).flatMap(([key, value]) =>
    typeof value === 'object' && value !== null
      ? keysOf(value as Record<string, unknown>, `${prefix}${key}.`)
      : [`${prefix}${key}`],
  )
}

describe('locale files', () => {
  it('English and Dutch have exactly the same keys', () => {
    expect(keysOf(nl).sort()).toEqual(keysOf(en).sort())
  })
})
