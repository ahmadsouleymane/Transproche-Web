import { Router } from 'express';
import { body } from 'express-validator';
import { authController } from '../controllers/auth.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';

const router = Router();

// Register validation
const registerValidation = [
  body('name').trim().notEmpty().withMessage('Le nom est requis'),
  body('email').isEmail().withMessage('Email invalide'),
  body('phone').trim().notEmpty().withMessage('Le téléphone est requis'),
  body('password').isLength({ min: 6 }).withMessage('Le mot de passe doit contenir au moins 6 caractères'),
];

// Login validation
const loginValidation = [
  body('email').isEmail().withMessage('Email invalide'),
  body('password').notEmpty().withMessage('Le mot de passe est requis'),
];

// Forgot password validation
const forgotPasswordValidation = [
  body('email').isEmail().withMessage('Email invalide'),
];

// Reset password validation
const resetPasswordValidation = [
  body('token').notEmpty().withMessage('Token requis'),
  body('password').isLength({ min: 6 }).withMessage('Le mot de passe doit contenir au moins 6 caractères'),
];

// Update profile validation
const updateProfileValidation = [
  body('name').optional().trim().notEmpty().withMessage('Le nom ne peut pas être vide'),
  body('phone').optional().trim().notEmpty().withMessage('Le téléphone ne peut pas être vide'),
];

// Change password validation
const changePasswordValidation = [
  body('currentPassword').notEmpty().withMessage('Le mot de passe actuel est requis'),
  body('newPassword').isLength({ min: 6 }).withMessage('Le nouveau mot de passe doit contenir au moins 6 caractères'),
];

// Routes
router.post('/register', validate(registerValidation), authController.register);
router.post('/login', validate(loginValidation), authController.login);
router.post('/refresh', authController.refreshToken);
router.get('/me', authenticate, authController.getMe);

// Password reset routes
router.post('/forgot-password', validate(forgotPasswordValidation), authController.forgotPassword);
router.post('/reset-password', validate(resetPasswordValidation), authController.resetPassword);

// Profile management routes
router.put('/profile', authenticate, validate(updateProfileValidation), authController.updateProfile);
router.put('/change-password', authenticate, validate(changePasswordValidation), authController.changePassword);

export default router;
