<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ArrowRight } from '@element-plus/icons-vue'
import { useDynastyTimelineQuery } from '@/composables/useCoinQueries'
import PageHeader from '@/components/PageHeader.vue'

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
    <PageHeader
      title="朝代年表"
      subtitle="按历史先后顺序浏览中国历代钱币"
      layout="center"
      show-back
    />

    <div v-if="isLoading" class="dynasty-timeline__loading">
      <el-skeleton :rows="8" animated />
    </div>

    <el-result v-else-if="isError" icon="error" title="加载失败" sub-title="请刷新页面重试" />

    <div v-else class="dynasty-timeline__list">
      <div
        v-for="(item, index) in timeline"
        :key="item.name"
        class="dynasty-timeline__item"
        :class="{ 'dynasty-timeline__item--clickable': item.coinCount > 0 }"
        :aria-label="
          item.coinCount > 0
            ? `查看${item.name}朝钱币，共${item.coinCount}枚，年代${formatYear(item.startYear)}至${formatYear(item.endYear)}`
            : `${item.name}朝，年代${formatYear(item.startYear)}至${formatYear(item.endYear)}，暂无钱币数据`
        "
        :role="item.coinCount > 0 ? 'button' : undefined"
        :tabindex="item.coinCount > 0 ? 0 : undefined"
        @click="item.coinCount > 0 && handleDynastyClick(item.name)"
        @keydown.enter="item.coinCount > 0 && handleDynastyClick(item.name)"
        @keydown.space.prevent="item.coinCount > 0 && handleDynastyClick(item.name)"
      >
        <div class="dynasty-timeline__index" aria-hidden="true">
          {{ String(index + 1).padStart(2, '0') }}
        </div>
        <div class="dynasty-timeline__info">
          <router-link
            v-if="item.coinCount > 0"
            :to="`/dynasty/${item.name}`"
            class="dynasty-timeline__name dynasty-timeline__name--link"
            @click.stop
          >
            {{ item.name }}
          </router-link>
          <div v-else class="dynasty-timeline__name">{{ item.name }}</div>
          <div class="dynasty-timeline__period" aria-hidden="true">
            {{ formatYear(item.startYear) }} — {{ formatYear(item.endYear) }}
          </div>
        </div>
        <div class="dynasty-timeline__coins">
          <span class="dynasty-timeline__coins-count">{{ item.coinCount }}</span>
          <span class="dynasty-timeline__coins-label">枚钱币</span>
        </div>
        <el-icon v-if="item.coinCount > 0" class="dynasty-timeline__arrow" aria-hidden="true">
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
  border: none;
  border-radius: 10px;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.06);
  transition: all 0.2s ease;
  font-family: inherit;
  text-align: left;
  width: 100%;
}

.dynasty-timeline__item:focus-visible {
  outline: 2px solid #b8860b;
  outline-offset: 2px;
}

.dynasty-timeline__item:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.dynasty-timeline__item--clickable {
  cursor: pointer;
}

.dynasty-timeline__item--clickable:hover,
.dynasty-timeline__item--clickable:focus-visible {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
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

.dynasty-timeline__name--link {
  display: inline-block;
  text-decoration: none;
  color: #8b6914;
  border-bottom: 1px dashed #8b6914;
  padding-bottom: 1px;
  transition: all 0.2s ease;
}

.dynasty-timeline__name--link:hover,
.dynasty-timeline__name--link:focus-visible {
  color: #b8860b;
  border-bottom-color: #b8860b;
  outline: none;
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
