<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Close } from '@element-plus/icons-vue'
import { useCompare, MAX_COMPARE_COUNT } from '@/composables/useCompare'

const router = useRouter()
const { count, selectedCoins, isFull, removeFromCompare, clearCompare } = useCompare()

function handleClear() {
  clearCompare()
}

function handleGoCompare() {
  if (count.value < 2) {
    ElMessage.warning('请至少选择两枚钱币进行对比')
    return
  }
  router.push('/compare')
}
</script>

<template>
  <div v-if="count > 0" class="compare-bar">
    <div class="compare-bar__content">
      <div class="compare-bar__left">
        <div class="compare-bar__info">
          <span class="compare-bar__label">已选对比</span>
          <span class="compare-bar__count" :class="{ full: isFull }">
            {{ count }} / {{ MAX_COMPARE_COUNT }}
          </span>
        </div>

        <div class="compare-bar__coins">
          <div
            v-for="coin in selectedCoins"
            :key="coin.id"
            class="compare-bar__item"
          >
            <el-image
              :src="coin.imageUrl"
              :alt="coin.name"
              fit="cover"
              class="compare-bar__thumb"
            />
            <span class="compare-bar__name">{{ coin.name }}</span>
            <button
              type="button"
              class="compare-bar__remove"
              @click.stop="removeFromCompare(coin.id)"
              :aria-label="`从对比中移除${coin.name}`"
              title="移除"
            >
              <el-icon><Close /></el-icon>
            </button>
          </div>
        </div>
      </div>

      <div class="compare-bar__actions">
        <el-button plain type="danger" :disabled="count === 0" @click="handleClear">
          清空
        </el-button>
        <el-button
          type="primary"
          :disabled="count < 2"
          @click="handleGoCompare"
        >
          去对比
        </el-button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.compare-bar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 100;
  background: #fff;
  border-top: 1px solid #e8e0d0;
  box-shadow: 0 -2px 16px rgba(0, 0, 0, 0.08);
  padding: 12px 20px calc(12px + env(safe-area-inset-bottom));
}

.compare-bar__content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}

.compare-bar__left {
  display: flex;
  align-items: center;
  gap: 20px;
  flex: 1;
  min-width: 0;
}

.compare-bar__info {
  display: flex;
  align-items: baseline;
  gap: 6px;
  white-space: nowrap;
}

.compare-bar__label {
  font-size: 13px;
  color: #666;
}

.compare-bar__count {
  font-size: 16px;
  font-weight: 600;
  color: #8b6914;
}

.compare-bar__count.full {
  color: #d9534f;
}

.compare-bar__coins {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  min-width: 0;
  overflow-x: auto;
}

.compare-bar__item {
  position: relative;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 8px 4px 4px;
  background: #faf7f2;
  border-radius: 6px;
  border: 1px solid #e8e0d0;
  flex-shrink: 0;
  transition: border-color 0.2s;
}

.compare-bar__item:hover {
  border-color: #8b6914;
}

.compare-bar__thumb {
  width: 36px;
  height: 36px;
  border-radius: 4px;
  flex-shrink: 0;
  background: #f5f0e8;
}

.compare-bar__name {
  font-size: 13px;
  color: #2c1810;
  max-width: 80px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.compare-bar__remove {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  padding: 0;
  border: none;
  background: rgba(0, 0, 0, 0.06);
  border-radius: 50%;
  cursor: pointer;
  color: #999;
  font-size: 12px;
  line-height: 1;
  transition: all 0.2s;
}

.compare-bar__remove:hover {
  background: #d9534f;
  color: #fff;
}

.compare-bar__actions {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
}
</style>
