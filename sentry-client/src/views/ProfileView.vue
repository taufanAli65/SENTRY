<template>
  <div class="max-w-md mx-auto mt-10 bg-white dark:bg-background shadow-lg rounded-xl p-8">
    <h2 class="text-2xl font-bold mb-6 text-center">My Profile</h2>
    <div v-if="user" class="space-y-4">
      <div class="flex flex-col items-center">
        <img
          v-if="user.photoUrl"
          :src="`http://localhost:8000${user.photoUrl}`"
          alt="Profile Photo"
          class="w-24 h-24 rounded-full object-cover mb-2 border"
        />
        <span class="font-semibold text-lg">{{ user.name }}</span>
        <span class="text-gray-500">{{ user.email }}</span>
        <span class="text-sm px-2 py-1 rounded bg-blue-100 text-blue-700 mt-2">{{
          user.role
        }}</span>
      </div>
    </div>
    <div v-else class="text-center text-gray-500">Loading...</div>
    <div class="mt-8 text-center">
      <Button @click="router.push('/change-password')" class="w-full">Change Password</Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'
import { Button } from '@/components/ui/button'
import { useRouter } from 'vue-router'
import api from '@/api/axios'

const userStore = useUserStore()
const user = ref(userStore.user)
const router = useRouter()

onMounted(async () => {
  if (!user.value) {
    try {
      const res = await api.get('/api/user/profile')
      user.value = res.data.data
      userStore.setUser(res.data.data)
    } catch {
      user.value = null
    }
  }
})
</script>
