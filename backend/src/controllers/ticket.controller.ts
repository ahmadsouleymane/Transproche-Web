import { Request, Response, NextFunction } from 'express';
import { Ticket } from '../models/Ticket';
import { Trip } from '../models/Trip';
import { AppException } from '../middlewares/error.middleware';
import { AuthRequest } from '../types';
import { ticketService } from '../services/ticket.service';
import { emailService } from '../services/email.service';

export const ticketController = {
  // Get user's tickets
  async getMyTickets(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const status = req.query.status as string;

      const query: Record<string, unknown> = { user: req.user?._id };
      if (status) query.status = status;

      const total = await Ticket.countDocuments(query);
      const tickets = await Ticket.find(query)
        .populate('company', 'name logo phone')
        .populate('trip', 'departure arrival departureTime')
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ createdAt: -1 });

      res.json({
        success: true,
        data: {
          tickets,
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

  // Get company's tickets
  async getCompanyTickets(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user?.company) {
        throw new AppException('Compagnie non associée', 400);
      }

      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const status = req.query.status as string;

      const query: Record<string, unknown> = { company: req.user.company };
      if (status) query.status = status;

      const total = await Ticket.countDocuments(query);
      const tickets = await Ticket.find(query)
        .populate('user', 'name phone email')
        .populate('trip', 'departure arrival departureTime price')
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ createdAt: -1 });

      res.json({
        success: true,
        data: {
          tickets,
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

  // Get all tickets (admin)
  async getAllTickets(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const status = req.query.status as string;
      const company = req.query.company as string;

      const query: Record<string, unknown> = {};
      if (status) query.status = status;
      if (company) query.company = company;

      const total = await Ticket.countDocuments(query);
      const tickets = await Ticket.find(query)
        .populate('user', 'name phone email')
        .populate('company', 'name')
        .populate('trip', 'departure arrival departureTime price')
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ createdAt: -1 });

      res.json({
        success: true,
        data: {
          tickets,
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

  // Get ticket by reservation number
  async getByReservationNumber(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const ticket = await Ticket.findOne({ reservationNumber: req.params.reservationNumber })
        .populate('company', 'name logo phone address')
        .populate('trip', 'departure arrival departureTime');

      if (!ticket) {
        throw new AppException('Réservation non trouvée', 404);
      }

      res.json({
        success: true,
        data: ticket,
      });
    } catch (error) {
      next(error);
    }
  },

  // Create ticket
  async create(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { tripId, travelDate, seats, passengerInfo } = req.body;

      const trip = await Trip.findById(tripId);
      if (!trip) {
        throw new AppException('Trajet non trouvé', 404);
      }

      if (trip.status !== 'active') {
        throw new AppException('Ce trajet n\'est plus disponible', 400);
      }

      if (trip.availableSeats < seats) {
        throw new AppException(`Seulement ${trip.availableSeats} places disponibles`, 400);
      }

      // Validate travel date
      const travelDateObj = new Date(travelDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (travelDateObj < today) {
        throw new AppException('La date de voyage ne peut pas être dans le passé', 400);
      }

      // Check if travel date matches trip's operating days
      const dayOfWeek = travelDateObj.getDay();
      if (!trip.daysOfWeek.includes(dayOfWeek)) {
        throw new AppException('Ce trajet n\'est pas disponible pour cette date', 400);
      }

      const totalPrice = trip.price * seats;

      const ticket = await Ticket.create({
        user: req.user?._id,
        company: trip.company,
        trip: tripId,
        travelDate,
        seats,
        totalPrice,
        passengerInfo,
        paymentMethod: 'livraison',
        status: 'en_attente',
      });

      // Update available seats
      trip.availableSeats -= seats;
      await trip.save();

      const populatedTicket = await Ticket.findById(ticket._id)
        .populate('company', 'name logo phone address')
        .populate('trip', 'departure arrival departureTime')
        .populate('user', 'name email phone');

      // Send confirmation email (non-blocking)
      emailService.sendBookingConfirmation(populatedTicket).catch(console.error);

      // Generate QR code for response
      const qrCode = await ticketService.generateQRCode(ticket.reservationNumber);

      res.status(201).json({
        success: true,
        message: 'Réservation créée avec succès',
        data: {
          ...populatedTicket?.toObject(),
          qrCode,
        },
      });
    } catch (error) {
      next(error);
    }
  },

  // Update ticket status
  async updateStatus(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { status } = req.body;
      const ticket = await Ticket.findById(req.params.id);

      if (!ticket) {
        throw new AppException('Réservation non trouvée', 404);
      }

      // Check ownership for company users
      if (req.user?.role === 'compagnie' && ticket.company.toString() !== req.user.company?.toString()) {
        throw new AppException('Non autorisé', 403);
      }

      // If cancelling, restore seats
      if (status === 'annule' && ticket.status !== 'annule') {
        const trip = await Trip.findById(ticket.trip);
        if (trip) {
          trip.availableSeats += ticket.seats;
          await trip.save();
        }
      }

      ticket.status = status;
      await ticket.save();

      // Send cancellation email if status is cancelled
      if (status === 'annule') {
        const populatedTicket = await Ticket.findById(ticket._id)
          .populate('company', 'name')
          .populate('trip', 'departure arrival departureTime')
          .populate('user', 'email');
        emailService.sendBookingCancellation(populatedTicket).catch(console.error);
      }

      res.json({
        success: true,
        message: 'Statut mis à jour',
        data: ticket,
      });
    } catch (error) {
      next(error);
    }
  },

  // Get ticket with QR code
  async getTicketWithQR(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const ticket = await ticketService.getTicketWithQR(req.params.reservationNumber);
      res.json({
        success: true,
        data: ticket,
      });
    } catch (error) {
      next(error);
    }
  },

  // Download ticket PDF
  async downloadPDF(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const pdfBuffer = await ticketService.generatePDF(req.params.reservationNumber);

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename=ticket-${req.params.reservationNumber}.pdf`
      );
      res.send(pdfBuffer);
    } catch (error) {
      next(error);
    }
  },

  // Verify ticket (for scanning QR code)
  async verifyTicket(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const ticket = await Ticket.findOne({ reservationNumber: req.params.reservationNumber })
        .populate('company', 'name logo phone')
        .populate('trip', 'departure arrival departureTime');

      if (!ticket) {
        throw new AppException('Ticket non trouvé', 404);
      }

      const travelDate = new Date(ticket.travelDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      travelDate.setHours(0, 0, 0, 0);

      const isValid = ticket.status !== 'annule' &&
                      ticket.status !== 'expire' &&
                      travelDate >= today;

      res.json({
        success: true,
        data: {
          ticket,
          isValid,
          validationMessage: isValid
            ? 'Ticket valide'
            : ticket.status === 'annule'
              ? 'Ce ticket a été annulé'
              : ticket.status === 'expire'
                ? 'Ce ticket a expiré'
                : 'Ce ticket n\'est plus valide pour aujourd\'hui',
        },
      });
    } catch (error) {
      next(error);
    }
  },
};
