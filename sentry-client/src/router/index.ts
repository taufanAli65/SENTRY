import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/user'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  { path: '/', redirect: '/login' },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/LoginView.vue'),
    meta: { guestOnly: true },
  },
  {
    path: '/forgot-password',
    name: 'forgot-password',
    component: () => import('../views/ForgotPasswordView.vue'),
    meta: { guestOnly: true },
  },
  {
    path: '/reset-password/:token',
    name: 'reset-password',
    component: () => import('../views/ResetPasswordView.vue'),
    meta: { guestOnly: true },
  },
  {
    path: '/owner',
    component: () => import('../views/DashboardOwner.vue'),
    meta: { requiresAuth: true, role: 'owner' },
  },
  {
    path: '/admin',
    component: () => import('../views/DashboardAdmin.vue'),
    meta: { requiresAuth: true, role: 'admin' },
  },
  {
    path: '/employee',
    component: () => import('../views/DashboardEmployee.vue'),
    meta: { requiresAuth: true, role: 'Employee' }
  },
  {
    path: '/employee/presence',
    component: () => import('../views/PresenceEmployee.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/items',
    name: 'items',
    component: () => import('../views/ItemsView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/users-management',
    name: 'users-management',
    component: () => import('../views/UsersManagementView.vue'),
    meta: { requiresAuth: true, role: 'owner' },
  },
  {
    path: '/profile',
    name: 'profile',
    component: () => import('../views/ProfileView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/register-user',
    name: 'register-user',
    component: () => import('../views/RegisterUserView.vue'),
    meta: { requiresAuth: true, role: 'owner' },
  },
  {
    path: '/create-item',
    name: 'create-item',
    component: () => import('../views/CreateItemView.vue'),
    meta: { requiresAuth: true, role: 'owner' },
  },
  { path: '/:pathMatch(.*)*', component: () => import('../views/NotFound.vue') },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

let userFetched = false

// Navigation Guard
router.beforeEach(async (to, from, next) => {
  const store = useUserStore()
  if (!userFetched) {
    await store.fetchUser()
    userFetched = true
  }

  if (to.meta.guestOnly && store.user) {
    if (store.user.role === 'owner') return next('/owner')
    if (store.user.role === 'admin') return next('/admin')
    if (store.user.role === 'employee') return next('/employee')
    return next('/')
  }

  if (to.meta.requiresAuth) {
    if (!store.user) {
      return next('/login')
    }
    if (to.meta.role && store.user.role !== to.meta.role) {
      // Redirect ke dashboard sesuai role
      if (store.user.role === 'owner') return next('/owner')
      if (store.user.role === 'admin') return next('/admin')
      if (store.user.role === 'employee') return next('/employee')
      return next('/login')
    }
  }
  next()
})

export default router
