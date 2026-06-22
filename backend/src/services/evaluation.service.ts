import { Evaluation, EvaluationStatus } from '@prisma/client';
import { EvaluationRepository } from '../repositories/evaluation.repository';
import { ApiError } from '../utils/ApiError';
import { logger } from '../utils/logger';
import prisma from '../config/database';
import {
  CreateEvaluationDTO,
  UpdateEvaluationDTO,
  EvaluationResponseDTO,
  EvaluationSummaryDTO,
} from '../dto/evaluation.dto';

export class EvaluationService {
  constructor(private readonly evaluationRepo: EvaluationRepository) {}

  // ─── Scoring Engine ───────────────────────────────────────────────────────

  private calculateOverallScore(scores: {
    attendance?: number;
    technicalSkills?: number;
    communication?: number;
    teamwork?: number;
    initiative?: number;
    problemSolving?: number;
    professionalConduct?: number;
  }): number | null {
    const values = Object.values(scores).filter((v): v is number => typeof v === 'number');
    if (values.length === 0) return null;
    const sum = values.reduce((acc, val) => acc + val, 0);
    return Math.round((sum / (values.length * 10)) * 100);
  }

  // ─── Create Evaluation ────────────────────────────────────────────────────

  async createEvaluation(supervisorId: string, dto: CreateEvaluationDTO): Promise<EvaluationResponseDTO> {
    // Verify placement exists and belongs to this supervisor
    const placement = await prisma.placement.findFirst({
      where: {
        id: dto.placementId,
        supervisorId,
        internProfile: { userId: dto.internId },
      },
    });

    if (!placement) {
      throw ApiError.forbidden('Placement not found or not assigned to you');
    }

    // Check if an evaluation already exists for this placement
    const existing = await this.evaluationRepo.findByPlacementId(dto.placementId);
    if (existing) {
      throw ApiError.conflict('An evaluation already exists for this placement');
    }

    const overallScore = this.calculateOverallScore({
      attendance: dto.attendance,
      technicalSkills: dto.technicalSkills,
      communication: dto.communication,
      teamwork: dto.teamwork,
      initiative: dto.initiative,
      problemSolving: dto.problemSolving,
      professionalConduct: dto.professionalConduct,
    });

    const evaluation = await this.evaluationRepo.create({
      intern: { connect: { id: dto.internId } },
      supervisor: { connect: { id: supervisorId } },
      placement: { connect: { id: dto.placementId } },
      status: (dto.status as EvaluationStatus) || 'PENDING',
      attendance: dto.attendance,
      technicalSkills: dto.technicalSkills,
      communication: dto.communication,
      teamwork: dto.teamwork,
      initiative: dto.initiative,
      problemSolving: dto.problemSolving,
      professionalConduct: dto.professionalConduct,
      overallScore,
      strengths: dto.strengths,
      improvements: dto.improvements,
      comments: dto.comments,
    } as any);

    return this.mapToResponseDTO(evaluation);
  }

  // ─── Update Evaluation ────────────────────────────────────────────────────

  async updateEvaluation(
    evaluationId: string,
    supervisorId: string,
    dto: UpdateEvaluationDTO,
  ): Promise<EvaluationResponseDTO> {
    const evaluation = await this.evaluationRepo.findById(evaluationId);
    if (!evaluation) {
      throw ApiError.notFound('Evaluation not found');
    }

    if (evaluation.supervisorId !== supervisorId) {
      throw ApiError.forbidden('You are not authorized to update this evaluation');
    }

    const overallScore = this.calculateOverallScore({
      attendance: dto.attendance,
      technicalSkills: dto.technicalSkills,
      communication: dto.communication,
      teamwork: dto.teamwork,
      initiative: dto.initiative,
      problemSolving: dto.problemSolving,
      professionalConduct: dto.professionalConduct,
    });

    const updated = await this.evaluationRepo.update(evaluationId, {
      ...(dto.attendance !== undefined && { attendance: dto.attendance }),
      ...(dto.technicalSkills !== undefined && { technicalSkills: dto.technicalSkills }),
      ...(dto.communication !== undefined && { communication: dto.communication }),
      ...(dto.teamwork !== undefined && { teamwork: dto.teamwork }),
      ...(dto.initiative !== undefined && { initiative: dto.initiative }),
      ...(dto.problemSolving !== undefined && { problemSolving: dto.problemSolving }),
      ...(dto.professionalConduct !== undefined && { professionalConduct: dto.professionalConduct }),
      ...(overallScore !== null && { overallScore }),
      ...(dto.strengths !== undefined && { strengths: dto.strengths }),
      ...(dto.improvements !== undefined && { improvements: dto.improvements }),
      ...(dto.comments !== undefined && { comments: dto.comments }),
      ...(dto.status !== undefined && { status: dto.status as EvaluationStatus }),
    } as any);

    return this.mapToResponseDTO(updated);
  }

