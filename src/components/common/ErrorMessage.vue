<script setup lang="ts">
import { useI18n } from 'vue-i18n'

defineProps<{ message: string }>()
const emit = defineEmits<{ retry: [] }>()
const { t } = useI18n()
</script>

<template>
  <div class="error" role="alert">
    <p>{{ message }}</p>
    <button type="button" @click="emit('retry')">{{ t('common.retry') }}</button>
  </div>
</template>

<style scoped>
.error {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
  padding: 1.25rem;
  border-radius: 12px;
  border: 1px solid rgba(255, 138, 138, 0.4);
  background: rgba(255, 138, 138, 0.08);
}
p {
  margin: 0;
  color: var(--danger);
}
button {
  border: 0;
  border-radius: 8px;
  padding: 0.5rem 1rem;
  background: var(--gradient);
  color: #fff;
  font-weight: 700;
  cursor: pointer;
}
</style>
