import axios from 'axios'

export async function login(email: string, password: string) {
  return axios.post('/api/auth/login', { email, password }, { withCredentials: true })
}
