import { PlacementStatus } from '@prisma/client';

// ─── Request DTOs ─────────────────────────────────────────────────────────────

export interface CreatePlacementRequestDTO {
  internId: string;
  organizationId: string;
  supervisorId?: string;
  status?: PlacementStatus;
  role?: string;
  department?: string;
  startDate?: string; // ISO date string
  endDate?: string;   // ISO date string
  notes?: string;
}

export interface UpdatePlacementRequestDTO {
  status?: PlacementStatus;
  role?: string;
  department?: string;
  startDate?: string;
  endDate?: string;
  notes?: string;
}

export interface AssignSupervisorRequestDTO {
  supervisorId: string;
}

// ─── Response DTO ─────────────────────────────────────────────────────────────

export interface PlacementResponseDTO {
  id: string;
  internId: string;
  internName: string;
  internEmail: string;
  matricNumber: string | null;
  organizationId: string;
  organizationName: string;
  organizationSector: string;
  supervisorId: string | null;
  supervisorName: string | null;
  status: PlacementStatus;
  role: string | null;
  department: string | null;
  startDate: string | null;
  endDate: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PlacementListDTO {
  placements: PlacementResponseDTO[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}