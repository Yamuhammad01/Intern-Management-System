import { Router } from 'express';
import authRoutes from './auth.routes';
import profileRoutes from './profile.routes';
import organizationRoutes from './organization.routes';
import placementRoutes from './placement.routes';
import logbookRoutes from './logbook.routes';
import supervisorRoutes from './supervisor.routes';
import userRoutes from './user.routes';
import evaluationRoutes from './evaluation.routes';
import internEvaluationRoutes from './intern-evaluation.routes';
import scorecardRoutes from './scorecard.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/profile', profileRoutes);
router.use('/organizations', organizationRoutes);
router.use('/placements', placementRoutes);
router.use('/logbook', logbookRoutes);
router.use('/supervisor', supervisorRoutes);
router.use('/users', userRoutes);
router.use('/evaluations', evaluationRoutes);
router.use('/intern/evaluations', internEvaluationRoutes);
router.use('/scorecards', scorecardRoutes);

export default router;
