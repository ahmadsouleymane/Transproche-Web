import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/auth.service';
import { verifyRefreshToken } from '../utils/jwt.utils';
import { AuthRequest } from '../types';

export const authController = {
  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await authService.register(req.body);

      res.status(201).json({
        success: true,
        message: 'Inscription réussie',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await authService.login(req.body);

      res.json({
        success: true,
        message: 'Connexion réussie',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },

  async refreshToken(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        res.status(400).json({
          success: false,
          message: 'Refresh token requis',
        });
        return;
      }

      const decoded = verifyRefreshToken(refreshToken);
      const tokens = await authService.refreshTokens(decoded.userId, decoded.role);

      res.json({
        success: true,
        message: 'Tokens rafraîchis',
        data: tokens,
      });
    } catch (error) {
      next(error);
    }
  },

  async getMe(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: 'Non authentifié',
        });
        return;
      }

      const user = await authService.getProfile(req.user._id.toString());

      res.json({
        success: true,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  },
};
