<template>
  <div class="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min">
    <div class="p-6 space-y-6">
      <!-- Header -->
      <div>
        <h2 class="text-3xl font-bold tracking-tight">Create New Item</h2>
        <p class="text-muted-foreground">Add a new item to your inventory with details and photo</p>
      </div>

      <div class="grid gap-6 lg:grid-cols-3">
        <!-- Item Form -->
        <div class="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle class="flex items-center gap-2">
                <Package class="h-5 w-5" />
                Item Information
              </CardTitle>
              <CardDescription>Fill in the details for the new item</CardDescription>
            </CardHeader>
            <CardContent>
              <form @submit.prevent="onSubmit" class="space-y-6">
                <!-- Photo Upload Section -->
                <div class="space-y-4">
                  <Label class="text-sm font-medium">Item Photo</Label>
                  <div class="flex flex-col items-center space-y-4">
                    <!-- Photo Preview Area -->
                    <div
                      class="relative w-full max-w-xs aspect-square bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden border-2 border-dashed border-slate-300 dark:border-slate-600"
                    >
                      <!-- Image Preview -->
                      <img
                        v-if="preview"
                        :src="preview"
                        alt="Item preview"
                        class="object-cover w-full h-full"
                      />

                      <!-- Empty State -->
                      <div
                        v-else
                        class="flex flex-col items-center justify-center h-full text-slate-500 dark:text-slate-400"
                      >
                        <ImageIcon class="w-12 h-12 mb-2" />
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
                  </div>
                </div>

                <!-- Form Fields -->
                <div class="grid gap-4">
                  <div class="space-y-2">
                    <Label for="name">Item Name</Label>
                    <div class="relative">
                      <Package class="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="name"
                        v-model="name"
                        placeholder="Enter item name"
                        class="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div class="grid gap-4 md:grid-cols-2">
                    <div class="space-y-2">
                      <Label for="weight">Weight (kg)</Label>
                      <div class="relative">
                        <Scale class="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="weight"
                          v-model.number="weight"
                          type="number"
                          min="0"
                          step="0.01"
                          placeholder="0.00"
                          class="pl-10"
                          required
                        />
                      </div>
                    </div>

                    <div class="space-y-2">
                      <Label for="category">Category</Label>
                      <Select v-model="category" required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Elektronik">
                            <div class="flex items-center gap-2">
                              <Zap class="w-4 h-4" />
                              Electronics
                            </div>
                          </SelectItem>
                          <SelectItem value="Furniture">
                            <div class="flex items-center gap-2">
                              <Home class="w-4 h-4" />
                              Furniture
                            </div>
                          </SelectItem>
                          <SelectItem value="Clothing">
                            <div class="flex items-center gap-2">
                              <Shirt class="w-4 h-4" />
                              Clothing
                            </div>
                          </SelectItem>
                          <SelectItem value="Books">
                            <div class="flex items-center gap-2">
                              <BookOpen class="w-4 h-4" />
                              Books
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div class="space-y-2">
                    <Label for="description">Description (Optional)</Label>
                    <Textarea
                      id="description"
                      v-model="description"
                      placeholder="Enter item description..."
                      class="min-h-[80px]"
                    />
                  </div>
                </div>

                <!-- Submit Button -->
                <Button type="submit" class="w-full" :disabled="loading || !file">
                  <Loader2 v-if="loading" class="w-4 h-4 mr-2 animate-spin" />
                  <Plus v-else class="w-4 h-4 mr-2" />
                  {{ loading ? 'Creating Item...' : 'Create Item' }}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <!-- Preview & Barcode -->
        <div class="lg:col-span-1 space-y-6">
          <!-- Item Preview -->
          <Card>
            <CardHeader>
              <CardTitle class="flex items-center gap-2">
                <Eye class="h-5 w-5" />
                Preview
              </CardTitle>
              <CardDescription>Preview of your item</CardDescription>
            </CardHeader>
            <CardContent class="space-y-4">
              <div class="space-y-3">
                <div
                  class="aspect-square bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden"
                >
                  <img
                    v-if="preview"
                    :src="preview"
                    alt="Preview"
                    class="object-cover w-full h-full"
                  />
                  <div v-else class="flex items-center justify-center h-full text-slate-400">
                    <ImageIcon class="w-8 h-8" />
                  </div>
                </div>

                <div class="space-y-2">
                  <h3 class="font-semibold">{{ name || 'Item Name' }}</h3>
                  <div class="flex items-center gap-2 text-sm text-muted-foreground">
                    <Scale class="w-3 h-3" />
                    {{ weight || '0' }} kg
                  </div>
                  <div class="flex items-center gap-2 text-sm text-muted-foreground">
                    <Tag class="w-3 h-3" />
                    {{ category || 'No category' }}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <!-- Barcode Section -->
          <Card v-if="itemCode">
            <CardHeader>
              <CardTitle class="flex items-center gap-2">
                <QrCode class="h-5 w-5" />
                Generated Barcode
              </CardTitle>
              <CardDescription>Item barcode for inventory tracking</CardDescription>
            </CardHeader>
            <CardContent class="space-y-4">
              <div class="flex justify-center p-4 bg-white rounded-lg border">
                <svg ref="barcodeRef" class="max-w-full"></svg>
              </div>

              <div class="space-y-2">
                <div class="text-center">
                  <p class="text-sm font-medium">Item Code</p>
                  <p class="text-xs text-muted-foreground font-mono">{{ itemCode }}</p>
                </div>

                <Button @click="printBarcode" variant="outline" class="w-full">
                  <Printer class="w-4 h-4 mr-2" />
                  Print Barcode
                </Button>
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
        <AlertTitle>Item Created Successfully</AlertTitle>
        <AlertDescription>{{ success }}</AlertDescription>
      </Alert>

      <Alert v-if="error" variant="destructive">
        <AlertCircle class="h-4 w-4" />
        <AlertTitle>Creation Failed</AlertTitle>
        <AlertDescription>{{ error }}</AlertDescription>
      </Alert>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import {
  Package,
  ImageIcon,
  Upload,
  Camera,
  Scale,
  Zap,
  Home,
  Shirt,
  BookOpen,
  Plus,
  Loader2,
  Eye,
  Tag,
  QrCode,
  Printer,
  CheckCircle,
  AlertCircle,
} from 'lucide-vue-next'

