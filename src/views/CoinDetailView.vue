<script setup lang="ts">
import { computed, ref, toRef, watch } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Star, StarFilled, ArrowLeft, ArrowRight, Notebook, Edit } from '@element-plus/icons-vue'
import dayjs from 'dayjs'
import SimilarCoins from '@/components/SimilarCoins.vue'
import PageHeader from '@/components/PageHeader.vue'
import {
  useCoinDetailQuery,
  useSimilarCoinsQuery,
  useSameMaterialCoinsQuery,
  useAdjacentCoinsQuery,
} from '@/composables/useCoinQueries'
import { useFavorites } from '@/composables/useFavorites'
import { useRecentViews } from '@/composables/useRecentViews'
import { useNotes } from '@/composables/useNotes'

const props = defineProps<{
  id: string
}>()

const router = useRouter()
const idRef = toRef(props, 'id')

const { data: coin, isLoading, isError } = useCoinDetailQuery(idRef)
const coinRef = computed(() => coin.value)
const { data: similarCoins, isLoading: similarLoading } = useSimilarCoinsQuery(coinRef)
const { data: sameMaterialCoins, isLoading: sameMaterialLoading } =
  useSameMaterialCoinsQuery(coinRef)
const { data: adjacentIds, isLoading: adjacentLoading } = useAdjacentCoinsQuery(idRef)

const { isFavorite, toggleFavorite } = useFavorites()
const { addView } = useRecentViews()
const { getNote, hasNote, saveNote } = useNotes()

const isFavorited = computed(() => (coin.value ? isFavorite(coin.value.id) : false))

const currentNote = computed(() => (coin.value ? getNote(coin.value.id) : undefined))
const hasCurrentNote = computed(() => (coin.value ? hasNote(coin.value.id) : false))

const noteDialogVisible = ref(false)
const noteContent = ref('')

watch(
  () => coin.value,
  (newCoin) => {
    if (newCoin) {
      addView(newCoin.id)
    }
  },
  { immediate: true },
)

const hasPrev = computed(() => adjacentLoading.value || adjacentIds.value?.prevId != null)
const hasNext = computed(() => adjacentLoading.value || adjacentIds.value?.nextId != null)

function goPrev() {
  const prevId = adjacentIds.value?.prevId
  if (prevId) router.push({ name: 'coin-detail', params: { id: prevId } })
}

function goNext() {
  const nextId = adjacentIds.value?.nextId
  if (nextId) router.push({ name: 'coin-detail', params: { id: nextId } })
}

function handleToggleFavorite() {
  if (!coin.value) return
  const favorited = toggleFavorite(coin.value)
  ElMessage.success(favorited ? '已添加到收藏' : '已取消收藏')
}

function openNoteDialog() {
  noteContent.value = currentNote.value?.content || ''
  noteDialogVisible.value = true
}

function handleSaveNote() {
  if (!coin.value) return
  const trimmed = noteContent.value.trim()
  if (!trimmed) {
    ElMessage.warning('笔记内容不能为空')
    return
  }
  saveNote(coin.value.id, trimmed)
  ElMessage.success(hasCurrentNote.value ? '笔记已更新' : '笔记已保存')
  noteDialogVisible.value = false
}

function goNotesList() {
  router.push('/notes')
}

function formatMintYear(mintYear?: string): string {
  if (!mintYear) return '不详'
  return mintYear
}

function formatTime(timestamp: number): string {
  return dayjs(timestamp).format('YYYY-MM-DD HH:mm')
}

function getNoteSummary(content: string, maxLen = 80): string {
  const trimmed = content.trim()
  if (trimmed.length <= maxLen) return trimmed
  return trimmed.slice(0, maxLen) + '…'
}

const pageLoadedAt = dayjs().format('YYYY-MM-DD HH:mm')
</script>

