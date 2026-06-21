import { Request, Response } from 'express';
import { OrganizationService } from '../services/organization.service';
import { asyncHandler } from '../middleware/asyncHandler.middleware';
import { ApiResponse } from '../utils/ApiResponse';
import { validate } from '../middleware/validate.middleware';
import { createOrganizationSchema, updateOrganizationSchema } from '../validators/organization.validator';
import { authorize } from '../middleware/rbac.middleware';
import { UserRole } from '@prisma/client';

export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) {}

  public create = asyncHandler(async (req: Request, res: Response) => {
    const dto = req.body;
    const result = await this.organizationService.createOrganization(dto);
    res.status(201).json(ApiResponse.created(result, 'Organization created successfully'));
  });

  public getById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await this.organizationService.getOrganizationById(id);
    res.status(200).json(ApiResponse.success(result, 'Organization retrieved successfully'));
  });

  public getAll = asyncHandler(async (req: Request, res: Response) => {
    const { page = 1, limit = 10, search, sector, isActive } = req.query;
    const result = await this.organizationService.getOrganizations({
      page: Number(page),
      limit: Number(limit),
      search: search as string,
      sector: sector as string,
      isActive: isActive === 'true' ? true : isActive === 'false' ? false : undefined,
    });
    res.status(200).json(ApiResponse.success(result, 'Organizations retrieved successfully'));
  });

  public update = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const dto = req.body;
    const result = await this.organizationService.updateOrganization(id, dto);
    res.status(200).json(ApiResponse.success(result, 'Organization updated successfully'));
  });

  public delete = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    await this.organizationService.deleteOrganization(id);
    res.status(200).json(ApiResponse.success(null, 'Organization deleted successfully'));
  });
}