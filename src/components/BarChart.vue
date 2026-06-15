<script setup lang="ts">
import { computed } from 'vue'

interface BarData {
  label: string
  value: number
}

const props = defineProps<{
  data: BarData[]
  title?: string
  color?: string
}>()

const maxValue = computed(() => {
  if (props.data.length === 0) return 0
  return Math.max(...props.data.map((d) => d.value))
})

const chartHeight = 240
const chartPadding = { top: 20, right: 20, bottom: 40, left: 40 }
const innerWidth = computed(() => {
  const barGap = 12
  const barWidth = 36
  return props.data.length * (barWidth + barGap) - barGap + chartPadding.left + chartPadding.right
})
const innerHeight = chartHeight - chartPadding.top - chartPadding.bottom

const bars = computed(() => {
  const barWidth = 36
  const barGap = 12
  return props.data.map((d, index) => {
    const height = maxValue.value > 0 ? (d.value / maxValue.value) * innerHeight : 0
    const x = chartPadding.left + index * (barWidth + barGap)
    const y = chartPadding.top + innerHeight - height
    return {
      label: d.label,
      value: d.value,
      x,
      y,
      width: barWidth,
      height,
    }
  })
})

const yTicks = computed(() => {
  const ticks: { value: number; y: number }[] = []
  const tickCount = 5
  for (let i = 0; i <= tickCount; i++) {
    const value = Math.round((maxValue.value / tickCount) * i)
    const y = chartPadding.top + innerHeight - (i / tickCount) * innerHeight
    ticks.push({ value, y })
  }
  return ticks
})

const barColor = computed(() => props.color || '#b8860b')
</script>

<template>
  <div class="bar-chart">
    <h3 v-if="title" class="bar-chart__title">{{ title }}</h3>
    <div class="bar-chart__container">
      <svg :width="innerWidth" :height="chartHeight" class="bar-chart__svg">
        <line
          v-for="tick in yTicks"
          :key="tick.value"
          :x1="chartPadding.left"
          :y1="tick.y"
          :x2="innerWidth - chartPadding.right"
          :y2="tick.y"
          class="bar-chart__grid-line"
        />
        <text
          v-for="tick in yTicks"
          :key="tick.value"
          :x="chartPadding.left - 8"
          :y="tick.y + 4"
          text-anchor="end"
          class="bar-chart__tick-text"
        >
          {{ tick.value }}
        </text>
        <g v-for="bar in bars" :key="bar.label" class="bar-chart__bar-group">
          <rect
            :x="bar.x"
            :y="bar.y"
            :width="bar.width"
            :height="bar.height"
            :fill="barColor"
            rx="4"
            class="bar-chart__bar"
          />
          <text
            :x="bar.x + bar.width / 2"
            :y="bar.y - 6"
            text-anchor="middle"
            class="bar-chart__bar-value"
          >
            {{ bar.value }}
          </text>
          <text
            :x="bar.x + bar.width / 2"
            :y="chartHeight - chartPadding.bottom + 20"
            text-anchor="middle"
            class="bar-chart__bar-label"
          >
            {{ bar.label }}
          </text>
        </g>
      </svg>
    </div>
  </div>
</template>

<style scoped>
.bar-chart {
  background: #fff;
  border-radius: 12px;
  padding: 20px 24px;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.06);
}

.bar-chart__title {
  margin: 0 0 16px;
  font-size: 16px;
  font-weight: 600;
  color: #2c1810;
}

.bar-chart__container {
  overflow-x: auto;
}

.bar-chart__svg {
  display: block;
}

.bar-chart__grid-line {
  stroke: #f0ebe0;
  stroke-width: 1;
}

.bar-chart__tick-text {
  font-size: 12px;
  fill: #999;
}

.bar-chart__bar {
  transition: all 0.3s ease;
}

.bar-chart__bar-group:hover .bar-chart__bar {
  opacity: 0.85;
}

.bar-chart__bar-value {
  font-size: 12px;
  font-weight: 600;
  fill: #2c1810;
}

.bar-chart__bar-label {
  font-size: 13px;
  fill: #666;
}
</style>
