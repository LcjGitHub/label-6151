import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'coin-list',
      component: () => import('@/views/CoinListView.vue'),
    },
    {
      path: '/coin/:id',
      name: 'coin-detail',
      component: () => import('@/views/CoinDetailView.vue'),
      props: true,
    },
    {
      path: '/compare',
      name: 'coin-compare',
      component: () => import('@/views/CoinCompareView.vue'),
    },
  ],
})

export default router
