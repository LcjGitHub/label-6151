<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { DataLine, StarFilled, Timer } from '@element-plus/icons-vue'
import CoinCard from '@/components/CoinCard.vue'
import CompareBar from '@/components/CompareBar.vue'
import { useCoinsQuery, useDynastiesQuery, useMaterialsQuery } from '@/composables/useCoinQueries'
import { useCompare } from '@/composables/useCompare'
import { useFavorites } from '@/composables/useFavorites'

const route = useRoute()
const router = useRouter()
const selectedDynasty = ref<string>((route.query.dynasty as string) || '')
const selectedMaterials = ref<string[]>(
  (() => {
    const m = route.query.materials
    if (!m) return []
    return Array.isArray(m) ? (m as string[]) : [m as string]
  })(),
)

const { data: coins, isLoading: coinsLoading, isError: coinsError } = useCoinsQuery()
const { data: dynasties, isLoading: dynastiesLoading } = useDynastiesQuery()
const { data: materials, isLoading: materialsLoading } = useMaterialsQuery()

const { count: compareCount } = useCompare()
const { count: favoriteCount } = useFavorites()

const filteredCoins = computed(() => {
  if (!coins.value) return []
  return coins.value.filter((coin) => {
    if (selectedDynasty.value && coin.dynasty !== selectedDynasty.value) return false
    if (selectedMaterials.value.length > 0 && !selectedMaterials.value.includes(coin.material))
      return false
    return true
  })
})

const isLoading = computed(() => coinsLoading.value || dynastiesLoading.value || materialsLoading.value)

const hasContent = computed(() => !isLoading.value && filteredCoins.value.length > 0)

watch(selectedDynasty, (val) => {
  if (val) {
    router.replace({ query: { ...route.query, dynasty: val } })
  } else {
    const { dynasty, ...rest } = route.query
    router.replace({ query: rest })
  }
})

watch(selectedMaterials, (val) => {
  if (val.length > 0) {
    router.replace({ query: { ...route.query, materials: val } })
  } else {
    const { materials, ...rest } = route.query
    router.replace({ query: rest })
  }
})

watch(
  () => route.query.dynasty,
  (val) => {
    if (val !== selectedDynasty.value) {
      selectedDynasty.value = (val as string) || ''
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
</script>

<template>
  <div class="coin-list" :class="{ 'has-compare-bar': compareCount > 0 }">
    <header class="coin-list__header">
      <div class="coin-list__header-top">
        <h1 class="coin-list__title">古钱币形制浏览图录</h1>
        <div class="coin-list__header-buttons">
          <el-button type="primary" plain :icon="Timer" @click="router.push('/timeline')">
            朝代年表
          </el-button>
          <el-button type="primary" plain :icon="DataLine" @click="router.push('/statistics')">
            统计概览
          </el-button>
          <el-button
            type="primary"
            plain
            :icon="StarFilled"
            @click="router.push('/favorites')"
          >
            我的收藏
            <el-badge
              v-if="favoriteCount > 0"
              :value="favoriteCount"
              :max="99"
              class="coin-list__badge"
            />
          </el-button>
        </div>
      </div>
      <p class="coin-list__desc">按朝代浏览中国历代钱币形制</p>
    </header>

    <div class="coin-list__filter">
      <span class="coin-list__filter-label">朝代筛选：</span>
      <el-radio-group v-model="selectedDynasty" size="default">
        <el-radio-button label="">全部</el-radio-button>
        <el-radio-button
          v-for="dynasty in dynasties"
          :key="dynasty"
          :label="dynasty"
        >
          {{ dynasty }}
        </el-radio-button>
      </el-radio-group>
    </div>

    <div v-if="materials && materials.length > 0" class="coin-list__filter coin-list__filter--sub">
      <span class="coin-list__filter-label">材质筛选：</span>
      <el-checkbox-group v-model="selectedMaterials" size="default">
        <el-checkbox
          v-for="material in materials"
          :key="material"
          :label="material"
        >
          {{ material }}
        </el-checkbox>
      </el-checkbox-group>
    </div>

    <div v-if="isLoading" class="coin-list__loading">
      <el-skeleton :rows="6" animated />
    </div>

    <el-result
      v-else-if="coinsError"
      icon="error"
      title="加载失败"
      sub-title="请刷新页面重试"
    />

    <el-empty
      v-else-if="filteredCoins.length === 0"
      description="暂无符合条件的钱币数据"
    />

    <div v-else class="coin-list__grid">
      <CoinCard
        v-for="coin in filteredCoins"
        :key="coin.id"
        :coin="coin"
        compare-mode
      />
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

.coin-list__header {
  text-align: center;
  margin-bottom: 32px;
}

.coin-list__header-top {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin-bottom: 8px;
}

.coin-list__header-buttons {
  display: flex;
  align-items: center;
  gap: 12px;
}

.coin-list__title {
  margin: 0;
  font-size: 28px;
  color: #2c1810;
  letter-spacing: 2px;
}

.coin-list__badge {
  margin-left: 6px;
}

.coin-list__desc {
  margin: 0;
  font-size: 14px;
  color: #888;
}

.coin-list__filter {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
  margin-bottom: 28px;
  padding: 16px 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.06);
}

.coin-list__filter--sub {
  margin-top: -20px;
  margin-bottom: 28px;
}

.coin-list__filter-label {
  font-size: 14px;
  color: #666;
  white-space: nowrap;
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
