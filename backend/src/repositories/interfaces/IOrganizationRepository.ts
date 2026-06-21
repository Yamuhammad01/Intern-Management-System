import { Organization, Prisma } from '@prisma/client';

export interface IOrganizationRepository {
  findById(id: string): Promise<Organization | null>;
  findByName(name: string): Promise<Organization | null>;
  findAll(params: {
    skip?: number;
    take?: number;
    search?: string;
    sector?: string;
    isActive?: boolean;
  }): Promise<{ organizations: Organization[]; total: number }>;
  create(data: Prisma.OrganizationCreateInput): Promise<Organization>;
  update(id: string, data: Prisma.OrganizationUpdateInput): Promise<Organization>;
  delete(id: string): Promise<void>;
  getActiveInternsCount(organizationId: string): Promise<number>;
  getPlacementCount(organizationId: string): Promise<number>;
}