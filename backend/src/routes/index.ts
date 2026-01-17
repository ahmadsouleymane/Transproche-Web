import { Router } from 'express';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';
import companyRoutes from './company.routes';
import tripRoutes from './trip.routes';
import ticketRoutes from './ticket.routes';
import parcelRoutes from './parcel.routes';
import advertisementRoutes from './advertisement.routes';
import { authenticate } from '../middlewares/auth.middleware';
import { isAdmin } from '../middlewares/role.middleware';
import { statsController } from '../controllers/stats.controller';
import { NIGER_CITIES } from '../config/cities';

const router = Router();

router.get('/health', (_req, res) => {
  res.json({ success: true, message: 'API is running' });
});

router.get('/cities', (_req, res) => {
  res.json({ success: true, data: NIGER_CITIES });
});

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/companies', companyRoutes);
router.use('/trips', tripRoutes);
router.use('/tickets', ticketRoutes);
router.use('/parcels', parcelRoutes);
router.use('/advertisements', advertisementRoutes);
router.get('/stats/dashboard', authenticate, isAdmin, statsController.getDashboardStats);

export default router;
