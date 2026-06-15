<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowLeft } from '@element-plus/icons-vue'
import CoinCard from '@/components/CoinCard.vue'
import { useSearchQuery } from '@/composables/useCoinQueries'

const route = useRoute()
const router = useRouter()

const keyword = ref((route.query.q as string) || '')

watch(
  () => route.query.q,
  (val) => {
    keyword.value = (val as string) || ''
  },
)

const { data: results, isLoading, isError } = useSearchQuery(keyword)

const matchCount = computed(() => results.value?.length ?? 0)

const hasResults = computed(() => results.value && results.value.length > 0)
</script>

<template>
  <div class="search-results">
    <header class="search-results__header">
      <el-button :icon="ArrowLeft" text @click="router.push('/')">返回首页</el-button>
      <h2 class="search-results__title">
        搜索结果
        <template v-if="!isLoading && keyword">
          · 找到 <span class="search-results__count">{{ matchCount }}</span> 枚
        </template>
      </h2>
      <p v-if="keyword" class="search-results__keyword">
        关键词：<em>{{ keyword }}</em>
      </p>
    </header>

    <div v-if="isLoading" class="search-results__loading">
      <el-skeleton :rows="6" animated />
    </div>

    <el-result v-else-if="isError" icon="error" title="搜索失败" sub-title="请刷新页面重试" />

    <el-empty
      v-else-if="keyword && !hasResults"
      description="未找到匹配的钱币，请尝试其他关键词"
    >
      <template #image>
        <div class="search-results__empty-icon">🔍</div>
      </template>
    </el-empty>

    <div v-else-if="hasResults" class="search-results__grid">
      <CoinCard v-for="coin in results" :key="coin.id" :coin="coin" />
    </div>
  </div>
</template>

<style scoped>
.search-results {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px 20px 48px;
}

.search-results__header {
  margin-bottom: 28px;
}

.search-results__title {
  margin: 12px 0 4px;
  font-size: 22px;
  color: #2c1810;
  display: flex;
  align-items: baseline;
  gap: 4px;
}

.search-results__count {
  color: #8b6914;
  font-weight: 700;
}

.search-results__keyword {
  margin: 0;
  font-size: 14px;
  color: #888;
}

.search-results__keyword em {
  font-style: normal;
  color: #8b6914;
}

.search-results__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 24px;
}

.search-results__loading {
  padding: 40px 0;
}

.search-results__empty-icon {
  font-size: 64px;
  line-height: 1;
  margin-bottom: 12px;
}
</style>
