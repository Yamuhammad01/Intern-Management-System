import { Router } from 'express';
import { InternEvaluationController } from '../controllers/intern-evaluation.controller';
import { InternEvaluationService } from '../services/intern-evaluation.service';
import { EvaluationRepository } from '../repositories/evaluation.repository';
import { authenticate } from '../middleware/auth.middleware';
import { authorize } from '../middleware/rbac.middleware';

const router = Router();

// Dependency injection
const evaluationRepository = new EvaluationRepository();
const internEvalService = new InternEvaluationService(evaluationRepository);
const internEvalController = new InternEvaluationController(internEvalService);

// ─── All routes require authentication and INTERN role ────

// GET /api/intern/evaluations - Get all completed evaluations for logged-in intern
router.get(
  '/',
  authenticate,
  authorize('INTERN'),
  internEvalController.getMyEvaluations,
);

// GET /api/intern/evaluations/:evaluationId - Get details of a specific evaluation
router.get(
  '/:evaluationId',
  authenticate,
  authorize('INTERN'),
  internEvalController.getMyEvaluationById,
);

export default router;