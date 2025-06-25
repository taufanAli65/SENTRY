<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4"
  >
    <div class="w-full max-w-md">
      <Card class="shadow-xl border border-slate-200 dark:border-slate-700">
        <CardHeader class="text-center space-y-4">
          <!-- Icon -->
          <div
            class="mx-auto w-12 h-12 bg-white dark:bg-slate-900 rounded-full flex items-center justify-center border-2 border-slate-400 dark:border-slate-600 shadow-md dark:shadow-slate-900/30 transition-all"
            style="box-shadow: 0 4px 16px 0 rgba(100, 116, 139, 0.1)"
          >
            <Shield class="w-6 h-6 text-slate-600 dark:text-slate-300 drop-shadow" />
          </div>

          <div class="space-y-2">
            <CardTitle class="text-2xl font-semibold tracking-tight">Reset Password</CardTitle>
            <CardDescription class="text-slate-600 dark:text-slate-400">
              Enter your new password below to reset your account password
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent class="space-y-6">
          <form @submit.prevent="onSubmit" class="space-y-4">
            <div class="space-y-2">
              <Label for="password">New Password</Label>
              <div class="relative">
                <Lock class="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  id="password"
                  v-model="password"
                  :type="showPassword ? 'text' : 'password'"
                  placeholder="Enter your new password"
                  class="pl-10 pr-10"
                  required
                />
                <button
                  type="button"
                  @click="showPassword = !showPassword"
                  class="absolute right-3 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                >
                  <EyeOff v-if="showPassword" class="h-4 w-4" />
                  <Eye v-else class="h-4 w-4" />
                </button>
              </div>
            </div>

            <div class="space-y-2">
              <Label for="confirmPassword">Confirm New Password</Label>
              <div class="relative">
                <Lock class="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  id="confirmPassword"
                  v-model="confirmPassword"
                  :type="showConfirmPassword ? 'text' : 'password'"
                  placeholder="Confirm your new password"
                  class="pl-10 pr-10"
                  required
                />
                <button
                  type="button"
                  @click="showConfirmPassword = !showConfirmPassword"
                  class="absolute right-3 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                >
                  <EyeOff v-if="showConfirmPassword" class="h-4 w-4" />
                  <Eye v-else class="h-4 w-4" />
                </button>
              </div>
            </div>

            <!-- Password Requirements -->
            <div class="text-sm text-slate-600 dark:text-slate-400 space-y-1">
              <p class="font-medium">Password requirements:</p>
              <ul class="space-y-1 ml-4">
                <li class="flex items-center gap-2">
                  <div
                    :class="password.length >= 8 ? 'text-green-600' : 'text-slate-400'"
                    class="w-1 h-1 rounded-full bg-current"
                  ></div>
                  At least 8 characters
                </li>
                <li class="flex items-center gap-2">
                  <div
                    :class="/[A-Z]/.test(password) ? 'text-green-600' : 'text-slate-400'"
                    class="w-1 h-1 rounded-full bg-current"
                  ></div>
                  One uppercase letter
                </li>
                <li class="flex items-center gap-2">
                  <div
                    :class="/[0-9]/.test(password) ? 'text-green-600' : 'text-slate-400'"
                    class="w-1 h-1 rounded-full bg-current"
                  ></div>
                  One number
                </li>
              </ul>
            </div>

            <Button type="submit" class="w-full" :disabled="loading || !isPasswordValid">
              <Loader2 v-if="loading" class="w-4 h-4 mr-2 animate-spin" />
              <Key v-else class="w-4 h-4 mr-2" />
              {{ loading ? 'Resetting...' : 'Reset Password' }}
            </Button>
          </form>

          <!-- Success Alert -->
          <Alert
            v-if="message"
            class="border-green-200 bg-green-50 text-green-800 dark:border-green-800 dark:bg-green-900/20 dark:text-green-300"
          >
            <CheckCircle class="h-4 w-4" />
            <AlertTitle>Password Reset Successful</AlertTitle>
            <AlertDescription>{{ message }}</AlertDescription>
          </Alert>

          <!-- Error Alert -->
          <Alert v-if="error" variant="destructive">
            <AlertCircle class="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{{ error }}</AlertDescription>
          </Alert>

          <!-- Back to Login -->
          <div class="text-center pt-4 border-t border-slate-200 dark:border-slate-700">
            <Button
              variant="ghost"
              @click="goToLogin"
              class="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
            >
              <ArrowLeft class="w-4 h-4 mr-2" />
              Back to Login
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { resetPassword } from '@/api/auth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import {
  Shield,
  Lock,
  Eye,
  EyeOff,
  Key,
  Loader2,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
} from 'lucide-vue-next'

const password = ref('')
const confirmPassword = ref('')
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const error = ref('')
const message = ref('')
const loading = ref(false)
const route = useRoute()
const router = useRouter()

const isPasswordValid = computed(() => {
  return (
    password.value.length >= 8 &&
    /[A-Z]/.test(password.value) &&
    /[0-9]/.test(password.value) &&
    password.value === confirmPassword.value
  )
})

async function onSubmit() {
  error.value = ''
  message.value = ''
  if (password.value !== confirmPassword.value) {
    error.value = 'Passwords do not match'
    return
  }
  loading.value = true
  try {
    const token = route.params.token as string
    await resetPassword(token, password.value)
    message.value =
      'Your password has been successfully reset. You can now login with your new password.'
    password.value = ''
    confirmPassword.value = ''
    setTimeout(() => {
      goToLogin()
    }, 3000)
  } catch (e: any) {
    error.value = e.response?.data?.message || 'Failed to reset password. Please try again.'
  } finally {
    loading.value = false
  }
}

function goToLogin() {
  console.log('Navigate to login')
  router.push('/login')
}
</script>
