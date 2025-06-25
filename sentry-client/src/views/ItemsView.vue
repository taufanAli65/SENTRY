<template>
  <div class="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min">
    <div class="p-6 space-y-6">
      <div>
        <h2 class="text-3xl font-bold tracking-tight">Items</h2>
        <p class="text-muted-foreground">Manage and view your inventory items</p>
      </div>

      <!-- Items Table -->
      <Card>
        <CardHeader>
          <CardTitle class="flex items-center gap-2">
            <Package class="h-5 w-5" />
            Item List
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div class="mb-4 flex flex-col md:flex-row gap-2 md:items-center">
            <Input
              v-model="search"
              placeholder="Search items..."
              class="max-w-xs"
              @keyup.enter="fetchItems"
            />
            <Button @click="fetchItems" variant="outline" class="w-fit"> Search </Button>
          </div>
          <div class="overflow-x-auto">
            <table class="min-w-full text-sm">
              <thead>
                <tr class="border-b">
                  <th class="py-2 px-4 text-left">#</th>
                  <th class="py-2 px-4 text-left">Photo</th>
                  <th class="py-2 px-4 text-left">Name</th>
                  <th class="py-2 px-4 text-left">Category</th>
                  <th class="py-2 px-4 text-left">Weight</th>
                  <th class="py-2 px-4 text-left">Item Code</th>
                  <th class="py-2 px-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(item, idx) in items"
                  :key="item._id"
                  class="border-b hover:bg-muted/70 transition"
                >
                  <td class="py-2 px-4">{{ (page - 1) * limit + idx + 1 }}</td>
                  <td class="py-2 px-4">
                    <img
                      :src="`api/${item.photo_url}`"
                      alt="photo"
                      class="w-12 h-12 object-cover rounded"
                    />
                  </td>
                  <td class="py-2 px-4">{{ item.name }}</td>
                  <td class="py-2 px-4">{{ item.category }}</td>
                  <td class="py-2 px-4">{{ item.weight }} kg</td>
                  <td class="py-2 px-4 font-mono">{{ item.item_code }}</td>
                  <td class="py-2 px-4 flex gap-2">
                    <Button size="sm" variant="outline" @click="showDetail(item)">
                      <Eye class="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="destructive" @click="confirmDelete(item)">
                      <Trash class="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
                <tr v-if="items.length === 0">
                  <td colspan="7" class="text-center py-6 text-muted-foreground">
                    No items found.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <!-- Pagination -->
          <div class="flex justify-between items-center mt-4">
            <Button variant="outline" :disabled="page === 1" @click="page-- && fetchItems()">
              Previous
            </Button>
            <span class="text-sm text-muted-foreground"> Page {{ page }} of {{ totalPages }} </span>
            <Button
              variant="outline"
              :disabled="page === totalPages"
              @click="page++ && fetchItems()"
            >
              Next
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Detail Modal -->
    <Dialog v-model:open="detailOpen">
      <DialogContent class="max-w-lg">
        <DialogHeader>
          <DialogTitle>Item Detail</DialogTitle>
        </DialogHeader>
        <div v-if="selectedItem" class="space-y-4">
          <div class="flex gap-4">
            <img
              :src="`api/${selectedItem.photo_url}`"
              alt="photo"
              class="w-32 h-32 object-cover rounded"
            />
            <div class="flex-1 space-y-1">
              <div class="font-semibold text-lg">{{ selectedItem.name }}</div>
              <div class="text-muted-foreground">Category: {{ selectedItem.category }}</div>
              <div class="text-muted-foreground">Weight: {{ selectedItem.weight }} kg</div>
              <div class="text-muted-foreground">
                Item Code: <span class="font-mono">{{ selectedItem.item_code }}</span>
              </div>
            </div>
          </div>
          <div>
            <div class="font-medium mb-1">Barcode</div>
            <div class="bg-white rounded border p-2 flex justify-center">
              <svg ref="barcodeRef" class="max-w-full"></svg>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" @click="detailOpen = false">Close</Button>
          <Button variant="outline" @click="printBarcode" v-if="selectedItem">
            Print Barcode
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <!-- Delete Confirmation Dialog -->
    <Dialog v-model:open="deleteOpen">
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Item</DialogTitle>
        </DialogHeader>
        <div>
          Are you sure you want to delete <span class="font-semibold">{{ selectedItem?.name }}</span
          >?
        </div>
        <DialogFooter>
          <Button variant="outline" @click="deleteOpen = false">Cancel</Button>
          <Button variant="destructive" @click="deleteItem" :loading="loadingDelete">Delete</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick, computed } from 'vue'
import api from '@/api/axios'
import JsBarcode from 'jsbarcode'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Eye, Trash, Package } from 'lucide-vue-next'

const items = ref<any[]>([])
const page = ref(1)
const limit = ref(10)
const total = ref(0)
const search = ref('')
const detailOpen = ref(false)
const deleteOpen = ref(false)
const selectedItem = ref<any>(null)
const barcodeRef = ref<SVGSVGElement | null>(null)
const loadingDelete = ref(false)

const totalPages = computed(() => Math.ceil(total.value / limit.value))

async function fetchItems() {
  const params: any = { page: page.value, limit: limit.value }
  if (search.value) params.search = search.value
  const res = await api.get('/api/items', { params })
  items.value = res.data.data.items
  total.value = res.data.data.total
}

function showDetail(item: any) {
  selectedItem.value = item
  detailOpen.value = true
}

watch(detailOpen, async (open) => {
  if (open && selectedItem.value) {
    await nextTick()
    if (barcodeRef.value) {
      JsBarcode(barcodeRef.value, selectedItem.value.item_code, {
        format: 'CODE128',
        width: 2,
        height: 60,
        displayValue: true,
        fontSize: 12,
        margin: 10,
      })
    }
  }
})

function confirmDelete(item: any) {
  selectedItem.value = item
  deleteOpen.value = true
}

async function deleteItem() {
  if (!selectedItem.value) return
  loadingDelete.value = true
  try {
    await api.delete(`/api/items/${selectedItem.value._id}`)
    deleteOpen.value = false
    fetchItems()
  } finally {
    loadingDelete.value = false
  }
}
function printBarcode() {
  if (!barcodeRef.value || !selectedItem.value) return

  const printWindow = window.open('', '_blank')
  if (printWindow) {
    printWindow.document.write(`
      <html>
        <head>
          <title>Print Barcode - ${selectedItem.value.item_code}</title>
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
              <h3>${selectedItem.value.name}</h3>
              <p>Weight: ${selectedItem.value.weight} kg | Category: ${selectedItem.value.category}</p>
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

fetchItems()
</script>
