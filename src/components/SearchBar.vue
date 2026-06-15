<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Search } from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()
const keyword = ref('')

if (route.name === 'search' && route.query.q) {
  keyword.value = route.query.q as string
}

function handleSearch() {
  const q = keyword.value.trim()
  if (!q) return
  router.push({ name: 'search', query: { q } })
}
</script>

<template>
  <div class="search-bar">
    <div class="search-bar__inner">
      <el-input
        v-model="keyword"
        placeholder="搜索钱币名称、面文、背文…"
        clearable
        :prefix-icon="Search"
        @keyup.enter="handleSearch"
        @clear="handleSearch"
      >
        <template #append>
          <el-button :icon="Search" @click="handleSearch">搜索</el-button>
        </template>
      </el-input>
    </div>
  </div>
</template>

<style scoped>
.search-bar {
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgba(250, 247, 242, 0.95);
  backdrop-filter: blur(8px);
  border-bottom: 1px solid rgba(139, 105, 20, 0.1);
  padding: 12px 20px;
}

.search-bar__inner {
  max-width: 1200px;
  margin: 0 auto;
}

.search-bar :deep(.el-input__wrapper) {
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.search-bar :deep(.el-input-group__append) {
  background: #8b6914;
  color: #fff;
  border-color: #8b6914;
  border-radius: 0 8px 8px 0;
  padding: 0 16px;
}

.search-bar :deep(.el-input-group__append .el-button) {
  color: #fff;
}

.search-bar :deep(.el-input-group__append .el-button:hover) {
  color: #f5e6c8;
}
</style>
