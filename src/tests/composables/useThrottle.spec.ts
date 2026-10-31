import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useThrottleFn } from '@/composables/useThrottle'

describe('useThrottleFn', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('ignores calls made inside the delay window', () => {
    const fn = vi.fn<() => void>()
    const throttled = useThrottleFn(fn, 100)

    throttled()
    throttled()
    throttled()
    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('runs again once the delay has passed', () => {
    const fn = vi.fn<() => void>()
    const throttled = useThrottleFn(fn, 100)

    throttled()
    vi.advanceTimersByTime(100)
    throttled()
    expect(fn).toHaveBeenCalledTimes(2)
  })
})