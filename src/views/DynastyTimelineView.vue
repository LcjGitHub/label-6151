<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ArrowLeft, ArrowRight } from '@element-plus/icons-vue'
import { useDynastyTimelineQuery } from '@/composables/useCoinQueries'

const router = useRouter()
const { data: timeline, isLoading, isError } = useDynastyTimelineQuery()

function formatYear(year: number): string {
  if (year < 0) {
    return `前${Math.abs(year)}年`
  }
  return `${year}年`
}

function handleDynastyClick(dynasty: string) {
  router.push({
    name: 'coin-list',
    query: { dynasty },
  })
}
</script>

<template>
  <div class="dynasty-timeline">
    <header class="dynasty-timeline__header">
      <div class="dynasty-timeline__header-top">
        <el-button
          type="primary"
          plain
          :icon="ArrowLeft"
          @click="router.push('/')"
        >
          返回列表
        </el-button>
      </div>
      <h1 class="dynasty-timeline__title">朝代年表</h1>
      <p class="dynasty-timeline__desc">按历史先后顺序浏览中国历代钱币</p>
    </header>

    <div v-if="isLoading" class="dynasty-timeline__loading">
      <el-skeleton :rows="8" animated />
    </div>

    <el-result
      v-else-if="isError"
      icon="error"
      title="加载失败"
      sub-title="请刷新页面重试"
    />

    <div v-else class="dynasty-timeline__list">
      <div
        v-for="(item, index) in timeline"
        :key="item.name"
        class="dynasty-timeline__item"
        :class="{ 'dynasty-timeline__item--clickable': item.coinCount > 0 }"
        @click="item.coinCount > 0 && handleDynastyClick(item.name)"
      >
        <div class="dynasty-timeline__index">
          {{ String(index + 1).padStart(2, '0') }}
        </div>
        <div class="dynasty-timeline__info">
          <div class="dynasty-timeline__name">{{ item.name }}</div>
          <div class="dynasty-timeline__period">
            {{ formatYear(item.startYear) }} — {{ formatYear(item.endYear) }}
          </div>
        </div>
        <div class="dynasty-timeline__coins">
          <span class="dynasty-timeline__coins-count">{{ item.coinCount }}</span>
          <span class="dynasty-timeline__coins-label">枚钱币</span>
        </div>
        <el-icon v-if="item.coinCount > 0" class="dynasty-timeline__arrow">
          <ArrowRight />
        </el-icon>
      </div>
    </div>

    <footer v-if="timeline && timeline.length > 0" class="dynasty-timeline__footer">
      共 {{ timeline.length }} 个朝代
    </footer>
  </div>
</template>

<style scoped>
.dynasty-timeline {
  max-width: 800px;
  margin: 0 auto;
  padding: 24px 20px 48px;
}

.dynasty-timeline__header {
  text-align: center;
  margin-bottom: 32px;
}

.dynasty-timeline__header-top {
  display: flex;
  justify-content: flex-start;
  margin-bottom: 16px;
}

.dynasty-timeline__title {
  margin: 0 0 8px;
  font-size: 28px;
  color: #2c1810;
  letter-spacing: 2px;
}

.dynasty-timeline__desc {
  margin: 0;
  font-size: 14px;
  color: #888;
}

.dynasty-timeline__loading {
  padding: 20px 0;
}

.dynasty-timeline__list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.dynasty-timeline__item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px 24px;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.06);
  transition: all 0.2s ease;
}

.dynasty-timeline__item--clickable {
  cursor: pointer;
}

.dynasty-timeline__item--clickable:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-color: #b8860b;
}

.dynasty-timeline__index {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 600;
  color: #b8860b;
  background: #faf5e8;
  border-radius: 50%;
  flex-shrink: 0;
}

.dynasty-timeline__info {
  flex: 1;
  min-width: 0;
}

.dynasty-timeline__name {
  font-size: 18px;
  font-weight: 600;
  color: #2c1810;
  margin-bottom: 4px;
}

.dynasty-timeline__period {
  font-size: 13px;
  color: #888;
}

.dynasty-timeline__coins {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  flex-shrink: 0;
}

.dynasty-timeline__coins-count {
  font-size: 20px;
  font-weight: 700;
  color: #b8860b;
}

.dynasty-timeline__coins-label {
  font-size: 12px;
  color: #aaa;
}

.dynasty-timeline__arrow {
  color: #ccc;
  font-size: 18px;
  flex-shrink: 0;
}

.dynasty-timeline__footer {
  margin-top: 32px;
  text-align: center;
  font-size: 13px;
  color: #aaa;
}
</style>
