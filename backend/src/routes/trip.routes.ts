import { Router } from 'express';
import { body } from 'express-validator';
import { tripController } from '../controllers/trip.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { isAdminOrCompany } from '../middlewares/role.middleware';
import { validate } from '../middlewares/validate.middleware';

const router = Router();

// Create/Update validation
const tripValidation = [
  body('departure').trim().notEmpty().withMessage('Ville de départ requise'),
  body('arrival').trim().notEmpty().withMessage('Ville d\'arrivée requise'),
  body('departureTime').matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Format d\'heure invalide (HH:MM)'),
  body('price').isFloat({ min: 0 }).withMessage('Le prix doit être positif'),
  body('totalSeats').isInt({ min: 1 }).withMessage('Le nombre de places doit être au moins 1'),
  body('daysOfWeek').isArray({ min: 1 }).withMessage('Les jours de la semaine sont requis'),
];

// Public routes
router.get('/', tripController.getAll);
router.get('/search', tripController.search);
router.get('/:id', tripController.getById);

// Company routes
router.get('/company/my', authenticate, isAdminOrCompany, tripController.getByCompany);
router.post('/', authenticate, isAdminOrCompany, validate(tripValidation), tripController.create);
router.put('/:id', authenticate, isAdminOrCompany, tripController.update);
router.delete('/:id', authenticate, isAdminOrCompany, tripController.delete);

export default router;
