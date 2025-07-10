import api from './axios'

export async function createScan(code_item: string, isOut?: boolean) {
  return api.post('/api/scans', { code_item, isOut })
}

export async function updateScan(code_item: string) {
  return api.put('/api/scans/out', { code_item })
}

export async function getScans(page = 1, limit = 10) {
  return api.get('/api/scans', { params: { page, limit } })
}