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
    {
      path: '/favorites',
      name: 'coin-favorites',
      component: () => import('@/views/CoinFavoriteView.vue'),
    },
    {
      path: '/timeline',
      name: 'dynasty-timeline',
      component: () => import('@/views/DynastyTimelineView.vue'),
    },
    {
      path: '/dynasty/:name',
      name: 'dynasty-topic',
      component: () => import('@/views/DynastyTopicView.vue'),
      props: true,
    },
    {
      path: '/search',
      name: 'search',
      component: () => import('@/views/SearchResultsView.vue'),
    },
    {
      path: '/statistics',
      name: 'coin-statistics',
      component: () => import('@/views/CoinStatisticsView.vue'),
    },
    {
      path: '/recent-views',
      name: 'recent-views',
      component: () => import('@/views/RecentViewsView.vue'),
    },
    {
      path: '/random',
      name: 'coin-random',
      component: () => import('@/views/CoinRandomView.vue'),
    },
    {
      path: '/notes',
      name: 'coin-notes',
      component: () => import('@/views/NotesListView.vue'),
    },
  ],
})

export default router