  // ─── Complete Evaluation ──────────────────────────────────────────────────

  async completeEvaluation(evaluationId: string, supervisorId: string): Promise<EvaluationResponseDTO> {
    const evaluation = await this.evaluationRepo.findById(evaluationId);
    if (!evaluation) {
      throw ApiError.notFound('Evaluation not found');
    }

    if (evaluation.supervisorId !== supervisorId) {
      throw ApiError.forbidden('You are not authorized to complete this evaluation');
    }

    const scores = {
      attendance: evaluation.attendance ?? undefined,
      technicalSkills: evaluation.technicalSkills ?? undefined,
      communication: evaluation.communication ?? undefined,
      teamwork: evaluation.teamwork ?? undefined,
      initiative: evaluation.initiative ?? undefined,
      problemSolving: evaluation.problemSolving ?? undefined,
      professionalConduct: evaluation.professionalConduct ?? undefined,
    };

    const missingScores = Object.entries(scores)
      .filter(([_, v]) => v === undefined)
      .map(([k]) => k);

    if (missingScores.length > 0) {
      throw ApiError.badRequest(`Please complete the following criteria: ${missingScores.join(', ')}`);
    }

    const overallScore = this.calculateOverallScore(scores as any);
    if (overallScore === null) {
      throw ApiError.badRequest('Unable to calculate overall score');
    }

    const updated = await this.evaluationRepo.updateStatus(evaluationId, 'COMPLETED');
    const final = await this.evaluationRepo.update(evaluationId, { overallScore } as any);

    return this.mapToResponseDTO(final);
  }

  // ─── Review Evaluation ────────────────────────────────────────────────────

  async reviewEvaluation(evaluationId: string, reviewerId: string): Promise<EvaluationResponseDTO> {
    const evaluation = await this.evaluationRepo.findById(evaluationId);
    if (!evaluation) {
      throw ApiError.notFound('Evaluation not found');
    }

    const reviewed = await this.evaluationRepo.updateStatus(evaluationId, 'REVIEWED', reviewerId);
    return this.mapToResponseDTO(reviewed);
  }

  // ─── Get Evaluation by ID ─────────────────────────────────────────────────

  async getEvaluationById(evaluationId: string, userId: string, userRole: string): Promise<EvaluationResponseDTO> {
    const evaluation = await this.evaluationRepo.findById(evaluationId);
    if (!evaluation) {
      throw ApiError.notFound('Evaluation not found');
    }

    // Access control: intern, supervisor, or admin can view
    const isAuthorized =
      userRole === 'ADMIN' ||
      userRole === 'SUPER_ADMIN' ||
      evaluation.internId === userId ||
      evaluation.supervisorId === userId;

    if (!isAuthorized) {
      throw ApiError.forbidden('You are not authorized to view this evaluation');
    }

    return this.mapToResponseDTO(evaluation);
  }

  // ─── Get Evaluations for Intern ──────────────────────────────────────────

  async getEvaluationsByIntern(
    internId: string,
    userId: string,
    userRole: string,
    params: { page?: number; limit?: number },
  ): Promise<{ evaluations: EvaluationResponseDTO[]; total: number }> {
    // Access control
    const isAuthorized =
      userRole === 'ADMIN' ||
      userRole === 'SUPER_ADMIN' ||
      internId === userId;

    if (!isAuthorized) {
      throw ApiError.forbidden('You are not authorized to view these evaluations');
    }

    const { page = 1, limit = 10 } = params;
    const skip = (page - 1) * limit;

    const [evaluations, total] = await Promise.all([
      this.evaluationRepo.findByInternId(internId, { skip, take: limit }),
      prisma.evaluation.count({ where: { internId } }),
    ]);

    return {
      evaluations: evaluations.map((e) => this.mapToResponseDTO(e)),
      total,
    };
  }

  // ─── Get Evaluations by Supervisor ───────────────────────────────────────

  async getEvaluationsBySupervisor(
    supervisorId: string,
    userId: string,
    userRole: string,
    params: { page?: number; limit?: number },
  ): Promise<{ evaluations: EvaluationResponseDTO[]; total: number }> {
    // Access control
    const isAuthorized =
      userRole === 'ADMIN' ||
      userRole === 'SUPER_ADMIN' ||
      supervisorId === userId;

    if (!isAuthorized) {
      throw ApiError.forbidden('You are not authorized to view these evaluations');
    }

    const { page = 1, limit = 10 } = params;
    const skip = (page - 1) * limit;

    const [evaluations, total] = await Promise.all([
      this.evaluationRepo.findBySupervisorId(supervisorId, { skip, take: limit }),
      prisma.evaluation.count({ where: { supervisorId } }),
    ]);

    return {
      evaluations: evaluations.map((e) => this.mapToResponseDTO(e)),
      total,
    };
  }

