import { Router } from 'express';
import { EvaluationController } from '../controllers/evaluation.controller';
import { EvaluationService } from '../services/evaluation.service';
import { EvaluationRepository } from '../repositories/evaluation.repository';
import { authenticate } from '../middleware/auth.middleware';
import { authorize } from '../middleware/rbac.middleware';
import { validate } from '../middleware/validate.middleware';
import { createEvaluationSchema, updateEvaluationSchema, evaluationQuerySchema } from '../validators/evaluation.validator';

const router = Router();

// Dependency injection
const evaluationRepository = new EvaluationRepository();
const evaluationService = new EvaluationService(evaluationRepository);
const evaluationController = new EvaluationController(evaluationService);

// ─── All routes require authentication ────

// Create evaluation (Supervisor, Mentor, Admin)
router.post(
  '/',
  authenticate,
  authorize('SUPERVISOR'),
  validate(createEvaluationSchema),
  evaluationController.createEvaluation,
);

// Get all evaluations (Admin, Supervisor)
router.get(
  '/',
  authenticate,
  authorize('SUPERVISOR', 'MENTOR', 'ADMIN', 'SUPER_ADMIN'),
  validate(evaluationQuerySchema),
  evaluationController.getAllEvaluations,
);

// Get evaluation summary
router.get(
  '/summary',
  authenticate,
  authorize('SUPERVISOR', 'MENTOR', 'ADMIN', 'SUPER_ADMIN'),
  evaluationController.getEvaluationSummary,
);

// Get evaluation by ID
router.get(
  '/:id',
  authenticate,
  authorize('SUPERVISOR', 'MENTOR', 'ADMIN', 'SUPER_ADMIN', 'INTERN'),
  evaluationController.getEvaluationById,
);

// Update evaluation
router.put(
  '/:id',
  authenticate,
  authorize('SUPERVISOR', 'MENTOR', 'ADMIN', 'SUPER_ADMIN'),
  validate(updateEvaluationSchema),
  evaluationController.updateEvaluation,
);

// Complete evaluation
router.patch(
  '/:id/complete',
  authenticate,
  authorize('SUPERVISOR', 'MENTOR', 'ADMIN', 'SUPER_ADMIN'),
  evaluationController.completeEvaluation,
);

// Review evaluation
router.patch(
  '/:id/review',
  authenticate,
  authorize('ADMIN', 'SUPER_ADMIN'),
  evaluationController.reviewEvaluation,
);

// Get evaluations by intern
router.get(
  '/intern/:internId',
  authenticate,
  authorize('SUPERVISOR', 'MENTOR', 'ADMIN', 'SUPER_ADMIN'),
  evaluationController.getEvaluationsByIntern,
);

// Get evaluations by supervisor
router.get(
  '/supervisor/me',
  authenticate,
  authorize('SUPERVISOR', 'MENTOR', 'ADMIN', 'SUPER_ADMIN'),
  evaluationController.getEvaluationsBySupervisor,
);

// Delete evaluation
router.delete(
  '/:id',
  authenticate,
  authorize('SUPERVISOR', 'MENTOR', 'ADMIN', 'SUPER_ADMIN'),
  evaluationController.deleteEvaluation,
);

export default router;