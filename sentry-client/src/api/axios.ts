import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8000',
  withCredentials: true,
})

// Interceptor untuk menyisipkan token Authorization
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')  // atau sessionStorage, tergantung kamu simpan di mana
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
}, error => {
  return Promise.reject(error)
})

export default api
