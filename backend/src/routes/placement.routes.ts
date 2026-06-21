import { Router } from 'express';
import { PlacementController } from '../controllers/placement.controller';
import { PlacementService } from '../services/placement.service';
import { PlacementRepository } from '../repositories/placement.repository';
import { OrganizationRepository } from '../repositories/organization.repository';
import { UserRepository } from '../repositories/user.repository';
import { validate } from '../middleware/validate.middleware';
import {
  createPlacementSchema,
  updatePlacementSchema,
  assignSupervisorSchema,
} from '../validators/placement.validator';
import { authorize } from '../middleware/rbac.middleware';
import { authenticate } from '../middleware/auth.middleware';
import { UserRole } from '@prisma/client';

// placement routers 
const router = Router();

const placementRepository = new PlacementRepository();
const organizationRepository = new OrganizationRepository();
const userRepository = new UserRepository();
const placementService = new PlacementService(placementRepository, organizationRepository, userRepository);
const placementController = new PlacementController(placementService);

router.use(authenticate);

router.post(
  '/',
  authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  validate(createPlacementSchema, 'body'),
  placementController.create,
);

router.get('/', placementController.getAll);

router.get('/:id', placementController.getById);

router.put(
  '/:id',
  authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.SUPERVISOR),
  validate(updatePlacementSchema, 'body'),
  placementController.update,
);

router.post(
  '/:id/assign-supervisor',
  authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  validate(assignSupervisorSchema, 'body'),
  placementController.assignSupervisor,
);

router.delete(
  '/:id',
  authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  placementController.delete,
);

export default router;