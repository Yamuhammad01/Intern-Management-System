import { Router } from 'express';
import { OrganizationController } from '../controllers/organization.controller';
import { OrganizationService } from '../services/organization.service';
import { OrganizationRepository } from '../repositories/organization.repository';
import { UserRepository } from '../repositories/user.repository';
import { validate } from '../middleware/validate.middleware';
import { createOrganizationSchema, updateOrganizationSchema } from '../validators/organization.validator';
import { authorize } from '../middleware/rbac.middleware';
import { authenticate } from '../middleware/auth.middleware';
import { UserRole } from '@prisma/client';

const router = Router();

const organizationRepository = new OrganizationRepository();
const userRepository = new UserRepository();
const organizationService = new OrganizationService(organizationRepository, userRepository);
const organizationController = new OrganizationController(organizationService);

router.use(authenticate);

router.post(
  '/',
  authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  validate(createOrganizationSchema, 'body'),
  organizationController.create,
);

router.get('/', authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN), organizationController.getAll);

router.get('/:id', authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN), organizationController.getById);

router.put(
  '/:id',
  authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  validate(updateOrganizationSchema, 'body'),
  organizationController.update,
);

router.delete(
  '/:id',
  authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  organizationController.delete,
);

export default router;