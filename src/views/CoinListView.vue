<script setup lang="ts">
import { computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Search } from '@element-plus/icons-vue'
import CoinCard from '@/components/CoinCard.vue'
import CompareBar from '@/components/CompareBar.vue'
import FilterBar from '@/components/FilterBar.vue'
import PageHeader from '@/components/PageHeader.vue'
import {
  useCoinsQuery,
  useDynastiesQuery,
  useMaterialsQuery,
  useDiameterRangeQuery,
} from '@/composables/useCoinQueries'
import { useCompare } from '@/composables/useCompare'
import { useCoinFilter } from '@/composables/useCoinFilter'

const route = useRoute()
const router = useRouter()

const { data: coins, isLoading: coinsLoading, isError: coinsError } = useCoinsQuery()
const { data: dynasties, isLoading: dynastiesLoading } = useDynastiesQuery()
const { data: materials } = useMaterialsQuery()
const { data: diameterExtremes } = useDiameterRangeQuery()

const { count: compareCount } = useCompare()

const initialDynasty = (route.query.dynasty as string) || ''
const initialMaterials = (() => {
  const m = route.query.materials
  if (!m) return []
  return Array.isArray(m) ? (m as string[]) : [m as string]
})()
const initialKeyword = (route.query.keyword as string) || ''

const {
  selectedDynasty,
  selectedMaterials,
  keyword,
  diameterRange,
  filteredCoins,
  hasActiveFilters,
} = useCoinFilter(coins, diameterExtremes, {
  dynasty: initialDynasty,
  materials: initialMaterials,
  keyword: initialKeyword,
})

const isLoading = computed(() => coinsLoading.value || dynastiesLoading.value)

function validateDynastyParam(val: unknown): string {
  const dynastyStr = typeof val === 'string' ? val : ''
  if (!dynastyStr) return ''
  if (dynasties.value && dynasties.value.includes(dynastyStr)) {
    return dynastyStr
  }
  return ''
}

function clearInvalidDynastyParam() {
  const { dynasty: _dynasty, ...rest } = route.query
  router.replace({ query: rest })
}

watch(
  () => dynasties.value,
  (newDynasties) => {
    if (!newDynasties) return
    const paramDynasty = route.query.dynasty
    if (!paramDynasty) return
    const valid = validateDynastyParam(paramDynasty)
    if (!valid) {
      selectedDynasty.value = ''
      clearInvalidDynastyParam()
    }
  },
  { immediate: true },
)

const hasContent = computed(() => !isLoading.value && filteredCoins.value.length > 0)

const isFilterResultEmpty = computed(
  () =>
    !isLoading.value &&
    !coinsError.value &&
    filteredCoins.value.length === 0 &&
    hasActiveFilters.value,
)

watch(selectedDynasty, (val) => {
  if (val) {
    router.replace({ query: { ...route.query, dynasty: val } })
  } else {
    const { dynasty: _dynasty, ...rest } = route.query
    router.replace({ query: rest })
  }
})

watch(selectedMaterials, (val) => {
  if (val.length > 0) {
    router.replace({ query: { ...route.query, materials: val } })
  } else {
    const { materials: _materials, ...rest } = route.query
    router.replace({ query: rest })
  }
})

watch(keyword, (val) => {
  if (val.trim()) {
    router.replace({ query: { ...route.query, keyword: val.trim() } })
  } else {
    const { keyword: _keyword, ...rest } = route.query
    router.replace({ query: rest })
  }
})

watch(
  () => route.query.dynasty,
  (val) => {
    const valid = validateDynastyParam(val)
    if (valid !== selectedDynasty.value) {
      selectedDynasty.value = valid
    }
    if (val && !valid) {
      clearInvalidDynastyParam()
    }
  },
)

watch(
  () => route.query.materials,
  (val) => {
    const arr = val ? (Array.isArray(val) ? (val as string[]) : [val as string]) : []
    const current = JSON.stringify(selectedMaterials.value)
    const incoming = JSON.stringify(arr)
    if (current !== incoming) {
      selectedMaterials.value = arr
    }
  },
)

watch(
  () => route.query.keyword,
  (val) => {
    const incoming = (val as string) || ''
    if (incoming !== keyword.value) {
      keyword.value = incoming
    }
  },
)

watch(
  () => diameterExtremes.value,
  (extremes) => {
    if (!extremes) return
    const qMin = route.query.diameterMin
    const qMax = route.query.diameterMax
    if (qMin !== undefined && qMax !== undefined) {
      const min = Number(qMin)
      const max = Number(qMax)
      if (!isNaN(min) && !isNaN(max) && min >= extremes.min && max <= extremes.max) {
        diameterRange.value = [min, max]
        return
      }
    }
    diameterRange.value = [extremes.min, extremes.max]
  },
  { immediate: true },
)

watch(diameterRange, (val) => {
  if (!diameterExtremes.value) return
  const [min, max] = val
  const isDefault = min === diameterExtremes.value.min && max === diameterExtremes.value.max
  if (isDefault) {
    const { diameterMin: _min, diameterMax: _max, ...rest } = route.query
    router.replace({ query: rest })
  } else {
    router.replace({
      query: { ...route.query, diameterMin: String(min), diameterMax: String(max) },
    })
  }
})

