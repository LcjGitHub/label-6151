<script setup lang="ts">
import { useRouter } from 'vue-router'
import { DataLine, StarFilled, Timer, ArrowLeft, Clock, Guide, Notebook } from '@element-plus/icons-vue'
import { useFavorites } from '@/composables/useFavorites'
import { useRecentViews } from '@/composables/useRecentViews'
import { useNotes } from '@/composables/useNotes'

interface Props {
  title?: string
  subtitle?: string
  showBack?: boolean
  showTimeline?: boolean
  showFavorites?: boolean
  showStatistics?: boolean
  showRecentViews?: boolean
  showRandom?: boolean
  showNotes?: boolean
  variant?: 'card' | 'plain'
  layout?: 'center' | 'split' | 'left'
  favoriteBadgeCount?: number
  recentViewsBadgeCount?: number
}

const props = withDefaults(defineProps<Props>(), {
  showBack: false,
  showTimeline: false,
  showFavorites: false,
  showStatistics: false,
  showRecentViews: false,
  showRandom: false,
  showNotes: false,
  variant: 'plain',
  layout: 'center',
})

const router = useRouter()
const { count: defaultFavoriteCount } = useFavorites()
const { count: defaultRecentViewsCount } = useRecentViews()
const { count: defaultNotesCount } = useNotes()

const favoriteCount = () =>
  props.favoriteBadgeCount !== undefined ? props.favoriteBadgeCount : defaultFavoriteCount.value

const recentViewsCount = () =>
  props.recentViewsBadgeCount !== undefined
    ? props.recentViewsBadgeCount
    : defaultRecentViewsCount.value

const notesCount = () => defaultNotesCount.value

function goBack() {
  router.push('/')
}

function goTimeline() {
  router.push('/timeline')
}

function goFavorites() {
  router.push('/favorites')
}

function goRecentViews() {
  router.push('/recent-views')
}

function goStatistics() {
  router.push('/statistics')
}

function goRandom() {
  router.push('/random')
}

function goNotes() {
  router.push('/notes')
}
</script>

