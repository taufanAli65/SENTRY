<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4"
  >
    <Card class="w-full max-w-2xl shadow-xl border border-slate-200 dark:border-slate-700">
      <CardHeader class="text-center space-y-2">
        <div
          class="mx-auto w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center"
        >
          <UserPlus class="w-6 h-6 text-blue-600 dark:text-blue-400" />
        </div>
        <CardTitle class="text-2xl font-semibold tracking-tight">Register New User</CardTitle>
        <CardDescription class="text-slate-600 dark:text-slate-400">
          Fill in the details below to create a new user account
        </CardDescription>
      </CardHeader>

      <CardContent class="space-y-6">
        <form @submit.prevent="onSubmit" class="space-y-6">
          <!-- Photo Section -->
          <div class="space-y-4 flex flex-col items-center">
            <Label class="text-sm font-medium">Scan Photo</Label>
            <div class="flex flex-col items-center space-y-4">
              <!-- Camera/Preview Area -->
              <div
                class="relative w-full max-w-sm aspect-[4/3] bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden border-2 border-dashed border-slate-300 dark:border-slate-600"
              >
                <!-- Video Stream -->
                <video
                  v-if="showCamera && !preview"
                  ref="videoRef"
                  autoplay
                  playsinline
                  class="object-cover w-full h-full"
                ></video>

                <!-- Simple person silhouette guide -->
                <div
                  v-if="showCamera && !preview"
                  class="absolute inset-0 flex items-center justify-center pointer-events-none"
                >
                  <svg
                    class="w-full h-full opacity-20"
                    viewBox="0 0 300 400"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    preserveAspectRatio="xMidYMid meet"
                  >
                    <!-- Head: Dibesarkan dan diturunkan -->
                    <circle cx="150" cy="130" r="80" stroke="white" stroke-width="3" fill="none" />

                    <!-- Neck: Disesuaikan dengan posisi kepala baru -->
                    <path
                      d="M130 200 Q130 215 130 225 L170 225 Q170 215 170 200"
                      stroke="white"
                      stroke-width="3"
                      fill="none"
                    />

                    <!-- Shoulders/body: Bahu dilebarkan -->
                    <path
                      d="M130 225 Q100 235 70 250 Q50 270 45 290 L45 360 L255 360 L255 290 Q250 270 230 250 Q200 235 170 225"
                      stroke="white"
                      stroke-width="3"
                      fill="none"
                    />
                  </svg>
                </div>

                <!-- Image Preview -->
                <img
                  v-if="preview"
                  :src="preview"
                  alt="Preview"
                  class="object-cover w-full h-full"
                />

                <!-- Empty State -->
                <div
                  v-if="!showCamera && !preview"
                  class="flex flex-col items-center justify-center h-full text-slate-500 dark:text-slate-400"
                >
                  <Camera class="w-12 h-12 mb-2" />
                  <p class="text-sm">No photo selected</p>
                </div>

                <!-- Upload Button -->
                <Label
                  class="absolute bottom-3 right-3 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors rounded-full shadow-lg p-2 cursor-pointer border border-slate-200 dark:border-slate-600"
                >
                  <Input type="file" accept="image/*" @change="onFileChange" class="hidden" />
                  <Upload class="w-4 h-4 text-slate-600 dark:text-slate-300" />
                </Label>
              </div>

              <!-- Camera Controls -->
              <div class="flex gap-2">
                <Button
                  v-if="showCamera && !preview"
                  type="button"
                  @click="capturePhoto"
                  class="flex items-center gap-2"
                >
                  <Camera class="w-4 h-4" />
                  Capture Photo
                </Button>

                <Button
                  v-if="preview"
                  type="button"
                  variant="outline"
                  @click="resetPhoto"
                  class="flex items-center gap-2"
                >
                  <RotateCcw class="w-4 h-4" />
                  Retake
                </Button>

                <Button
                  v-if="!showCamera && !preview"
                  type="button"
                  variant="outline"
                  @click="startCamera"
                  class="flex items-center gap-2"
                >
                  <Camera class="w-4 h-4" />
                  Start Camera
                </Button>
              </div>
            </div>
          </div>

          <!-- Form Fields -->
          <div class="grid gap-4">
            <div class="space-y-2">
              <Label for="name">Full Name</Label>
              <div class="relative">
                <User class="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  id="name"
                  v-model="name"
                  placeholder="Enter full name"
                  class="pl-10"
                  required
                />
              </div>
            </div>

            <div class="space-y-2">
              <Label for="email">Email Address</Label>
              <div class="relative">
                <Mail class="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  id="email"
                  v-model="email"
                  type="email"
                  placeholder="Enter email address"
                  class="pl-10"
                  required
                />
              </div>
            </div>

            <div class="space-y-2">
              <Label for="role">Role</Label>
              <Select v-model="role" required>
                <SelectTrigger>
                  <SelectValue placeholder="Select user role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">
                    <div class="flex items-center gap-2">
                      <Shield class="w-4 h-4" />
                      Admin
                    </div>
                  </SelectItem>
                  <SelectItem value="employee">
                    <div class="flex items-center gap-2">
                      <Users class="w-4 h-4" />
                      Employee
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <!-- Submit Button -->
          <Button type="submit" class="w-full" :disabled="loading || !file">
            <Loader2 v-if="loading" class="w-4 h-4 mr-2 animate-spin" />
            <UserPlus v-else class="w-4 h-4 mr-2" />
            {{ loading ? 'Registering User...' : 'Register User' }}
          </Button>
        </form>

        <!-- Success Alert -->
        <Alert
          v-if="success"
          class="border-green-200 bg-green-50 text-green-800 dark:border-green-800 dark:bg-green-900/20 dark:text-green-300"
        >
          <CheckCircle class="h-4 w-4" />
          <AlertTitle>Registration Successful</AlertTitle>
          <AlertDescription>{{ success }}</AlertDescription>
        </Alert>

        <!-- Error Alert -->
        <Alert v-if="error" variant="destructive">
          <AlertCircle class="h-4 w-4" />
          <AlertTitle>Registration Failed</AlertTitle>
          <AlertDescription>{{ error }}</AlertDescription>
        </Alert>
      </CardContent>
    </Card>

    <!-- Photo Preview Modal -->
    <div
      v-if="showPreviewModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
    >
      <Card class="w-full max-w-md">
        <CardHeader>
          <CardTitle class="text-center">Photo Preview</CardTitle>
        </CardHeader>
        <CardContent class="space-y-4">
          <div class="aspect-[4/3] rounded-lg overflow-hidden">
            <img :src="preview" alt="Photo preview" class="object-cover w-full h-full" />
          </div>
          <div class="flex gap-2">
            <Button @click="usePhoto" class="flex-1">
              <Check class="w-4 h-4 mr-2" />
              Use This Photo
            </Button>
            <Button variant="outline" @click="retakePhoto" class="flex-1">
              <RotateCcw class="w-4 h-4 mr-2" />
              Retake
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  UserPlus,
  Camera,
  Upload,
  User,
  Mail,
  Shield,
  Users,
  RotateCcw,
  Loader2,
  CheckCircle,
  AlertCircle,
  Check,
} from 'lucide-vue-next'
import { registerUser } from '@/api/auth'

