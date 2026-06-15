<script setup lang="ts">
import { Search } from '@element-plus/icons-vue'

interface Props {
  dynasties?: string[]
  selectedDynasty: string
  keyword: string
  showDynastyFilter?: boolean
  showKeywordSearch?: boolean
}

withDefaults(defineProps<Props>(), {
  showDynastyFilter: true,
  showKeywordSearch: true,
})

const emit = defineEmits<{
  (e: 'update:selectedDynasty', value: string): void
  (e: 'update:keyword', value: string): void
}>()

function handleDynastyChange(val: string) {
  emit('update:selectedDynasty', val)
}

function handleKeywordInput(val: string) {
  emit('update:keyword', val)
}
</script>

<template>
  <div class="filter-bar" role="group" aria-label="钱币筛选">
    <div v-if="showKeywordSearch" class="filter-bar__row filter-bar__row--search">
      <span id="keyword-filter-label" class="filter-bar__label">关键词搜索：</span>
      <el-input
        :model-value="keyword"
        placeholder="输入名称、面文或背文…"
        clearable
        :prefix-icon="Search"
        class="filter-bar__search-input"
        aria-labelledby="keyword-filter-label"
        @update:model-value="handleKeywordInput"
      />
    </div>

    <div v-if="showDynastyFilter" class="filter-bar__row">
      <span id="dynasty-filter-label" class="filter-bar__label">朝代筛选：</span>
      <el-radio-group
        :model-value="selectedDynasty"
        size="default"
        aria-labelledby="dynasty-filter-label"
        @update:model-value="handleDynastyChange"
      >
        <el-radio-button label="">全部</el-radio-button>
        <el-radio-button v-for="dynasty in dynasties" :key="dynasty" :label="dynasty">
          {{ dynasty }}
        </el-radio-button>
      </el-radio-group>
    </div>
  </div>
</template>

<style scoped>
.filter-bar {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.06);
}

.filter-bar__row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
}

.filter-bar__row--search {
  padding-bottom: 12px;
  border-bottom: 1px dashed #eee;
}

.filter-bar__label {
  font-size: 14px;
  color: #666;
  white-space: nowrap;
  flex-shrink: 0;
}

.filter-bar__search-input {
  flex: 1;
  min-width: 240px;
  max-width: 480px;
}

.filter-bar__search-input :deep(.el-input__wrapper) {
  border-radius: 8px;
}
</style>
