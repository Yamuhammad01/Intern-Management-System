import { Request, Response } from 'express';
import { ScorecardService } from '../services/scorecard.service';
import { asyncHandler } from '../middleware/asyncHandler.middleware';
import { ApiResponse } from '../utils/ApiResponse';
import { authorize } from '../middleware/rbac.middleware';
import { UserRole } from '@prisma/client';

export class ScorecardController {
  constructor(private readonly scorecardService: ScorecardService) {}

  public getScorecard = asyncHandler(async (req: Request, res: Response) => {
    const supervisorId = req.user!.userId;
    const scorecards = await this.scorecardService.getScorecard(supervisorId);
    res.status(200).json(ApiResponse.success(scorecards, 'Scorecard retrieved successfully'));
  });

  public getScorecardRanking = asyncHandler(async (req: Request, res: Response) => {
    const supervisorId = req.user!.userId;
    const ranking = await this.scorecardService.getScorecardRanking(supervisorId);
    res.status(200).json(ApiResponse.success(ranking, 'Scorecard ranking retrieved successfully'));
  });
}
