import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/ApiError';
import { logger } from '../utils/logger';

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  logger.error('Error caught in handler:', {
    name: err.name,
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });

  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      statusCode: err.statusCode,
      message: err.message,
      error: {
        type: err.type,
        ...(err.details && { details: err.details }),
      },
      meta: {
        timestamp: new Date().toISOString(),
      },
    });
  }

  // Prisma known errors
  if (err.name === 'PrismaClientKnownRequestError') {
    const prismaErr = err as any;
    if (prismaErr.code === 'P2002') {
      return res.status(409).json({
        success: false,
        statusCode: 409,
        message: 'A record with this value already exists',
        error: { type: 'CONFLICT' },
        meta: { timestamp: new Date().toISOString() },
      });
    }
    if (prismaErr.code === 'P2025') {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: 'Record not found',
        error: { type: 'NOT_FOUND' },
        meta: { timestamp: new Date().toISOString() },
      });
    }
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      statusCode: 401,
      message: 'Invalid token',
      error: { type: 'UNAUTHORIZED' },
      meta: { timestamp: new Date().toISOString() },
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      statusCode: 401,
      message: 'Token expired',
      error: { type: 'TOKEN_EXPIRED' },
      meta: { timestamp: new Date().toISOString() },
    });
  }

  // Default 500
  return res.status(500).json({
    success: false,
    statusCode: 500,
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error',
    error: { type: 'INTERNAL_ERROR' },
    meta: { timestamp: new Date().toISOString() },
  });
};