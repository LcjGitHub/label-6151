<script setup lang="ts">
import type { Coin } from '@/types/coin'
import { useCompare } from '@/composables/useCompare'

defineProps<{
  coin: Coin
  compareMode?: boolean
}>()

const { isSelected, isFull, toggleCompare } = useCompare()

function handleCheckboxClick(e: Event, coin: Coin) {
  e.preventDefault()
  e.stopPropagation()
  const selected = isSelected(coin.id)
  if (!selected && isFull.value) {
    return
  }
  toggleCompare(coin)
}
</script>

<template>
  <div class="coin-card-wrapper">
    <router-link :to="`/coin/${coin.id}`" class="coin-card">
      <div class="coin-card__image">
        <el-image
          :src="coin.imageUrl"
          :alt="coin.name"
          fit="cover"
          lazy
          class="coin-card__img"
        >
          <template #placeholder>
            <div class="coin-card__placeholder">加载中…</div>
          </template>
          <template #error>
            <div class="coin-card__placeholder">暂无图片</div>
          </template>
        </el-image>
      </div>
      <div class="coin-card__body">
        <h3 class="coin-card__title">{{ coin.name }}</h3>
        <p class="coin-card__meta">
          <span class="coin-card__dynasty">{{ coin.dynasty }}</span>
          <span>{{ coin.obverse }}</span>
        </p>
        <p class="coin-card__info">{{ coin.diameter }}mm · {{ coin.material }}</p>
      </div>
    </router-link>

    <div
      v-if="compareMode"
      class="coin-card__compare"
      role="button"
      :aria-label="`将${coin.name}${isSelected(coin.id) ? '移出' : '加入'}对比`"
      :aria-pressed="isSelected(coin.id)"
      @click="handleCheckboxClick($event, coin)"
    >
      <el-checkbox
        :model-value="isSelected(coin.id)"
        :disabled="!isSelected(coin.id) && isFull"
        :aria-label="`${coin.name}加入对比勾选框`"
      />
      <span class="coin-card__compare-label">
        {{ isSelected(coin.id) ? '已加入' : '加入对比' }}
      </span>
    </div>
  </div>
</template>

<style scoped>
.coin-card-wrapper {
  position: relative;
}

.coin-card {
  display: block;
  border-radius: 8px;
  overflow: hidden;
  background: #fff;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  transition: transform 0.2s, box-shadow 0.2s;
  text-decoration: none;
  color: inherit;
}

.coin-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.coin-card__image {
  aspect-ratio: 1;
  overflow: hidden;
  background: #f5f0e8;
}

.coin-card__img {
  width: 100%;
  height: 100%;
}

.coin-card__placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  min-height: 160px;
  color: #999;
  font-size: 14px;
  background: #f5f0e8;
}

.coin-card__body {
  padding: 12px 16px 16px;
}

.coin-card__title {
  margin: 0 0 6px;
  font-size: 16px;
  font-weight: 600;
  color: #2c1810;
}

.coin-card__meta {
  margin: 0 0 4px;
  font-size: 13px;
  color: #666;
  display: flex;
  gap: 8px;
  align-items: center;
}

.coin-card__dynasty {
  display: inline-block;
  padding: 1px 8px;
  border-radius: 4px;
  background: #8b6914;
  color: #fff;
  font-size: 12px;
}

.coin-card__info {
  margin: 0;
  font-size: 12px;
  color: #999;
}

.coin-card__compare {
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 6px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.2s;
  backdrop-filter: blur(4px);
}

.coin-card__compare:hover {
  background: #fff;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
}

.coin-card__compare-label {
  font-size: 12px;
  color: #2c1810;
  white-space: nowrap;
}
</style>
