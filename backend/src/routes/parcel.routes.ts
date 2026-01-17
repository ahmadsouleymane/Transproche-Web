import { Router } from 'express';
import { body } from 'express-validator';
import { parcelController } from '../controllers/parcel.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { isAdmin, isAdminOrCompany } from '../middlewares/role.middleware';
import { validate } from '../middlewares/validate.middleware';
import { NIGER_CITIES } from '../config/cities';

const router = Router();

// Create validation
const createValidation = [
  body('sender.name').trim().notEmpty().withMessage('Le nom de l\'expéditeur est requis'),
  body('sender.phone').trim().notEmpty().withMessage('Le téléphone de l\'expéditeur est requis'),
  body('sender.address').trim().notEmpty().withMessage('L\'adresse de l\'expéditeur est requise'),
  body('receiver.name').trim().notEmpty().withMessage('Le nom du destinataire est requis'),
  body('receiver.phone').trim().notEmpty().withMessage('Le téléphone du destinataire est requis'),
  body('receiver.address').trim().notEmpty().withMessage('L\'adresse du destinataire est requise'),
  body('companyId').notEmpty().withMessage('La compagnie est requise'),
  body('type').isIn(['petit', 'moyen', 'gros']).withMessage('Type de colis invalide'),
  body('departure').isIn(NIGER_CITIES).withMessage('Ville de départ invalide'),
  body('arrival').isIn(NIGER_CITIES).withMessage('Ville d\'arrivée invalide'),
];

// Status update validation
const statusValidation = [
  body('status').isIn(['en_attente', 'collecte', 'en_transit', 'livre', 'annule']).withMessage('Statut invalide'),
];

// Public routes
router.get('/prices', parcelController.getPrices);
router.get('/track/:trackingNumber', parcelController.track);

// User routes
router.get('/', authenticate, parcelController.getMyParcels);
router.post('/', authenticate, validate(createValidation), parcelController.create);

// Company routes
router.get('/company', authenticate, isAdminOrCompany, parcelController.getCompanyParcels);

// Admin routes
router.get('/all', authenticate, isAdmin, parcelController.getAllParcels);

// Shared routes
router.patch('/:id/status', authenticate, isAdminOrCompany, validate(statusValidation), parcelController.updateStatus);

export default router;
