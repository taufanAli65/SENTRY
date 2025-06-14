<template>
  <div class="min-h-screen bg-gray-50 p-4">
    <div class="max-w-md mx-auto">
      <!-- Form Card -->
      <div class="bg-white rounded-lg shadow-sm border p-6 space-y-6">
        <div class="text-center">
          <h1 class="text-2xl font-semibold text-gray-900">Tambah Barang</h1>
        </div>

        <form @submit.prevent="onSubmit" class="space-y-5">
          <!-- Image Upload -->
          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-700">Foto Barang</label>
            <div class="flex flex-col items-center space-y-3">
              <div
                v-if="preview"
                class="w-32 h-32 rounded-lg border-2 border-dashed border-gray-200 overflow-hidden"
              >
                <img :src="preview" alt="Preview" class="w-full h-full object-cover" />
              </div>
              <div
                v-else
                class="w-32 h-32 rounded-lg border-2 border-dashed border-gray-200 flex items-center justify-center bg-gray-50"
              >
                <ImageIcon class="w-8 h-8 text-gray-400" />
              </div>
              <label class="cursor-pointer">
                <Input type="file" accept="image/*" @change="onFileChange" class="sr-only" />
                <span
                  class="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Pilih Foto
                </span>
              </label>
            </div>
          </div>

          <!-- Name Input -->
          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-700">Nama Barang</label>
            <Input v-model="name" placeholder="Masukkan nama barang" required class="w-full" />
          </div>

          <!-- Weight Input -->
          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-700">Berat (kg)</label>
            <Input
              v-model.number="weight"
              type="number"
              min="0"
              step="0.01"
              placeholder="0.00"
              required
              class="w-full"
            />
          </div>

          <!-- Category Select -->
          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-700">Kategori</label>
            <Select v-model="category">
              <SelectTrigger class="w-full">
                <span>{{ categoryLabel }}</span>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Elektronik">Elektronik</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <!-- Submit Button -->
          <Button type="submit" class="w-full" :disabled="loading">
            {{ loading ? 'Menyimpan...' : 'Simpan Barang' }}
          </Button>

          <!-- Messages -->
          <div v-if="success" class="text-sm text-green-600 text-center font-medium">
            {{ success }}
          </div>
          <div v-if="error" class="text-sm text-red-600 text-center font-medium">
            {{ error }}
          </div>
        </form>
      </div>

      <!-- Barcode Card -->
      <div v-if="itemCode" class="mt-6 bg-white rounded-lg shadow-sm border p-6">
        <div class="text-center space-y-4">
          <h2 class="text-lg font-semibold text-gray-900">Barcode Barang</h2>
          <div class="flex justify-center">
            <svg ref="barcodeRef" class="border rounded"></svg>
          </div>
          <Button @click="printBarcode" variant="outline" class="w-full"> Cetak Barcode </Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectTrigger, SelectContent, SelectItem } from '@/components/ui/select'
import { ImageIcon } from 'lucide-vue-next'
import JsBarcode from 'jsbarcode'
import api from '@/api/axios'

const name = ref('')
const weight = ref<number | null>(null)
const category = ref('')
const file = ref<File | null>(null)
const preview = ref<string | null>(null)
const loading = ref(false)
const error = ref('')
const success = ref('')
const itemCode = ref('')
const barcodeRef = ref<SVGSVGElement | null>(null)

const categoryLabel = computed(() => category.value || 'Pilih Kategori')

function onFileChange(e: Event) {
  const target = e.target as HTMLInputElement
  if (target.files && target.files[0]) {
    file.value = target.files[0]
    preview.value = URL.createObjectURL(target.files[0])
  }
}

async function onSubmit() {
  error.value = ''
  success.value = ''
  itemCode.value = ''
  loading.value = true

  try {
    if (!file.value) {
      error.value = 'Foto barang wajib diisi'
      loading.value = false
      return
    }
    if (!category.value) {
      error.value = 'Kategori wajib dipilih'
      loading.value = false
      return
    }
    if (!weight.value || isNaN(Number(weight.value))) {
      error.value = 'Berat barang wajib diisi dan berupa angka'
      loading.value = false
      return
    }

    const formData = new FormData()
    formData.append('photo', file.value)
    formData.append('name', name.value)
    formData.append('weight', String(weight.value))
    formData.append('category', category.value)

    const res = await api.post('/api/items', formData)
    success.value = res.data?.message || 'Barang berhasil disimpan!'
    itemCode.value = res.data?.data?.item_code

    // Reset form
    name.value = ''
    weight.value = null
    category.value = ''
    file.value = null
    preview.value = null

    await nextTick()
    if (barcodeRef.value && itemCode.value) {
      JsBarcode(barcodeRef.value, itemCode.value, {
        format: 'CODE128',
        width: 2,
        height: 80,
        displayValue: true,
        fontSize: 14,
      })
    }
  } catch (e: any) {
    // Ambil pesan error dari API
    error.value = e.response?.data?.message || 'Gagal menyimpan barang'
  } finally {
    loading.value = false
  }
}

function printBarcode() {
  if (!barcodeRef.value) return
  const printWindow = window.open('', '_blank')
  if (printWindow) {
    printWindow.document.write(`
      <html>
        <head>
          <title>Print Barcode</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              display: flex;
              justify-content: center;
              align-items: center;
              min-height: 100vh;
              margin: 0;
            }
          </style>
        </head>
        <body>
          ${barcodeRef.value.outerHTML}
        </body>
      </html>
    `)
    printWindow.document.close()
    printWindow.print()
  }
}
</script>