  // ─── Get Evaluation Summary ──────────────────────────────────────────────

  async getEvaluationSummary(supervisorId?: string, internId?: string): Promise<EvaluationSummaryDTO> {
    const where: any = {};
    if (supervisorId) where.supervisorId = supervisorId;
    if (internId) where.internId = internId;

    const [total, completed, pending, avgScore] = await Promise.all([
      prisma.evaluation.count({ where }),
      prisma.evaluation.count({ where: { ...where, status: 'COMPLETED' } }),
      prisma.evaluation.count({ where: { ...where, status: 'PENDING' } }),
      prisma.evaluation.aggregate({
        where,
        _avg: { overallScore: true },
      }),
    ]);

    return {
      totalEvaluations: total,
      completedEvaluations: completed,
      pendingEvaluations: pending,
      averageScore: avgScore._avg.overallScore,
    };
  }

  // ─── Get All Evaluations (Admin) ─────────────────────────────────────────

  async getAllEvaluations(params: {
    page?: number;
    limit?: number;
    status?: EvaluationStatus;
    internId?: string;
    placementId?: string;
    startDate?: Date;
    endDate?: Date;
  }): Promise<{ evaluations: EvaluationResponseDTO[]; total: number }> {
    const { page = 1, limit = 10 } = params;
    const skip = (page - 1) * limit;

    const { evaluations, total } = await this.evaluationRepo.findAll({
      page,
      limit,
      status: params.status,
      internId: params.internId,
      placementId: params.placementId,
      startDate: params.startDate,
      endDate: params.endDate,
    });

    return {
      evaluations: evaluations.map((e) => this.mapToResponseDTO(e)),
      total,
    };
  }

  // ─── Delete Evaluation ────────────────────────────────────────────────────

  async deleteEvaluation(evaluationId: string, userId: string, userRole: string): Promise<void> {
    const evaluation = await this.evaluationRepo.findById(evaluationId);
    if (!evaluation) {
      throw ApiError.notFound('Evaluation not found');
    }

    const isAuthorized =
      userRole === 'ADMIN' ||
      userRole === 'SUPER_ADMIN' ||
      evaluation.supervisorId === userId;

    if (!isAuthorized) {
      throw ApiError.forbidden('You are not authorized to delete this evaluation');
    }

    await this.evaluationRepo.delete(evaluationId);
  }

  // ─── Mapper ──────────────────────────────────────────────────────────────

  private mapToResponseDTO(evaluation: Evaluation & {
    intern?: { id: string; firstName: string; lastName: string; email: string };
    supervisor?: { id: string; firstName: string; lastName: string };
    reviewer?: { id: string; firstName: string; lastName: string };
    placement?: {
      id: string;
      organization?: { id: string; name: string };
      internProfile?: {
        user?: { id: string; firstName: string; lastName: string; email: string };
      };
    };
  }): EvaluationResponseDTO {
    return {
      id: evaluation.id,
      internId: evaluation.internId,
      internName: evaluation.intern
        ? `${evaluation.intern.firstName} ${evaluation.intern.lastName}`
        : evaluation.placement?.internProfile?.user
          ? `${evaluation.placement.internProfile.user.firstName} ${evaluation.placement.internProfile.user.lastName}`
          : 'Unknown',
      internEmail: evaluation.intern?.email || evaluation.placement?.internProfile?.user?.email || '',
      supervisorId: evaluation.supervisorId,
      supervisorName: evaluation.supervisor
        ? `${evaluation.supervisor.firstName} ${evaluation.supervisor.lastName}`
        : 'Unknown',
      placementId: evaluation.placementId,
      status: evaluation.status,
      attendance: evaluation.attendance,
      technicalSkills: evaluation.technicalSkills,
      communication: evaluation.communication,
      teamwork: evaluation.teamwork,
      initiative: evaluation.initiative,
      problemSolving: evaluation.problemSolving,
      professionalConduct: evaluation.professionalConduct,
      overallScore: evaluation.overallScore,
      strengths: evaluation.strengths,
      improvements: evaluation.improvements,
      comments: evaluation.comments,
      reviewedBy: evaluation.reviewedBy,
      reviewerName: evaluation.reviewer
        ? `${evaluation.reviewer.firstName} ${evaluation.reviewer.lastName}`
        : null,
      reviewedAt: evaluation.reviewedAt?.toISOString() || null,
      createdAt: evaluation.createdAt.toISOString(),
      updatedAt: evaluation.updatedAt.toISOString(),
    };
  }
}