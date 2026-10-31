<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useThrottleFn } from '@/composables/useThrottle'

const { t } = useI18n()
const visible = ref(false)

// The scroll event fires dozens of times per second; we only need a check every 150 ms
const onScroll = useThrottleFn(() => {
  visible.value = window.scrollY > 400
}, 150)

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()
})
onUnmounted(() => window.removeEventListener('scroll', onScroll))

function toTop() {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' })
}
</script>

<template>
  <button
    v-show="visible"
    type="button"
    class="top"
    :aria-label="t('common.backToTop')"
    @click="toTop"
  >
    ↑
  </button>
</template>

<style scoped>
.top {
  position: fixed;
  right: 1.25rem;
  bottom: 1.25rem;
  z-index: 50;
  width: 3rem;
  height: 3rem;
  border: 0;
  border-radius: 50%;
  background: var(--gradient);
  color: #fff;
  font-size: 1.4rem;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 6px 20px rgba(237, 33, 104, 0.5);
}
</style>
