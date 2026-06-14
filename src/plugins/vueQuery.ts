import { VueQueryPlugin, QueryClient } from '@tanstack/vue-query'

/** 全局 Vue Query 客户端 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
    },
  },
})

export { VueQueryPlugin }
