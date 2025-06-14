import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null as null | {
      id: string
      email: string
      name: string
      role: string
    },
  }),
  actions: {
    setUser(user: any) {
      this.user = user
    },
    logout() {
      this.user = null
    },
  },
})
