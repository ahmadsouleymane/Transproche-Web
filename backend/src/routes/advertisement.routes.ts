import { Router } from 'express';
import { body } from 'express-validator';
import { advertisementController } from '../controllers/advertisement.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { isAdmin } from '../middlewares/role.middleware';
import { validate } from '../middlewares/validate.middleware';
import { uploadAd } from '../config/multer';

const router = Router();

// Create/Update validation
const advertisementValidation = [
  body('title').trim().notEmpty().withMessage('Le titre est requis'),
];

// Public routes
router.get('/active', advertisementController.getActive);

// Admin routes
router.use(authenticate, isAdmin);
router.get('/', advertisementController.getAll);
router.get('/:id', advertisementController.getById);
router.post('/', uploadAd.single('image'), validate(advertisementValidation), advertisementController.create);
router.put('/:id', uploadAd.single('image'), advertisementController.update);
router.delete('/:id', advertisementController.delete);

export default router;
