<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowLeft, List } from '@element-plus/icons-vue'
import CoinCard from '@/components/CoinCard.vue'
import CompareBar from '@/components/CompareBar.vue'
import PageHeader from '@/components/PageHeader.vue'
import { useCoinsByDynastyQuery, useDynastyByNameQuery } from '@/composables/useCoinQueries'
import { useCompare } from '@/composables/useCompare'

const route = useRoute()
const router = useRouter()

const dynastyName = computed(() => (route.params.name as string) || '')

const {
  data: dynasty,
  isLoading: dynastyLoading,
  isError: dynastyError,
} = useDynastyByNameQuery(dynastyName)
const {
  data: coins,
  isLoading: coinsLoading,
  isError: coinsError,
} = useCoinsByDynastyQuery(dynastyName)

const { count: compareCount } = useCompare()

const isLoading = computed(() => dynastyLoading.value || coinsLoading.value)
const isError = computed(() => dynastyError.value || coinsError.value)

function formatYear(year: number): string {
  if (year < 0) {
    return `前${Math.abs(year)}年`
  }
  return `${year}年`
}

function goBackToTimeline() {
  router.push('/timeline')
}

function goToCoinList() {
  router.push({
    name: 'coin-list',
    query: { dynasty: dynastyName.value },
  })
}

const hasContent = computed(() => !isLoading.value && coins.value && coins.value.length > 0)
</script>

<template>
  <div class="dynasty-topic" :class="{ 'has-compare-bar': compareCount > 0 }">
    <PageHeader layout="center" show-back>
      <template #title>
        <div class="dynasty-topic__header-row">
          <el-button
            type="primary"
            plain
            :icon="ArrowLeft"
            aria-label="返回朝代年表"
            @click="goBackToTimeline"
          >
            返回年表
          </el-button>
          <h1 class="page-header__title">
            {{ dynasty ? `${dynasty.name}朝专题` : '朝代专题' }}
          </h1>
          <el-button
            type="primary"
            plain
            :icon="List"
            aria-label="跳转钱币列表并选中该朝代筛选"
            @click="goToCoinList"
          >
            钱币列表
          </el-button>
        </div>
      </template>
      <template #subtitle>
        <p v-if="dynasty" class="page-header__subtitle">
          年代：<em>{{ formatYear(dynasty.startYear) }} — {{ formatYear(dynasty.endYear) }}</em>
          &nbsp;·&nbsp; 共收录 <em>{{ dynasty.coinCount }}</em> 枚钱币
        </p>
      </template>
    </PageHeader>

    <div v-if="isLoading" class="dynasty-topic__loading">
      <el-skeleton :rows="8" animated />
    </div>

    <el-result
      v-else-if="isError || !dynasty"
      icon="error"
      title="加载失败"
      sub-title="请检查 URL 或稍后重试"
    />

    <template v-else>
      <div class="dynasty-topic__info-card">
        <div class="dynasty-topic__info-row">
          <div class="dynasty-topic__info-item">
            <span class="dynasty-topic__info-label">朝代名称</span>
            <span class="dynasty-topic__info-value">{{ dynasty.name }}朝</span>
          </div>
          <div class="dynasty-topic__info-item">
            <span class="dynasty-topic__info-label">起止年份</span>
            <span class="dynasty-topic__info-value">
              {{ formatYear(dynasty.startYear) }} — {{ formatYear(dynasty.endYear) }}
            </span>
          </div>
          <div class="dynasty-topic__info-item">
            <span class="dynasty-topic__info-label">钱币总数</span>
            <span class="dynasty-topic__info-value dynasty-topic__info-value--highlight">
              {{ dynasty.coinCount }} 枚
            </span>
          </div>
        </div>
      </div>

      <el-empty v-if="!hasContent" description="该朝代暂无收录钱币" />

      <div v-else class="dynasty-topic__grid">
        <CoinCard v-for="coin in coins" :key="coin.id" :coin="coin" compare-mode />
      </div>

      <footer v-if="hasContent" class="dynasty-topic__footer">
        共 {{ coins?.length || 0 }} 枚钱币
      </footer>
    </template>

    <CompareBar />
  </div>
</template>

<style scoped>
.dynasty-topic {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px 20px 48px;
}

.dynasty-topic.has-compare-bar {
  padding-bottom: 120px;
}

.dynasty-topic__header-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  gap: 16px;
}

.dynasty-topic__header-row .page-header__title {
  margin: 0;
  flex: 1;
  text-align: center;
}

.dynasty-topic__loading {
  padding: 40px 0;
}

.dynasty-topic__info-card {
  background: #fff;
  border-radius: 12px;
  padding: 24px 32px;
  margin-bottom: 32px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}

.dynasty-topic__info-row {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  gap: 24px;
}

.dynasty-topic__info-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  flex: 1;
  min-width: 160px;
}

.dynasty-topic__info-label {
  font-size: 13px;
  color: #888;
  letter-spacing: 1px;
}

.dynasty-topic__info-value {
  font-size: 20px;
  font-weight: 600;
  color: #2c1810;
}

.dynasty-topic__info-value--highlight {
  color: #b8860b;
  font-size: 24px;
}

.dynasty-topic__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 24px;
}

.dynasty-topic__footer {
  margin-top: 32px;
  text-align: center;
  font-size: 13px;
  color: #aaa;
}
</style>
