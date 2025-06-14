<script setup lang="ts">
import Navbar from '@/components/Navbar.vue'
</script>

<template>
  <div class="min-h-screen flex flex-col bg-gray-50 dark:bg-background">
    <Navbar />
    <RouterView />
  </div>
</template>
