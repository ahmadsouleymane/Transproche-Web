import { Request, Response, NextFunction } from 'express';
import { Advertisement } from '../models/Advertisement';
import { AppException } from '../middlewares/error.middleware';
import fs from 'fs';
import path from 'path';

export const advertisementController = {
  // Get all advertisements
  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const total = await Advertisement.countDocuments();
      const advertisements = await Advertisement.find()
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ position: 1 });

      res.json({
        success: true,
        data: {
          advertisements,
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

  // Get active advertisements
  async getActive(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const now = new Date();

      const advertisements = await Advertisement.find({
        active: true,
        $or: [
          { startDate: { $exists: false }, endDate: { $exists: false } },
          { startDate: { $lte: now }, endDate: { $gte: now } },
          { startDate: { $lte: now }, endDate: { $exists: false } },
          { startDate: { $exists: false }, endDate: { $gte: now } },
        ],
      }).sort({ position: 1 });

      res.json({
        success: true,
        data: advertisements,
      });
    } catch (error) {
      next(error);
    }
  },

  // Get advertisement by ID
  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const advertisement = await Advertisement.findById(req.params.id);

      if (!advertisement) {
        throw new AppException('Publicité non trouvée', 404);
      }

      res.json({
        success: true,
        data: advertisement,
      });
    } catch (error) {
      next(error);
    }
  },

  // Create advertisement
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { title, link, active, position, startDate, endDate } = req.body;

      if (!req.file) {
        throw new AppException('L\'image est requise', 400);
      }

      const imagePath = `/uploads/ads/${req.file.filename}`;

      const advertisement = await Advertisement.create({
        title,
        image: imagePath,
        link,
        active: active !== undefined ? active : true,
        position: position || 0,
        startDate,
        endDate,
      });

      res.status(201).json({
        success: true,
        message: 'Publicité créée avec succès',
        data: advertisement,
      });
    } catch (error) {
      next(error);
    }
  },

  // Update advertisement
  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const advertisement = await Advertisement.findById(req.params.id);

      if (!advertisement) {
        throw new AppException('Publicité non trouvée', 404);
      }

      const { title, link, active, position, startDate, endDate } = req.body;

      let imagePath = advertisement.image;
      if (req.file) {
        // Delete old image
        const oldImagePath = path.join(__dirname, '../../', advertisement.image);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
        imagePath = `/uploads/ads/${req.file.filename}`;
      }

      const updatedAd = await Advertisement.findByIdAndUpdate(
        req.params.id,
        {
          title,
          image: imagePath,
          link,
          active,
          position,
          startDate,
          endDate,
        },
        { new: true, runValidators: true }
      );

      res.json({
        success: true,
        message: 'Publicité mise à jour',
        data: updatedAd,
      });
    } catch (error) {
      next(error);
    }
  },

  // Delete advertisement
  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const advertisement = await Advertisement.findById(req.params.id);

      if (!advertisement) {
        throw new AppException('Publicité non trouvée', 404);
      }

      // Delete image
      const imagePath = path.join(__dirname, '../../', advertisement.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }

      await Advertisement.findByIdAndDelete(req.params.id);

      res.json({
        success: true,
        message: 'Publicité supprimée',
      });
    } catch (error) {
      next(error);
    }
  },
};
