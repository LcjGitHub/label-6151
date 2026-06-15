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

function niceStep(rawStep: number): number {
  const magnitude = Math.pow(10, Math.floor(Math.log10(rawStep)))
  const residual = rawStep / magnitude
  let nice: number
  if (residual <= 1) {
    nice = 1
  } else if (residual <= 2) {
    nice = 2
  } else if (residual <= 5) {
    nice = 5
  } else {
    nice = 10
  }
  return nice * magnitude
}

const yStep = computed(() => {
  if (maxValue.value === 0) return 1
  const targetTickCount = 5
  const rawStep = maxValue.value / targetTickCount
  return Math.max(1, niceStep(rawStep))
})

const yTicks = computed(() => {
  const ticks: { value: number; y: number }[] = []
  const step = yStep.value
  const chartMax = Math.ceil(maxValue.value / step) * step
  const count = Math.round(chartMax / step)
  const innerHeight = chartHeight - chartPadding.top - chartPadding.bottom
  for (let i = 0; i <= count; i++) {
    const value = step * i
    const y = chartPadding.top + innerHeight - (i / count) * innerHeight
    ticks.push({ value, y })
  }
  return ticks
})

const chartHeight = 240
const chartPadding = { top: 20, right: 20, bottom: 40, left: 40 }
const barWidth = 36
const barGap = 12

const innerWidth = computed(() => {
  return props.data.length * (barWidth + barGap) - barGap + chartPadding.left + chartPadding.right
})

const bars = computed(() => {
  const step = yStep.value
  const chartMax = Math.ceil(maxValue.value / step) * step
  const innerHeight = chartHeight - chartPadding.top - chartPadding.bottom
  return props.data.map((d, index) => {
    const height = chartMax > 0 ? (d.value / chartMax) * innerHeight : 0
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

const barColor = computed(() => props.color || '#b8860b')

const chartAriaLabel = computed(() => {
  if (props.data.length === 0) return '柱状图，暂无数据'
  const parts = props.data.map((d) => `${d.label}${d.value}枚`)
  return `柱状图，${props.title || '数据'}，共${props.data.length}项：${parts.join('，')}`
})
</script>

<template>
  <figure class="bar-chart" :aria-label="chartAriaLabel" role="img">
    <figcaption v-if="title" class="bar-chart__title">{{ title }}</figcaption>
    <div class="bar-chart__container" role="group" aria-label="可横向滚动的柱状图区域">
      <svg :width="innerWidth" :height="chartHeight" class="bar-chart__svg" focusable="false">
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
          aria-hidden="true"
        >
          {{ tick.value }}
        </text>
        <g
          v-for="bar in bars"
          :key="bar.label"
          class="bar-chart__bar-group"
          :aria-label="`${bar.label}，${bar.value}枚`"
        >
          <rect
            :x="bar.x"
            :y="bar.y"
            :width="bar.width"
            :height="bar.height"
            :fill="barColor"
            rx="4"
            class="bar-chart__bar"
            role="img"
            :aria-label="`${bar.label}柱状条，数值${bar.value}`"
          />
          <text
            :x="bar.x + bar.width / 2"
            :y="bar.y - 6"
            text-anchor="middle"
            class="bar-chart__bar-value"
            aria-hidden="true"
          >
            {{ bar.value }}
          </text>
          <text
            :x="bar.x + bar.width / 2"
            :y="chartHeight - chartPadding.bottom + 20"
            text-anchor="middle"
            class="bar-chart__bar-label"
            aria-hidden="true"
          >
            {{ bar.label }}
          </text>
        </g>
      </svg>
    </div>
  </figure>
</template>

<style scoped>
.bar-chart {
  margin: 0;
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
  overflow-y: hidden;
  -webkit-overflow-scrolling: touch;
  padding-bottom: 4px;
}

.bar-chart__container::-webkit-scrollbar {
  height: 6px;
}

.bar-chart__container::-webkit-scrollbar-track {
  background: #f5f0e8;
  border-radius: 3px;
}

.bar-chart__container::-webkit-scrollbar-thumb {
  background: #d4c4a8;
  border-radius: 3px;
}

.bar-chart__container::-webkit-scrollbar-thumb:hover {
  background: #b8860b;
}

.bar-chart__svg {
  display: block;
  min-width: 100%;
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
