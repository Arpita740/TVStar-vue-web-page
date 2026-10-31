<script setup lang="ts">
defineProps<{ label?: string }>()
</script>

<template>
  <div class="loading" role="status">
    <span class="spinner" aria-hidden="true" />
    <span>{{ label }}</span>
  </div>
</template>

<style scoped>
.loading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 3rem 0;
  color: var(--muted);
}
.spinner {
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 50%;
  border: 3px solid var(--border);
  border-top-color: var(--accent);
  animation: spin 0.8s linear infinite;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
