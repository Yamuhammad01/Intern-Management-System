import { Router } from 'express';
import { LogbookController } from '../controllers/logbook.controller';
import { LogbookService } from '../services/logbook.service';
import { LogEntryRepository } from '../repositories/logEntry.repository';
import { authenticate } from '../middleware/auth.middleware';
import { authorize } from '../middleware/rbac.middleware';
import { validate } from '../middleware/validate.middleware';
import {
  createLogEntrySchema,
  updateLogEntrySchema,
  reviewLogEntrySchema,
} from '../validators/logbook.validator';

const router = Router();

// Dependency injection
const logEntryRepository = new LogEntryRepository();
const logbookService = new LogbookService(logEntryRepository);
const logbookController = new LogbookController(logbookService);

// ─── Intern routes (authenticated) ──────────────────────────────────────────

// Create a new log entry (intern only)
router.post(
  '/',
  authenticate,
  authorize('INTERN'),
  validate(createLogEntrySchema),
  logbookController.createLog,
);

// Get current intern's logs
router.get(
  '/mine',
  authenticate,
  authorize('INTERN'),
  logbookController.getMyLogs,
);

// Get dashboard stats for current intern
router.get(
  '/dashboard/stats',
  authenticate,
  authorize('INTERN'),
  logbookController.getDashboardStats,
);

// Submit a draft log entry for review
router.patch(
  '/:id/submit',
  authenticate,
  authorize('INTERN'),
  logbookController.submitLog,
);

// Update a draft log entry (intern only)
router.patch(
  '/:id',
  authenticate,
  authorize('INTERN'),
  validate(updateLogEntrySchema),
  logbookController.updateLog,
);

// Delete a draft log entry (intern only)
router.delete(
  '/:id',
  authenticate,
  authorize('INTERN'),
  logbookController.deleteLog,
);

// ─── Supervisor/Admin routes ───────────────────────────────────────────────

// Get all logs (supervisors, admins)
router.get(
  '/',
  authenticate,
  authorize('SUPERVISOR', 'MENTOR', 'ADMIN', 'SUPER_ADMIN'),
  logbookController.getAllLogs,
);

// Review a submitted log (supervisors, admins)
router.patch(
  '/:id/review',
  authenticate,
  authorize('SUPERVISOR', 'MENTOR', 'ADMIN', 'SUPER_ADMIN'),
  validate(reviewLogEntrySchema),
  logbookController.reviewLog,
);

// Get a single log by ID (any authenticated user with access)
router.get(
  '/:id',
  authenticate,
  logbookController.getLogById,
);

export default router;