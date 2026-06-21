import { Placement, Prisma } from '@prisma/client';

export interface IPlacementRepository {
  findById(id: string): Promise<Placement | null>;
  findByInternAndOrganization(internId: string, organizationId: string): Promise<Placement | null>;
  findAll(params: {
    skip?: number;
    take?: number;
    organizationId?: string;
    internId?: string;
    supervisorId?: string;
    status?: string;
  }): Promise<{ placements: Placement[]; total: number }>;
  create(data: Prisma.PlacementCreateInput): Promise<Placement>;
  update(id: string, data: Prisma.PlacementUpdateInput): Promise<Placement>;
  assignSupervisor(id: string, supervisorId: string): Promise<Placement>;
  delete(id: string): Promise<void>;
}