import { Request, Response } from 'express';
import { InternEvaluationService } from '../services/intern-evaluation.service';
import { asyncHandler } from '../middleware/asyncHandler.middleware';
import { ApiResponse } from '../utils/ApiResponse';

export class InternEvaluationController {
  constructor(private readonly internEvalService: InternEvaluationService) {}

  // GET /api/intern/evaluations
  public getMyEvaluations = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const result = await this.internEvalService.getMyEvaluations(userId);
    res.status(200).json(ApiResponse.success(result, 'Evaluations retrieved successfully'));
  });

  // GET /api/intern/evaluations/:evaluationId   /intern/evaluations/:27f7900c-ea2c-420a-96ed-e0396f733380
  public getMyEvaluationById = asyncHandler(async (req: Request, res: Response) => {
    const { evaluationId } = req.params;
    const userId = req.user!.userId;
    const result = await this.internEvalService.getMyEvaluationById(evaluationId, userId);
    res.status(200).json(ApiResponse.success(result, 'Evaluation details retrieved successfully'));
  });
}