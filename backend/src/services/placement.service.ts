import { Placement, PlacementStatus } from '@prisma/client';
import { IPlacementRepository } from '../repositories/interfaces/IPlacementRepository';
import { IOrganizationRepository } from '../repositories/interfaces/IOrganizationRepository';
import { IUserRepository } from '../repositories/interfaces/IUserRepository';
import { ApiError } from '../utils/ApiError';
import { logger } from '../utils/logger';
import prisma from '../config/database';
import {
  CreatePlacementRequestDTO,
  PlacementResponseDTO,
  PlacementListDTO,
  UpdatePlacementRequestDTO,
  AssignSupervisorRequestDTO,
} from '../dto/placement.dto';

export class PlacementService {
  constructor(
    private readonly placementRepo: IPlacementRepository,
    private readonly organizationRepo: IOrganizationRepository,
    private readonly userRepo: IUserRepository,
  ) {}

  async createPlacement(dto: CreatePlacementRequestDTO): Promise<PlacementResponseDTO> {
    const organization = await this.organizationRepo.findById(dto.organizationId);
    if (!organization) {
      throw ApiError.notFound('Organization not found');
    }

    // Resolve internId: it may be a User ID or an InternProfile ID
    const internProfile = await prisma.internProfile.findFirst({
      where: {
        OR: [
          { id: dto.internId },
          { userId: dto.internId },
        ],
      },
    });

    if (!internProfile) {
      throw ApiError.notFound('Intern profile not found. Please ensure the intern has a profile.');
    }

    const existing = await this.placementRepo.findByInternAndOrganization(
      internProfile.id,
      dto.organizationId,
    );
    if (existing) {
      throw ApiError.conflict('This intern is already placed in this organization');
    }

    const placement = await this.placementRepo.create({
      internProfile: { connect: { id: internProfile.id } },
      organization: { connect: { id: dto.organizationId } },
      ...(dto.supervisorId && {
        supervisor: { connect: { id: dto.supervisorId as string } },
      }),
      status: dto.status || PlacementStatus.ACTIVE,
      role: dto.role,
      department: dto.department,
      startDate: dto.startDate ? new Date(dto.startDate) : undefined,
      endDate: dto.endDate ? new Date(dto.endDate) : undefined,
      notes: dto.notes,
    } as any);

    return this.mapToResponseDTO(placement);
  }

  async getPlacementById(id: string): Promise<PlacementResponseDTO> {
    const placement = await this.placementRepo.findById(id);
    if (!placement) {
      throw ApiError.notFound('Placement not found');
    }
    return this.mapToResponseDTO(placement);
  }

  async getPlacements(params: {
    page?: number;
    limit?: number;
    organizationId?: string;
    internId?: string;
    supervisorId?: string;
    status?: string;
  }): Promise<PlacementListDTO> {
    const { page = 1, limit = 10, organizationId, internId, supervisorId, status } = params;
    const skip = (page - 1) * limit;

    const { placements, total } = await this.placementRepo.findAll({
      skip,
      take: limit,
      organizationId,
      internId,
      supervisorId,
      status,
    });

    return {
      placements: placements.map((p) => this.mapToResponseDTO(p)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async updatePlacement(
    id: string,
    dto: UpdatePlacementRequestDTO,
  ): Promise<PlacementResponseDTO> {
    const placement = await this.placementRepo.findById(id);
    if (!placement) {
      throw ApiError.notFound('Placement not found');
    }

    const updateData: any = { ...dto };
    if (dto.startDate) updateData.startDate = new Date(dto.startDate);
    if (dto.endDate) updateData.endDate = new Date(dto.endDate);

    const updated = await this.placementRepo.update(id, updateData);
    return this.mapToResponseDTO(updated);
  }

  async assignSupervisor(
    id: string,
    dto: AssignSupervisorRequestDTO,
  ): Promise<PlacementResponseDTO> {
    const placement = await this.placementRepo.findById(id);
    if (!placement) {
      throw ApiError.notFound('Placement not found');
    }

    const supervisor = await this.userRepo.findById(dto.supervisorId);
    if (!supervisor) {
      throw ApiError.notFound('Supervisor not found');
    }

    if (supervisor.role !== 'SUPERVISOR') {
      throw ApiError.badRequest('Assigned user must have SUPERVISOR role');
    }

    const updated = await this.placementRepo.assignSupervisor(id, dto.supervisorId);
    return this.mapToResponseDTO(updated);
  }

  async deletePlacement(id: string): Promise<void> {
    const placement = await this.placementRepo.findById(id);
    if (!placement) {
      throw ApiError.notFound('Placement not found');
    }

    await this.placementRepo.delete(id);
  }

  private mapToResponseDTO(placement: any): PlacementResponseDTO {
    const internName = `${placement.internProfile?.user?.firstName || ''} ${placement.internProfile?.user?.lastName || ''}`.trim();
    const supervisorName = placement.supervisor
      ? `${placement.supervisor.firstName} ${placement.supervisor.lastName}`
      : null;

    return {
      id: placement.id,
      internId: placement.internId,
      internName,
      internEmail: placement.internProfile?.user?.email || '',
      matricNumber: placement.internProfile?.matricNumber || null,
      organizationId: placement.organizationId,
      organizationName: placement.organization?.name || '',
      organizationSector: placement.organization?.sector || '',
      supervisorId: placement.supervisorId,
      supervisorName,
      status: placement.status,
      role: placement.role,
      department: placement.department,
      startDate: placement.startDate?.toISOString() || null,
      endDate: placement.endDate?.toISOString() || null,
      notes: placement.notes,
      createdAt: placement.createdAt.toISOString(),
      updatedAt: placement.updatedAt.toISOString(),
    };
  }
}
