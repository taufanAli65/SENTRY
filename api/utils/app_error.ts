import { IAppError } from '../types/error_types'

// Fungsi untuk membuat objek kesalahan terstruktur
export const AppError = (message: string, statusCode: number, data: unknown = null): IAppError => {
  const error = new Error(message) as IAppError
  error.statusCode = statusCode
  error.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error'
  error.isOperational = true
  error.data = data;

  return error
}
