import { IndustrySector } from '@prisma/client';

// ─── Request DTOs ─────────────────────────────────────────────────────────────

export interface CreateOrganizationRequestDTO {
  name: string;
  address?: string;
  email?: string;
  phone?: string;
  website?: string;
  sector?: IndustrySector;
  description?: string;
}

export interface UpdateOrganizationRequestDTO {
  name?: string;
  address?: string;
  email?: string;
  phone?: string;
  website?: string;
  sector?: IndustrySector;
  description?: string;
  isActive?: boolean;
}

// ─── Response DTO ─────────────────────────────────────────────────────────────

export interface OrganizationResponseDTO {
  id: string;
  name: string;
  address: string | null;
  email: string | null;
  phone: string | null;
  website: string | null;
  sector: IndustrySector;
  description: string | null;
  isActive: boolean;
  placementCount?: number;
  activeInternsCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface OrganizationListDTO {
  organizations: OrganizationResponseDTO[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}