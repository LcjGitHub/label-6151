<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Delete } from '@element-plus/icons-vue'
import CoinCard from '@/components/CoinCard.vue'
import { useCoinsQuery } from '@/composables/useCoinQueries'
import { useFavorites } from '@/composables/useFavorites'

const router = useRouter()
const { data: coins, isLoading, isError } = useCoinsQuery()
const { count, removeFavorite, clearFavorites, getFavoriteCoins } = useFavorites()

const favoriteCoins = computed(() => {
  if (!coins.value) return []
  return getFavoriteCoins(coins.value)
})

const hasContent = computed(() => !isLoading.value && favoriteCoins.value.length > 0)

function handleRemove(coinId: string, coinName: string) {
  removeFavorite(coinId)
  ElMessage.success(`已取消收藏「${coinName}」`)
}

async function handleClearAll() {
  if (count.value === 0) return
  try {
    await ElMessageBox.confirm('确定要清空所有收藏吗？', '提示', {
      confirmButtonText: '确定清空',
      cancelButtonText: '取消',
      type: 'warning',
    })
    clearFavorites()
    ElMessage.success('已清空所有收藏')
  } catch {
    // 用户取消
  }
}
</script>

<template>
  <div class="coin-favorite">
    <header class="coin-favorite__header">
      <div class="coin-favorite__header-inner">
        <div class="coin-favorite__back">
          <el-button text @click="router.push('/')">
            ← 返回列表
          </el-button>
        </div>
        <div class="coin-favorite__title-area">
          <h1 class="coin-favorite__title">我的收藏</h1>
          <p class="coin-favorite__desc">共收藏 {{ count }} 枚钱币</p>
        </div>
        <div class="coin-favorite__actions">
          <el-button
            type="danger"
            plain
            :icon="Delete"
            :disabled="count === 0"
            @click="handleClearAll"
          >
            一键清空
          </el-button>
        </div>
      </div>
    </header>

    <div v-if="isLoading" class="coin-favorite__loading">
      <el-skeleton :rows="6" animated />
    </div>

    <el-result
      v-else-if="isError"
      icon="error"
      title="加载失败"
      sub-title="请刷新页面重试"
    />

    <el-empty
      v-else-if="favoriteCoins.length === 0"
      description="暂无收藏的钱币"
    >
      <el-button type="primary" @click="router.push('/')">
        去浏览
      </el-button>
    </el-empty>

    <div v-else class="coin-favorite__grid">
      <div
        v-for="coin in favoriteCoins"
        :key="coin.id"
        class="coin-favorite__item"
      >
        <CoinCard :coin="coin" :show-favorite="false" />
        <div class="coin-favorite__item-actions">
          <el-button
            type="danger"
            plain
            size="small"
            :icon="Delete"
            @click="handleRemove(coin.id, coin.name)"
          >
            取消收藏
          </el-button>
        </div>
      </div>
    </div>

    <footer v-if="hasContent" class="coin-favorite__footer">
      共 {{ favoriteCoins.length }} 枚收藏
    </footer>
  </div>
</template>

<style scoped>
.coin-favorite {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px 20px 48px;
}

.coin-favorite__header {
  margin-bottom: 24px;
  padding: 20px 24px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.06);
}

.coin-favorite__header-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}

.coin-favorite__back {
  flex-shrink: 0;
}

.coin-favorite__title-area {
  flex: 1;
  text-align: center;
}

.coin-favorite__title {
  margin: 0 0 4px;
  font-size: 22px;
  color: #2c1810;
  letter-spacing: 2px;
}

.coin-favorite__desc {
  margin: 0;
  font-size: 13px;
  color: #888;
}

.coin-favorite__actions {
  flex-shrink: 0;
}

.coin-favorite__loading {
  padding: 40px 0;
}

.coin-favorite__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 24px;
}

.coin-favorite__item {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.coin-favorite__item-actions {
  display: flex;
  justify-content: center;
}

.coin-favorite__footer {
  margin-top: 32px;
  text-align: center;
  font-size: 13px;
  color: #aaa;
}
</style>
