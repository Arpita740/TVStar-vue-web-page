<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<template>
  <section class="nf">
    <p class="code" aria-hidden="true">404</p>
    <h1>{{ t('notFound.title') }}</h1>
    <p>{{ t('notFound.text') }}</p>
    <RouterLink to="/" class="cta">{{ t('notFound.home') }}</RouterLink>
  </section>
</template>

<style scoped>
.nf {
  text-align: center;
  padding: 4rem 0;
}
.code {
  font-size: 5rem;
  font-weight: 800;
  margin: 0;
  background: var(--gradient);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
h1 {
  margin: 0 0 0.5rem;
}
p {
  color: var(--muted);
}
.cta {
  display: inline-block;
  margin-top: 1rem;
  background: var(--gradient);
  color: #fff;
  padding: 0.6rem 1.2rem;
  border-radius: 8px;
  font-weight: 700;
}
</style>
