import { Request, Response } from 'express';
import { SupervisorService } from '../services/supervisor.service';
import { asyncHandler } from '../middleware/asyncHandler.middleware';
import { ApiResponse } from '../utils/ApiResponse';

export class SupervisorController {
  constructor(private readonly supervisorService: SupervisorService) {}

  public getDashboardStats = asyncHandler(async (req: Request, res: Response) => {
    const supervisorId = req.user!.userId;
    const result = await this.supervisorService.getDashboardStats(supervisorId);
    res.status(200).json(ApiResponse.success(result, 'Dashboard stats retrieved successfully'));
  });

  public getAssignedInterns = asyncHandler(async (req: Request, res: Response) => {
    const supervisorId = req.user!.userId;
    const result = await this.supervisorService.getAssignedInterns(supervisorId);
    res.status(200).json(ApiResponse.success(result, 'Assigned interns retrieved successfully'));
  });

  public getSubmittedLogs = asyncHandler(async (req: Request, res: Response) => {
    const supervisorId = req.user!.userId;
    const { page = '1', limit = '10', internId, status } = req.query;
    const result = await this.supervisorService.getSubmittedLogs(supervisorId, {
      page: Number(page),
      limit: Number(limit),
      internId: internId as string,
      status: status as string,
    });
    res.status(200).json(ApiResponse.success(result, 'Submitted logs retrieved successfully'));
  });

  public reviewLog = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const reviewerId = req.user!.userId;
    const { status, reviewNotes } = req.body;
    const result = await this.supervisorService.reviewLog(id, reviewerId, status, reviewNotes);
    res.status(200).json(ApiResponse.success(result, `Log ${status.toLowerCase()} successfully`));
  });

  public createFeedback = asyncHandler(async (req: Request, res: Response) => {
    const supervisorId = req.user!.userId;
    const dto = req.body;
    const result = await this.supervisorService.createFeedback(supervisorId, dto);
    res.status(201).json(ApiResponse.created(result, 'Feedback submitted successfully'));
  });

  public getInternFeedback = asyncHandler(async (req: Request, res: Response) => {
    const supervisorId = req.user!.userId;
    const { internId } = req.params;
    const { page = '1', limit = '10' } = req.query;
    const result = await this.supervisorService.getFeedbacksForIntern(internId, supervisorId, {
      page: Number(page),
      limit: Number(limit),
    });
    res.status(200).json(ApiResponse.success(result, 'Feedbacks retrieved successfully'));
  });

  public getMyFeedbacks = asyncHandler(async (req: Request, res: Response) => {
    const supervisorId = req.user!.userId;
    const { page = '1', limit = '10' } = req.query;
    const result = await this.supervisorService.getMyFeedbacks(supervisorId, {
      page: Number(page),
      limit: Number(limit),
    });
    res.status(200).json(ApiResponse.success(result, 'Feedbacks retrieved successfully'));
  });

  public deleteFeedback = asyncHandler(async (req: Request, res: Response) => {
    const supervisorId = req.user!.userId;
    const { id } = req.params;
    await this.supervisorService.deleteFeedback(id, supervisorId);
    res.status(200).json(ApiResponse.success(null, 'Feedback deleted successfully'));
  });

  public getInternProgress = asyncHandler(async (req: Request, res: Response) => {
    const supervisorId = req.user!.userId;
    const { internId } = req.params;
    const result = await this.supervisorService.getInternProgress(internId, supervisorId);
    res.status(200).json(ApiResponse.success(result, 'Intern progress retrieved successfully'));
  });
}