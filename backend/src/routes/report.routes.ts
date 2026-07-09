import { Router } from 'express';
import { ReportController } from '../controllers/report.controller';
import { authorize } from '../middleware/rbac.middleware';
import { authenticate } from '../middleware/auth.middleware';
import { UserRole } from '@prisma/client';

const router = Router();
const reportController = new ReportController();

router.use(authenticate);

router.get(
  '/:reportType?',
  authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.SUPERVISOR, UserRole.INTERN),
  reportController.getReportData
);

export default router;