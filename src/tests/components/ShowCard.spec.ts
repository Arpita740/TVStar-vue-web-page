import { beforeEach, describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia } from 'pinia'
import { createMemoryHistory, createRouter } from 'vue-router'
import { i18n } from '@/i18n'
import ShowCard from '@/components/shows/ShowCard.vue'
import { makeShow } from '../helpers'

const router = createRouter({
  history: createMemoryHistory(),
  routes: [
    { path: '/', component: { render: () => null } },
    { path: '/shows/:id', component: { render: () => null } },
  ],
})

function mountCard() {
  const show = makeShow({ id: 1, name: 'Breaking Bad', genres: ['Drama'], rating: { average: 9.2 } })
  return mount(ShowCard, { props: { show }, global: { plugins: [createPinia(), router, i18n] } })
}

describe('ShowCard', () => {
  beforeEach(() => localStorage.clear())

  it('shows the name and the rating', () => {
    const wrapper = mountCard()
    expect(wrapper.text()).toContain('Breaking Bad')
    expect(wrapper.text()).toContain('9.2')
  })

  it('links to the details page', () => {
    expect(mountCard().find('a').attributes('href')).toBe('/shows/1')
  })

  it('toggles the favorite button', async () => {
    const button = mountCard().find('button')
    expect(button.attributes('aria-pressed')).toBe('false')

    await button.trigger('click')
    expect(button.attributes('aria-pressed')).toBe('true')
  })
})