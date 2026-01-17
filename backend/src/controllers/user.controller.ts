import { Request, Response, NextFunction } from 'express';
import { User } from '../models/User';
import { AppException } from '../middlewares/error.middleware';

export const userController = {
  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const role = req.query.role as string;

      const query: Record<string, unknown> = {};
      if (role) {
        query.role = role;
      }

      const total = await User.countDocuments(query);
      const users = await User.find(query)
        .populate('company', 'name')
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ createdAt: -1 });

      res.json({
        success: true,
        data: {
          users,
          pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit),
          },
        },
      });
    } catch (error) {
      next(error);
    }
  },

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await User.findById(req.params.id).populate('company');

      if (!user) {
        throw new AppException('Utilisateur non trouvé', 404);
      }

      res.json({
        success: true,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  },

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { name, phone, email, role, company } = req.body;

      const user = await User.findById(req.params.id);
      if (!user) {
        throw new AppException('Utilisateur non trouvé', 404);
      }

      // Check if email is taken by another user
      if (email && email !== user.email) {
        const existingEmail = await User.findOne({ email, _id: { $ne: user._id } });
        if (existingEmail) {
          throw new AppException('Cet email est déjà utilisé', 400);
        }
      }

      // Check if phone is taken by another user
      if (phone && phone !== user.phone) {
        const existingPhone = await User.findOne({ phone, _id: { $ne: user._id } });
        if (existingPhone) {
          throw new AppException('Ce numéro de téléphone est déjà utilisé', 400);
        }
      }

      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        { name, phone, email, role, company },
        { new: true, runValidators: true }
      ).populate('company', 'name');

      res.json({
        success: true,
        message: 'Utilisateur mis à jour',
        data: updatedUser,
      });
    } catch (error) {
      next(error);
    }
  },

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await User.findById(req.params.id);

      if (!user) {
        throw new AppException('Utilisateur non trouvé', 404);
      }

      await User.findByIdAndDelete(req.params.id);

      res.json({
        success: true,
        message: 'Utilisateur supprimé',
      });
    } catch (error) {
      next(error);
    }
  },
};
