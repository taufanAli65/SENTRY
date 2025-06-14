import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/user'

import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: () => import('../views/LoginView.vue') },
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
    meta: { requiresAuth: true, role: 'employee' },
  },
  { path: '/:pathMatch(.*)*', component: () => import('../views/NotFound.vue') },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Navigation Guard
router.beforeEach((to, from, next) => {
  const store = useUserStore()
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
