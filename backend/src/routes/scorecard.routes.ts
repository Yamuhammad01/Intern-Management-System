import { Router } from 'express';
import { ScorecardController } from '../controllers/scorecard.controller';
import { ScorecardService } from '../services/scorecard.service';
import { EvaluationRepository } from '../repositories/evaluation.repository';
import { UserRepository } from '../repositories/user.repository';
import { ProfileRepository } from '../repositories/profile.repository';
import { PlacementRepository } from '../repositories/placement.repository';
import { authorize } from '../middleware/rbac.middleware';
import { authenticate } from '../middleware/auth.middleware';
import { UserRole } from '@prisma/client';

// scorecard routers 
const router = Router();

const evaluationRepository = new EvaluationRepository();
const userRepository = new UserRepository();
const profileRepository = new ProfileRepository();
const placementRepository = new PlacementRepository();
const scorecardService = new ScorecardService(evaluationRepository, userRepository, profileRepository, placementRepository);
const scorecardController = new ScorecardController(scorecardService);

router.use(authenticate);

router.get(
  '/',
  authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.SUPERVISOR),
  scorecardController.getScorecard,
);

router.get(
  '/ranking',
  authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.SUPERVISOR),
  scorecardController.getScorecardRanking,
);

export default router;
