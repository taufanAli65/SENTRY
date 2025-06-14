<template>
  <div class="min-h-screen flex items-center justify-center bg-muted">
    <form
      @submit.prevent="onSubmit"
      class="bg-white dark:bg-background shadow-xl rounded-2xl p-8 w-full max-w-lg space-y-8"
      enctype="multipart/form-data"
    >
      <h1 class="text-3xl font-bold text-center mb-4 tracking-tight">Register User</h1>
      <div class="space-y-6">
        <div class="relative flex flex-col items-center">
          <div
            class="w-full max-w-md aspect-[4/3] bg-gray-200 rounded-2xl overflow-hidden flex items-center justify-center mb-2 relative shadow"
          >
            <video
              v-if="showCamera && !preview"
              ref="videoRef"
              autoplay
              playsinline
              class="object-cover w-full h-full"
            ></video>
            <img v-if="preview" :src="preview" alt="Preview" class="object-cover w-full h-full" />
            <!-- Tombol upload file di kanan bawah pakai lucide-vue-next -->
            <label
              class="absolute bottom-3 right-3 bg-white/80 hover:bg-white transition rounded-full shadow p-2 cursor-pointer border border-gray-200"
            >
              <Input type="file" accept="image/*" @change="onFileChange" class="hidden" />
              <CameraIcon class="w-6 h-6 text-gray-700" />
            </label>
          </div>
          <div class="flex gap-3 mt-2">
            <Button
              v-if="showCamera && !preview"
              type="button"
              size="lg"
              class="bg-primary text-white font-semibold px-6 py-2 rounded-lg shadow"
              @click="capturePhoto"
              >Ambil Foto</Button
            >
            <Button
              v-if="preview"
              type="button"
              variant="secondary"
              size="lg"
              class="font-semibold px-6 py-2 rounded-lg shadow"
              @click="resetPhoto"
              >Ulangi Foto</Button
            >
          </div>
        </div>
        <div class="grid grid-cols-1 gap-4">
          <Input v-model="name" placeholder="Name" required class="w-full" />
          <Input v-model="email" placeholder="Email" type="email" required class="w-full" />
          <Select v-model="role">
            <SelectTrigger class="w-full">
              <span>{{ roleLabel }}</span>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="employee">Employee</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <Button type="submit" class="w-full mt-4" size="lg" :disabled="loading">
        {{ loading ? 'Registering...' : 'Register' }}
      </Button>
      <div v-if="success" class="text-green-600 text-center text-sm mt-2">{{ success }}</div>
      <div v-if="error" class="text-red-500 text-center text-sm mt-2">{{ error }}</div>
    </form>
    <!-- Modal Preview Foto -->
    <div
      v-if="showPreviewModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
    >
      <div
        class="bg-white dark:bg-background rounded-2xl shadow-xl p-6 max-w-md w-full flex flex-col items-center"
      >
        <img
          :src="preview"
          alt="Preview"
          class="rounded-xl object-cover w-full aspect-[4/3] mb-4"
        />
        <div class="flex gap-4 mt-2 w-full">
          <Button class="flex-1" @click="usePhoto">Gunakan Foto Ini</Button>
          <Button class="flex-1" variant="secondary" @click="ulangFoto">Ulangi Foto</Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed, nextTick } from 'vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { registerUser } from '@/api/auth'
import { Select, SelectTrigger, SelectContent, SelectItem } from '@/components/ui/select'
import { CameraIcon } from 'lucide-vue-next'

const name = ref('')
const email = ref('')
const role = ref('')
const file = ref<File | null>(null)
const preview = ref<string | null>(null)
const loading = ref(false)
const error = ref('')
const success = ref('')

const videoRef = ref<HTMLVideoElement | null>(null)
const showCamera = ref(true)
const showPreviewModal = ref(false)
let stream: MediaStream | null = null

const roleLabel = computed(() => {
  if (role.value === 'admin') return 'Admin'
  if (role.value === 'employee') return 'Employee'
  return 'Select Role'
})

async function startCamera() {
  stopCamera()
  try {
    stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
    showCamera.value = true
    await nextTick()
    if (videoRef.value) {
      videoRef.value.srcObject = null
      videoRef.value.srcObject = stream
      videoRef.value.play()
    }
  } catch (e) {
    error.value = 'Tidak dapat mengakses kamera'
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

async function onSubmit() {
  error.value = ''
  success.value = ''
  loading.value = true
  try {
    if (!file.value) {
      error.value = 'Photo is required'
      loading.value = false
      return
    }
    const formData = new FormData()
    formData.append('photo', file.value)
    formData.append('name', name.value)
    formData.append('email', email.value)
    formData.append('role', role.value)
    await registerUser(formData)
    success.value = 'User registered successfully! Email registration sent.'
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

function usePhoto() {
  stopCamera()
  showPreviewModal.value = false
}
function ulangFoto() {
  file.value = null
  preview.value = null
  showPreviewModal.value = false
  startCamera()
}
</script>
