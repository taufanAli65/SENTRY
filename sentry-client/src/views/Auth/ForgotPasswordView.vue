<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4"
  >
    <div class="w-full max-w-md">
      <Card class="shadow-xl border border-slate-200 dark:border-slate-700">
        <CardHeader class="text-center space-y-4">
          <!-- Icon -->
          <div
            class="mx-auto w-14 h-14 bg-white dark:bg-slate-900 rounded-full flex items-center justify-center border-2 border-slate-400 dark:border-slate-600 shadow-md dark:shadow-slate-900/30 transition-all"
            style="box-shadow: 0 4px 16px 0 rgba(100, 116, 139, 0.1)"
          >
            <KeyRound class="w-7 h-7 text-slate-600 dark:text-slate-300 drop-shadow" />
          </div>

          <div class="space-y-2">
            <CardTitle class="text-2xl font-semibold tracking-tight">Forgot Password</CardTitle>
            <CardDescription class="text-slate-600 dark:text-slate-400">
              Enter your email address and we'll send you a link to reset your password
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent class="space-y-6">
          <form @submit.prevent="onSubmit" class="space-y-4">
            <div class="space-y-2">
              <Label for="email">Email Address</Label>
              <div class="relative">
                <Mail class="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  id="email"
                  v-model="email"
                  type="email"
                  placeholder="Enter your email address"
                  class="pl-10"
                  required
                />
              </div>
            </div>

            <Button type="submit" class="w-full" :disabled="loading">
              <Loader2 v-if="loading" class="w-4 h-4 mr-2 animate-spin" />
              <Send v-else class="w-4 h-4 mr-2" />
              {{ loading ? 'Sending...' : 'Send Reset Link' }}
            </Button>
          </form>

          <!-- Success Alert -->
          <Alert
            v-if="message"
            class="border-green-200 bg-green-50 text-green-800 dark:border-green-800 dark:bg-green-900/20 dark:text-green-300"
          >
            <CheckCircle class="h-4 w-4" />
            <AlertTitle>Email Sent</AlertTitle>
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
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { forgotPassword } from '@/api/auth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { KeyRound, Mail, Send, Loader2, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-vue-next'

const email = ref('')
const error = ref('')
const message = ref('')
const loading = ref(false)
const router = useRouter()

async function onSubmit() {
  error.value = ''
  message.value = ''
  loading.value = true
  try {
    await forgotPassword(email.value)
    message.value = 'Reset instructions sent to your email.'
    email.value = ''
  } catch (e: any) {
    error.value = e.response?.data?.message || 'Failed to send reset email'
  } finally {
    loading.value = false
  }
}

function goToLogin() {
  router.push('/login')
}
</script>
