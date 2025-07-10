<template>
  <div class="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min">
    <div class="p-6 space-y-6">
      <!-- Header -->
      <div>
        <h2 class="text-3xl font-bold tracking-tight">Scan Management</h2>
        <p class="text-muted-foreground">Scan items in and out of the warehouse</p>
      </div>

      <div class="grid gap-6 lg:grid-cols-3">
        <!-- Scan Input Section -->
        <div class="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle class="flex items-center gap-2">
                <QrCode class="h-5 w-5" />
                Scan Item
              </CardTitle>
              <CardDescription>Scan or enter item barcode manually</CardDescription>
            </CardHeader>
            <CardContent class="space-y-6">
              <!-- Barcode Scanner/Input -->
              <div class="space-y-4">
                <div class="space-y-2">
                  <Label for="barcode">Item Barcode</Label>
                  <div class="relative">
                    <Scan class="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="barcode"
                      v-model="barcode"
                      placeholder="SNTRY001 or scan barcode"
                      class="pl-10"
                      @keyup.enter="handleScan"
                      ref="barcodeInput"
                    />
                  </div>
                </div>

                <!-- Action Type -->
                <div class="space-y-2">
                  <Label>Action Type</Label>
                  <div class="flex gap-2">
                    <Button
                      variant="outline"
                      :class="{ 'bg-green-50 border-green-200 text-green-700': !isOut }"
                      @click="isOut = false"
                      class="flex-1"
                    >
                      <ArrowDown class="w-4 h-4 mr-2" />
                      Item In
                    </Button>
                    <Button
                      variant="outline"
                      :class="{ 'bg-red-50 border-red-200 text-red-700': isOut }"
                      @click="isOut = true"
                      class="flex-1"
                    >
                      <ArrowUp class="w-4 h-4 mr-2" />
                      Item Out
                    </Button>
                  </div>
                </div>

                <!-- Scan Button -->
                <Button @click="handleScan" class="w-full" :disabled="!barcode || loading">
                  <Loader2 v-if="loading" class="w-4 h-4 mr-2 animate-spin" />
                  <Scan v-else class="w-4 h-4 mr-2" />
                  {{ loading ? 'Processing...' : 'Scan Item' }}
                </Button>
              </div>
            </CardContent>
          </Card>

          <!-- Recent Scan Result -->
          <Card v-if="lastScanResult" class="mt-6">
            <CardHeader>
              <CardTitle class="flex items-center gap-2">
                <CheckCircle class="h-5 w-5 text-green-600" />
                Last Scan Result
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div class="space-y-2">
                <div class="flex justify-between">
                  <span class="text-sm text-muted-foreground">Item Code:</span>
                  <span class="text-sm font-mono">{{ lastScanResult.item_code }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-sm text-muted-foreground">Action:</span>
                  <Badge :variant="lastScanResult.isOut ? 'destructive' : 'default'">
                    {{ lastScanResult.isOut ? 'Item Out' : 'Item In' }}
                  </Badge>
                </div>
                <div class="flex justify-between">
                  <span class="text-sm text-muted-foreground">Time:</span>
                  <span class="text-sm">{{ formatTime(lastScanResult.time) }}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <!-- Scan History -->
        <div class="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle class="flex items-center gap-2">
                <History class="h-5 w-5" />
                Scan History
              </CardTitle>
              <CardDescription>Recent scan activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div class="space-y-4">
                <!-- Filters -->
                <div class="flex flex-col md:flex-row gap-2 md:items-center">
                  <Input
                    v-model="searchHistory"
                    placeholder="Search by item code..."
                    class="max-w-xs"
                  />
                  <Select v-model="filterType">
                    <SelectTrigger class="w-[180px]">
                      <SelectValue placeholder="Filter by type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Actions</SelectItem>
                      <SelectItem value="in">Item In Only</SelectItem>
                      <SelectItem value="out">Item Out Only</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button @click="fetchScans" variant="outline" size="sm">
                    <RefreshCw class="w-4 h-4 mr-2" />
                    Refresh
                  </Button>
                </div>

                <!-- Scan History Table -->
                <div class="overflow-x-auto">
                  <table class="min-w-full text-sm">
                    <thead>
                      <tr class="border-b">
                        <th class="py-2 px-4 text-left">#</th>
                        <th class="py-2 px-4 text-left">Item Code</th>
                        <th class="py-2 px-4 text-left">Action</th>
                        <th class="py-2 px-4 text-left">Scanned By</th>
                        <th class="py-2 px-4 text-left">Time</th>
                        <th class="py-2 px-4 text-left">Status</th>
                        <th class="py-2 px-4 text-left">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        v-for="(scan, idx) in filteredScans"
                        :key="scan.id"
                        class="border-b hover:bg-muted/70 transition"
                      >
                        <td class="py-2 px-4">{{ (page - 1) * limit + idx + 1 }}</td>
                        <td class="py-2 px-4 font-mono">{{ scan.item_code || 'N/A' }}</td>
                        <td class="py-2 px-4">
                          <Badge :variant="scan.isOut ? 'destructive' : 'default'">
                            {{ scan.isOut ? 'Out' : 'In' }}
                          </Badge>
                        </td>
                        <td class="py-2 px-4">{{ scan.stocked_by_name || 'Unknown' }}</td>
                        <td class="py-2 px-4">{{ formatTime(scan.stocked_at) }}</td>
                        <td class="py-2 px-4">
                          <Badge :variant="scan.isOut ? 'outline' : 'secondary'" class="text-xs">
                            {{ scan.isOut ? 'Completed' : 'In Stock' }}
                          </Badge>
                        </td>
                        <td class="py-2 px-4">
                          <Button
                            v-if="!scan.isOut"
                            size="sm"
                            variant="outline"
                            @click="markAsOut(scan.item_code)"
                            :disabled="loadingOut === scan.item_code"
                          >
                            <Loader2
                              v-if="loadingOut === scan.item_code"
                              class="w-3 h-3 mr-1 animate-spin"
                            />
                            <ArrowUp v-else class="w-3 h-3 mr-1" />
                            Mark Out
                          </Button>
                          <span v-else class="text-xs text-muted-foreground"> Completed </span>
                        </td>
                      </tr>
                      <tr v-if="scans.length === 0">
                        <td colspan="7" class="text-center py-6 text-muted-foreground">
                          No scan history found.
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <!-- Pagination -->
                <div class="flex justify-between items-center mt-4">
                  <Button variant="outline" :disabled="page === 1" @click="page-- && fetchScans()">
                    Previous
                  </Button>
                  <span class="text-sm text-muted-foreground">
                    Page {{ page }} of {{ totalPages }}
                  </span>
                  <Button
                    variant="outline"
                    :disabled="page === totalPages"
                    @click="page++ && fetchScans()"
                  >
                    Next
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <!-- Success/Error Alerts -->
      <Alert
        v-if="success"
        class="border-green-200 bg-green-50 text-green-800 dark:border-green-800 dark:bg-green-900/20 dark:text-green-300"
      >
        <CheckCircle class="h-4 w-4" />
        <AlertTitle>Success</AlertTitle>
        <AlertDescription>{{ success }}</AlertDescription>
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
import { ref, computed, onMounted, nextTick } from 'vue'
import { storeToRefs } from 'pinia'
import { useUserStore } from '@/stores/user'
import { createScan, updateScan, getScans } from '@/api/scans'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import {
  QrCode,
  Scan,
  ArrowDown,
  ArrowUp,
  X,
  Focus,
  CheckCircle,
  History,
  RefreshCw,
  Loader2,
  AlertCircle,
} from 'lucide-vue-next'

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

// Form state
const barcode = ref('')
const isOut = ref(false)
const loading = ref(false)
const loadingOut = ref<string | null>(null)
const error = ref('')
const success = ref('')
const barcodeInput = ref<HTMLInputElement | null>(null)

// Scan history state
const scans = ref<any[]>([])
const page = ref(1)
const limit = ref(10)
const total = ref(0)
const searchHistory = ref('')
const filterType = ref('all')
const lastScanResult = ref<any>(null)

const totalPages = computed(() => Math.ceil(total.value / limit.value))

const filteredScans = computed(() => {
  let filtered = scans.value

  if (searchHistory.value) {
    filtered = filtered.filter((scan) =>
      scan.item_code?.toLowerCase().includes(searchHistory.value.toLowerCase()),
    )
  }

  if (filterType.value !== 'all') {
    filtered = filtered.filter((scan) => {
      if (filterType.value === 'in') return !scan.isOut
      if (filterType.value === 'out') return scan.isOut
      return true
    })
  }

  return filtered
})

async function handleScan() {
  if (!barcode.value.trim()) {
    error.value = 'Please enter or scan a barcode'
    return
  }

  error.value = ''
  success.value = ''
  loading.value = true

  try {
    const response = await createScan(barcode.value.trim(), isOut.value)

    success.value = `Item ${isOut.value ? 'out' : 'in'} scan successful!`

    // Store last scan result
    lastScanResult.value = {
      item_code: barcode.value.trim(),
      isOut: isOut.value,
      time: new Date().toISOString(),
    }

    // Clear form and refresh history
    barcode.value = ''
    await fetchScans()

    // Auto-focus back to input
    await nextTick()
    focusInput()
  } catch (e: any) {
    error.value = e.response?.data?.message || 'Failed to scan item'
  } finally {
    loading.value = false
  }
}

async function markAsOut(itemCode: string) {
  loadingOut.value = itemCode
  error.value = ''
  success.value = ''

  try {
    await updateScan(itemCode)
    success.value = 'Item marked as out successfully!'
    await fetchScans()
  } catch (e: any) {
    error.value = e.response?.data?.message || 'Failed to mark item as out'
  } finally {
    loadingOut.value = null
  }
}

async function fetchScans() {
  try {
    const response = await getScans(page.value, limit.value)
    scans.value = response.data.data.scans || []
    total.value = response.data.data.total || 0
  } catch (e: any) {
    console.error('Failed to fetch scans:', e)
    scans.value = []
  }
}

function clearInput() {
  barcode.value = ''
  error.value = ''
  success.value = ''
  focusInput()
}

function focusInput() {
  nextTick(() => {
    barcodeInput.value?.focus()
  })
}

function formatTime(dateString: string) {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleString()
}

// Auto-clear messages after 5 seconds
function autoClearMessages() {
  setTimeout(() => {
    error.value = ''
    success.value = ''
  }, 5000)
}

// Watch for message changes to auto-clear
import { watch } from 'vue'
watch([error, success], () => {
  if (error.value || success.value) {
    autoClearMessages()
  }
})

onMounted(() => {
  fetchScans()
  focusInput()
})
</script>
