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
export function scanItemIn(id_user: string, id_item: string) {
  return api.post('/api/scan', { id_user, id_item, isOut: false })
}

export function scanItemOut(scanId: string) {
  return api.put(`/api/scan/${scanId}`)
}

export async function fetchScanSummary() {
  return api.get('/api/scan/summary')
}

export async function fetchScanChartDaily() {
  return api.get('/api/scan/chart/daily')
}

export async function fetchScanChartHourly() {
  return api.get('/api/scan/chart/hourly')
}

export async function fetchScanHistory() {
  return api.get('/api/scan/history')
}
