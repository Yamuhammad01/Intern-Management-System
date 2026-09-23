import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/ApiError';
import { logger } from '../utils/logger';

/**
 * Resolves the HTTP status that will ultimately be sent
 */
const resolveStatusCode = (err: Error): number => {
  if (err instanceof ApiError) {
    return err.statusCode;
  }

  if (err.name === 'PrismaClientKnownRequestError') {
    const code = (err as any).code;
    if (code === 'P2002') return 409;
    if (code === 'P2025') return 404;
  }

  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    return 401;
  }

  return 500;
};

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  const statusCode = resolveStatusCode(err);

  if (statusCode >= 500) {
    logger.error('Error caught in handler:', {
      name: err.name,
      message: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    });
  } else {
    // 4xx responses are expected client-side rejections (missing/expired token,
    // validation errors, permissions). Log them concisely and without a stack so
    // that genuine server faults are not buried in noise.
    logger.warn(`Request rejected with ${statusCode}: ${err.name} - ${err.message}`);
  }

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