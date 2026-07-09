import { Request, Response } from 'express';
import { ReportService } from '../services/report.service';
import { EvaluationRepository } from '../repositories/evaluation.repository';
import { UserRepository } from '../repositories/user.repository';
import { ProfileRepository } from '../repositories/profile.repository';
import { PlacementRepository } from '../repositories/placement.repository';
import { asyncHandler } from '../middleware/asyncHandler.middleware';
import { ApiResponse } from '../utils/ApiResponse';

export class ReportController {
  private reportService: ReportService;

  constructor() {
    const evaluationRepository = new EvaluationRepository();
    const userRepository = new UserRepository();
    const profileRepository = new ProfileRepository();
    const placementRepository = new PlacementRepository();
    this.reportService = new ReportService(
      evaluationRepository,
      userRepository,
      profileRepository,
      placementRepository
    );
  }

  public getReportData = asyncHandler(async (req: Request, res: Response) => {
    const { reportType = 'intern' } = req.params;
    const data = await this.reportService.getReportData(reportType);
    res.status(200).json(ApiResponse.success(data, 'Report data retrieved successfully'));
  });
}