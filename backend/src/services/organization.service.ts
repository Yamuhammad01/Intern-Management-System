import { Organization, IndustrySector } from '@prisma/client';
import { IOrganizationRepository } from '../repositories/interfaces/IOrganizationRepository';
import { IUserRepository } from '../repositories/interfaces/IUserRepository';
import { ApiError } from '../utils/ApiError';
import { logger } from '../utils/logger';
import {
  CreateOrganizationRequestDTO,
  OrganizationResponseDTO,
  OrganizationListDTO,
  UpdateOrganizationRequestDTO,
} from '../dto/organization.dto';

export class OrganizationService {
  constructor(
    private readonly organizationRepo: IOrganizationRepository,
    private readonly userRepo: IUserRepository,
  ) {}

  async createOrganization(dto: CreateOrganizationRequestDTO): Promise<OrganizationResponseDTO> {
    const existing = await this.organizationRepo.findByName(dto.name);
    if (existing) {
      throw ApiError.conflict('An organization with this name already exists');
    }

    const organization = await this.organizationRepo.create({
      name: dto.name,
      address: dto.address,
      email: dto.email,
      phone: dto.phone,
      website: dto.website,
      sector: dto.sector || IndustrySector.OTHER,
      description: dto.description,
    } as any);

    return this.mapToResponseDTO(organization);
  }

  async getOrganizationById(id: string): Promise<OrganizationResponseDTO> {
    const organization = await this.organizationRepo.findById(id);
    if (!organization) {
      throw ApiError.notFound('Organization not found');
    }

    return this.mapToResponseDTO(organization);
  }

  async getOrganizations(params: {
    page?: number;
    limit?: number;
    search?: string;
    sector?: string;
    isActive?: boolean;
  }): Promise<OrganizationListDTO> {
    const { page = 1, limit = 10, search, sector, isActive } = params;
    const skip = (page - 1) * limit;

    const { organizations, total } = await this.organizationRepo.findAll({
      skip,
      take: limit,
      search,
      sector,
      isActive,
    });

    return {
      organizations: organizations.map((org) => this.mapToResponseDTO(org)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async updateOrganization(
    id: string,
    dto: UpdateOrganizationRequestDTO,
  ): Promise<OrganizationResponseDTO> {
    const existing = await this.organizationRepo.findById(id);
    if (!existing) {
      throw ApiError.notFound('Organization not found');
    }

    if (dto.name && dto.name !== existing.name) {
      const nameExists = await this.organizationRepo.findByName(dto.name);
      if (nameExists) {
        throw ApiError.conflict('An organization with this name already exists');
      }
    }

    const updated = await this.organizationRepo.update(id, dto as any);
    return this.mapToResponseDTO(updated);
  }

  async deleteOrganization(id: string): Promise<void> {
    const organization = await this.organizationRepo.findById(id);
    if (!organization) {
      throw ApiError.notFound('Organization not found');
    }

    await this.organizationRepo.delete(id);
  }

  private mapToResponseDTO(organization: Organization): OrganizationResponseDTO {
    return {
      id: organization.id,
      name: organization.name,
      address: organization.address,
      email: organization.email,
      phone: organization.phone,
      website: organization.website,
      sector: organization.sector,
      description: organization.description,
      isActive: organization.isActive,
      createdAt: organization.createdAt.toISOString(),
      updatedAt: organization.updatedAt.toISOString(),
    };
  }
}