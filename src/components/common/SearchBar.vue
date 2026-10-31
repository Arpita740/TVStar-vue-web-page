<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const model = defineModel<string>({ default: '' })
const emit = defineEmits<{ submit: [] }>()
</script>

<template>
  <form role="search" class="search" @submit.prevent="emit('submit')">
    <label for="search" class="sr-only">{{ t('search.label') }}</label>
    <input
      id="search"
      v-model="model"
      type="search"
      :placeholder="t('search.placeholder')"
      autocomplete="off"
    />
  </form>
</template>

<style scoped>
.search {
  flex: 1 1 200px;
  max-width: 480px;
  margin-left: auto;
}
input {
  width: 100%;
  padding: 0.65rem 1rem;
  border-radius: 999px;
  border: 1px solid var(--border);
  background: var(--surface);
  color: var(--text);
}
input::placeholder {
  color: var(--muted);
}
</style>
