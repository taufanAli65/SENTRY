import api from './axios'

export async function login(email: string, password: string) {
  return api.post('/api/auth/login', { email, password })
}
export async function logout() {
  return api.post('/api/auth/logout')
}
export async function forgotPassword(email: string) {
  return api.post('/api/auth/forgot-password', { email })
}
export async function resetPassword(token: string, newPassword: string) {
  return api.post(`/api/auth/reset-password/${token}`, { newPassword })
}
export async function registerUser(formData: FormData) {
  return api.post('/api/auth/admin/register', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}
