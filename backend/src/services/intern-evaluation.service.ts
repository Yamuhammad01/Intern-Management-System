import { Evaluation, EvaluationStatus } from '@prisma/client';
import { EvaluationRepository } from '../repositories/evaluation.repository';
import { ApiError } from '../utils/ApiError';
import { logger } from '../utils/logger';
import prisma from '../config/database';
import {
  InternEvaluationListDTO,
  InternEvaluationDetailDTO,
  InternEvaluationStatsDTO,
} from '../dto/intern-evaluation.dto';

export class InternEvaluationService {
  constructor(private readonly evaluationRepo: EvaluationRepository) {}

  // ─── Resolve InternProfile ID ─────────────────────────────────────────────
  // The frontend sends user IDs which resolve to InternProfile.id

  private async resolveInternProfileId(userId: string): Promise<string> {
    const profile = await prisma.internProfile.findFirst({
      where: {
        OR: [
          { id: userId },
          { userId },
        ],
      },
    });
    if (!profile) {
      throw ApiError.notFound('Intern profile not found');
    }
    return profile.id;
  }

  // ─── Get All Completed Evaluations for Logged-in Intern ───────────────────

  async getMyEvaluations(userId: string): Promise<{
    evaluations: InternEvaluationListDTO[];
    stats: InternEvaluationStatsDTO;
  }> {
    const internProfileId = await this.resolveInternProfileId(userId);

    const allEvaluations = await prisma.evaluation.findMany({
      where: { internId: internProfileId },
      include: {
        supervisor: { select: { firstName: true, lastName: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Only show COMPLETED or REVIEWED evaluations to the intern
    const visibleEvaluations = allEvaluations.filter(
      (e) => e.status === 'COMPLETED' || e.status === 'REVIEWED',
    );

    // Calculate stats
    const scores = visibleEvaluations
      .map((e) => e.overallScore)
      .filter((s): s is number => s !== null);

    const stats: InternEvaluationStatsDTO = {
      totalEvaluations: visibleEvaluations.length,
      averageScore: scores.length > 0
        ? Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 100) / 100
        : null,
      highestScore: scores.length > 0 ? Math.max(...scores) : null,
    };

    const evaluations: InternEvaluationListDTO[] = visibleEvaluations.map((e) => ({
      id: e.id,
      supervisorName: `${e.supervisor.firstName} ${e.supervisor.lastName}`,
      overallScore: e.overallScore,
      status: e.status,
      createdAt: e.createdAt.toISOString(),
    }));

    return { evaluations, stats };
  }

  // ─── Get Single Evaluation Detail ─────────────────────────────────────────

  async getMyEvaluationById(evaluationId: string, userId: string): Promise<InternEvaluationDetailDTO> {
    const internProfileId = await this.resolveInternProfileId(userId);

    const evaluation = await prisma.evaluation.findFirst({
      where: {
        id: evaluationId,
        internId: internProfileId,
        status: { in: ['COMPLETED', 'REVIEWED'] },
      },
      include: {
        supervisor: { select: { firstName: true, lastName: true } },
        placement: {
          include: {
            organization: { select: { name: true } },
          },
        },
      },
    });

    if (!evaluation) {
      throw ApiError.notFound('Evaluation not found or not yet completed');
    }

    return {
      id: evaluation.id,
      supervisorName: `${evaluation.supervisor.firstName} ${evaluation.supervisor.lastName}`,
      placementRole: evaluation.placement?.role ?? null,
      placementOrganization: evaluation.placement?.organization?.name ?? 'N/A',
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
      reviewedAt: evaluation.reviewedAt?.toISOString() ?? null,
      createdAt: evaluation.createdAt.toISOString(),
      updatedAt: evaluation.updatedAt.toISOString(),
    };
  }
}