watch(
  () => route.query.diameterMin as string | undefined,
  () => {
    if (!diameterExtremes.value) return
    const qMin = route.query.diameterMin
    const qMax = route.query.diameterMax
    if (qMin !== undefined && qMax !== undefined) {
      const min = Number(qMin)
      const max = Number(qMax)
      const [curMin, curMax] = diameterRange.value
      if (min !== curMin || max !== curMax) {
        if (
          !isNaN(min) &&
          !isNaN(max) &&
          min >= diameterExtremes.value.min &&
          max <= diameterExtremes.value.max
        ) {
          diameterRange.value = [min, max]
        }
      }
    } else {
      const [curMin, curMax] = diameterRange.value
      if (curMin !== diameterExtremes.value.min || curMax !== diameterExtremes.value.max) {
        diameterRange.value = [diameterExtremes.value.min, diameterExtremes.value.max]
      }
    }
  },
)
</script>

<template>
  <div class="coin-list" :class="{ 'has-compare-bar': compareCount > 0 }">
    <PageHeader
      title="古钱币形制浏览图录"
      subtitle="按朝代浏览中国历代钱币形制"
      show-timeline
      show-statistics
      show-favorites
      show-recent-views
    />

    <FilterBar
      v-model:selected-dynasty="selectedDynasty"
      v-model:keyword="keyword"
      class="coin-list__filter"
      :dynasties="dynasties"
    />

    <div v-if="materials && materials.length > 0" class="coin-list__material-filter">
      <span id="material-filter-label" class="coin-list__filter-label">材质筛选：</span>
      <el-checkbox-group
        v-model="selectedMaterials"
        size="default"
        aria-labelledby="material-filter-label"
      >
        <el-checkbox
          v-for="material in materials"
          :key="material"
          :label="material"
          :aria-label="`材质：${material}`"
        >
          {{ material }}
        </el-checkbox>
      </el-checkbox-group>
    </div>

    <div v-if="diameterExtremes" class="coin-list__diameter-filter">
      <span id="diameter-filter-label" class="coin-list__filter-label">直径筛选：</span>
      <div class="coin-list__diameter-slider">
        <span class="coin-list__diameter-value">{{ diameterRange[0] }}mm</span>
        <el-slider
          :model-value="diameterRange"
          range
          :min="diameterExtremes.min"
          :max="diameterExtremes.max"
          :step="1"
          aria-labelledby="diameter-filter-label"
          @update:model-value="
            (val: number[]) => {
              if (val.length === 2) diameterRange = [val[0], val[1]]
            }
          "
        />
        <span class="coin-list__diameter-value">{{ diameterRange[1] }}mm</span>
      </div>
    </div>

    <div v-if="isLoading" class="coin-list__loading">
      <el-skeleton :rows="6" animated />
    </div>

    <el-result v-else-if="coinsError" icon="error" title="加载失败" sub-title="请刷新页面重试" />

    <el-empty
      v-else-if="isFilterResultEmpty"
      description="没有找到匹配的钱币，请尝试调整筛选条件或搜索关键词"
    >
      <template #image>
        <div class="coin-list__empty-icon">
          <el-icon :size="48" color="#c0c4cc">
            <Search />
          </el-icon>
        </div>
      </template>
    </el-empty>

    <el-empty v-else-if="filteredCoins.length === 0" description="暂无钱币数据" />

    <div v-else class="coin-list__grid">
      <CoinCard v-for="coin in filteredCoins" :key="coin.id" :coin="coin" compare-mode />
    </div>

    <footer v-if="hasContent" class="coin-list__footer">
      共 {{ filteredCoins.length }} 枚钱币
    </footer>

    <CompareBar />
  </div>
</template>

<style scoped>
.coin-list {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px 20px 48px;
}

.coin-list.has-compare-bar {
  padding-bottom: 120px;
}

.coin-list__filter {
  margin-bottom: 12px;
}

.coin-list__material-filter {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
  margin-bottom: 28px;
  padding: 12px 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.06);
}

.coin-list__filter-label {
  font-size: 14px;
  color: #666;
  white-space: nowrap;
}

.coin-list__diameter-filter {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
  margin-bottom: 28px;
  padding: 12px 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.06);
}

.coin-list__diameter-slider {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  min-width: 240px;
  max-width: 480px;
}

.coin-list__diameter-slider :deep(.el-slider) {
  flex: 1;
}

.coin-list__diameter-value {
  font-size: 13px;
  color: #409eff;
  white-space: nowrap;
  min-width: 42px;
  text-align: center;
}

.coin-list__empty-icon {
  margin-bottom: 12px;
}

.coin-list__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 24px;
}

.coin-list__loading {
  padding: 40px 0;
}

.coin-list__footer {
  margin-top: 32px;
  text-align: center;
  font-size: 13px;
  color: #aaa;
}
</style>
