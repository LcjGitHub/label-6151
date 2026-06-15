<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Guide, Star, StarFilled, View } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import PageHeader from '@/components/PageHeader.vue'
import { fetchRandomCoin } from '@/api/coins'
import type { Coin } from '@/types/coin'
import { useFavorites } from '@/composables/useFavorites'
import { useRecentViews } from '@/composables/useRecentViews'

const router = useRouter()
const { isFavorite, toggleFavorite } = useFavorites()
const { addView } = useRecentViews()

const coin = ref<Coin | undefined>(undefined)
const isLoading = ref(false)
const isError = ref(false)
const lastCoinId = ref<string | undefined>(undefined)

const isFavorited = computed(() => (coin.value ? isFavorite(coin.value.id) : false))

async function loadRandomCoin() {
  isLoading.value = true
  isError.value = false
  try {
    const result = await fetchRandomCoin(lastCoinId.value)
    if (!result) {
      isError.value = true
      return
    }
    if (lastCoinId.value && result.id === lastCoinId.value) {
      const retryResult = await fetchRandomCoin(lastCoinId.value)
      if (retryResult) {
        coin.value = retryResult
      } else {
        coin.value = result
      }
    } else {
      coin.value = result
    }
    lastCoinId.value = coin.value.id
    addView(coin.value.id)
  } catch {
    isError.value = true
  } finally {
    isLoading.value = false
  }
}

function handleToggleFavorite() {
  if (!coin.value) return
  const favorited = toggleFavorite(coin.value)
  ElMessage.success(favorited ? '已添加到收藏' : '已取消收藏')
}

function goToDetail() {
  if (!coin.value) return
  router.push({ name: 'coin-detail', params: { id: coin.value.id } })
}

loadRandomCoin()
</script>

<template>
  <div class="coin-random">
    <PageHeader
      title="随机发现"
      subtitle="探索未知的古钱币世界"
      layout="center"
      show-back
    />

    <div v-if="isLoading" class="coin-random__loading">
      <el-skeleton :rows="8" animated />
    </div>

    <el-result
      v-else-if="isError"
      icon="error"
      title="加载失败"
      sub-title="请点击「换一枚」重试"
    >
      <template #extra>
        <el-button type="primary" :icon="Guide" @click="loadRandomCoin">换一枚</el-button>
      </template>
    </el-result>

    <template v-else-if="coin">
      <div class="coin-random__card">
        <div class="coin-random__image-wrap">
          <el-image
            :src="coin.imageUrl"
            :alt="coin.name"
            fit="contain"
            lazy
            class="coin-random__image"
            :preview-src-list="[coin.imageUrl]"
          >
            <template #placeholder>
              <div class="coin-random__placeholder">加载中…</div>
            </template>
            <template #error>
              <div class="coin-random__placeholder">暂无图片</div>
            </template>
          </el-image>
        </div>

        <div class="coin-random__info">
          <el-tag type="warning" effect="dark" class="coin-random__dynasty">
            {{ coin.dynasty }}
          </el-tag>
          <h1 class="coin-random__title">{{ coin.name }}</h1>
          <p class="coin-random__desc">{{ coin.description }}</p>

          <el-descriptions :column="1" border class="coin-random__descriptions">
            <el-descriptions-item label="面文">
              <span class="coin-random__text-highlight">{{ coin.obverse }}</span>
            </el-descriptions-item>
            <el-descriptions-item label="背文">
              <span class="coin-random__text-highlight">{{ coin.reverse }}</span>
            </el-descriptions-item>
            <el-descriptions-item label="直径"> {{ coin.diameter }} mm </el-descriptions-item>
            <el-descriptions-item label="材质">
              {{ coin.material }}
            </el-descriptions-item>
          </el-descriptions>

          <div class="coin-random__actions">
            <el-button type="primary" :icon="Guide" size="large" @click="loadRandomCoin">
              换一枚
            </el-button>
            <el-button
              :icon="isFavorited ? StarFilled : Star"
              size="large"
              @click="handleToggleFavorite"
            >
              {{ isFavorited ? '已收藏' : '收藏' }}
            </el-button>
            <el-button type="success" plain :icon="View" size="large" @click="goToDetail">
              查看详情
            </el-button>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.coin-random {
  max-width: 960px;
  margin: 0 auto;
  padding: 24px 20px 48px;
}

.coin-random__loading {
  padding: 40px 0;
}

.coin-random__card {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  align-items: start;
  background: #fff;
  border-radius: 12px;
  padding: 32px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

@media (max-width: 768px) {
  .coin-random__card {
    grid-template-columns: 1fr;
    padding: 20px;
  }
}

.coin-random__image-wrap {
  background: #f5f0e8;
  border-radius: 12px;
  overflow: hidden;
  aspect-ratio: 1;
}

.coin-random__image {
  width: 100%;
  height: 100%;
}

.coin-random__placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  min-height: 300px;
  color: #999;
  background: #f5f0e8;
}

.coin-random__dynasty {
  margin-bottom: 12px;
}

.coin-random__title {
  margin: 0 0 12px;
  font-size: 26px;
  color: #2c1810;
}

.coin-random__desc {
  margin: 0 0 16px;
  font-size: 14px;
  line-height: 1.7;
  color: #666;
}

.coin-random__descriptions {
  margin-bottom: 24px;
}

.coin-random__text-highlight {
  font-size: 18px;
  font-weight: 600;
  color: #8b6914;
  letter-spacing: 2px;
}

.coin-random__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}
</style>
