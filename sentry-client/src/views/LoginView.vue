<template>
  <div class="min-h-screen flex items-center justify-center bg-muted">
    <form
      @submit.prevent="onLogin"
      class="bg-white dark:bg-background shadow-lg rounded-xl p-8 w-full max-w-sm space-y-6"
    >
      <h1 class="text-2xl font-bold text-center mb-2">Login</h1>
      <div class="space-y-4">
        <Input v-model="email" placeholder="Email" type="email" required class="w-full" />
        <Input v-model="password" placeholder="Password" type="password" required class="w-full" />
      </div>
      <Button type="submit" class="w-full">Login</Button>
      <div v-if="error" class="text-red-500 text-center text-sm mt-2">{{ error }}</div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { login } from '../api/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const email = ref('')
const password = ref('')
const error = ref('')
const router = useRouter()
const userStore = useUserStore()

async function onLogin() {
  error.value = ''
  try {
    const res = await login(email.value, password.value)
    userStore.setUser(res.data.data)
    // Redirect sesuai role
    if (res.data.data.role === 'owner') router.push('/owner')
    else if (res.data.data.role === 'admin') router.push('/admin')
    else router.push('/employee')
  } catch (e: any) {
    error.value = e.response?.data?.message || 'Login failed'
  }
}
</script>
