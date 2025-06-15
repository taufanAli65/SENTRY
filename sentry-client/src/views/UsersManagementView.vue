<template>
  <div class="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min">
    <div class="p-6 space-y-6">
      <div>
        <h2 class="text-3xl font-bold tracking-tight">User Management</h2>
        <p class="text-muted-foreground">Manage admin and employee accounts</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle class="flex items-center gap-2">
            <Users class="h-5 w-5" />
            User List
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div class="mb-4 flex flex-col md:flex-row gap-2 md:items-center">
            <Input
              v-model="search"
              placeholder="Search users..."
              class="max-w-xs"
              @keyup.enter="fetchUsers"
            />
            <Button @click="fetchUsers" variant="outline" class="w-fit">Search</Button>
          </div>
          <div class="overflow-x-auto">
            <table class="min-w-full text-sm">
              <thead>
                <tr class="border-b">
                  <th class="py-2 px-4 text-left">#</th>
                  <th class="py-2 px-4 text-left">Photo</th>
                  <th class="py-2 px-4 text-left">Name</th>
                  <th class="py-2 px-4 text-left">Email</th>
                  <th class="py-2 px-4 text-left">Role</th>
                  <th class="py-2 px-4 text-left">Status</th>
                  <th class="py-2 px-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(user, idx) in users"
                  :key="user._id"
                  class="border-b hover:bg-muted/70 transition"
                >
                  <td class="py-2 px-4">{{ (page - 1) * limit + idx + 1 }}</td>
                  <td class="py-2 px-4">
                    <img
                      :src="`/api/${user.photoUrl}`"
                      alt="photo"
                      class="w-10 h-10 object-cover rounded-full border"
                    />
                  </td>
                  <td class="py-2 px-4">{{ user.name }}</td>
                  <td class="py-2 px-4">{{ user.email }}</td>
                  <td class="py-2 px-4 capitalize">{{ user.role }}</td>
                  <td class="py-2 px-4">
                    <span
                      :class="
                        user.suspended
                          ? 'text-red-600 font-semibold'
                          : 'text-green-600 font-semibold'
                      "
                    >
                      {{ user.suspended ? 'Suspended' : 'Active' }}
                    </span>
                  </td>
                  <td class="py-2 px-4 flex gap-2">
                    <Button
                      v-if="!user.suspended"
                      size="sm"
                      variant="destructive"
                      @click="confirmSuspend(user)"
                    >
                      Suspend
                    </Button>
                    <Button v-else size="sm" variant="outline" @click="confirmUnsuspend(user)">
                      Unsuspend
                    </Button>
                  </td>
                </tr>
                <tr v-if="users.length === 0">
                  <td colspan="7" class="text-center py-6 text-muted-foreground">
                    No users found.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <!-- Pagination -->
          <div class="flex justify-between items-center mt-4">
            <Button variant="outline" :disabled="page === 1" @click="page-- && fetchUsers()">
              Previous
            </Button>
            <span class="text-sm text-muted-foreground"> Page {{ page }} of {{ totalPages }} </span>
            <Button
              variant="outline"
              :disabled="page === totalPages"
              @click="page++ && fetchUsers()"
            >
              Next
            </Button>
          </div>
        </CardContent>
      </Card>

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

    <Dialog v-model:open="suspendOpen">
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Suspend User</DialogTitle>
        </DialogHeader>
        <div>
          Are you sure you want to suspend
          <span class="font-semibold">{{ selectedUser?.name }}</span
          >?
        </div>
        <DialogFooter>
          <Button variant="outline" @click="suspendOpen = false">Cancel</Button>
          <Button
            type="submit"
            class="min-w-[120px]"
            :disabled="loadingAction"
            @click="suspendUser"
          >
            <Loader2 v-if="loadingAction" class="w-4 h-4 mr-2 animate-spin" />
            <AlertCircle v-else class="w-4 h-4 mr-2" />
            {{ loadingAction ? 'Suspending...' : 'Suspend' }}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <!-- Unsuspend Confirmation Dialog -->
    <Dialog v-model:open="unsuspendOpen">
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Unsuspend User</DialogTitle>
        </DialogHeader>
        <div>
          Are you sure you want to unsuspend
          <span class="font-semibold">{{ selectedUser?.name }}</span
          >?
        </div>
        <DialogFooter>
          <Button variant="outline" @click="unsuspendOpen = false">Cancel</Button>
          <Button
            type="submit"
            class="min-w-[120px]"
            :disabled="loadingAction"
            @click="unsuspendUser"
          >
            <Loader2 v-if="loadingAction" class="w-4 h-4 mr-2 animate-spin" />
            <CheckCircle v-else class="w-4 h-4 mr-2" />
            {{ loadingAction ? 'Unsuspending...' : 'Unsuspend' }}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import api from '@/api/axios'
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
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Users, CheckCircle, AlertCircle, Loader2 } from 'lucide-vue-next'

const users = ref<any[]>([])
const page = ref(1)
const limit = ref(10)
const total = ref(0)
const search = ref('')
const message = ref('')
const error = ref('')
const suspendOpen = ref(false)
const unsuspendOpen = ref(false)
const selectedUser = ref<any>(null)
const loadingAction = ref(false)

const totalPages = computed(() => Math.ceil(total.value / limit.value))

async function fetchUsers() {
  error.value = ''
  message.value = ''
  const params: any = { page: page.value, limit: limit.value }
  if (search.value) params.search = search.value
  const res = await api.get('http://localhost:8000/owner/users', { params })
  console.log(res.data.data)
  users.value = res.data.data.users
  total.value = res.data.data.total
}

function confirmSuspend(user: any) {
  selectedUser.value = user
  suspendOpen.value = true
}

function confirmUnsuspend(user: any) {
  selectedUser.value = user
  unsuspendOpen.value = true
}

async function suspendUser() {
  if (!selectedUser.value) return
  loadingAction.value = true
  error.value = ''
  message.value = ''
  try {
    await api.post(`http://localhost:8000/owner/users/${selectedUser.value._id}/suspend`)
    message.value = `User "${selectedUser.value.name}" suspended and notified`
    suspendOpen.value = false
    fetchUsers()
  } catch (e: any) {
    error.value = e.response?.data?.message || 'Failed to suspend user'
  } finally {
    loadingAction.value = false
  }
}

async function unsuspendUser() {
  if (!selectedUser.value) return
  loadingAction.value = true
  error.value = ''
  message.value = ''
  try {
    await api.post(`http://localhost:8000/owner/users/${selectedUser.value._id}/unsuspend`)
    message.value = `User "${selectedUser.value.name}" unsuspended and notified`
    unsuspendOpen.value = false
    fetchUsers()
  } catch (e: any) {
    error.value = e.response?.data?.message || 'Failed to unsuspend user'
  } finally {
    loadingAction.value = false
  }
}

fetchUsers()
</script>
