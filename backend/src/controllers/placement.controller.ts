import { Request, Response } from 'express';
import { PlacementService } from '../services/placement.service';
import { asyncHandler } from '../middleware/asyncHandler.middleware';
import { ApiResponse } from '../utils/ApiResponse';
import { validate } from '../middleware/validate.middleware';
import {
  createPlacementSchema,
  updatePlacementSchema,
  assignSupervisorSchema,
} from '../validators/placement.validator';
import { authorize } from '../middleware/rbac.middleware';
import { UserRole } from '@prisma/client';

export class PlacementController {
  constructor(private readonly placementService: PlacementService) {}

  public create = asyncHandler(async (req: Request, res: Response) => {
    const dto = req.body;
    const result = await this.placementService.createPlacement(dto);
    res.status(201).json(ApiResponse.created(result, 'Placement created successfully'));
  });

  public getById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await this.placementService.getPlacementById(id);
    res.status(200).json(ApiResponse.success(result, 'Placement retrieved successfully'));
  });

  public getAll = asyncHandler(async (req: Request, res: Response) => {
    const { page = 1, limit = 10, organizationId, internId, supervisorId, status } = req.query;
    const result = await this.placementService.getPlacements({
      page: Number(page),
      limit: Number(limit),
      organizationId: organizationId as string,
      internId: internId as string,
      supervisorId: supervisorId as string,
      status: status as string,
    });
    res.status(200).json(ApiResponse.success(result, 'Placements retrieved successfully'));
  });

  public update = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const dto = req.body;
    const result = await this.placementService.updatePlacement(id, dto);
    res.status(200).json(ApiResponse.success(result, 'Placement updated successfully'));
  });

  public assignSupervisor = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const dto = req.body;
    const result = await this.placementService.assignSupervisor(id, dto);
    res.status(200).json(ApiResponse.success(result, 'Supervisor assigned successfully'));
  });

  public delete = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    await this.placementService.deletePlacement(id);
    res.status(200).json(ApiResponse.success(null, 'Placement deleted successfully'));
  });
}