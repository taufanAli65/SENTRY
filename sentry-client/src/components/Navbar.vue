<template>
  <Sidebar v-if="user" collapsible="icon" class="border-r">
    <SidebarHeader>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton
            size="lg"
            class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
          >
            <div
              class="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground"
            >
              <Building2 class="size-4" />
            </div>
            <div class="grid flex-1 text-left text-sm leading-tight">
              <span class="truncate font-semibold">Data Sentry</span>
              <span class="truncate text-xs">Layanan Keamanan Gudang</span>
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeader>

    <SidebarContent>
      <!-- Main Navigation -->
      <SidebarGroup>
        <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem v-if="user.role === 'owner'">
              <SidebarMenuButton as-child :is-active="isCurrentRoute('/owner')">
                <RouterLink to="/owner">
                  <Crown class="size-4" />
                  <span>Owner Dashboard</span>
                </RouterLink>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem v-if="user.role === 'admin'">
              <SidebarMenuButton as-child :is-active="isCurrentRoute('/admin')">
                <RouterLink to="/admin">
                  <Shield class="size-4" />
                  <span>Admin Dashboard</span>
                </RouterLink>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem v-if="user.role === 'employee'">
              <SidebarMenuButton as-child :is-active="isCurrentRoute('/employee')">
                <RouterLink to="/employee">
                  <Users class="size-4" />
                  <span>Employee Dashboard</span>
                </RouterLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>

      <!-- User Management -->
      <SidebarGroup v-if="user.role === 'owner'">
        <SidebarGroupLabel>User Management</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton as-child :is-active="isCurrentRoute('/register-user')">
                <RouterLink to="/register-user">
                  <UserPlus class="size-4" />
                  <span>Register User</span>
                </RouterLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem v-if="user.role === 'owner'">
              <SidebarMenuButton as-child :is-active="isCurrentRoute('/users-management')">
                <RouterLink to="/users-management">
                  <Users class="size-4" />
                  <span>User Management</span>
                </RouterLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
      <!-- Item Management -->
      <SidebarGroup v-if="user.role === 'owner'">
        <SidebarGroupLabel>Item Management</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton as-child :is-active="isCurrentRoute('/create-item')">
                <RouterLink to="/create-item">
                  <Plus class="size-4" />
                  <span>Create Item</span>
                </RouterLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton as-child :is-active="isCurrentRoute('/items')">
                <RouterLink to="/items">
                  <Package class="size-4" />
                  <span>Items</span>
                </RouterLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>

      <!-- Account -->
      <SidebarGroup>
        <SidebarGroupLabel>Account</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton as-child :is-active="isCurrentRoute('/profile')">
                <RouterLink to="/profile">
                  <User class="size-4" />
                  <span>Profile</span>
                </RouterLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>

    <SidebarFooter>
      <div class="flex items-center justify-between w-full px-2 pb-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger as-child>
                <SidebarMenuButton
                  size="lg"
                  class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <Avatar class="h-8 w-8 rounded-lg">
                    <AvatarImage
                      v-if="user.photoUrl"
                      :src="`http://localhost:8000${user.photoUrl}`"
                      :alt="user.name"
                    />
                    <AvatarFallback class="rounded-lg">
                      {{ getInitials(user.name) }}
                    </AvatarFallback>
                  </Avatar>
                  <div class="grid flex-1 text-left text-sm leading-tight">
                    <span class="truncate font-semibold">{{ user.name }}</span>
                    <span class="truncate text-xs capitalize">{{ user.role }}</span>
                  </div>
                  <ChevronsUpDown class="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                class="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                side="bottom"
                align="end"
                :side-offset="4"
              >
                <DropdownMenuLabel class="p-0 font-normal">
                  <div class="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <Avatar class="h-8 w-8 rounded-lg">
                      <AvatarImage
                        v-if="user.photoUrl"
                        :src="`http://localhost:8000${user.photoUrl}`"
                        :alt="user.name"
                      />
                      <AvatarFallback class="rounded-lg">
                        {{ getInitials(user.name) }}
                      </AvatarFallback>
                    </Avatar>
                    <div class="grid flex-1 text-left text-sm leading-tight">
                      <span class="truncate font-semibold">{{ user.name }}</span>
                      <span class="truncate text-xs">{{ user.email }}</span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem @click="goToProfile">
                  <User class="size-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem @click="goToSettings">
                  <Settings class="size-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem @click="logout" class="text-red-600 focus:text-red-600">
                  <LogOut class="size-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
        <!-- Tombol switch dark mode -->
        <button
          class="ml-2 p-2 rounded transition hover:bg-sidebar-accent"
          @click="toggleDark"
          :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
        >
          <svg
            v-if="isDark"
            xmlns="http://www.w3.org/2000/svg"
            class="size-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 3v1m0 16v1m8.66-8.66l-.71.71M4.05 4.05l-.71.71M21 12h-1M4 12H3m16.95 7.05l-.71-.71M4.05 19.95l-.71-.71M16 12a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
          <svg
            v-else
            xmlns="http://www.w3.org/2000/svg"
            class="size-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 12.79A9 9 0 1111.21 3a7 7 0 009.79 9.79z"
            />
          </svg>
        </button>
      </div>
    </SidebarFooter>

    <SidebarRail />
  </Sidebar>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useUserStore } from '@/stores/user'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@/components/ui/sidebar'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import {
  Building2,
  Crown,
  Shield,
  Users,
  UserPlus,
  User,
  Settings,
  LogOut,
  ChevronsUpDown,
  Plus,
  Package,
} from 'lucide-vue-next'

import { ref, onMounted } from 'vue'

const userStore = useUserStore()
const { user } = storeToRefs(userStore)
const router = useRouter()
const route = useRoute()

const isDark = ref(false)

onMounted(() => {
  const theme = localStorage.getItem('theme')
  if (theme === 'dark') {
    isDark.value = true
    document.documentElement.classList.add('dark')
  } else if (theme === 'light') {
    isDark.value = false
    document.documentElement.classList.remove('dark')
  } else {
    // fallback: cek class pada html
    isDark.value = document.documentElement.classList.contains('dark')
  }
})

const isCurrentRoute = (path: string): boolean => route.path === path

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
}

function goToProfile() {
  router.push('/profile')
}

function goToSettings() {
  router.push('/settings')
}

async function logout() {
  await userStore.logoutUser()
  router.push('/login')
}

function toggleDark() {
  isDark.value = !isDark.value
  document.documentElement.classList.toggle('dark', isDark.value)
  // Simpan preferensi ke localStorage (opsional)
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
}
</script>
