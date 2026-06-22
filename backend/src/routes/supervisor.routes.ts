import { Router } from 'express';
import { SupervisorController } from '../controllers/supervisor.controller';
import { SupervisorService } from '../services/supervisor.service';
import { FeedbackRepository } from '../repositories/supervisor/feedback.repository';
import { LogEntryRepository } from '../repositories/logEntry.repository';
import { authenticate } from '../middleware/auth.middleware';
import { authorize } from '../middleware/rbac.middleware';
import { validate } from '../middleware/validate.middleware';
import { reviewLogSchema, createFeedbackSchema, updateFeedbackSchema } from '../validators/supervisor/supervisor.validator';

const router = Router();

// Dependency injection
const feedbackRepository = new FeedbackRepository();
const logEntryRepository = new LogEntryRepository();
const supervisorService = new SupervisorService(feedbackRepository, logEntryRepository);
const supervisorController = new SupervisorController(supervisorService);

// ─── All routes require authentication and SUPERVISOR/MENTOR/ADMIN role ────

// Dashboard
router.get(
  '/dashboard/stats',
  authenticate,
  authorize('SUPERVISOR', 'MENTOR', 'ADMIN', 'SUPER_ADMIN'),
  supervisorController.getDashboardStats,
);

// Assigned interns
router.get(
  '/interns',
  authenticate,
  authorize('SUPERVISOR', 'MENTOR', 'ADMIN', 'SUPER_ADMIN'),
  supervisorController.getAssignedInterns,
);

// Submitted logs
router.get(
  '/submitted-logs',
  authenticate,
  authorize('SUPERVISOR', 'MENTOR', 'ADMIN', 'SUPER_ADMIN'),
  supervisorController.getSubmittedLogs,
);

// Review a log
router.patch(
  '/logs/:id/review',
  authenticate,
  authorize('SUPERVISOR', 'MENTOR', 'ADMIN', 'SUPER_ADMIN'),
  validate(reviewLogSchema),
  supervisorController.reviewLog,
);

// Intern progress
router.get(
  '/interns/:internId/progress',
  authenticate,
  authorize('SUPERVISOR', 'MENTOR', 'ADMIN', 'SUPER_ADMIN'),
  supervisorController.getInternProgress,
);

// Feedback CRUD
router.post(
  '/feedback',
  authenticate,
  authorize('SUPERVISOR', 'MENTOR', 'ADMIN', 'SUPER_ADMIN'),
  validate(createFeedbackSchema),
  supervisorController.createFeedback,
);

router.get(
  '/feedback',
  authenticate,
  authorize('SUPERVISOR', 'MENTOR', 'ADMIN', 'SUPER_ADMIN'),
  supervisorController.getMyFeedbacks,
);

router.get(
  '/interns/:internId/feedback',
  authenticate,
  authorize('SUPERVISOR', 'MENTOR', 'ADMIN', 'SUPER_ADMIN'),
  supervisorController.getInternFeedback,
);

router.delete(
  '/feedback/:id',
  authenticate,
  authorize('SUPERVISOR', 'MENTOR', 'ADMIN', 'SUPER_ADMIN'),
  supervisorController.deleteFeedback,
);

export default router;