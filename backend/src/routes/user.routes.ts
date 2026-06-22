import { Router, Request, Response, NextFunction } from 'express';
import { UserRepository } from '../repositories/user.repository';
import { authenticate } from '../middleware/auth.middleware';
import { authorize } from '../middleware/rbac.middleware';
import { UserRole } from '@prisma/client';
import { ApiResponse } from '../utils/ApiResponse';

const router = Router();
const userRepository = new UserRepository();

router.use(authenticate);

// GET /api/users?role=INTERN|SUPERVISOR|MENTOR
router.get(
  '/',
  authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.SUPERVISOR, UserRole.MENTOR),
  async (req: Request, res: Response, _next: NextFunction) => {
    const { role } = req.query;

    if (!role || !['INTERN', 'SUPERVISOR', 'MENTOR'].includes(role as string)) {
      return res.status(400).json({
        success: false,
        message: 'Valid role query parameter is required (INTERN, SUPERVISOR, MENTOR)',
      });
    }

    const users = await userRepository.findByRole(role as string);

    const responseData = users.map((u: any) => ({
      id: u.id,
      email: u.email,
      firstName: u.firstName,
      lastName: u.lastName,
      phone: u.phone,
      role: u.role,
      department: u.department,
      internProfile: u.internProfile,
    }));

    res.status(200).json(ApiResponse.success(responseData, 'Users retrieved successfully'));
  }
);

export default router;
