import { NextFunction, type Request, type Response } from 'express'
import logger from '../utils/logger'
import { IAppError } from '../types/error_types'

// Fungsi untuk menangani error di lingkungan pengembangan
const sendErrorDev = (error: IAppError, req: Request, res: Response): Response => {
  logger.error('ERROR 💥', {
    message: error.message,
    stack: error.stack
  })

  return res.status(error.statusCode).json({
    status: error.status,
    error: error,
    message: error.message,
    stack: error.stack,
    data: error.data || null
  })
}

// Fungsi untuk menangani error di lingkungan produksi
const sendErrorProd = (error: IAppError, req: Request, res: Response): Response => {
  if (error.isOperational) {
    return res.status(error.statusCode).json({
      status: error.status,
      message: error.message,
      data: error.data || null
    })
  }

  // Log error di production jika bukan error operasional
  logger.error('ERROR 💥', {
    message: error.message,
    stack: error.stack
  })

  return res.status(500).json({
    status: 'error',
    message: 'Something went wrong!'
  })
}

// Middleware global untuk menangani error
export const globalErrorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const error = err as IAppError
  error.statusCode = error.statusCode || 500
  error.status = error.status || 'error'

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(error, req, res)
  } else if (process.env.NODE_ENV === 'production') {
    sendErrorProd(error, req, res)
  }

  next()
}
