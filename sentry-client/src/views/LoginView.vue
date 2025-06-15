<template>
  <div class="min-h-screen flex">
    <!-- Left Side - Branding -->
    <div
      class="hidden lg:flex lg:flex-1 lg:flex-col lg:justify-center lg:px-12 xl:px-24 bg-slate-50 dark:bg-slate-900"
    >
      <div class="mx-auto w-full max-w-sm">
        <div class="flex items-center gap-3 mb-8">
          <div
            class="flex h-12 w-12 items-center justify-center rounded-lg bg-slate-900 dark:bg-slate-100"
          >
            <Shield class="h-6 w-6 text-white dark:text-slate-900" />
          </div>
          <div>
            <h1 class="text-2xl font-bold text-slate-900 dark:text-white">Data Sentry</h1>
          </div>
        </div>
        <div class="space-y-6">
          <div>
            <h2 class="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Secure Data Management Platform
            </h2>
            <p class="mt-4 text-lg text-slate-600 dark:text-slate-400">
              Monitor, analyze, and protect your data with enterprise-grade security and real-time
              insights.
            </p>
          </div>
          <div class="space-y-4">
            <div class="flex items-center gap-3">
              <div
                class="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30"
              >
                <div class="h-2 w-2 rounded-full bg-green-600 dark:bg-green-400" />
              </div>
              <span class="text-sm text-slate-600 dark:text-slate-400">Real-time monitoring</span>
            </div>
            <div class="flex items-center gap-3">
              <div
                class="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30"
              >
                <div class="h-2 w-2 rounded-full bg-blue-600 dark:bg-blue-400" />
              </div>
              <span class="text-sm text-slate-600 dark:text-slate-400">Advanced analytics</span>
            </div>
            <div class="flex items-center gap-3">
              <div
                class="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/30"
              >
                <div class="h-2 w-2 rounded-full bg-purple-600 dark:bg-purple-400" />
              </div>
              <span class="text-sm text-slate-600 dark:text-slate-400">Enterprise security</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Right Side - Login Form -->
    <div class="flex flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div class="mx-auto w-full max-w-sm">
        <!-- Mobile Branding -->
        <div class="flex items-center justify-center gap-3 mb-8 lg:hidden">
          <div
            class="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-900 dark:bg-slate-100"
          >
            <Shield class="h-5 w-5 text-white dark:text-slate-900" />
          </div>
          <h1 class="text-xl font-bold text-slate-900 dark:text-white">Data Sentry</h1>
        </div>

        <Card class="border-0 shadow-none lg:border lg:shadow-sm">
          <CardHeader class="space-y-1 pb-6">
            <CardTitle class="text-2xl font-semibold tracking-tight"
              >Login to your account</CardTitle
            >
            <CardDescription
              >Enter your email and password to access your dashboard</CardDescription
            >
          </CardHeader>

          <CardContent>
            <form @submit.prevent="handleSubmit" class="space-y-4">
              <div class="space-y-2">
                <Label for="email">Email</Label>
                <div class="relative">
                  <Mail class="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    id="email"
                    v-model="email"
                    type="email"
                    placeholder="Enter your email"
                    class="pl-10"
                    required
                  />
                </div>
              </div>

              <div class="space-y-2">
                <Label for="password">Password</Label>
                <div class="relative">
                  <Lock class="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    id="password"
                    v-model="password"
                    :type="showPassword ? 'text' : 'password'"
                    placeholder="Enter your password"
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

              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-2">
                  <Checkbox id="remember" v-model:checked="rememberMe" />
                  <Label for="remember" class="text-sm font-normal"> Remember me </Label>
                </div>
                <Button
                  type="button"
                  variant="link"
                  class="px-0 text-sm text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
                  @click="goToForgotPassword"
                >
                  Forgot password?
                </Button>
              </div>

              <Button type="submit" class="w-full" :disabled="isLoading">
                {{ isLoading ? 'Signing in...' : 'Sign in' }}
              </Button>
            </form>

            <!-- Error Alert -->
            <Alert v-if="error" variant="destructive" class="mt-4">
              <AlertCircle class="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{{ error }}</AlertDescription>
            </Alert>

            <!-- Success Alert -->
            <Alert
              v-if="success"
              class="mt-4 border-green-200 bg-green-50 text-green-800 dark:border-green-800 dark:bg-green-900/20 dark:text-green-300"
            >
              <CheckCircle class="h-4 w-4" />
              <AlertTitle>Success</AlertTitle>
              <AlertDescription>{{ success }}</AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Shield, Mail, Lock, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-vue-next'
import { login } from '@/api/auth'
import { useUserStore } from '@/stores/user'

const email = ref('')
const password = ref('')
const rememberMe = ref(false)
const showPassword = ref(false)
const isLoading = ref(false)
const error = ref('')
const success = ref('')

const router = useRouter()
const userStore = useUserStore()

async function handleSubmit() {
  error.value = ''
  success.value = ''
  isLoading.value = true

  try {
    await login(email.value, password.value)
    await userStore.fetchUser()
    // Redirect sesuai role
    if (userStore.user?.role === 'owner') {
      router.push('/owner')
    } else if (userStore.user?.role === 'admin') {
      router.push('/admin')
    } else if (userStore.user?.role === 'employee') {
      router.push('/employee')
    } else {
      router.push('/')
    }
  } catch (e: any) {
    error.value = e.response?.data?.message || 'Login failed'
  } finally {
    isLoading.value = false
  }
}

function goToForgotPassword() {
  router.push('/forgot-password')
}
</script>
