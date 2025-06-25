export interface IAppError extends Error {
  statusCode: number;
  status: string;
  isOperational?: boolean;
  data?: unknown;
}
