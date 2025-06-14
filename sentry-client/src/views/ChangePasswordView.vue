<template>
  <div class="max-w-md mx-auto mt-10 bg-white dark:bg-background shadow-lg rounded-xl p-8">
    <h2 class="text-2xl font-bold mb-6 text-center">Change Password</h2>
    <form @submit.prevent="onSubmit" class="space-y-4">
      <Input
        v-model="oldPassword"
        type="password"
        placeholder="Current Password"
        required
        class="w-full"
      />
      <Input
        v-model="newPassword"
        type="password"
        placeholder="New Password"
        required
        class="w-full"
      />
      <Button type="submit" class="w-full" :disabled="loading">
        {{ loading ? 'Changing...' : 'Change Password' }}
      </Button>
      <div v-if="message" class="text-green-600 text-center text-sm mt-2">{{ message }}</div>
      <div v-if="error" class="text-red-500 text-center text-sm mt-2">{{ error }}</div>
      <div class="text-center mt-4">
        <Button variant="link" @click="router.push('/profile')" class="text-blue-600"
          >Back to Profile</Button
        >
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import api from '@/api/axios'

const oldPassword = ref('')
const newPassword = ref('')
const error = ref('')
const message = ref('')
const loading = ref(false)
const router = useRouter()

async function onSubmit() {
  error.value = ''
  message.value = ''
  loading.value = true
  try {
    await api.put('/api/auth/change-password', {
      old_password: oldPassword.value,
      new_password: newPassword.value,
    })
    message.value = 'Password changed successfully.'
    oldPassword.value = ''
    newPassword.value = ''
  } catch (e: any) {
    error.value = e.response?.data?.message || 'Failed to change password'
  } finally {
    loading.value = false
  }
}
</script>
