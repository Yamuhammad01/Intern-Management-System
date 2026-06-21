import { IProfileRepository } from '../repositories/interfaces/IProfileRepository';
import { IUserRepository } from '../repositories/interfaces/IUserRepository';
import { ApiError } from '../utils/ApiError';
import {
  UpdateProfileRequestDTO,
  UpdateContactRequestDTO,
  UploadAvatarRequestDTO,
  ProfileResponseDTO,
} from '../dto/profile.dto';

export class ProfileService {
  constructor(
    private readonly profileRepo: IProfileRepository,
    private readonly userRepo: IUserRepository,
  ) {}

  /**
   * Get a unified profile + user object for the given userId.
   */
  async getProfile(userId: string): Promise<ProfileResponseDTO> {
    const user = await this.userRepo.findById(userId);
    if (!user) throw ApiError.notFound('User not found');

    const profile = await this.profileRepo.findByUserId(userId);

    return this.buildResponse(user, profile);
  }

  /**
   * Create or update profile fields.
   * Also syncs firstName / lastName / phone / department back to the User record.
   */
  async upsertProfile(userId: string, dto: UpdateProfileRequestDTO): Promise<ProfileResponseDTO> {
    const user = await this.userRepo.findById(userId);
    if (!user) throw ApiError.notFound('User not found');

    // If fullName provided, split into first / last
    let firstName = user.firstName;
    let lastName = user.lastName;
    if (dto.fullName) {
      const parts = dto.fullName.trim().split(/\s+/);
      firstName = parts[0];
      lastName = parts.slice(1).join(' ') || lastName;
    }

    // If matric number is changing, ensure uniqueness
    if (dto.matricNumber && dto.matricNumber.trim() !== '') {
      const existing = await this.profileRepo.findByMatricNumber(dto.matricNumber);
      if (existing && existing.userId !== userId) {
        throw ApiError.conflict('Matric number is already registered to another user');
      }
    }

    // Sync shared fields back to the User table
    await this.userRepo.update(userId, {
      firstName,
      lastName,
      ...(dto.phone !== undefined && { phone: dto.phone }),
      ...(dto.department !== undefined && { department: dto.department }),
      ...(dto.program !== undefined && { program: dto.program }),
    });

    // Build profile-specific update payload
    const profileData: Record<string, unknown> = {};
    if (dto.matricNumber !== undefined) profileData.matricNumber = dto.matricNumber || null;
    if (dto.faculty !== undefined) profileData.faculty = dto.faculty || null;
    if (dto.institution !== undefined) profileData.institution = dto.institution || null;
    if (dto.startDate !== undefined) profileData.startDate = dto.startDate ? new Date(dto.startDate) : null;
    if (dto.endDate !== undefined) profileData.endDate = dto.endDate ? new Date(dto.endDate) : null;
    if (dto.supervisorName !== undefined) profileData.supervisorName = dto.supervisorName || null;
    if (dto.organizationName !== undefined) profileData.organizationName = dto.organizationName || null;

    const profile = await this.profileRepo.upsert(userId, profileData as any);

    // Re-fetch user with updated fields
    const updatedUser = await this.userRepo.findById(userId);
    return this.buildResponse(updatedUser!, profile);
  }

  /**
   * Update phone number only (contact information).
   */
  async updateContact(userId: string, dto: UpdateContactRequestDTO): Promise<ProfileResponseDTO> {
    const user = await this.userRepo.findById(userId);
    if (!user) throw ApiError.notFound('User not found');

    await this.userRepo.update(userId, { phone: dto.phone });

    const profile = await this.profileRepo.findByUserId(userId);
    const updatedUser = await this.userRepo.findById(userId);
    return this.buildResponse(updatedUser!, profile);
  }

  /**
   * Upload or replace the profile avatar (stored as base64 string).
   */
  async uploadAvatar(userId: string, dto: UploadAvatarRequestDTO): Promise<ProfileResponseDTO> {
    const user = await this.userRepo.findById(userId);
    if (!user) throw ApiError.notFound('User not found');

    const profile = await this.profileRepo.updateAvatar(userId, dto.avatar);
    return this.buildResponse(user, profile);
  }

  /**
   * Build a unified ProfileResponseDTO from user + profile records.
   */
  private buildResponse(user: any, profile: any | null): ProfileResponseDTO {
    return {
      id: profile?.id ?? '',
      userId: user.id,
      email: user.email,
      fullName: `${user.firstName} ${user.lastName}`.trim(),
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone ?? null,
      role: user.role,
      department: user.department ?? null,
      program: user.program ?? null,
      matricNumber: profile?.matricNumber ?? null,
      faculty: profile?.faculty ?? null,
      institution: profile?.institution ?? null,
      avatarUrl: profile?.avatarUrl ?? null,
      startDate: profile?.startDate ? (profile.startDate as Date).toISOString() : null,
      endDate: profile?.endDate ? (profile.endDate as Date).toISOString() : null,
      supervisorName: profile?.supervisorName ?? null,
      organizationName: profile?.organizationName ?? null,
      createdAt: profile?.createdAt ? (profile.createdAt as Date).toISOString() : new Date().toISOString(),
      updatedAt: profile?.updatedAt ? (profile.updatedAt as Date).toISOString() : new Date().toISOString(),
    };
  }
}
