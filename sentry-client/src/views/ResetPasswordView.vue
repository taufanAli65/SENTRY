<template>
  <div class="min-h-screen flex items-center justify-center bg-muted">
    <form
      @submit.prevent="onSubmit"
      class="bg-white dark:bg-background shadow-lg rounded-xl p-8 w-full max-w-sm space-y-6"
    >
      <h1 class="text-2xl font-bold text-center mb-2">Reset Password</h1>
      <div class="space-y-4">
        <Input
          v-model="password"
          placeholder="New Password"
          type="password"
          required
          class="w-full"
        />
      </div>
      <Button type="submit" class="w-full" :disabled="loading">
        {{ loading ? 'Resetting...' : 'Reset Password' }}
      </Button>
      <div v-if="message" class="text-green-600 text-center text-sm mt-2">{{ message }}</div>
      <div v-if="error" class="text-red-500 text-center text-sm mt-2">{{ error }}</div>
      <div class="text-center mt-4">
        <Button variant="link" @click="router.push('/login')" class="text-blue-600"
          >Back to Login</Button
        >
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { resetPassword } from '@/api/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const password = ref('')
const error = ref('')
const message = ref('')
const loading = ref(false)
const route = useRoute()
const router = useRouter()

async function onSubmit() {
  error.value = ''
  message.value = ''
  loading.value = true
  try {
    const token = route.params.token as string
    await resetPassword(token, password.value)
    message.value = 'Password successfully reset. You can now login.'
    password.value = ''
  } catch (e: any) {
    error.value = e.response?.data?.message || 'Failed to reset password'
  } finally {
    loading.value = false
  }
}
</script>