const name = ref('')
const email = ref('')
const role = ref('')
const file = ref<File | null>(null)
const preview = ref<string | null>(null)
const loading = ref(false)
const error = ref('')
const success = ref('')

const videoRef = ref<HTMLVideoElement | null>(null)
const showCamera = ref(false)
const showPreviewModal = ref(false)
let stream: MediaStream | null = null

async function startCamera() {
  stopCamera()
  try {
    stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'environment' },
    })
    showCamera.value = true
    await nextTick()
    if (videoRef.value) {
      videoRef.value.srcObject = stream
      videoRef.value.play()
    }
  } catch (e) {
    error.value = 'Unable to access camera'
    showCamera.value = false
  }
}

function stopCamera() {
  if (stream) {
    stream.getTracks().forEach((track) => track.stop())
    stream = null
  }
  if (videoRef.value) {
    videoRef.value.srcObject = null
  }
  showCamera.value = false
}

onMounted(() => {
  startCamera()
})

onBeforeUnmount(() => {
  stopCamera()
})

function capturePhoto() {
  if (!videoRef.value) return

  const canvas = document.createElement('canvas')
  canvas.width = videoRef.value.videoWidth
  canvas.height = videoRef.value.videoHeight
  const ctx = canvas.getContext('2d')

  if (ctx) {
    ctx.drawImage(videoRef.value, 0, 0, canvas.width, canvas.height)
    canvas.toBlob((blob) => {
      if (blob) {
        file.value = new File([blob], 'photo.jpg', { type: 'image/jpeg' })
        preview.value = URL.createObjectURL(blob)
        showPreviewModal.value = true
      }
    }, 'image/jpeg')
  }
}

function onFileChange(e: Event) {
  const target = e.target as HTMLInputElement
  if (target.files && target.files[0]) {
    file.value = target.files[0]
    preview.value = URL.createObjectURL(target.files[0])
    stopCamera()
  }
}

async function resetPhoto() {
  file.value = null
  preview.value = null
  await startCamera()
}

function usePhoto() {
  stopCamera()
  showPreviewModal.value = false
}

function retakePhoto() {
  file.value = null
  preview.value = null
  showPreviewModal.value = false
  startCamera()
}

async function onSubmit() {
  error.value = ''
  success.value = ''
  loading.value = true

  try {
    if (!file.value) {
      error.value = 'Profile photo is required'
      loading.value = false
      return
    }

    const formData = new FormData()
    formData.append('photo', file.value)
    formData.append('name', name.value)
    formData.append('email', email.value)
    formData.append('role', role.value)

    await registerUser(formData)

    success.value = 'User registered successfully! Registration email has been sent.'

    // Reset form
    name.value = ''
    email.value = ''
    role.value = ''
    file.value = null
    preview.value = null
    await startCamera()
  } catch (e: any) {
    error.value = e.response?.data?.message || 'Failed to register user'
  } finally {
    loading.value = false
  }
}
</script>
