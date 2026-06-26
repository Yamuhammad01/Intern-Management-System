import { Request, Response } from 'express';
import { EvaluationService } from '../services/evaluation.service';
import { asyncHandler } from '../middleware/asyncHandler.middleware';
import { ApiResponse } from '../utils/ApiResponse';
import { validate } from '../middleware/validate.middleware';
import { createEvaluationSchema, updateEvaluationSchema, evaluationQuerySchema } from '../validators/evaluation.validator';

export class EvaluationController {
  constructor(private readonly evaluationService: EvaluationService) {}

  // ─── Create Evaluation ────────────────────────────────────────────────────

  public createEvaluation = asyncHandler(async (req: Request, res: Response) => {
    const supervisorId = req.user!.userId;
    const dto = req.body;
    const result = await this.evaluationService.createEvaluation(supervisorId, dto);
    res.status(201).json(ApiResponse.created(result, 'Evaluation created successfully'));
  });

  // ─── Update Evaluation ────────────────────────────────────────────────────

  public updateEvaluation = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const supervisorId = req.user!.userId;
    const dto = req.body;
    const result = await this.evaluationService.updateEvaluation(id, supervisorId, dto);
    res.status(200).json(ApiResponse.success(result, 'Evaluation updated successfully'));
  });

  // ─── Complete Evaluation ──────────────────────────────────────────────────

  public completeEvaluation = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const supervisorId = req.user!.userId;
    const result = await this.evaluationService.completeEvaluation(id, supervisorId);
    res.status(200).json(ApiResponse.success(result, 'Evaluation completed successfully'));
  });

  // ─── Review Evaluation ────────────────────────────────────────────────────

  public reviewEvaluation = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const reviewerId = req.user!.userId;
    const result = await this.evaluationService.reviewEvaluation(id, reviewerId);
    res.status(200).json(ApiResponse.success(result, 'Evaluation reviewed successfully'));
  });

  // ─── Get Evaluation by ID ─────────────────────────────────────────────────

  public getEvaluationById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = req.user!.userId;
    const userRole = req.user!.role;
    const result = await this.evaluationService.getEvaluationById(id, userId, userRole);
    res.status(200).json(ApiResponse.success(result, 'Evaluation retrieved successfully'));
  });

  // ─── Get Evaluations for Intern ──────────────────────────────────────────

  public getEvaluationsByIntern = asyncHandler(async (req: Request, res: Response) => {
    const { internId } = req.params;
    const userId = req.user!.userId;
    const userRole = req.user!.role;
    const { page = '1', limit = '10' } = req.query;
    const result = await this.evaluationService.getEvaluationsByIntern(internId, userId, userRole, {
      page: Number(page),
      limit: Number(limit),
    });
    res.status(200).json(ApiResponse.success(result, 'Evaluations retrieved successfully'));
  });

  // ─── Get Evaluations by Supervisor ───────────────────────────────────────

  public getEvaluationsBySupervisor = asyncHandler(async (req: Request, res: Response) => {
    const supervisorId = req.user!.userId;
    const userId = req.user!.userId;
    const userRole = req.user!.role;
    const { page = '1', limit = '10' } = req.query;
    const result = await this.evaluationService.getEvaluationsBySupervisor(supervisorId, userId, userRole, {
      page: Number(page),
      limit: Number(limit),
    });
    res.status(200).json(ApiResponse.success(result, 'Evaluations retrieved successfully'));
  });

  // ─── Get Skills Assessment (for report preview) ──────────────────────────

  public getSkillsAssessment = asyncHandler(async (req: Request, res: Response) => {
    const supervisorId = req.user!.userId;
    const result = await this.evaluationService.getSkillsAssessment(supervisorId);
    res.status(200).json(ApiResponse.success(result, 'Skills assessment retrieved successfully'));
  });

  // ─── Get Evaluation Summary ──────────────────────────────────────────────

  public getEvaluationSummary = asyncHandler(async (req: Request, res: Response) => {
    const userRole = req.user!.role;
    const supervisorId = userRole === 'SUPERVISOR' || userRole === 'MENTOR' ? req.user!.userId : undefined;
    const result = await this.evaluationService.getEvaluationSummary(supervisorId);
    res.status(200).json(ApiResponse.success(result, 'Evaluation summary retrieved successfully'));
  });

  // ─── Get All Evaluations (Admin) ─────────────────────────────────────────

  public getAllEvaluations = asyncHandler(async (req: Request, res: Response) => {
    const { page = '1', limit = '10', status, internId, placementId, startDate, endDate } = req.query;
    const result = await this.evaluationService.getAllEvaluations({
      page: Number(page),
      limit: Number(limit),
      status: status as any,
      internId: internId as string,
      placementId: placementId as string,
      startDate: startDate ? new Date(startDate as string) : undefined,
      endDate: endDate ? new Date(endDate as string) : undefined,
    });
    res.status(200).json(ApiResponse.success(result, 'All evaluations retrieved successfully'));
  });

  // ─── Delete Evaluation ────────────────────────────────────────────────────

  public deleteEvaluation = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = req.user!.userId;
    const userRole = req.user!.role;
    await this.evaluationService.deleteEvaluation(id, userId, userRole);
    res.status(200).json(ApiResponse.success(null, 'Evaluation deleted successfully'));
  });
}