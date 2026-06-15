<script setup lang="ts">
import { computed } from 'vue'
import CoinCard from '@/components/CoinCard.vue'
import type { Coin } from '@/types/coin'

const props = withDefaults(defineProps<{
  coins: Coin[]
  loading?: boolean
  title?: string
  subtitle?: string
  emptyDescription?: string
  headingId?: string
}>(), {
  title: '相似形制推荐',
  subtitle: '同朝代形制参考',
  emptyDescription: '暂无相似形制',
  headingId: '',
})

const resolvedHeadingId = computed(() => {
  if (props.headingId) return props.headingId
  return `heading-${props.title.replace(/\s+/g, '-')}`
})

const shouldRender = computed(() => props.loading || props.coins.length > 0)
</script>

<template>
  <section
    v-if="shouldRender"
    class="similar-coins"
    :aria-labelledby="resolvedHeadingId"
  >
    <h2 :id="resolvedHeadingId" class="similar-coins__title">{{ title }}</h2>
    <p class="similar-coins__subtitle">{{ subtitle }}</p>

    <div v-if="loading" class="similar-coins__loading">
      <el-skeleton :rows="3" animated />
    </div>

    <div v-else class="similar-coins__grid">
      <CoinCard v-for="coin in coins" :key="coin.id" :coin="coin" />
    </div>
  </section>
</template>

<style scoped>
.similar-coins {
  margin-top: 40px;
  padding-top: 32px;
  border-top: 1px solid #e8e0d0;
}

.similar-coins__title {
  margin: 0 0 4px;
  font-size: 20px;
  color: #2c1810;
}

.similar-coins__subtitle {
  margin: 0 0 20px;
  font-size: 14px;
  color: #999;
}

.similar-coins__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
}

.similar-coins__loading {
  padding: 20px 0;
}
</style>
