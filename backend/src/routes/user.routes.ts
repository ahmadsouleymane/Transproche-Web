import { Router } from 'express';
import { body } from 'express-validator';
import { userController } from '../controllers/user.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { isAdmin } from '../middlewares/role.middleware';
import { validate } from '../middlewares/validate.middleware';

const router = Router();

// Update validation
const updateValidation = [
  body('name').optional().trim().notEmpty().withMessage('Le nom ne peut pas être vide'),
  body('email').optional().isEmail().withMessage('Email invalide'),
  body('phone').optional().trim().notEmpty().withMessage('Le téléphone ne peut pas être vide'),
  body('role').optional().isIn(['client', 'compagnie', 'admin']).withMessage('Rôle invalide'),
];

// All routes require admin access
router.use(authenticate, isAdmin);

router.get('/', userController.getAll);
router.get('/:id', userController.getById);
router.put('/:id', validate(updateValidation), userController.update);
router.delete('/:id', userController.delete);

export default router;
