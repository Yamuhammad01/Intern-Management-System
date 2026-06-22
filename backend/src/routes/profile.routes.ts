import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { ProfileController } from '../controllers/profile.controller';
import { ProfileService } from '../services/profile.service';
import { ProfileRepository } from '../repositories/profile.repository';
import { UserRepository } from '../repositories/user.repository';
import { authenticate } from '../middleware/auth.middleware';
import { authorize } from '../middleware/rbac.middleware';
import { validate } from '../middleware/validate.middleware';
import {
  upsertProfileSchema,
  updateContactSchema,
  uploadAvatarSchema,
} from '../validators/profile.validator';

const router = Router();

// Initialise dependencies
const profileRepo = new ProfileRepository();
const userRepo = new UserRepository();
const profileService = new ProfileService(profileRepo, userRepo);
const profileController = new ProfileController(profileService);

// Rate limiting for profile operations
const profileLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30,
  message: {
    success: false,
    statusCode: 429,
    message: 'Too many profile requests. Please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const avatarLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10,
  message: {
    success: false,
    statusCode: 429,
    message: 'Too many avatar uploads. Please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// All profile routes require authentication
router.use(authenticate);

// All profile routes require authentication
// All authenticated roles can access their own profile
router.use(authorize('INTERN', 'SUPER_ADMIN', 'ADMIN', 'SUPERVISOR', 'MENTOR'));

// GET  /api/profile/me         — fetch current user's profile
router.get('/me', profileLimiter, profileController.getProfile);

// POST /api/profile            — create or update full profile
router.post('/', profileLimiter, validate(upsertProfileSchema), profileController.upsertProfile);

// PATCH /api/profile/contact   — update contact info only
router.patch('/contact', profileLimiter, validate(updateContactSchema), profileController.updateContact);

// PUT  /api/profile/avatar     — upload profile picture (base64)
router.put('/avatar', avatarLimiter, validate(uploadAvatarSchema), profileController.uploadAvatar);

export default router;