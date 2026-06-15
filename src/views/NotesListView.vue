<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Delete, Edit, Notebook, View } from '@element-plus/icons-vue'
import dayjs from 'dayjs'
import PageHeader from '@/components/PageHeader.vue'
import { useCoinsQuery } from '@/composables/useCoinQueries'
import { useNotes, type CoinNote } from '@/composables/useNotes'
import type { Coin } from '@/types/coin'

const router = useRouter()
const { data: coins, isLoading, isError } = useCoinsQuery()
const { count, removeNote, clearNotes, getNotesWithCoins } = useNotes()

const editingCoinId = ref<string | null>(null)
const editingContent = ref('')

type NoteWithCoin = { coin: Coin; note: CoinNote }

const notesWithCoins = computed<NoteWithCoin[]>(() => {
  if (!coins.value) return []
  return getNotesWithCoins(coins.value)
})

const hasContent = computed(() => !isLoading.value && notesWithCoins.value.length > 0)

function handleRemove(coinId: string, coinName: string) {
  removeNote(coinId)
  ElMessage.success(`已删除「${coinName}」的笔记`)
}

async function handleClearAll() {
  if (count.value === 0) return
  try {
    await ElMessageBox.confirm('确定要清空所有笔记吗？此操作不可恢复。', '提示', {
      confirmButtonText: '确定清空',
      cancelButtonText: '取消',
      type: 'warning',
    })
    clearNotes()
    ElMessage.success('已清空所有笔记')
  } catch {
    // 用户取消
  }
}

function startEdit(item: NoteWithCoin) {
  editingCoinId.value = item.coin.id
  editingContent.value = item.note.content
}

function cancelEdit() {
  editingCoinId.value = null
  editingContent.value = ''
}

function saveEdit() {
  if (!editingCoinId.value) return
  const { saveNote } = useNotes()
  saveNote(editingCoinId.value, editingContent.value)
  ElMessage.success('笔记已更新')
  cancelEdit()
}

function goDetail(coinId: string) {
  router.push({ name: 'coin-detail', params: { id: coinId } })
}

function formatTime(timestamp: number): string {
  return dayjs(timestamp).format('YYYY-MM-DD HH:mm')
}
</script>

<template>
  <div class="notes-list">
    <PageHeader
      title="个人笔记"
      :subtitle="`共 ${count} 条笔记`"
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

    <div v-if="isLoading" class="notes-list__loading">
      <el-skeleton :rows="6" animated />
    </div>

    <el-result v-else-if="isError" icon="error" title="加载失败" sub-title="请刷新页面重试" />

    <el-empty v-else-if="notesWithCoins.length === 0" description="暂无笔记，快去浏览钱币并记录心得吧">
      <el-button type="primary" @click="router.push('/')"> 去浏览 </el-button>
    </el-empty>

    <div v-else class="notes-list__content">
      <div
        v-for="item in notesWithCoins"
        :key="item.coin.id"
        class="notes-list__item"
      >
        <div class="notes-list__coin-info">
          <router-link
            :to="`/coin/${item.coin.id}`"
            class="notes-list__coin-link"
          >
            <div class="notes-list__coin-thumb">
              <el-image
              :src="item.coin.imageUrl"
              :alt="item.coin.name"
              fit="cover"
              lazy
            >
              <template #placeholder>
                <div class="notes-list__placeholder">加载中…</div>
              </template>
              <template #error>
                <div class="notes-list__placeholder">暂无图片</div>
              </template>
            </el-image>
            </div>
            <div class="notes-list__coin-meta">
              <el-tag type="warning" effect="dark" size="small">
                {{ item.coin.dynasty }}
              </el-tag>
              <h3 class="notes-list__coin-name">{{ item.coin.name }}</h3>
              <p class="notes-list__coin-sub">{{ item.coin.obverse }} · {{ item.coin.material }}</p>
            </div>
          </router-link>
          <div class="notes-list__coin-actions">
            <el-button
              size="small"
            :icon="View"
            @click="goDetail(item.coin.id)"
          >
              查看钱币
            </el-button>
          </div>
        </div>

        <div class="notes-list__note-wrap">
          <div class="notes-list__note-header">
            <el-icon :size="16" color="#8b6914">
              <Notebook />
            </el-icon>
            <span class="notes-list__time">
              更新于 {{ formatTime(item.note.updatedAt) }}
            </span>
            <div class="notes-list__note-actions">
              <el-button
                v-if="editingCoinId !== item.coin.id"
                size="small"
              :icon="Edit"
              @click="startEdit(item)"
            >
                编辑
              </el-button>
              <el-button
                size="small"
              :icon="Delete"
                type="danger"
                plain
                @click="handleRemove(item.coin.id, item.coin.name)"
              >
                删除
              </el-button>
            </div>
          </div>

          <div v-if="editingCoinId === item.coin.id" class="notes-list__edit">
            <el-input
              v-model="editingContent"
              type="textarea"
              :rows="5"
              placeholder="在此输入笔记内容..."
              maxlength="2000"
              show-word-limit
              resize="vertical"
            />
            <div class="notes-list__edit-actions">
              <el-button type="primary" :disabled="!editingContent.trim()" @click="saveEdit">
                保存
              </el-button>
              <el-button @click="cancelEdit">取消</el-button>
            </div>
          </div>

          <div v-else class="notes-list__content-text">
            {{ item.note.content }}
          </div>
        </div>
      </div>
    </div>

    <footer v-if="hasContent" class="notes-list__footer">
      共 {{ notesWithCoins.length }} 条笔记
    </footer>
  </div>
</template>

<style scoped>
.notes-list {
  max-width: 960px;
  margin: 0 auto;
  padding: 24px 20px 48px;
}

.notes-list__loading {
  padding: 40px 0;
}

.notes-list__content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.notes-list__item {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}

.notes-list__coin-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 16px;
  border-bottom: 1px solid #f0ebe3;
  margin-bottom: 16px;
  gap: 16px;
}

.notes-list__coin-link {
  display: flex;
  align-items: center;
  gap: 14px;
  text-decoration: none;
  color: inherit;
  flex: 1;
  min-width: 0;
}

.notes-list__coin-thumb {
  flex-shrink: 0;
  width: 64px;
  height: 64px;
  border-radius: 8px;
  overflow: hidden;
  background: #f5f0e8;
}

.notes-list__coin-thumb :deep(.el-image) {
  width: 100%;
  height: 100%;
}

.notes-list__placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  color: #999;
  font-size: 12px;
  background: #f5f0e8;
}

.notes-list__coin-meta {
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
}

.notes-list__coin-name {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #2c1810;
}

.notes-list__coin-sub {
  margin: 0;
  font-size: 13px;
  color: #999;
}

.notes-list__coin-actions {
  flex-shrink: 0;
}

.notes-list__note-wrap {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.notes-list__note-header {
  display: flex;
  align-items: center;
  gap: 8px;
}

.notes-list__time {
  flex: 1;
  font-size: 12px;
  color: #999;
}

.notes-list__note-actions {
  display: flex;
  gap: 8px;
}

.notes-list__content-text {
  padding: 14px 16px;
  background: #faf7f2;
  border-radius: 8px;
  line-height: 1.8;
  color: #333;
  font-size: 14px;
  white-space: pre-wrap;
  word-break: break-all;
}

.notes-list__edit {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.notes-list__edit-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.notes-list__footer {
  margin-top: 32px;
  text-align: center;
  font-size: 13px;
  color: #aaa;
}
</style>
