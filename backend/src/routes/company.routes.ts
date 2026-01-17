import { Router } from 'express';
import { body } from 'express-validator';
import { companyController } from '../controllers/company.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { isAdmin, isAdminOrCompany } from '../middlewares/role.middleware';
import { validate } from '../middlewares/validate.middleware';
import { uploadLogo } from '../config/multer';

const router = Router();

// Create/Update validation
const companyValidation = [
  body('name').trim().notEmpty().withMessage('Le nom est requis'),
  body('email').isEmail().withMessage('Email invalide'),
  body('phone').trim().notEmpty().withMessage('Le téléphone est requis'),
  body('address').trim().notEmpty().withMessage('L\'adresse est requise'),
];

const commissionValidation = [
  body('commission').isFloat({ min: 0, max: 100 }).withMessage('La commission doit être entre 0 et 100'),
];

// Public routes
router.get('/', companyController.getAll);
router.get('/active', companyController.getActive);
router.get('/:id', companyController.getById);

// Admin routes
router.post('/', authenticate, isAdmin, uploadLogo.single('logo'), validate(companyValidation), companyController.create);
router.put('/:id', authenticate, isAdminOrCompany, uploadLogo.single('logo'), companyController.update);
router.patch('/:id/commission', authenticate, isAdmin, validate(commissionValidation), companyController.updateCommission);
router.delete('/:id', authenticate, isAdmin, companyController.delete);

export default router;
