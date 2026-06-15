<script setup lang="ts">
import { computed } from 'vue'
import { DataLine, Coin, Histogram } from '@element-plus/icons-vue'
import BarChart from '@/components/BarChart.vue'
import PieChart from '@/components/PieChart.vue'
import { useStatisticsQuery } from '@/composables/useCoinQueries'
import PageHeader from '@/components/PageHeader.vue'

const { data: statistics, isLoading, isError } = useStatisticsQuery()

const barChartData = computed(() => {
  if (!statistics.value) return []
  return statistics.value.dynastyCounts.map((d) => ({
    label: d.dynasty,
    value: d.count,
  }))
})

const pieChartData = computed(() => {
  if (!statistics.value) return []
  return statistics.value.materialRatios.map((m) => ({
    label: m.material,
    value: m.count,
    ratio: m.ratio,
  }))
})
</script>

<template>
  <div class="statistics-view">
    <PageHeader
      title="形制统计概览"
      subtitle="从古钱币数据看形制分布与时代特征"
      layout="center"
      show-back
      show-timeline
      show-favorites
    />

    <div v-if="isLoading" class="statistics-view__loading">
      <el-skeleton :rows="8" animated />
    </div>

    <el-result v-else-if="isError" icon="error" title="加载失败" sub-title="请刷新页面重试" />

    <template v-else>
      <div class="statistics-view__stats-cards">
        <div class="stat-card">
          <div class="stat-card__icon stat-card__icon--coin">
            <el-icon><Coin /></el-icon>
          </div>
          <div class="stat-card__info">
            <div class="stat-card__value">{{ statistics?.totalCoins }}</div>
            <div class="stat-card__label">总钱币数量</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-card__icon stat-card__icon--dynasty">
            <el-icon><Histogram /></el-icon>
          </div>
          <div class="stat-card__info">
            <div class="stat-card__value">{{ statistics?.totalDynasties }}</div>
            <div class="stat-card__label">朝代数量</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-card__icon stat-card__icon--material">
            <el-icon><DataLine /></el-icon>
          </div>
          <div class="stat-card__info">
            <div class="stat-card__value">{{ statistics?.totalMaterials }}</div>
            <div class="stat-card__label">材质种类</div>
          </div>
        </div>
      </div>

      <div class="statistics-view__charts">
        <div class="statistics-view__chart-item">
          <BarChart :data="barChartData" title="各朝代钱币数量" color="#b8860b" />
        </div>
        <div class="statistics-view__chart-item">
          <PieChart :data="pieChartData" title="各材质占比" />
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.statistics-view {
  max-width: 1000px;
  margin: 0 auto;
  padding: 24px 20px 48px;
}

.statistics-view__loading {
  padding: 40px 0;
}

.statistics-view__stats-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 28px;
}

@media (max-width: 600px) {
  .statistics-view__stats-cards {
    grid-template-columns: 1fr;
  }
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 24px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.06);
}

.stat-card__icon {
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  font-size: 28px;
  color: #fff;
  flex-shrink: 0;
}

.stat-card__icon--coin {
  background: linear-gradient(135deg, #d4af37, #b8860b);
}

.stat-card__icon--dynasty {
  background: linear-gradient(135deg, #8b6914, #6b4423);
}

.stat-card__icon--material {
  background: linear-gradient(135deg, #cd853f, #a67c00);
}

.stat-card__info {
  flex: 1;
  min-width: 0;
}

.stat-card__value {
  font-size: 28px;
  font-weight: 700;
  color: #2c1810;
  margin-bottom: 4px;
}

.stat-card__label {
  font-size: 14px;
  color: #888;
}

.statistics-view__charts {
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  gap: 20px;
}

@media (max-width: 800px) {
  .statistics-view__charts {
    grid-template-columns: 1fr;
  }
}

.statistics-view__chart-item {
  min-width: 0;
}
</style>
