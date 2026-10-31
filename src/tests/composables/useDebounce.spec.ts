import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { effectScope, nextTick, ref } from 'vue'
import { useDebounce } from '@/composables/useDebounce'

describe('useDebounce', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('updates only after the delay has passed', async () => {
    const scope = effectScope()
    const source = ref('a')
    const debounced = scope.run(() => useDebounce(source, 300))!

    source.value = 'ab'
    await nextTick()
    vi.advanceTimersByTime(299)
    expect(debounced.value).toBe('a')

    vi.advanceTimersByTime(1)
    expect(debounced.value).toBe('ab')
    scope.stop()
  })

  it('restarts the timer on rapid changes and keeps the last value', async () => {
    const scope = effectScope()
    const source = ref('')
    const debounced = scope.run(() => useDebounce(source, 300))!

    source.value = 'b'
    await nextTick()
    vi.advanceTimersByTime(200)
    source.value = 'br'
    await nextTick()
    vi.advanceTimersByTime(200)
    expect(debounced.value).toBe('') // first timer was cancelled

    vi.advanceTimersByTime(100)
    expect(debounced.value).toBe('br')
    scope.stop()
  })
})
