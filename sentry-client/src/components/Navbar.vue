<template>
  <nav v-if="user"
    class="w-full bg-white dark:bg-background shadow px-6 py-3 flex items-center justify-between"
  >
    <!-- Navigation Menu -->
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem v-if="user">
          <NavigationMenuLink v-if="user.role === 'owner'" href="/owner"
            >Dashboard Owner</NavigationMenuLink
          >
          <NavigationMenuLink v-if="user.role === 'admin'" href="/admin"
            >Dashboard Admin</NavigationMenuLink
          >
          <NavigationMenuLink v-if="user.role === 'employee'" href="/employee"
            >Dashboard Employee</NavigationMenuLink
          >
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink href="/profile">Profile</NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem v-if="user && user.role === 'owner'">
          <NavigationMenuLink href="/register-user">Register User</NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
    <!-- User Info -->
    <div v-if="user" class="flex items-center gap-3">
      <span class="font-medium">{{ user.name }}</span>
      <span class="text-xs px-2 py-1 rounded bg-gray-100 text-gray-600 capitalize">{{
        user.role
      }}</span>
      <button
        @click="logout"
        class="ml-2 px-3 py-1 rounded bg-red-500 text-white text-xs hover:bg-red-600 transition"
      >
        Logout
      </button>
    </div>
  </nav>
</template>

<script setup lang="ts">
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
} from '@/components/ui/navigation-menu'
import { useUserStore } from '@/stores/user'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'

const userStore = useUserStore()
const { user } = storeToRefs(userStore)
const router = useRouter()

async function logout() {
  await userStore.logoutUser()
  router.push('/login')
}
</script>
