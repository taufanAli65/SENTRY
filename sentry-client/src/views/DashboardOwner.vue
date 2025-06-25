<template>
  <div class="container mt-5">
    <h3 class="mb-3">Welcome, {{ userName }}</h3>

    <!-- Toggle -->
    <div class="mb-3">
      <button
        class="btn me-2"
        :class="chartMode === 'daily' ? 'btn-primary' : 'btn-outline-primary'"
        @click="setChartMode('daily')"
      >
        Per Hari
      </button>
      <button
        class="btn"
        :class="chartMode === 'hourly' ? 'btn-primary' : 'btn-outline-primary'"
        @click="setChartMode('hourly')"
      >
        Per Jam
      </button>
    </div>

    <!-- Grafik -->
    <div class="row mb-5">
      <div class="col-12">
        <canvas ref="scanChart" style="max-height: 400px;"></canvas>
      </div>
    </div>

    <!-- Riwayat -->
    <h5 class="mb-3">Scan History</h5>
    <div class="row">
      <div
        v-for="scan in scanHistory"
        :key="scan._id"
        class="col-md-6 col-lg-4 mb-3"
      >
        <div class="card shadow-sm">
          <div class="card-body">
            <h5 class="card-title">
              📦 {{ scan.id_item?.name || 'Unknown Item' }}
            </h5>
            <h6 class="card-subtitle mb-2 text-muted">
              👤 {{ scan.id_user?.name || 'Unknown User' }}
            </h6>
            <span :class="['badge', scan.isOut ? 'bg-danger' : 'bg-success']">
              {{ scan.isOut ? 'OUT' : 'IN' }}
            </span>
            <p class="mt-2 mb-0">
              🕒 <strong>Time:</strong>
              {{ formatDate(scan.isOut ? scan.out_time : scan.in_time) }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, nextTick } from 'vue'
import Chart from 'chart.js/auto'
import api from '@/api/axios'

const chartMode = ref('daily') // 'daily' or 'hourly'
const scanHistory = ref([])
const scanChart = ref(null)
let chartInstance = null

function setChartMode(mode) {
  chartMode.value = mode
}

function formatDate(date) {
  return new Date(date).toLocaleString()
}

async function renderChart() {
  await nextTick() // pastikan canvas sudah tersedia

  const endpoint =
    chartMode.value === 'daily'
      ? '/api/scan/chart/daily'
      : '/api/scan/chart/hourly'

  const { data } = await api.get(endpoint)
  const { labels, scanIn, scanOut } = data.data

  if (chartInstance) {
    chartInstance.destroy()
  }

  chartInstance = new Chart(scanChart.value, {
    type: 'line', // selalu garis
    data: {
      labels,
      datasets: [
        {
          label: 'Scan IN',
          data: scanIn,
          backgroundColor: 'rgba(40, 167, 69, 0.1)',
          borderColor: 'rgba(40, 167, 69, 1)',
          fill: true,
          tension: 0.4,
        },
        {
          label: 'Scan OUT',
          data: scanOut,
          backgroundColor: 'rgba(220, 53, 69, 0.1)',
          borderColor: 'rgba(220, 53, 69, 1)',
          fill: true,
          tension: 0.4,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
      },
    },
  })
}

async function fetchHistory() {
  const { data } = await api.get('/api/scan/history')
  scanHistory.value = data.data
}

onMounted(() => {
  renderChart()
  fetchHistory()
})

watch(chartMode, () => {
  renderChart()
})
</script>

<style scoped>
.badge {
  font-size: 0.85rem;
  padding: 0.4em 0.6em;
}
.card {
  border-left: 5px solid #0d6efd;
}
.card .badge {
  font-size: 0.8rem;
}
</style>
