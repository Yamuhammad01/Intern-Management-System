import { Request, Response } from 'express';
import { ProfileService } from '../services/profile.service';
import { asyncHandler } from '../middleware/asyncHandler.middleware';
import { ApiResponse } from '../utils/ApiResponse';
import {
  UpdateProfileRequestDTO,
  UpdateContactRequestDTO,
  UploadAvatarRequestDTO,
} from '../dto/profile.dto';

export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  /**
   * GET /api/profile/me
   * Fetch the authenticated user's full profile.
   */
  public getProfile = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const profile = await this.profileService.getProfile(userId);
    res.status(200).json(ApiResponse.success(profile, 'Profile retrieved successfully'));
  });

  /**
   * POST /api/profile
   * Create or update intern profile fields.
   */
  public upsertProfile = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const dto: UpdateProfileRequestDTO = req.body;
    const profile = await this.profileService.upsertProfile(userId, dto);
    res.status(200).json(ApiResponse.success(profile, 'Profile updated successfully'));
  });

  /**
   * PATCH /api/profile/contact
   * Update phone/contact information only.
   */
  public updateContact = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const dto: UpdateContactRequestDTO = req.body;
    const profile = await this.profileService.updateContact(userId, dto);
    res.status(200).json(ApiResponse.success(profile, 'Contact information updated successfully'));
  });

  /**
   * PUT /api/profile/avatar
   * Upload or replace the profile picture (base64).
   */
  public uploadAvatar = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const dto: UploadAvatarRequestDTO = req.body;
    const profile = await this.profileService.uploadAvatar(userId, dto);
    res.status(200).json(ApiResponse.success(profile, 'Profile picture updated successfully'));
  });
}
