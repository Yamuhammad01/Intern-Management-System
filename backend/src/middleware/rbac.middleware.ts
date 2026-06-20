import { Request, Response, NextFunction } from 'express';
import { UserRole } from '@prisma/client';
import { ApiError } from '../utils/ApiError';

export const authorize = (...allowedRoles: UserRole[]) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      throw ApiError.unauthorized('Authentication required');
    }

    if (!allowedRoles.includes(req.user.role as UserRole)) {
      throw ApiError.forbidden(
        `Access denied. Required role: ${allowedRoles.join(', ')}`,
      );
    }

    next();
  };
};

export const authorizeSelfOrRoles = (paramUserId: string, ...allowedRoles: UserRole[]) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      throw ApiError.unauthorized('Authentication required');
    }

    const targetUserId = req.params[paramUserId] || req.body[paramUserId];

    // Allow if user is accessing their own resource OR has required role
    if (req.user.userId === targetUserId) {
      return next();
    }

    if (allowedRoles.includes(req.user.role as UserRole)) {
      return next();
    }

    throw ApiError.forbidden('Access denied');
  };
};