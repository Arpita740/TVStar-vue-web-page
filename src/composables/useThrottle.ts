// Runs `fn` at most once every `delay` ms. Extra calls in between are ignored.
export function useThrottleFn<A extends unknown[]>(fn: (...args: A) => void, delay = 200) {
  let lastRun = 0

  return (...args: A) => {
    const now = Date.now()
    if (now - lastRun >= delay) {
      lastRun = now
      fn(...args)
    }
  }
}
