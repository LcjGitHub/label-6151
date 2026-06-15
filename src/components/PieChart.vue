<script setup lang="ts">
import { computed } from 'vue'

interface PieData {
  label: string
  value: number
  ratio: number
}

const props = defineProps<{
  data: PieData[]
  title?: string
  colors?: string[]
}>()

const defaultColors = ['#b8860b', '#8b6914', '#d4af37', '#6b4423', '#a67c00', '#cd853f', '#8b4513']

const pieColors = computed(() => props.colors || defaultColors)

const total = computed(() => props.data.reduce((sum, d) => sum + d.value, 0))

const viewBoxSize = 200
const center = viewBoxSize / 2
const radius = 80

const slices = computed(() => {
  let startAngle = -Math.PI / 2
  return props.data.map((d, index) => {
    const angle = (d.value / total.value) * Math.PI * 2
    const endAngle = startAngle + angle
    const x1 = center + radius * Math.cos(startAngle)
    const y1 = center + radius * Math.sin(startAngle)
    const x2 = center + radius * Math.cos(endAngle)
    const y2 = center + radius * Math.sin(endAngle)
    const largeArc = angle > Math.PI ? 1 : 0
    const path = `M ${center} ${center} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`

    const midAngle = startAngle + angle / 2
    const labelRadius = radius * 0.65
    const labelX = center + labelRadius * Math.cos(midAngle)
    const labelY = center + labelRadius * Math.sin(midAngle)

    const color = pieColors.value[index % pieColors.value.length]

    startAngle = endAngle

    return {
      label: d.label,
      value: d.value,
      ratio: d.ratio,
      path,
      labelX,
      labelY,
      color,
    }
  })
})
</script>

<template>
  <div class="pie-chart">
    <h3 v-if="title" class="pie-chart__title">{{ title }}</h3>
    <div class="pie-chart__content">
      <div class="pie-chart__chart-wrap">
        <svg :viewBox="`0 0 ${viewBoxSize} ${viewBoxSize}`" class="pie-chart__svg">
          <g>
            <path
              v-for="slice in slices"
              :key="slice.label"
              :d="slice.path"
              :fill="slice.color"
              class="pie-chart__slice"
            />
          </g>
        </svg>
      </div>
      <div class="pie-chart__legend">
        <div
          v-for="slice in slices"
          :key="slice.label"
          class="pie-chart__legend-item"
        >
          <span class="pie-chart__legend-dot" :style="{ backgroundColor: slice.color }" />
          <span class="pie-chart__legend-label">{{ slice.label }}</span>
          <span class="pie-chart__legend-value">{{ slice.ratio }}%</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.pie-chart {
  background: #fff;
  border-radius: 12px;
  padding: 20px 24px;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.06);
}

.pie-chart__title {
  margin: 0 0 16px;
  font-size: 16px;
  font-weight: 600;
  color: #2c1810;
}

.pie-chart__content {
  display: flex;
  align-items: center;
  gap: 32px;
}

@media (max-width: 600px) {
  .pie-chart__content {
    flex-direction: column;
    gap: 20px;
  }
}

.pie-chart__chart-wrap {
  flex-shrink: 0;
  width: 200px;
  height: 200px;
}

.pie-chart__svg {
  width: 100%;
  height: 100%;
  display: block;
}

.pie-chart__slice {
  transition: all 0.3s ease;
  cursor: pointer;
}

.pie-chart__slice:hover {
  opacity: 0.85;
}

.pie-chart__legend {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.pie-chart__legend-item {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
}

.pie-chart__legend-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  flex-shrink: 0;
}

.pie-chart__legend-label {
  flex: 1;
  color: #666;
}

.pie-chart__legend-value {
  font-weight: 600;
  color: #2c1810;
}
</style>
