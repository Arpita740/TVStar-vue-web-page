import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: () => import('@/views/HomeView.vue') },
    { path: '/discover', name: 'discover', component: () => import('@/views/DiscoverView.vue') },
    { path: '/favorites', name: 'favorites', component: () => import('@/views/FavoritesView.vue') },
    {
      path: '/genre/:genre',
      name: 'genre',
      component: () => import('@/views/GenreView.vue'),
      props: true,
    },
    {
      // (\\d+) means only numbers match, so /shows/abc falls through to the 404 page
      path: '/shows/:id(\\d+)',
      name: 'show-details',
      component: () => import('@/views/ShowDetailsView.vue'),
      props: true,
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/NotFoundView.vue'),
    },
  ],
  
   scrollBehavior: () => ({ top: 0 }),
})

export default router
