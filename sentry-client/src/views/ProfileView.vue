<template>
  <div class="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min">
    <div class="p-6 space-y-6">
      <!-- Profile Header -->
      <div>
        <h2 class="text-3xl font-bold tracking-tight">Profile Settings</h2>
        <p class="text-muted-foreground">Manage your account settings and preferences</p>
      </div>

      <div class="grid gap-6 lg:grid-cols-3">
        <!-- Profile Information Card -->
        <div class="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle class="flex items-center gap-2">
                <User class="h-5 w-5" />
                Profile Information
              </CardTitle>
              <CardDescription>Your account details and role information</CardDescription>
            </CardHeader>
            <CardContent class="space-y-6">
              <div v-if="user" class="flex flex-col items-center text-center space-y-4">
                <!-- Profile Avatar -->
                <Avatar class="h-24 w-24">
                  <AvatarImage
                    v-if="user.photoUrl"
                    :src="`http://localhost:8000${user.photoUrl}`"
                    :alt="user.name"
                  />
                  <AvatarFallback class="text-lg">
                    {{ getInitials(user.name) }}
                  </AvatarFallback>
                </Avatar>

                <!-- User Details -->
                <div class="space-y-2">
                  <h3 class="text-xl font-semibold">{{ user.name }}</h3>
                  <p class="text-sm text-muted-foreground">{{ user.email }}</p>
                  <Badge :variant="getRoleVariant(user.role)" class="capitalize">
                    {{ user.role }}
                  </Badge>
                </div>
              </div>

              <div v-else class="flex items-center justify-center py-8">
                <div class="flex items-center gap-2 text-muted-foreground">
                  <Loader2 class="h-4 w-4 animate-spin" />
                  Loading profile...
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <!-- Settings Cards -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Security Settings -->
          <Card>
            <CardHeader>
              <CardTitle class="flex items-center gap-2">
                <Shield class="h-5 w-5" />
                Security Settings
              </CardTitle>
              <CardDescription>Manage your password and security preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs default-value="password" class="w-full">
                <TabsList class="grid w-full grid-cols-2">
                  <TabsTrigger value="password">Change Password</TabsTrigger>
                  <TabsTrigger value="security">Security Info</TabsTrigger>
                </TabsList>

                <TabsContent value="password" class="space-y-4">
                  <form @submit.prevent="onSubmitPassword" class="space-y-4">
                    <div class="space-y-2">
                      <Label for="current-password">Current Password</Label>
                      <div class="relative">
                        <Lock class="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="current-password"
                          v-model="oldPassword"
                          :type="showCurrentPassword ? 'text' : 'password'"
                          placeholder="Enter current password"
                          class="pl-10 pr-10"
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          class="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          @click="showCurrentPassword = !showCurrentPassword"
                        >
                          <Eye v-if="!showCurrentPassword" class="h-4 w-4" />
                          <EyeOff v-else class="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div class="space-y-2">
                      <Label for="new-password">New Password</Label>
                      <div class="relative">
                        <Lock class="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="new-password"
                          v-model="newPassword"
                          :type="showNewPassword ? 'text' : 'password'"
                          placeholder="Enter new password"
                          class="pl-10 pr-10"
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          class="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          @click="showNewPassword = !showNewPassword"
                        >
                          <Eye v-if="!showNewPassword" class="h-4 w-4" />
                          <EyeOff v-else class="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div class="space-y-2">
                      <Label for="confirm-password">Confirm New Password</Label>
                      <div class="relative">
                        <Lock class="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="confirm-password"
                          v-model="confirmPassword"
                          :type="showConfirmPassword ? 'text' : 'password'"
                          placeholder="Confirm new password"
                          class="pl-10 pr-10"
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          class="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          @click="showConfirmPassword = !showConfirmPassword"
                        >
                          <Eye v-if="!showConfirmPassword" class="h-4 w-4" />
                          <EyeOff v-else class="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <!-- Password Requirements -->
                    <div class="text-sm text-muted-foreground space-y-1">
                      <p class="font-medium">Password requirements:</p>
                      <ul class="space-y-1 ml-4">
                        <li class="flex items-center gap-2">
                          <div
                            :class="
                              newPassword.length >= 8 ? 'text-green-600' : 'text-muted-foreground'
                            "
                            class="w-1 h-1 rounded-full bg-current"
                          ></div>
                          At least 8 characters
                        </li>
                        <li class="flex items-center gap-2">
                          <div
                            :class="
                              /[A-Z]/.test(newPassword) ? 'text-green-600' : 'text-muted-foreground'
                            "
                            class="w-1 h-1 rounded-full bg-current"
                          ></div>
                          One uppercase letter
                        </li>
                        <li class="flex items-center gap-2">
                          <div
                            :class="
                              /[0-9]/.test(newPassword) ? 'text-green-600' : 'text-muted-foreground'
                            "
                            class="w-1 h-1 rounded-full bg-current"
                          ></div>
                          One number
                        </li>
                      </ul>
                    </div>

                    <Button type="submit" class="w-full" :disabled="loading || !isPasswordValid">
                      <Loader2 v-if="loading" class="w-4 h-4 mr-2 animate-spin" />
                      <Key v-else class="w-4 h-4 mr-2" />
                      {{ loading ? 'Updating Password...' : 'Update Password' }}
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="security" class="space-y-4">
                  <div class="space-y-4">
                    <div class="flex items-center justify-between p-4 border rounded-lg">
                      <div class="space-y-1">
                        <p class="font-medium">Two-Factor Authentication</p>
                        <p class="text-sm text-muted-foreground">
                          Add an extra layer of security to your account
                        </p>
                      </div>
                      <Badge variant="outline">Coming Soon</Badge>
                    </div>

                    <div class="flex items-center justify-between p-4 border rounded-lg">
                      <div class="space-y-1">
                        <p class="font-medium">Login Sessions</p>
                        <p class="text-sm text-muted-foreground">
                          Manage your active login sessions
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        <Monitor class="w-4 h-4 mr-2" />
                        View Sessions
                      </Button>
                    </div>

                    <div class="flex items-center justify-between p-4 border rounded-lg">
                      <div class="space-y-1">
                        <p class="font-medium">Account Activity</p>
                        <p class="text-sm text-muted-foreground">Review recent account activity</p>
                      </div>
                      <Button variant="outline" size="sm">
                        <Activity class="w-4 h-4 mr-2" />
                        View Activity
                      </Button>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>

      <!-- Success/Error Alerts -->
      <Alert
        v-if="message"
        class="border-green-200 bg-green-50 text-green-800 dark:border-green-800 dark:bg-green-900/20 dark:text-green-300"
      >
        <CheckCircle class="h-4 w-4" />
        <AlertTitle>Success</AlertTitle>
        <AlertDescription>{{ message }}</AlertDescription>
      </Alert>

      <Alert v-if="error" variant="destructive">
        <AlertCircle class="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{{ error }}</AlertDescription>
      </Alert>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useUserStore } from '@/stores/user'
