import { Request, Response, NextFunction } from 'express';
import { Trip } from '../models/Trip';
import { AppException } from '../middlewares/error.middleware';
import { AuthRequest } from '../types';

export const tripController = {
  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const status = req.query.status as string;
      const company = req.query.company as string;

      const query: Record<string, unknown> = {};
      if (status) query.status = status;
      if (company) query.company = company;

      const total = await Trip.countDocuments(query);
      const trips = await Trip.find(query)
        .populate('company', 'name logo')
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ createdAt: -1 });

      res.json({
        success: true,
        data: {
          trips,
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

  async search(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const {
        departure,
        arrival,
        date,
        minPrice,
        maxPrice,
        company,
        sortBy,
        sortOrder,
      } = req.query;

      if (!departure || !arrival) {
        throw new AppException('Départ et arrivée sont requis', 400);
      }

      const query: Record<string, unknown> = {
        departure,
        arrival,
        status: 'active',
        availableSeats: { $gt: 0 },
      };

      // If date provided, filter by day of week
      if (date) {
        const searchDate = new Date(date as string);
        const dayOfWeek = searchDate.getDay();
        query.daysOfWeek = dayOfWeek;
      }

      // Price range filter
      if (minPrice || maxPrice) {
        query.price = {};
        if (minPrice) (query.price as Record<string, number>).$gte = parseInt(minPrice as string);
        if (maxPrice) (query.price as Record<string, number>).$lte = parseInt(maxPrice as string);
      }

      // Company filter
      if (company) {
        query.company = company;
      }

      // Determine sorting
      let sortOptions: Record<string, 1 | -1> = { departureTime: 1 };
      if (sortBy === 'price') {
        sortOptions = { price: sortOrder === 'desc' ? -1 : 1 };
      } else if (sortBy === 'time') {
        sortOptions = { departureTime: sortOrder === 'desc' ? -1 : 1 };
      }

      const trips = await Trip.find(query)
        .populate('company', 'name logo phone')
        .sort(sortOptions);

      // Get unique companies for filter dropdown
      const allTripsForFilters = await Trip.find({
        departure,
        arrival,
        status: 'active',
      }).populate('company', 'name');

      const companies = [...new Map(
        allTripsForFilters
          .filter(t => t.company)
          .map(t => [(t.company as any)._id.toString(), { _id: (t.company as any)._id, name: (t.company as any).name }])
      ).values()];

      // Get price range for filters
      const priceRange = {
        min: Math.min(...allTripsForFilters.map(t => t.price)),
        max: Math.max(...allTripsForFilters.map(t => t.price)),
      };

      res.json({
        success: true,
        data: trips,
        filters: {
          companies,
          priceRange,
        },
      });
    } catch (error) {
      next(error);
    }
  },

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const trip = await Trip.findById(req.params.id).populate('company');

      if (!trip) {
        throw new AppException('Trajet non trouvé', 404);
      }

      res.json({
        success: true,
        data: trip,
      });
    } catch (error) {
      next(error);
    }
  },

  async getByCompany(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user?.company) {
        throw new AppException('Compagnie non associée', 400);
      }

      const trips = await Trip.find({ company: req.user.company }).sort({ createdAt: -1 });

      res.json({
        success: true,
        data: trips,
      });
    } catch (error) {
      next(error);
    }
  },

  async create(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user?.company) {
        throw new AppException('Compagnie non associée', 400);
      }

      const {
        departure,
        arrival,
        departureTime,
        price,
        totalSeats,
        daysOfWeek,
      } = req.body;

      if (departure === arrival) {
        throw new AppException('La ville de départ et d\'arrivée doivent être différentes', 400);
      }

      const trip = await Trip.create({
        company: req.user.company,
        departure,
        arrival,
        departureTime,
        price,
        availableSeats: totalSeats,
        totalSeats,
        daysOfWeek,
        status: 'active',
      });

      res.status(201).json({
        success: true,
        message: 'Trajet créé avec succès',
        data: trip,
      });
    } catch (error) {
      next(error);
    }
  },

  async update(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const trip = await Trip.findById(req.params.id);

      if (!trip) {
        throw new AppException('Trajet non trouvé', 404);
      }

      // Check ownership for company users
      if (req.user?.role === 'compagnie' && trip.company.toString() !== req.user.company?.toString()) {
        throw new AppException('Non autorisé', 403);
      }

      const {
        departure,
        arrival,
        departureTime,
        price,
        availableSeats,
        totalSeats,
        daysOfWeek,
        status,
      } = req.body;

      if (departure && arrival && departure === arrival) {
        throw new AppException('La ville de départ et d\'arrivée doivent être différentes', 400);
      }

      const updatedTrip = await Trip.findByIdAndUpdate(
        req.params.id,
        {
          departure,
          arrival,
          departureTime,
          price,
          availableSeats,
          totalSeats,
          daysOfWeek,
          status,
        },
        { new: true, runValidators: true }
      );

      res.json({
        success: true,
        message: 'Trajet mis à jour',
        data: updatedTrip,
      });
    } catch (error) {
      next(error);
    }
  },

  async delete(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const trip = await Trip.findById(req.params.id);

      if (!trip) {
        throw new AppException('Trajet non trouvé', 404);
      }

      // Check ownership for company users
      if (req.user?.role === 'compagnie' && trip.company.toString() !== req.user.company?.toString()) {
        throw new AppException('Non autorisé', 403);
      }

      await Trip.findByIdAndDelete(req.params.id);

      res.json({
        success: true,
        message: 'Trajet supprimé',
      });
    } catch (error) {
      next(error);
    }
  },
};
