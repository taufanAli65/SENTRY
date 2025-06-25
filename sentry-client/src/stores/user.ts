import { defineStore } from 'pinia'
import { logout } from '@/api/auth'
import api from '@/api/axios'

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null as null | {
      id: string
      email: string
      name: string
      role: string
      photoUrl: string
    },
  }),
  actions: {
    setUser(user: any) {
      this.user = user
    },
    logout() {
      this.user = null
    },
    async fetchUser() {
      try {
        const res = await api.get('/api/user/profile')
        this.user = res.data.data
      } catch {
        this.user = null
      }
    },
    async logoutUser() {
      await logout()
      this.user = null
    },
  },
})
