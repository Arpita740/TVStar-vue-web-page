import { onScopeDispose, ref, watch, type Ref } from 'vue'

/** Returns a ref that follows `source`, but only after it has been still for `delay` ms. */
export function useDebounce<T>(source: Ref<T>, delay = 400): Ref<T> {
  const debounced = ref(source.value) as Ref<T>
  let timer: ReturnType<typeof setTimeout> | undefined

  watch(source, (value) => {
    clearTimeout(timer) // every keystroke cancels the previous timer
    timer = setTimeout(() => {
      debounced.value = value
    }, delay)
  })

  onScopeDispose(() => clearTimeout(timer)) // no stray timers after unmount
  return debounced
}
