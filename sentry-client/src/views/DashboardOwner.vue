<template>
  <div class="flex flex-col items-center mt-10">
    <h1 class="text-2xl font-bold mb-4">Owner Dashboard</h1>
    <button
      @click="onLogout"
      class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition"
    >
      Logout
    </button>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '@/stores/user'
import { useRouter } from 'vue-router'

const store = useUserStore()
const router = useRouter()

async function onLogout() {
  await store.logoutUser()
  router.push('/login')
}
</script>