import api from '@/api/axios'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import {
  User,
  Settings,
  Shield,
  Lock,
  Eye,
  EyeOff,
  Key,
  Loader2,
  CheckCircle,
  AlertCircle,
  Monitor,
  Activity,
} from 'lucide-vue-next'

const userStore = useUserStore()
const user = ref(userStore.user)

// Password form state
const oldPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const showCurrentPassword = ref(false)
const showNewPassword = ref(false)
const showConfirmPassword = ref(false)

// UI state
const error = ref('')
const message = ref('')
const loading = ref(false)

const isPasswordValid = computed(() => {
  return (
    newPassword.value.length >= 8 &&
    /[A-Z]/.test(newPassword.value) &&
    /[0-9]/.test(newPassword.value) &&
    newPassword.value === confirmPassword.value &&
    oldPassword.value.length > 0
  )
})

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

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
}

function getRoleVariant(role: string) {
  switch (role) {
    case 'owner':
      return 'destructive'
    case 'admin':
      return 'default'
    case 'employee':
      return 'secondary'
    default:
      return 'outline'
  }
}

async function onSubmitPassword() {
  error.value = ''
  message.value = ''

  if (newPassword.value !== confirmPassword.value) {
    error.value = 'New passwords do not match'
    return
  }

  loading.value = true

  try {
    await api.put('/api/auth/change-password', {
      old_password: oldPassword.value,
      new_password: newPassword.value,
    })

    message.value = 'Password updated successfully!'

    // Reset form
    oldPassword.value = ''
    newPassword.value = ''
    confirmPassword.value = ''
  } catch (e: any) {
    error.value = e.response?.data?.message || 'Failed to change password'
  } finally {
    loading.value = false
  }
}
</script>
