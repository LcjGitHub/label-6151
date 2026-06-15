<script setup lang="ts">
import { computed, toRef } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Star, StarFilled, ArrowLeft, ArrowRight } from '@element-plus/icons-vue'
import dayjs from 'dayjs'
import SimilarCoins from '@/components/SimilarCoins.vue'
import PageHeader from '@/components/PageHeader.vue'
import { useCoinDetailQuery, useSimilarCoinsQuery, useSameMaterialCoinsQuery, useAdjacentCoinsQuery } from '@/composables/useCoinQueries'
import { useFavorites } from '@/composables/useFavorites'

const props = defineProps<{
  id: string
}>()

const router = useRouter()
const idRef = toRef(props, 'id')

const { data: coin, isLoading, isError } = useCoinDetailQuery(idRef)
const coinRef = computed(() => coin.value)
const { data: similarCoins, isLoading: similarLoading } = useSimilarCoinsQuery(coinRef)
const { data: sameMaterialCoins, isLoading: sameMaterialLoading } = useSameMaterialCoinsQuery(coinRef)
const { data: adjacentIds, isLoading: adjacentLoading } = useAdjacentCoinsQuery(idRef)

const { isFavorite, toggleFavorite } = useFavorites()

const isFavorited = computed(() => (coin.value ? isFavorite(coin.value.id) : false))

const hasPrev = computed(() => adjacentLoading.value || adjacentIds.value?.prevId != null)
const hasNext = computed(() => adjacentLoading.value || adjacentIds.value?.nextId != null)

/**
 * 导航到上一枚钱币
 */
function goPrev() {
  const prevId = adjacentIds.value?.prevId
  if (prevId) router.push({ name: 'coin-detail', params: { id: prevId } })
}

/**
 * 导航到下一枚钱币
 */
function goNext() {
  const nextId = adjacentIds.value?.nextId
  if (nextId) router.push({ name: 'coin-detail', params: { id: nextId } })
}

/**
 * 切换当前钱币的收藏状态
 */
function handleToggleFavorite() {
  if (!coin.value) return
  const favorited = toggleFavorite(coin.value)
  ElMessage.success(favorited ? '已添加到收藏' : '已取消收藏')
}

/**
 * 格式化铸造年份显示
 * @param mintYear - 原始年份字符串
 */
function formatMintYear(mintYear?: string): string {
  if (!mintYear) return '不详'
  return mintYear
}

/** 页面加载时间（演示 dayjs 使用） */
const pageLoadedAt = dayjs().format('YYYY-MM-DD HH:mm')
</script>

<template>
  <div class="coin-detail">
    <PageHeader layout="left" show-back show-timeline>
      <el-button text :icon="ArrowLeft" :disabled="!hasPrev" aria-label="上一枚钱币" @click="goPrev">
        上一枚
      </el-button>
      <el-button text :icon="ArrowRight" :disabled="!hasNext" aria-label="下一枚钱币" @click="goNext">
        下一枚
      </el-button>
    </PageHeader>

    <div v-if="isLoading" class="coin-detail__loading">
      <el-skeleton :rows="8" animated />
    </div>

    <el-result
      v-else-if="isError || !coin"
      icon="warning"
      title="未找到该钱币"
      sub-title="请返回列表重新选择"
    >
      <template #extra>
        <el-button type="primary" @click="router.push('/')">返回列表</el-button>
      </template>
    </el-result>

    <template v-else>
      <div class="coin-detail__main">
        <div class="coin-detail__image-wrap">
          <el-image
            :src="coin.imageUrl"
            :alt="coin.name"
            fit="contain"
            lazy
            class="coin-detail__image"
            :preview-src-list="[coin.imageUrl]"
          >
            <template #placeholder>
              <div class="coin-detail__placeholder">加载中…</div>
            </template>
            <template #error>
              <div class="coin-detail__placeholder">暂无图片</div>
            </template>
          </el-image>
        </div>

        <div class="coin-detail__info">
          <el-tag type="warning" effect="dark" class="coin-detail__dynasty">
            {{ coin.dynasty }}
          </el-tag>
          <h1 class="coin-detail__title">{{ coin.name }}</h1>
          <p class="coin-detail__desc">{{ coin.description }}</p>

          <div class="coin-detail__actions">
            <el-button
              type="primary"
              :icon="isFavorited ? StarFilled : Star"
              @click="handleToggleFavorite"
            >
              {{ isFavorited ? '已收藏' : '收藏' }}
            </el-button>
          </div>

          <el-descriptions :column="1" border class="coin-detail__descriptions">
            <el-descriptions-item label="面文">
              <span class="coin-detail__text-highlight">{{ coin.obverse }}</span>
            </el-descriptions-item>
            <el-descriptions-item label="背文">
              <span class="coin-detail__text-highlight">{{ coin.reverse }}</span>
            </el-descriptions-item>
            <el-descriptions-item label="直径">
              {{ coin.diameter }} mm
            </el-descriptions-item>
            <el-descriptions-item label="材质">
              {{ coin.material }}
            </el-descriptions-item>
            <el-descriptions-item label="铸造年份">
              {{ formatMintYear(coin.mintYear) }}
            </el-descriptions-item>
          </el-descriptions>

          <p class="coin-detail__loaded-at">浏览时间：{{ pageLoadedAt }}</p>
        </div>
      </div>

      <SimilarCoins
        :coins="similarCoins ?? []"
        :loading="similarLoading"
        title="同朝代推荐"
        subtitle="同朝代形制参考"
        heading-id="recommend-same-dynasty"
      />

      <SimilarCoins
        :coins="sameMaterialCoins ?? []"
        :loading="sameMaterialLoading"
        title="同材质推荐"
        subtitle="相同材质钱币参考"
        heading-id="recommend-same-material"
      />
    </template>
  </div>
</template>

<style scoped>
.coin-detail {
  max-width: 960px;
  margin: 0 auto;
  padding: 24px 20px 48px;
}

.coin-detail__loading {
  padding: 40px 0;
}

.coin-detail__main {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  align-items: start;
}

@media (max-width: 768px) {
  .coin-detail__main {
    grid-template-columns: 1fr;
  }
}

.coin-detail__image-wrap {
  background: #f5f0e8;
  border-radius: 12px;
  overflow: hidden;
  aspect-ratio: 1;
}

.coin-detail__image {
  width: 100%;
  height: 100%;
}

.coin-detail__placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  min-height: 300px;
  color: #999;
  background: #f5f0e8;
}

.coin-detail__dynasty {
  margin-bottom: 12px;
}

.coin-detail__title {
  margin: 0 0 12px;
  font-size: 26px;
  color: #2c1810;
}

.coin-detail__desc {
  margin: 0 0 16px;
  font-size: 14px;
  line-height: 1.7;
  color: #666;
}

.coin-detail__actions {
  margin-bottom: 20px;
}

.coin-detail__descriptions {
  margin-bottom: 16px;
}

.coin-detail__text-highlight {
  font-size: 18px;
  font-weight: 600;
  color: #8b6914;
  letter-spacing: 2px;
}

.coin-detail__loaded-at {
  margin: 0;
  font-size: 12px;
  color: #ccc;
}
</style>
