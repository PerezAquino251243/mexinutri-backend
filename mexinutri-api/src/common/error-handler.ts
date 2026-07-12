import { type Request, type Response, type NextFunction } from 'express';

export class AppError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number,
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export interface ApiErrorResponse {
  success: false;
  error: string;
  details?: string[];
}

export function globalErrorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      error: err.message,
    } satisfies ApiErrorResponse);
    return;
  }

  console.error('Unhandled error:', err);

  res.status(500).json({
    success: false,
    error: 'Internal server error',
  } satisfies ApiErrorResponse);
}