import { Request, Response, NextFunction } from 'express';
import { Parcel } from '../models/Parcel';
import { Company } from '../models/Company';
import { AppException } from '../middlewares/error.middleware';
import { AuthRequest } from '../types';

// Pricing based on parcel type
const PARCEL_PRICES = {
  petit: 2000,
  moyen: 4000,
  gros: 7000,
};

export const parcelController = {
  // Get user's parcels
  async getMyParcels(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const status = req.query.status as string;

      const query: Record<string, unknown> = { user: req.user?._id };
      if (status) query.status = status;

      const total = await Parcel.countDocuments(query);
      const parcels = await Parcel.find(query)
        .populate('company', 'name logo phone')
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ createdAt: -1 });

      res.json({
        success: true,
        data: {
          parcels,
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

  // Get company's parcels
  async getCompanyParcels(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user?.company) {
        throw new AppException('Compagnie non associée', 400);
      }

      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const status = req.query.status as string;

      const query: Record<string, unknown> = { company: req.user.company };
      if (status) query.status = status;

      const total = await Parcel.countDocuments(query);
      const parcels = await Parcel.find(query)
        .populate('user', 'name phone email')
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ createdAt: -1 });

      res.json({
        success: true,
        data: {
          parcels,
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

  // Get all parcels (admin)
  async getAllParcels(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const status = req.query.status as string;
      const company = req.query.company as string;

      const query: Record<string, unknown> = {};
      if (status) query.status = status;
      if (company) query.company = company;

      const total = await Parcel.countDocuments(query);
      const parcels = await Parcel.find(query)
        .populate('user', 'name phone email')
        .populate('company', 'name')
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ createdAt: -1 });

      res.json({
        success: true,
        data: {
          parcels,
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

  // Track parcel by tracking number
  async track(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const parcel = await Parcel.findOne({ trackingNumber: req.params.trackingNumber })
        .populate('company', 'name logo phone');

      if (!parcel) {
        throw new AppException('Colis non trouvé', 404);
      }

      res.json({
        success: true,
        data: parcel,
      });
    } catch (error) {
      next(error);
    }
  },

  // Get parcel prices
  async getPrices(_req: Request, res: Response): Promise<void> {
    res.json({
      success: true,
      data: PARCEL_PRICES,
    });
  },

  // Create parcel (envoi mode)
  async create(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { sender, receiver, companyId, type, description, departure, arrival, pickupLocation } = req.body;

      const company = await Company.findById(companyId);
      if (!company) {
        throw new AppException('Compagnie non trouvée', 404);
      }

      if (company.status !== 'active') {
        throw new AppException('Cette compagnie n\'est pas disponible', 400);
      }

      if (departure === arrival) {
        throw new AppException('La ville de départ et d\'arrivée doivent être différentes', 400);
      }

      const price = PARCEL_PRICES[type as keyof typeof PARCEL_PRICES];
      if (!price) {
        throw new AppException('Type de colis invalide', 400);
      }

      const parcel = await Parcel.create({
        parcelMode: 'envoi',
        sender,
        receiver,
        user: req.user?._id,
        company: companyId,
        type,
        description,
        price,
        departure,
        arrival,
        pickupLocation,
        paymentMethod: 'livraison',
        status: 'en_attente',
      });

      const populatedParcel = await Parcel.findById(parcel._id)
        .populate('company', 'name logo phone');

      res.status(201).json({
        success: true,
        message: 'Envoi de colis créé avec succès',
        data: populatedParcel,
      });
    } catch (error) {
      next(error);
    }
  },

  // Create parcel (recuperation mode)
  async createRecuperation(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };

      // Parse form data (JSON strings if nested)
      let sender = req.body.sender;
      let receiver = req.body.receiver;

      if (typeof sender === 'string') {
        sender = JSON.parse(sender);
      }
      if (typeof receiver === 'string') {
        receiver = JSON.parse(receiver);
      }

      const { companyId, type, description, departure, arrival, pickupCompany } = req.body;

      // Validate required files
      if (!files.receiptPhoto || !files.receiptPhoto[0]) {
        throw new AppException('La photo du reçu est requise', 400);
      }
      if (!files.idPhoto || !files.idPhoto[0]) {
        throw new AppException('La photo de la pièce d\'identité est requise', 400);
      }
      if (!pickupCompany) {
        throw new AppException('La société de récupération est requise', 400);
      }

      const company = await Company.findById(companyId);
      if (!company) {
        throw new AppException('Compagnie non trouvée', 404);
      }

      if (company.status !== 'active') {
        throw new AppException('Cette compagnie n\'est pas disponible', 400);
      }

      if (departure === arrival) {
        throw new AppException('La ville de départ et d\'arrivée doivent être différentes', 400);
      }

      const price = PARCEL_PRICES[type as keyof typeof PARCEL_PRICES];
      if (!price) {
        throw new AppException('Type de colis invalide', 400);
      }

      const parcel = await Parcel.create({
        parcelMode: 'recuperation',
        sender,
        receiver,
        user: req.user?._id,
        company: companyId,
        type,
        description,
        price,
        departure,
        arrival,
        pickupCompany,
        receiptPhoto: `/uploads/parcels/${files.receiptPhoto[0].filename}`,
        idPhoto: `/uploads/parcels/${files.idPhoto[0].filename}`,
        paymentMethod: 'livraison',
        status: 'en_attente',
      });

      const populatedParcel = await Parcel.findById(parcel._id)
        .populate('company', 'name logo phone');

      res.status(201).json({
        success: true,
        message: 'Demande de récupération de colis créée avec succès',
        data: populatedParcel,
      });
    } catch (error) {
      next(error);
    }
  },

  // Update parcel status
  async updateStatus(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { status } = req.body;
      const parcel = await Parcel.findById(req.params.id);

      if (!parcel) {
        throw new AppException('Colis non trouvé', 404);
      }

      // Check ownership for company users
      if (req.user?.role === 'compagnie' && parcel.company.toString() !== req.user.company?.toString()) {
        throw new AppException('Non autorisé', 403);
      }

      parcel.status = status;
      await parcel.save();

      res.json({
        success: true,
        message: 'Statut mis à jour',
        data: parcel,
      });
    } catch (error) {
      next(error);
    }
  },
};
