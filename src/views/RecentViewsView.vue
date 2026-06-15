<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Delete, Clock } from '@element-plus/icons-vue'
import CoinCard from '@/components/CoinCard.vue'
import PageHeader from '@/components/PageHeader.vue'
import { useCoinsQuery } from '@/composables/useCoinQueries'
import { useRecentViews } from '@/composables/useRecentViews'
import dayjs from 'dayjs'

const router = useRouter()
const { data: coins, isLoading, isError } = useCoinsQuery()
const { count, recentViewsList, removeView, clearAll } = useRecentViews()

interface RecentViewCoin {
  id: string
  coin: typeof coins extends { value: (infer T)[] | undefined } ? NonNullable<T> : never
  viewedAt: string
}

const recentViewCoins = computed(() => {
  if (!coins.value) return [] as RecentViewCoin[]
  return recentViewsList.value
    .map((record) => {
      const coin = coins.value!.find((c) => c.id === record.id)
      if (!coin) return null
      return { id: record.id, coin, viewedAt: record.viewedAt }
    })
    .filter((item): item is NonNullable<typeof item> => item !== null)
})

const hasContent = computed(() => !isLoading.value && recentViewCoins.value.length > 0)

function formatViewedAt(iso: string): string {
  return dayjs(iso).format('YYYY-MM-DD HH:mm')
}

function handleRemove(id: string, coinName: string) {
  removeView(id)
  ElMessage.success(`已移除「${coinName}」的浏览记录`)
}

async function handleClearAll() {
  if (count.value === 0) return
  try {
    await ElMessageBox.confirm('确定要清空所有浏览记录吗？', '提示', {
      confirmButtonText: '确定清空',
      cancelButtonText: '取消',
      type: 'warning',
    })
    clearAll()
    ElMessage.success('已清空所有浏览记录')
  } catch {
    // 用户取消
  }
}
</script>

<template>
  <div class="recent-views">
    <PageHeader
      title="最近浏览"
      :subtitle="`共 ${count} 条浏览记录`"
      variant="card"
      layout="split"
      show-back
      show-timeline
      show-statistics
    >
      <template #right>
        <el-button
          type="danger"
          plain
          :icon="Delete"
          :disabled="count === 0"
          @click="handleClearAll"
        >
          一键清空
        </el-button>
      </template>
    </PageHeader>

    <div v-if="isLoading" class="recent-views__loading">
      <el-skeleton :rows="6" animated />
    </div>

    <el-result v-else-if="isError" icon="error" title="加载失败" sub-title="请刷新页面重试" />

    <el-empty v-else-if="recentViewCoins.length === 0" description="暂无浏览记录">
      <el-button type="primary" @click="router.push('/')"> 去浏览 </el-button>
    </el-empty>

    <div v-else class="recent-views__list">
      <div v-for="item in recentViewCoins" :key="item.id" class="recent-views__item">
        <CoinCard :coin="item.coin" :show-favorite="false" />
        <div class="recent-views__item-meta">
          <span class="recent-views__item-time">
            <el-icon><Clock /></el-icon>
            {{ formatViewedAt(item.viewedAt) }}
          </span>
          <el-button
            type="danger"
            plain
            size="small"
            :icon="Delete"
            @click="handleRemove(item.id, item.coin.name)"
          >
            删除记录
          </el-button>
        </div>
      </div>
    </div>

    <footer v-if="hasContent" class="recent-views__footer">
      共 {{ recentViewCoins.length }} 条浏览记录
    </footer>
  </div>
</template>

<style scoped>
.recent-views {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px 20px 48px;
}

.recent-views__loading {
  padding: 40px 0;
}

.recent-views__list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 24px;
}

.recent-views__item {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.recent-views__item-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 4px;
}

.recent-views__item-time {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #999;
}

.recent-views__footer {
  margin-top: 32px;
  text-align: center;
  font-size: 13px;
  color: #aaa;
}
</style>
