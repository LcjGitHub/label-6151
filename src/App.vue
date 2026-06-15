<script setup lang="ts">
import { RouterView } from 'vue-router'
import SearchBar from '@/components/SearchBar.vue'
</script>

<template>
  <div class="app">
    <SearchBar />
    <RouterView />
  </div>
</template>

<style>
*,
*::before,
*::after {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
  background: #faf7f2;
  color: #333;
  -webkit-font-smoothing: antialiased;
}

#app {
  min-height: 100vh;
}

.app {
  min-height: 100vh;
}
</style>