<template>
  <div class="coin-detail">
    <PageHeader layout="left" show-back show-timeline show-recent-views show-notes>
      <template #extra>
        <el-button
          text
          :icon="ArrowLeft"
          :disabled="!hasPrev"
          aria-label="上一枚钱币"
          @click="goPrev"
        >
          上一枚
        </el-button>
        <el-button
          text
          :icon="ArrowRight"
          :disabled="!hasNext"
          aria-label="下一枚钱币"
          @click="goNext"
        >
          下一枚
        </el-button>
      </template>
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
            <el-button
              type="warning"
              plain
              :icon="hasCurrentNote ? Edit : Notebook"
              @click="openNoteDialog"
            >
              {{ hasCurrentNote ? '编辑笔记' : '添加笔记' }}
            </el-button>
          </div>

          <div v-if="hasCurrentNote && currentNote" class="coin-detail__note-card">
            <div class="coin-detail__note-header">
              <el-icon :size="16" color="#8b6914">
                <Notebook />
              </el-icon>
              <span class="coin-detail__note-title">我的笔记</span>
              <span class="coin-detail__note-time">
                更新于 {{ formatTime(currentNote.updatedAt) }}
              </span>
              <div class="coin-detail__note-actions">
                <el-button size="small" :icon="Edit" text @click="openNoteDialog">
                  编辑
                </el-button>
                <el-button size="small" text type="primary" @click="goNotesList">
                  全部笔记
                </el-button>
              </div>
            </div>
            <div class="coin-detail__note-content">
              {{ getNoteSummary(currentNote.content) }}
            </div>
            <div v-if="currentNote.content.length > 80" class="coin-detail__note-expand">
              <el-button text size="small" @click="openNoteDialog">
                查看完整内容 →
              </el-button>
            </div>
          </div>

          <el-descriptions :column="1" border class="coin-detail__descriptions">
            <el-descriptions-item label="面文">
              <span class="coin-detail__text-highlight">{{ coin.obverse }}</span>
            </el-descriptions-item>
            <el-descriptions-item label="背文">
              <span class="coin-detail__text-highlight">{{ coin.reverse }}</span>
            </el-descriptions-item>
            <el-descriptions-item label="直径"> {{ coin.diameter }} mm </el-descriptions-item>
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

    <el-dialog
      v-model="noteDialogVisible"
      :title="hasCurrentNote ? '编辑笔记' : '添加笔记'"
      width="520px"
      :close-on-click-modal="false"
      destroy-on-close
    >
      <div class="coin-detail__dialog-coin">
        <el-tag type="warning" effect="dark" size="small">{{ coin?.dynasty }}</el-tag>
        <span class="coin-detail__dialog-coin-name">{{ coin?.name }}</span>
      </div>
      <el-input
        v-model="noteContent"
        type="textarea"
        :rows="8"
        placeholder="记录你对这枚钱币的心得、研究、收藏故事……"
        maxlength="2000"
        show-word-limit
        resize="vertical"
      />
      <template #footer>
        <el-button @click="noteDialogVisible = false">取消</el-button>
        <el-button type="primary" :disabled="!noteContent.trim()" @click="handleSaveNote">
          保存
        </el-button>
      </template>
    </el-dialog>
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
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.coin-detail__note-card {
  margin-bottom: 20px;
  padding: 16px;
  background: #faf7f2;
  border-radius: 10px;
  border: 1px solid #f0ebe3;
}

.coin-detail__note-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
}

.coin-detail__note-title {
  font-size: 14px;
  font-weight: 600;
  color: #2c1810;
}

.coin-detail__note-time {
  flex: 1;
  font-size: 12px;
  color: #999;
}

.coin-detail__note-actions {
  display: flex;
  gap: 4px;
}

.coin-detail__note-content {
  font-size: 14px;
  line-height: 1.7;
  color: #333;
  white-space: pre-wrap;
  word-break: break-all;
  padding: 4px 0;
}

.coin-detail__note-expand {
  margin-top: 6px;
}

.coin-detail__dialog-coin {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
  padding: 10px 14px;
  background: #f5f0e8;
  border-radius: 8px;
}

.coin-detail__dialog-coin-name {
  font-size: 15px;
  font-weight: 600;
  color: #2c1810;
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
