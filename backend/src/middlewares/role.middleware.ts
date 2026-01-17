import { Response, NextFunction } from 'express';
import { AuthRequest, UserRole } from '../types';

export const authorize = (...roles: UserRole[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Authentification requise',
      });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        message: 'Accès non autorisé',
      });
      return;
    }

    next();
  };
};

export const isAdmin = authorize('admin');
export const isCompany = authorize('compagnie');
export const isClient = authorize('client');
export const isAdminOrCompany = authorize('admin', 'compagnie');
