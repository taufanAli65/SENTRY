<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useUserStore } from '@/stores/user'

import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'

import Navbar from '@/components/Navbar.vue'

const userStore = useUserStore()
const { user } = storeToRefs(userStore)
const route = useRoute()

const breadcrumbTitle = computed(getBreadcrumbTitle)
const currentPageTitle = computed(getCurrentPageTitle)

function getBreadcrumbTitle(): string {
  if (!user.value) return ''
  switch (user.value.role) {
    case 'owner':
      return 'Owner Panel'
    case 'admin':
      return 'Admin Panel'
    case 'employee':
      return 'Employee Panel'
    default:
      return 'Dashboard'
  }
}

function getCurrentPageTitle(): string {
  const path = route.path
  const pageMap: Record<string, string> = {
    '/owner': 'Dashboard',
    '/admin': 'Dashboard',
    '/employee': 'Dashboard',
    '/profile': 'Profile',
    '/register-user': 'Register User',
    '/settings': 'Settings',
    '/change-password': 'Change Password',
    '/create-item': 'Create Item',
    '/scans': 'Scan Items',
  }
  return pageMap[path] || 'Page'
}
</script>

<template>
  <SidebarProvider v-if="user && route.meta.requiresAuth">
    <Navbar />
    <SidebarInset>
      <Header class="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger class="-ml-1" />
        <Separator orientation="vertical" class="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem class="hidden md:block">
              <RouterLink to="/" custom v-slot="{ navigate }">
                <BreadcrumbLink @click="navigate">{{ breadcrumbTitle }}</BreadcrumbLink>
              </RouterLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator class="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage>{{ currentPageTitle }}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </Header>
      <div class="flex flex-1 flex-col gap-4 p-4 pt-0">
        <RouterView />
      </div>
    </SidebarInset>
  </SidebarProvider>
  <div v-else>
    <RouterView />
  </div>
</template>
