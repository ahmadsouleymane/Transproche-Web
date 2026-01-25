import { Router } from 'express';
import { body } from 'express-validator';
import { ticketController } from '../controllers/ticket.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { isAdmin, isAdminOrCompany } from '../middlewares/role.middleware';
import { validate } from '../middlewares/validate.middleware';

const router = Router();

// Create validation
const createValidation = [
  body('tripId').notEmpty().withMessage('Le trajet est requis'),
  body('travelDate').isISO8601().withMessage('Date de voyage invalide'),
  body('seats').isInt({ min: 1 }).withMessage('Le nombre de places doit être au moins 1'),
  body('passengerInfo.name').trim().notEmpty().withMessage('Le nom du passager est requis'),
  body('passengerInfo.phone').trim().notEmpty().withMessage('Le téléphone du passager est requis'),
];

// Status update validation
const statusValidation = [
  body('status').isIn(['en_attente', 'paye_livraison', 'confirme', 'annule', 'expire']).withMessage('Statut invalide'),
];

// User routes
router.get('/', authenticate, ticketController.getMyTickets);
router.post('/', authenticate, validate(createValidation), ticketController.create);

// Company routes
router.get('/company', authenticate, isAdminOrCompany, ticketController.getCompanyTickets);

// Admin routes
router.get('/all', authenticate, isAdmin, ticketController.getAllTickets);

// Shared routes
router.get('/reservation/:reservationNumber', ticketController.getByReservationNumber);
router.patch('/:id/status', authenticate, isAdminOrCompany, validate(statusValidation), ticketController.updateStatus);

// QR code and PDF routes (public for ticket verification)
router.get('/:reservationNumber/qr', ticketController.getTicketWithQR);
router.get('/:reservationNumber/pdf', ticketController.downloadPDF);
router.get('/verify/:reservationNumber', ticketController.verifyTicket);

export default router;
