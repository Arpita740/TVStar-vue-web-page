import { computed, nextTick, onBeforeUnmount, ref, toValue, watch, type MaybeRefOrGetter } from 'vue'

/**
 * Shows a list in chunks. Put the returned `sentinel` ref on an empty element
 * right after the list: when it comes into view, the next chunk is shown.
 */
export function useLazyList<T>(items: MaybeRefOrGetter<T[]>, pageSize: number) {
  const count = ref(pageSize)
  const visible = computed(() => toValue(items).slice(0, count.value))
  const hasMore = computed(() => count.value < toValue(items).length)

  // A new list (e.g. another genre): start again from the first chunk
  watch(
    () => toValue(items),
    () => (count.value = pageSize),
  )

  const sentinel = ref<HTMLElement | null>(null)
  let observer: IntersectionObserver | null = null

  watch(sentinel, (el) => {
    observer?.disconnect()
    if (!el) return

    const io = new IntersectionObserver(
      async ([entry]) => {
        if (!entry?.isIntersecting || !hasMore.value) return
        count.value += pageSize
        await nextTick()
        io.unobserve(el) // look again: if the sentinel is still in view, load another chunk
        io.observe(el)
      },
      { rootMargin: '400px' }, // start 400px before the end, so the user never sees a gap
    )
    io.observe(el)
    observer = io
  })

  onBeforeUnmount(() => observer?.disconnect())

  return { visible, hasMore, sentinel }
}