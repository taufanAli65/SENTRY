<template>
  <div class="container mt-5">
    <h3 class="mb-3">Welcome, {{ userName }}</h3>

    <!-- Tombol scan -->
    <div class="d-flex gap-3 mb-4">
      <button class="btn btn-outline-success" @click="openScanner('in')">Scan IN</button>
      <button class="btn btn-outline-danger" @click="openScanner('out')">Scan OUT</button>
    </div>

    <!-- Scanner Modal -->
    <div v-if="scannerVisible" class="modal-overlay">
      <div class="modal-content">
        <h5>Scanning ({{ scanMode.toUpperCase() }})</h5>

        <!-- Kamera -->
        <StreamBarcodeReader
          @decode="onBarcodeDetected"
          @error="onScanError"
          class="w-100"
        />

        <!-- Upload File -->
        <div class="mt-4">
          <label class="form-label fw-bold">Or Upload Barcode Image</label>
          <ImageBarcodeReader
            accept="image/*"
            class="form-control"
            @decode="onBarcodeDetected"
            @error="onScanError"
          />
        </div>

        <button class="btn btn-secondary mt-3" @click="closeScanner">Close</button>
        <p v-if="scanMessage" :class="`alert alert-${scanMessageType}`">{{ scanMessage }}</p>
      </div>
    </div>

    <!-- Hasil Scan -->
    <div class="card mt-4 shadow">
      <div class="card-body">
        <h5>Recent Scanned Items</h5>
        <div v-if="scannedItems.length === 0" class="text-muted">No items scanned yet.</div>
        <div v-else class="row">
          <div
            class="col-md-4 mb-3"
            v-for="item in scannedItems"
            :key="item.item_code + item.time"
          >
            <div class="card shadow-sm">
              <img :src="item.photo_url" class="card-img-top" />
              <div class="card-body">
                <h5 class="card-title d-flex justify-content-between">
                  {{ item.name }}
                  <span
                    class="badge"
                    :class="item.scanType === 'in' ? 'bg-success' : 'bg-danger'"
                  >
                    {{ item.scanType.toUpperCase() }}
                  </span>
                </h5>
                <p class="card-text">
                  <strong>Code:</strong> {{ item.item_code }}<br />
                  <strong>Weight:</strong> {{ item.weight }} kg<br />
                  <strong>Category:</strong> {{ item.category }}<br />
                  <small class="text-muted">Time: {{ item.time }}</small>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import {
  StreamBarcodeReader,
  ImageBarcodeReader,
} from '@teckel/vue-barcode-reader'
import api from '@/api/axios'
import { useUserStore } from '@/stores/user'
import { scanItemIn, scanItemOut } from '@/api/auth' // fungsi POST & PUT

/* ------------------------------------------------------------------ */
/* State & helper                                                     */
/* ------------------------------------------------------------------ */
const scanMode = ref('in')
const scannerVisible = ref(false)
const scannedItems = ref([])
const scanMessage = ref('')
const scanMessageType = ref('success')

const userStore = useUserStore()
const userName = userStore.user?.name || 'Employee'

function openScanner(mode) {
  scanMode.value = mode
  scannerVisible.value = true
  scanMessage.value = ''
}

function closeScanner() {
  scannerVisible.value = false
}

/* ------------------------------------------------------------------ */
/* Core logic: onBarcodeDetected                                       */
/* ------------------------------------------------------------------ */
async function onBarcodeDetected(code) {
  const item_code = code.trim()
  const user_id = userStore.user?.id
  if (!user_id) return showScanMessage('User not found. Please re-login.', 'danger')

  try {
    /* 1. Ambil detail item */
    const itemRes = await api.get(`/api/items/code/${item_code}`)
    const item = itemRes.data.data

    if (scanMode.value === 'in') {
      /* 2A. SCAN IN: simpan ke DB */
      const { data: scan } = await scanItemIn(user_id, item._id)

      scannedItems.value.unshift({
        ...item,
        scanType: 'in',
        scanId: scan.id,
        time: new Date().toLocaleString(),
      })
      showScanMessage('Item scanned IN successfully.', 'success')
    } else {
      /* 2B. SCAN OUT: cari Scan IN terakhir di DB */
      let scanInId
      try {
        const res = await api.get(`/api/scan/in/${item_code}`)
        scanInId = res.data.data._id
      } catch {
        return showScanMessage('Scan IN required before OUT.', 'warning')
      }

      await scanItemOut(scanInId)
      scannedItems.value.unshift({
        ...item,
        scanType: 'out',
        time: new Date().toLocaleString(),
      })
      showScanMessage('Item scanned OUT successfully.', 'success')
    }
  } catch (err) {
    const msg = err?.response?.data?.message || err.message
    showScanMessage(`Failed to scan: ${msg}`, 'danger')
  }
}

function onScanError(err) {
  showScanMessage(`Scan Error: ${err}`, 'danger')
}

function showScanMessage(msg, type = 'info') {
  scanMessage.value = msg
  scanMessageType.value = type
  setTimeout(() => (scanMessage.value = ''), 4000)
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1050;
}
.modal-content {
  background: white;
  padding: 30px;
  border-radius: 10px;
  text-align: center;
  max-width: 500px;
  width: 90%;
}
.card-img-top {
  height: 180px;
  object-fit: cover;
}
</style>
