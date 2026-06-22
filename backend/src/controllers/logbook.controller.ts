import { Request, Response } from 'express';
import { LogbookService } from '../services/logbook.service';
import { asyncHandler } from '../middleware/asyncHandler.middleware';
import { ApiResponse } from '../utils/ApiResponse';

export class LogbookController {
  constructor(private readonly logbookService: LogbookService) {}

  public createLog = asyncHandler(async (req: Request, res: Response) => {
    const internId = req.user!.userId;
    const dto = req.body;
    const result = await this.logbookService.createLogEntry(internId, dto);
    res.status(201).json(ApiResponse.created(result, 'Log entry created successfully'));
  });

  public getLogById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = req.user!.userId;
    const userRole = req.user!.role as string;
    const result = await this.logbookService.getLogEntryById(id, userId, userRole);
    res.status(200).json(ApiResponse.success(result, 'Log entry retrieved successfully'));
  });

  public getMyLogs = asyncHandler(async (req: Request, res: Response) => {
    const internId = req.user!.userId;
    const { page = '1', limit = '10', status, entryType, startDate, endDate } = req.query;
    const result = await this.logbookService.getMyLogs(internId, {
      page: Number(page),
      limit: Number(limit),
      status: status as string,
      entryType: entryType as string,
      startDate: startDate as string,
      endDate: endDate as string,
    });
    res.status(200).json(ApiResponse.success(result, 'Logs retrieved successfully'));
  });

  public getAllLogs = asyncHandler(async (req: Request, res: Response) => {
    const { page = '1', limit = '10', status, entryType, startDate, endDate, internId } = req.query;
    const result = await this.logbookService.getAllLogs({
      page: Number(page),
      limit: Number(limit),
      status: status as string,
      entryType: entryType as string,
      startDate: startDate as string,
      endDate: endDate as string,
      internId: internId as string,
    });
    res.status(200).json(ApiResponse.success(result, 'Logs retrieved successfully'));
  });

  public updateLog = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = req.user!.userId;
    const dto = req.body;
    const result = await this.logbookService.updateLogEntry(id, userId, dto);
    res.status(200).json(ApiResponse.success(result, 'Log entry updated successfully'));
  });

  public submitLog = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = req.user!.userId;
    const result = await this.logbookService.submitLog(id, userId);
    res.status(200).json(ApiResponse.success(result, 'Log entry submitted successfully'));
  });

  public deleteLog = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = req.user!.userId;
    await this.logbookService.deleteLogEntry(id, userId);
    res.status(200).json(ApiResponse.success(null, 'Log entry deleted successfully'));
  });

  public reviewLog = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const reviewerId = req.user!.userId;
    const dto = req.body;
    const result = await this.logbookService.reviewLogEntry(id, reviewerId, dto);
    res.status(200).json(ApiResponse.success(result, 'Log entry reviewed successfully'));
  });

  public getDashboardStats = asyncHandler(async (req: Request, res: Response) => {
    const internId = req.user!.userId;
    const result = await this.logbookService.getDashboardStats(internId);
    res.status(200).json(ApiResponse.success(result, 'Dashboard stats retrieved successfully'));
  });
}