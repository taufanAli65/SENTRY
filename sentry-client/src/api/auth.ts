import axios from 'axios'

const api = axios.create({
  baseURL: '',
  withCredentials: true,
})

export async function login(email: string, password: string) {
  return api.post('/api/auth/login', { email, password })
}
export async function logout() {
  return api.post('/api/auth/logout')
}
export default api
