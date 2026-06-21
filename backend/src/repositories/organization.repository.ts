import { Organization, Prisma } from '@prisma/client';
import prisma from '../config/database';
import { IOrganizationRepository } from './interfaces/IOrganizationRepository';

export class OrganizationRepository implements IOrganizationRepository {
  async findById(id: string): Promise<Organization | null> {
    return prisma.organization.findUnique({
      where: { id },
      include: { placements: true },
    });
  }

  async findByName(name: string): Promise<Organization | null> {
    return prisma.organization.findFirst({
      where: { name: { equals: name, mode: 'insensitive' } },
    });
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    search?: string;
    sector?: string;
    isActive?: boolean;
  }): Promise<{ organizations: Organization[]; total: number }> {
    const { skip = 0, take = 10, search, sector, isActive } = params;

    const where: Prisma.OrganizationWhereInput = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (sector) where.sector = sector as any;
    if (isActive !== undefined) where.isActive = isActive;

    const [organizations, total] = await Promise.all([
      prisma.organization.findMany({
        where,
        skip,
        take,
        include: {
          _count: { select: { placements: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.organization.count({ where }),
    ]);

    return { organizations, total };
  }

  async create(data: Prisma.OrganizationCreateInput): Promise<Organization> {
    return prisma.organization.create({ data });
  }

  async update(id: string, data: Prisma.OrganizationUpdateInput): Promise<Organization> {
    return prisma.organization.update({ where: { id }, data });
  }

  async delete(id: string): Promise<void> {
    await prisma.organization.delete({ where: { id } });
  }

  async getActiveInternsCount(organizationId: string): Promise<number> {
    return prisma.placement.count({
      where: { organizationId, status: 'ACTIVE' },
    });
  }

  async getPlacementCount(organizationId: string): Promise<number> {
    return prisma.placement.count({
      where: { organizationId },
    });
  }
}