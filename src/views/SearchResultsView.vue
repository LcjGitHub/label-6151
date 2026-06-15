<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import CoinCard from '@/components/CoinCard.vue'
import { useSearchQuery } from '@/composables/useCoinQueries'
import PageHeader from '@/components/PageHeader.vue'

const route = useRoute()

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

const hasKeyword = computed(() => keyword.value.trim().length > 0)
</script>

<template>
  <div class="search-results">
    <PageHeader variant="card" layout="split" show-back show-timeline show-favorites>
      <template #title>
        <h1 class="page-header__title">
          <template v-if="hasKeyword">搜索结果</template>
          <template v-else>全局搜索</template>
        </h1>
      </template>
      <template #subtitle>
        <p class="page-header__subtitle">
          <template v-if="hasKeyword">
            关键词：<em>{{ keyword }}</em> · 找到
            <span class="search-results__count">{{ matchCount }}</span> 枚
          </template>
          <template v-else> 在顶部搜索栏输入关键词开始搜索 </template>
        </p>
      </template>
    </PageHeader>

    <el-empty v-if="!hasKeyword" description="请在顶部搜索栏输入钱币名称、面文或背文进行搜索">
      <template #image>
        <div class="search-results__guide-icon">🔍</div>
      </template>
    </el-empty>

    <template v-else>
      <div v-if="isLoading" class="search-results__loading">
        <el-skeleton :rows="6" animated />
      </div>

      <el-result v-else-if="isError" icon="error" title="搜索失败" sub-title="请刷新页面重试" />

      <el-empty v-else-if="!hasResults" description="未找到匹配的钱币，请尝试其他关键词">
        <template #image>
          <div class="search-results__empty-icon">🔍</div>
        </template>
      </el-empty>

      <div v-else class="search-results__grid">
        <CoinCard v-for="coin in results" :key="coin.id" :coin="coin" />
      </div>
    </template>
  </div>
</template>

<style scoped>
.search-results {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px 20px 48px;
}

.search-results__count {
  color: #8b6914;
  font-weight: 700;
}

.search-results__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 24px;
}

.search-results__loading {
  padding: 40px 0;
}

.search-results__empty-icon,
.search-results__guide-icon {
  font-size: 64px;
  line-height: 1;
  margin-bottom: 12px;
}
</style>
