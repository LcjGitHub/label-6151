<script setup lang="ts">
import { computed, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { ArrowLeft, Delete, Close, InfoFilled } from '@element-plus/icons-vue'
import { useCompare, MAX_COMPARE_COUNT } from '@/composables/useCompare'
import { useCoinsQuery } from '@/composables/useCoinQueries'

const router = useRouter()
const { selectedCoins, removeFromCompare, clearCompare, count } = useCompare()

useCoinsQuery()

const comparisonFields = [
  { key: 'name', label: '名称' },
  { key: 'dynasty', label: '朝代' },
  { key: 'obverse', label: '面文' },
  { key: 'reverse', label: '背文' },
  { key: 'diameter', label: '直径' },
  { key: 'material', label: '材质' },
] as const

const displayCoins = computed(() => selectedCoins.value)

function handleRemove(id: string, name: string) {
  removeFromCompare(id)
  ElMessage.success(`已移除「${name}」`)
  if (displayCoins.value.length < 2) {
    setTimeout(() => {
      if (selectedCoins.value.length < 2) {
        router.push('/')
      }
    }, 1500)
  }
}

function handleClear() {
  clearCompare()
  ElMessage.success('已清空对比')
  router.push('/')
}

function formatFieldValue(key: string, coin: any) {
  if (key === 'diameter') {
    return `${coin[key]} mm`
  }
  return coin[key]
}

onMounted(() => {
  if (count.value < 2) {
    router.replace('/')
  }
})

watch(count, (newCount) => {
  if (newCount < 2) {
    setTimeout(() => {
      if (count.value < 2) {
        router.replace('/')
      }
    }, 1500)
  }
})
</script>

<template>
  <div class="coin-compare">
    <header class="coin-compare__header">
      <div class="coin-compare__header-left">
        <el-button plain @click="router.push('/')">
          <el-icon><ArrowLeft /></el-icon>
          <span>返回列表</span>
        </el-button>
        <div>
          <h1 class="coin-compare__title">形制对比</h1>
          <p class="coin-compare__subtitle">
            共 {{ displayCoins.length }} 枚钱币（最多 {{ MAX_COMPARE_COUNT }} 枚）
          </p>
        </div>
      </div>
      <div class="coin-compare__header-right">
        <el-button plain type="danger" @click="handleClear">
          <el-icon><Delete /></el-icon>
          <span>清空对比</span>
        </el-button>
      </div>
    </header>

    <el-empty
      v-if="displayCoins.length === 0"
      description="暂无对比数据，请从列表页选择钱币"
      class="coin-compare__empty"
    >
      <el-button type="primary" @click="router.push('/')">返回选择</el-button>
    </el-empty>

    <div v-else class="coin-compare__content">
      <div class="coin-compare__table-wrapper">
        <table class="coin-compare__table" aria-label="古钱币形制对比表">
          <thead>
            <tr>
              <th class="coin-compare__th coin-compare__th--field" scope="col">对比项</th>
              <th
                v-for="coin in displayCoins"
                :key="coin.id"
                class="coin-compare__th"
                scope="col"
              >
                <div class="coin-compare__col-header">
                  <el-image
                    :src="coin.imageUrl"
                    :alt="`${coin.name} 图片`"
                    fit="cover"
                    class="coin-compare__image"
                  />
                  <div class="coin-compare__col-name">{{ coin.name }}</div>
                  <button
                    type="button"
                    class="coin-compare__col-remove"
                    @click="handleRemove(coin.id, coin.name)"
                    :aria-label="`从对比中移除${coin.name}`"
                  >
                    <el-icon><Close /></el-icon>
                    <span>移除</span>
                  </button>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="field in comparisonFields"
              :key="field.key"
              class="coin-compare__row"
            >
              <th class="coin-compare__td coin-compare__td--field" scope="row">
                {{ field.label }}
              </th>
              <td
                v-for="coin in displayCoins"
                :key="`${coin.id}-${field.key}`"
                class="coin-compare__td"
              >
                <span class="coin-compare__value">
                  {{ formatFieldValue(field.key, coin) }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="coin-compare__tips" role="note">
        <el-icon><InfoFilled /></el-icon>
        <span>提示：点击「移除」可移出单项对比，不足两枚时将自动返回列表页</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.coin-compare {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px 20px 48px;
}

.coin-compare__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  padding: 20px 24px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  margin-bottom: 24px;
}

.coin-compare__header-left {
  display: flex;
  align-items: center;
  gap: 20px;
}

.coin-compare__title {
  margin: 0;
  font-size: 24px;
  font-weight: 600;
  color: #2c1810;
  letter-spacing: 2px;
}

.coin-compare__subtitle {
  margin: 4px 0 0;
  font-size: 13px;
  color: #888;
}

.coin-compare__header-right {
  flex-shrink: 0;
}

.coin-compare__empty {
  padding: 80px 0;
}

.coin-compare__content {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  overflow: hidden;
}

.coin-compare__table-wrapper {
  overflow-x: auto;
}

.coin-compare__table {
  width: 100%;
  border-collapse: collapse;
  min-width: 600px;
}

.coin-compare__th,
.coin-compare__td {
  padding: 16px 20px;
  text-align: center;
  border-bottom: 1px solid #f0ebe0;
  vertical-align: middle;
}

.coin-compare__th {
  background: #faf7f2;
  font-weight: 600;
  font-size: 14px;
  color: #2c1810;
}

.coin-compare__th--field {
  background: #f5f0e8;
  color: #8b6914;
  text-align: right;
  width: 120px;
  min-width: 120px;
}

.coin-compare__td--field {
  background: #faf7f2;
  color: #8b6914;
  font-weight: 600;
  text-align: right;
  width: 120px;
  min-width: 120px;
}

.coin-compare__row:last-child .coin-compare__td {
  border-bottom: none;
}

.coin-compare__col-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 8px 0;
}

.coin-compare__image {
  width: 80px;
  height: 80px;
  border-radius: 8px;
  background: #f5f0e8;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.coin-compare__col-name {
  font-size: 16px;
  font-weight: 600;
  color: #2c1810;
}

.coin-compare__col-remove {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 12px;
  border: 1px solid #e6c9c9;
  background: #fff;
  color: #d9534f;
  font-size: 12px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.coin-compare__col-remove:hover {
  background: #d9534f;
  border-color: #d9534f;
  color: #fff;
}

.coin-compare__value {
  font-size: 14px;
  color: #333;
  line-height: 1.6;
}

.coin-compare__tips {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 14px 24px;
  background: #fef9ec;
  border-top: 1px solid #f0ebe0;
  font-size: 13px;
  color: #8b6914;
}
</style>
