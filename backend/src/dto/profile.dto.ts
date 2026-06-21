import { UserRole } from '@prisma/client';

// ─── Request DTOs ────────────────────────────────────────────────────────────

/**
 * Used on POST /api/v1/profile  (create or full-update)
 * All fields optional to support incremental saves.
 */
export interface UpdateProfileRequestDTO {
  /** Will be split into firstName / lastName in the service layer */
  fullName?: string;
  phone?: string;
  department?: string;
  program?: string;
  matricNumber?: string;
  faculty?: string;
  institution?: string;
  /** ISO date string, e.g. "2026-01-15" */
  startDate?: string;
  /** ISO date string, e.g. "2026-07-31" */
  endDate?: string;
  supervisorName?: string;
  organizationName?: string;
}

/**
 * Used on PATCH /api/v1/profile/contact
 */
export interface UpdateContactRequestDTO {
  phone: string;
}

/**
 * Used on PUT /api/v1/profile/avatar
 * The avatar must be a base64-encoded data URI.
 */
export interface UploadAvatarRequestDTO {
  avatar: string; // e.g. "data:image/png;base64,iVBORw0K..."
}

/**
 * Legacy alias — kept for backward-compat; same shape as UpdateProfileRequestDTO.
 */
export interface CreateProfileRequestDTO {
  matricNumber: string;
  faculty: string;
  institution: string;
  startDate?: string;
  endDate?: string;
  supervisorName?: string;
  organizationName?: string;
}

// ─── Response DTO ─────────────────────────────────────────────────────────────

export interface ProfileResponseDTO {
  id: string;
  userId: string;
  email: string;
  fullName: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  role: UserRole;
  department: string | null;
  program: string | null;
  matricNumber: string | null;
  faculty: string | null;
  institution: string | null;
  avatarUrl: string | null;
  /** ISO 8601 date-time string */
  startDate: string | null;
  /** ISO 8601 date-time string */
  endDate: string | null;
  supervisorName: string | null;
  organizationName: string | null;
  createdAt: string;
  updatedAt: string;
}
