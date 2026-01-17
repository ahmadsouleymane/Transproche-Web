import { Request, Response, NextFunction } from 'express';
import { Company } from '../models/Company';
import { AppException } from '../middlewares/error.middleware';
import { AuthRequest } from '../types';
import fs from 'fs';
import path from 'path';

export const companyController = {
  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const status = req.query.status as string;

      const query: Record<string, unknown> = {};
      if (status) {
        query.status = status;
      }

      const total = await Company.countDocuments(query);
      const companies = await Company.find(query)
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ createdAt: -1 });

      res.json({
        success: true,
        data: {
          companies,
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

  async getActive(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const companies = await Company.find({ status: 'active' }).sort({ name: 1 });

      res.json({
        success: true,
        data: companies,
      });
    } catch (error) {
      next(error);
    }
  },

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const company = await Company.findById(req.params.id);

      if (!company) {
        throw new AppException('Compagnie non trouvée', 404);
      }

      res.json({
        success: true,
        data: company,
      });
    } catch (error) {
      next(error);
    }
  },

  async create(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { name, description, phone, email, address, commission } = req.body;

      const existingCompany = await Company.findOne({ name });
      if (existingCompany) {
        throw new AppException('Une compagnie avec ce nom existe déjà', 400);
      }

      let logoPath: string | undefined;
      if (req.file) {
        logoPath = `/uploads/logos/${req.file.filename}`;
      }

      const company = await Company.create({
        name,
        description,
        phone,
        email,
        address,
        commission: commission || 10,
        logo: logoPath,
        status: 'pending',
      });

      res.status(201).json({
        success: true,
        message: 'Compagnie créée avec succès',
        data: company,
      });
    } catch (error) {
      next(error);
    }
  },

  async update(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const company = await Company.findById(req.params.id);
      if (!company) {
        throw new AppException('Compagnie non trouvée', 404);
      }

      const { name, description, phone, email, address, status } = req.body;

      // Check if name is taken by another company
      if (name && name !== company.name) {
        const existingCompany = await Company.findOne({ name, _id: { $ne: company._id } });
        if (existingCompany) {
          throw new AppException('Une compagnie avec ce nom existe déjà', 400);
        }
      }

      let logoPath = company.logo;
      if (req.file) {
        // Delete old logo if exists
        if (company.logo) {
          const oldLogoPath = path.join(__dirname, '../../', company.logo);
          if (fs.existsSync(oldLogoPath)) {
            fs.unlinkSync(oldLogoPath);
          }
        }
        logoPath = `/uploads/logos/${req.file.filename}`;
      }

      const updatedCompany = await Company.findByIdAndUpdate(
        req.params.id,
        { name, description, phone, email, address, status, logo: logoPath },
        { new: true, runValidators: true }
      );

      res.json({
        success: true,
        message: 'Compagnie mise à jour',
        data: updatedCompany,
      });
    } catch (error) {
      next(error);
    }
  },

  async updateCommission(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { commission } = req.body;

      const company = await Company.findById(req.params.id);
      if (!company) {
        throw new AppException('Compagnie non trouvée', 404);
      }

      company.commission = commission;
      await company.save();

      res.json({
        success: true,
        message: 'Commission mise à jour',
        data: company,
      });
    } catch (error) {
      next(error);
    }
  },

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const company = await Company.findById(req.params.id);
      if (!company) {
        throw new AppException('Compagnie non trouvée', 404);
      }

      // Delete logo if exists
      if (company.logo) {
        const logoPath = path.join(__dirname, '../../', company.logo);
        if (fs.existsSync(logoPath)) {
          fs.unlinkSync(logoPath);
        }
      }

      await Company.findByIdAndDelete(req.params.id);

      res.json({
        success: true,
        message: 'Compagnie supprimée',
      });
    } catch (error) {
      next(error);
    }
  },
};
