<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { StarFilled, Timer } from '@element-plus/icons-vue'
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

const hasKeyword = computed(() => keyword.value.trim().length > 0)
</script>

<template>
  <div class="search-results">
    <header class="search-results__header">
      <div class="search-results__header-inner">
        <div class="search-results__back">
          <el-button text @click="router.push('/')">
            ← 返回列表
          </el-button>
        </div>
        <div class="search-results__title-area">
          <h1 class="search-results__title">
            <template v-if="hasKeyword">搜索结果</template>
            <template v-else>全局搜索</template>
          </h1>
          <p class="search-results__desc">
            <template v-if="hasKeyword">
              关键词：<em>{{ keyword }}</em> · 找到 <span class="search-results__count">{{ matchCount }}</span> 枚
            </template>
            <template v-else>
              在顶部搜索栏输入关键词开始搜索
            </template>
          </p>
        </div>
        <div class="search-results__actions">
          <el-button
            type="primary"
            plain
            :icon="Timer"
            @click="router.push('/timeline')"
          >
            朝代年表
          </el-button>
          <el-button
            type="primary"
            plain
            :icon="StarFilled"
            @click="router.push('/favorites')"
          >
            我的收藏
          </el-button>
        </div>
      </div>
    </header>

    <el-empty
      v-if="!hasKeyword"
      description="请在顶部搜索栏输入钱币名称、面文或背文进行搜索"
    >
      <template #image>
        <div class="search-results__guide-icon">🔍</div>
      </template>
    </el-empty>

    <template v-else>
      <div v-if="isLoading" class="search-results__loading">
        <el-skeleton :rows="6" animated />
      </div>

      <el-result v-else-if="isError" icon="error" title="搜索失败" sub-title="请刷新页面重试" />

      <el-empty
        v-else-if="!hasResults"
        description="未找到匹配的钱币，请尝试其他关键词"
      >
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

.search-results__header {
  margin-bottom: 24px;
  padding: 20px 24px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.06);
}

.search-results__header-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}

.search-results__back {
  flex-shrink: 0;
}

.search-results__title-area {
  flex: 1;
  text-align: center;
}

.search-results__title {
  margin: 0 0 4px;
  font-size: 22px;
  color: #2c1810;
  letter-spacing: 2px;
}

.search-results__desc {
  margin: 0;
  font-size: 13px;
  color: #888;
}

.search-results__desc em {
  font-style: normal;
  color: #8b6914;
}

.search-results__count {
  color: #8b6914;
  font-weight: 700;
}

.search-results__actions {
  flex-shrink: 0;
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
