import { Router } from 'express';
import { TaskController } from '../controllers/task.controller';
import { TaskService } from '../services/task.service';
import { authorize } from '../middleware/rbac.middleware';
import { authenticate } from '../middleware/auth.middleware';
import { UserRole } from '@prisma/client';

const router = Router();

const taskService = new TaskService();
const taskController = new TaskController(taskService);

router.use(authenticate);

router.get(
  '/stats',
  authorize(UserRole.INTERN, UserRole.SUPERVISOR, UserRole.ADMIN, UserRole.SUPER_ADMIN),
  taskController.getTaskStats,
);

export default router;