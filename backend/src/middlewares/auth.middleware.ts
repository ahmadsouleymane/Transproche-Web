import { Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt.utils';
import { User } from '../models/User';
import { AuthRequest } from '../types';

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        message: 'Token d\'authentification requis',
      });
      return;
    }

    const token = authHeader.split(' ')[1];

    const decoded = verifyAccessToken(token);

    const user = await User.findById(decoded.userId).select('+password');

    if (!user) {
      res.status(401).json({
        success: false,
        message: 'Utilisateur non trouvé',
      });
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Token invalide ou expiré',
    });
  }
};

export const optionalAuth = async (
  req: AuthRequest,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const decoded = verifyAccessToken(token);
      const user = await User.findById(decoded.userId);
      if (user) {
        req.user = user;
      }
    }
    next();
  } catch {
    next();
  }
};
