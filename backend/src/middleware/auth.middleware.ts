import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/token';
import { ApiError } from '../utils/ApiError';

export const authenticate = (req: Request, _res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    throw ApiError.unauthorized('No token provided');
  }

  // A header of exactly "Bearer" lands here. Node trims trailing whitespace from
  // header values, so a client that sends `Bearer ${undefined}` / `Bearer ` as an
  // empty token arrives as "Bearer" and never matches the "Bearer " prefix.
  // Distinguishing this from a totally missing header makes the cause obvious.
  if (!authHeader.startsWith('Bearer ')) {
    throw ApiError.unauthorized(
      'Invalid authorization header. Expected format: "Bearer <token>"',
    );
  }

  const token = authHeader.slice('Bearer '.length).trim();
  if (!token) {
    throw ApiError.unauthorized('No token provided');
  }

  const decoded = verifyAccessToken(token);
  req.user = {
    userId: decoded.userId,
    email: decoded.email,
    role: decoded.role as any,
  };

  next();
};

export const optionalAuth = (req: Request, _res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next();
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return next();
  }

  try {
    const decoded = verifyAccessToken(token);
    req.user = {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role as any,
    };
  } catch {
    // Token invalid, continue without user
  }

  next();
};