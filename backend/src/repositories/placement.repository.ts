import { Placement, Prisma } from '@prisma/client';
import prisma from '../config/database';
import { IPlacementRepository } from './interfaces/IPlacementRepository';

export class PlacementRepository implements IPlacementRepository {
  async findById(id: string): Promise<Placement | null> {
    return prisma.placement.findUnique({
      where: { id },
      include: {
        internProfile: { include: { user: true } },
        organization: true,
        supervisor: { select: { id: true, firstName: true, lastName: true, email: true } },
      },
    });
  }

  async findByInternAndOrganization(
    internId: string,
    organizationId: string,
  ): Promise<Placement | null> {
    return prisma.placement.findFirst({
      where: { internId, organizationId },
    });
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    organizationId?: string;
    internId?: string;
    supervisorId?: string;
    status?: string;
  }): Promise<{ placements: Placement[]; total: number }> {
    const { skip = 0, take = 10, organizationId, internId, supervisorId, status } = params;

    const where: Prisma.PlacementWhereInput = {};
    if (organizationId) where.organizationId = organizationId;
    if (internId) where.internId = internId;
    if (supervisorId) where.supervisorId = supervisorId;
    if (status) where.status = status as any;

    const [placements, total] = await Promise.all([
      prisma.placement.findMany({
        where,
        skip,
        take,
        include: {
          internProfile: { include: { user: true } },
          organization: true,
          supervisor: { select: { id: true, firstName: true, lastName: true, email: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.placement.count({ where }),
    ]);

    return { placements, total };
  }

  async create(data: Prisma.PlacementCreateInput): Promise<Placement> {
    return prisma.placement.create({
      data,
      include: {
        internProfile: { include: { user: true } },
        organization: true,
        supervisor: { select: { id: true, firstName: true, lastName: true, email: true } },
      },
    });
  }

  async update(id: string, data: Prisma.PlacementUpdateInput): Promise<Placement> {
    return prisma.placement.update({
      where: { id },
      data,
      include: {
        internProfile: { include: { user: true } },
        organization: true,
        supervisor: { select: { id: true, firstName: true, lastName: true, email: true } },
      },
    });
  }

  async assignSupervisor(id: string, supervisorId: string): Promise<Placement> {
    return prisma.placement.update({
      where: { id },
      data: { supervisorId },
      include: {
        internProfile: { include: { user: true } },
        organization: true,
        supervisor: { select: { id: true, firstName: true, lastName: true, email: true } },
      },
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.placement.delete({ where: { id } });
  }
}