<template>
  <header
    class="page-header"
    :class="{
      'page-header--card': variant === 'card',
      'page-header--split': layout === 'split',
      'page-header--center': layout === 'center',
      'page-header--left': layout === 'left',
    }"
  >
    <template v-if="layout === 'center'">
      <div class="page-header__top">
        <div v-if="showBack" class="page-header__back">
          <el-button type="primary" plain :icon="ArrowLeft" @click="goBack"> 返回列表 </el-button>
        </div>
        <div class="page-header__title-wrap">
          <slot name="title">
            <h1 v-if="title" class="page-header__title">{{ title }}</h1>
          </slot>
          <slot name="subtitle">
            <p v-if="subtitle" class="page-header__subtitle">{{ subtitle }}</p>
          </slot>
        </div>
        <div class="page-header__actions">
          <el-button v-if="showTimeline" type="primary" plain :icon="Timer" @click="goTimeline">
            朝代年表
          </el-button>
          <el-button
            v-if="showStatistics"
            type="primary"
            plain
            :icon="DataLine"
            @click="goStatistics"
          >
            统计概览
          </el-button>
          <el-button
            v-if="showRandom"
            type="primary"
            plain
            :icon="Guide"
            @click="goRandom"
          >
            随机发现
          </el-button>
          <el-button
            v-if="showFavorites"
            type="primary"
            plain
            :icon="StarFilled"
            @click="goFavorites"
          >
            我的收藏
            <el-badge
              v-if="favoriteCount() > 0"
              :value="favoriteCount()"
              :max="99"
              class="page-header__badge"
            />
          </el-button>
          <el-button
            v-if="showRecentViews"
            type="primary"
            plain
            :icon="Clock"
            @click="goRecentViews"
          >
            最近浏览
            <el-badge
              v-if="recentViewsCount() > 0"
              :value="recentViewsCount()"
              :max="99"
              class="page-header__badge"
            />
          </el-button>
          <el-button
            v-if="showNotes"
            type="primary"
            plain
            :icon="Notebook"
            @click="goNotes"
          >
            个人笔记
            <el-badge
              v-if="notesCount() > 0"
              :value="notesCount()"
              :max="99"
              class="page-header__badge"
            />
          </el-button>
          <slot name="extra-actions" />
        </div>
      </div>
    </template>

    <template v-else-if="layout === 'left'">
      <div class="page-header__left-nav">
        <slot name="default">
          <el-button v-if="showBack" text @click="goBack"> ← 返回列表 </el-button>
          <el-button v-if="showTimeline" type="primary" plain :icon="Timer" @click="goTimeline">
            朝代年表
          </el-button>
          <el-button
            v-if="showRandom"
            type="primary"
            plain
            :icon="Guide"
            @click="goRandom"
          >
            随机发现
          </el-button>
          <el-button
            v-if="showRecentViews"
            type="primary"
            plain
            :icon="Clock"
            @click="goRecentViews"
          >
            最近浏览
            <el-badge
              v-if="recentViewsCount() > 0"
              :value="recentViewsCount()"
              :max="99"
              class="page-header__badge"
            />
          </el-button>
          <el-button
            v-if="showNotes"
            type="primary"
            plain
            :icon="Notebook"
            @click="goNotes"
          >
            个人笔记
            <el-badge
              v-if="notesCount() > 0"
              :value="notesCount()"
              :max="99"
              class="page-header__badge"
            />
          </el-button>
          <slot name="extra" />
        </slot>
      </div>
    </template>

    <template v-else>
      <div class="page-header__inner">
        <div class="page-header__back">
          <slot name="left">
            <el-button v-if="showBack" text @click="goBack"> ← 返回列表 </el-button>
          </slot>
        </div>
        <div class="page-header__title-area">
          <slot name="title">
            <h1 v-if="title" class="page-header__title">{{ title }}</h1>
          </slot>
          <slot name="subtitle">
            <p v-if="subtitle" class="page-header__subtitle">{{ subtitle }}</p>
          </slot>
        </div>
        <div class="page-header__actions">
          <el-button v-if="showTimeline" type="primary" plain :icon="Timer" @click="goTimeline">
            朝代年表
          </el-button>
          <el-button
            v-if="showStatistics"
            type="primary"
            plain
            :icon="DataLine"
            @click="goStatistics"
          >
            统计概览
          </el-button>
          <el-button
            v-if="showRandom"
            type="primary"
            plain
            :icon="Guide"
            @click="goRandom"
          >
            随机发现
          </el-button>
          <el-button
            v-if="showFavorites"
            type="primary"
            plain
            :icon="StarFilled"
            @click="goFavorites"
          >
            我的收藏
          </el-button>
          <el-button
            v-if="showRecentViews"
            type="primary"
            plain
            :icon="Clock"
            @click="goRecentViews"
          >
            最近浏览
            <el-badge
              v-if="recentViewsCount() > 0"
              :value="recentViewsCount()"
              :max="99"
              class="page-header__badge"
            />
          </el-button>
          <el-button
            v-if="showNotes"
            type="primary"
            plain
            :icon="Notebook"
            @click="goNotes"
          >
            个人笔记
            <el-badge
              v-if="notesCount() > 0"
              :value="notesCount()"
              :max="99"
              class="page-header__badge"
            />
          </el-button>
          <slot name="right" />
        </div>
      </div>
    </template>
  </header>
</template>

<style scoped>
.page-header {
  margin-bottom: 32px;
}

.page-header--card {
  margin-bottom: 24px;
  padding: 20px 24px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.06);
}

.page-header--center {
  text-align: center;
}

.page-header--center .page-header__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.page-header--center .page-header__back {
  flex-shrink: 0;
  width: 120px;
  display: flex;
  justify-content: flex-start;
}

.page-header--center .page-header__title-wrap {
  flex: 1;
  text-align: center;
}

.page-header--center .page-header__actions {
  flex-shrink: 0;
  width: auto;
  display: flex;
  align-items: center;
  gap: 12px;
  justify-content: flex-end;
}

.page-header--split .page-header__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}

.page-header--split .page-header__back {
  flex-shrink: 0;
}

.page-header--split .page-header__title-area {
  flex: 1;
  text-align: center;
}

.page-header--split .page-header__actions {
  flex-shrink: 0;
  display: flex;
  gap: 12px;
}

.page-header__title {
  margin: 0;
  font-size: 28px;
  color: #2c1810;
  letter-spacing: 2px;
}

.page-header--card .page-header__title {
  margin: 0 0 4px;
  font-size: 22px;
}

.page-header__subtitle {
  margin: 0;
  font-size: 14px;
  color: #888;
}

.page-header__subtitle em {
  font-style: normal;
  color: #8b6914;
}

.page-header--card .page-header__subtitle {
  font-size: 13px;
}

.page-header--left {
  text-align: left;
}

.page-header--left .page-header__left-nav {
  display: flex;
  gap: 12px;
}

.page-header__badge {
  margin-left: 6px;
}
</style>
