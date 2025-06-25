<template>
  <div class="container mt-5 text-center">
    <h3 class="mb-4">Verifikasi Wajah</h3>

    <!-- Video di tengah -->
    <div class="d-flex justify-content-center">
      <video
        ref="videoRef"
        class="rounded shadow bg-black"
        autoplay
        muted
        width="400"
      ></video>
    </div>

    <!-- Loading text -->
    <div v-if="loading" class="mt-3 text-muted">
      <div class="spinner-border text-primary me-2" role="status"></div>
      Mendeteksi wajah...
    </div>

    <!-- Error -->
    <div v-if="errorMessage" class="alert alert-danger mt-3">
      {{ errorMessage }}
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const videoRef = ref(null)
const loading = ref(true)
const errorMessage = ref('')
const router = useRouter()

onMounted(() => {
  navigator.mediaDevices
    .getUserMedia({ video: true })
    .then((stream) => {
      videoRef.value.srcObject = stream
      simulateAutoRecognition()
    })
    .catch((err) => {
      errorMessage.value = 'Tidak dapat mengakses kamera: ' + err.message
      loading.value = false
    })
})

// Simulasi proses face recognition otomatis
const simulateAutoRecognition = () => {
  setTimeout(() => {
    const success = Math.random() > 0.2 // 80% kemungkinan berhasil
    loading.value = false

    if (success) {
      router.push({ path: '/employee', query: { status: 'success' } })
    } else {
      errorMessage.value = 'Wajah tidak dikenali. Silakan refresh dan coba lagi.'
    }
  }, 3000)
}
</script>

<style scoped>
video {
  border: 4px solid #007bff;
}
</style>