import JsBarcode from 'jsbarcode'
import api from '@/api/axios'

const name = ref('')
const weight = ref<number | null>(null)
const category = ref('')
const description = ref('')
const file = ref<File | null>(null)
const preview = ref<string | null>(null)
const loading = ref(false)
const error = ref('')
const success = ref('')
const itemCode = ref('')
const barcodeRef = ref<SVGSVGElement | null>(null)
const lastCreatedItem = ref<{ name: string; weight: number; category: string } | null>(null)

function onFileChange(e: Event) {
  const target = e.target as HTMLInputElement
  if (target.files && target.files[0]) {
    const selectedFile = target.files[0]

    // Validate file size (5MB max)
    if (selectedFile.size > 5 * 1024 * 1024) {
      error.value = 'File size must be less than 5MB'
      return
    }

    // Validate file type
    if (!selectedFile.type.startsWith('image/')) {
      error.value = 'Please select a valid image file'
      return
    }

    file.value = selectedFile
    preview.value = URL.createObjectURL(selectedFile)
    error.value = ''
  }
}

async function onSubmit() {
  error.value = ''
  success.value = ''
  itemCode.value = ''
  loading.value = true

  try {
    // Validation
    if (!file.value) {
      error.value = 'Item photo is required'
      loading.value = false
      return
    }

    if (!category.value) {
      error.value = 'Category is required'
      loading.value = false
      return
    }

    if (!weight.value || isNaN(Number(weight.value)) || weight.value <= 0) {
      error.value = 'Weight must be a valid positive number'
      loading.value = false
      return
    }

    const formData = new FormData()
    formData.append('photo', file.value)
    formData.append('name', name.value)
    formData.append('weight', String(weight.value))
    formData.append('category', category.value)
    if (description.value) {
      formData.append('description', description.value)
    }

    const res = await api.post('/api/items', formData)
    success.value = res.data?.message || 'Item created successfully!'
    itemCode.value = res.data?.data?.item_code

    // Simpan data item terakhir untuk print
    lastCreatedItem.value = {
      name: name.value,
      weight: weight.value as number,
      category: category.value,
    }

    // Reset form
    name.value = ''
    weight.value = null
    category.value = ''
    description.value = ''
    file.value = null
    preview.value = null

    // Generate barcode
    await nextTick()
    if (barcodeRef.value && itemCode.value) {
      JsBarcode(barcodeRef.value, itemCode.value, {
        format: 'CODE128',
        width: 2,
        height: 60,
        displayValue: true,
        fontSize: 12,
        margin: 10,
      })
    }
  } catch (e: any) {
    error.value = e.response?.data?.message || 'Failed to create item'
  } finally {
    loading.value = false
  }
}

function printBarcode() {
  if (!barcodeRef.value || !lastCreatedItem.value) return

  const printWindow = window.open('', '_blank')
  if (printWindow) {
    printWindow.document.write(`
      <html>
        <head>
          <title>Print Barcode - ${itemCode.value}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
              min-height: 100vh;
              margin: 0;
              padding: 20px;
            }
            .barcode-container {
              text-align: center;
              border: 1px solid #ccc;
              padding: 20px;
              border-radius: 8px;
            }
            .item-info {
              margin-bottom: 20px;
            }
            @media print {
              body { margin: 0; }
            }
          </style>
        </head>
        <body>
          <div class="barcode-container">
            <div class="item-info">
              <h3>${lastCreatedItem.value.name}</h3>
              <p>Weight: ${lastCreatedItem.value.weight} kg | Category: ${lastCreatedItem.value.category}</p>
            </div>
            ${barcodeRef.value.outerHTML}
          </div>
        </body>
      </html>
    `)
    printWindow.document.close()
    printWindow.print()
  }
}
</script>
