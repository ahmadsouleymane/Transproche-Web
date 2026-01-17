import { Request, Response, NextFunction } from 'express';
import { User } from '../models/User';
import { Company } from '../models/Company';
import { Ticket } from '../models/Ticket';
import { Parcel } from '../models/Parcel';
import { Trip } from '../models/Trip';

export const statsController = {
  async getDashboardStats(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const [
        totalUsers,
        totalCompanies,
        activeCompanies,
        totalTickets,
        confirmedTickets,
        pendingTickets,
        totalParcels,
        deliveredParcels,
        inTransitParcels,
        totalTrips,
        activeTrips,
      ] = await Promise.all([
        User.countDocuments(),
        Company.countDocuments(),
        Company.countDocuments({ status: 'active' }),
        Ticket.countDocuments(),
        Ticket.countDocuments({ status: 'confirme' }),
        Ticket.countDocuments({ status: 'en_attente' }),
        Parcel.countDocuments(),
        Parcel.countDocuments({ status: 'livre' }),
        Parcel.countDocuments({ status: 'en_transit' }),
        Trip.countDocuments(),
        Trip.countDocuments({ status: 'active' }),
      ]);

      const ticketRevenue = await Ticket.aggregate([
        { $match: { status: { $in: ['confirme', 'paye_livraison'] } } },
        { $group: { _id: null, total: { $sum: '$totalPrice' } } },
      ]);

      const parcelRevenue = await Parcel.aggregate([
        { $match: { status: { $in: ['livre', 'en_transit', 'collecte'] } } },
        { $group: { _id: null, total: { $sum: '$price' } } },
      ]);

      const recentTickets = await Ticket.find()
        .populate('company', 'name')
        .populate('user', 'name')
        .populate('trip', 'departure arrival')
        .sort({ createdAt: -1 })
        .limit(5);

      const recentParcels = await Parcel.find()
        .populate('company', 'name')
        .populate('user', 'name')
        .sort({ createdAt: -1 })
        .limit(5);

      res.json({
        success: true,
        data: {
          users: { total: totalUsers },
          companies: { total: totalCompanies, active: activeCompanies },
          tickets: { total: totalTickets, confirmed: confirmedTickets, pending: pendingTickets },
          parcels: { total: totalParcels, delivered: deliveredParcels, inTransit: inTransitParcels },
          trips: { total: totalTrips, active: activeTrips },
          revenue: {
            tickets: ticketRevenue[0]?.total || 0,
            parcels: parcelRevenue[0]?.total || 0,
            total: (ticketRevenue[0]?.total || 0) + (parcelRevenue[0]?.total || 0),
          },
          recent: { tickets: recentTickets, parcels: recentParcels },
        },
      });
    } catch (error) {
      next(error);
    }
  },
};
