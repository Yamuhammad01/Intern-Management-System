import { EvaluationRepository } from '../repositories/evaluation.repository';
import { UserRepository } from '../repositories/user.repository';
import { ProfileRepository } from '../repositories/profile.repository';
import { PlacementRepository } from '../repositories/placement.repository';
import prisma from '../config/database';
import { ApiError } from '../utils/ApiError';
import { InternScorecardDTO, ScorecardRankingDTO } from '../dto/scorecard.dto';

export class ScorecardService {
  constructor(
    private readonly evaluationRepo: EvaluationRepository,
    private readonly userRepo: UserRepository,
    private readonly profileRepo: ProfileRepository,
    private readonly placementRepo: PlacementRepository,
  ) {}

  async getScorecard(supervisorId: string): Promise<InternScorecardDTO[]> {
    // Get all placements for this supervisor
    const placements = await prisma.placement.findMany({
      where: { supervisorId },
      include: {
        internProfile: {
          include: {
            user: true,
          },
        },
      },
    });

    if (placements.length === 0) {
      return [];
    }

    const internIds = placements.map(p => p.internId);
    
    // Get all evaluations for these interns
    const evaluations = await prisma.evaluation.findMany({
      where: {
        internId: { in: internIds },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Map evaluations to scorecard entries
    const scorecards = evaluations.map(evaluation => {
      const placement = placements.find(p => p.internId === evaluation.internId);
      const internProfile = placement?.internProfile;
      const user = internProfile?.user;

      if (!user || !internProfile) {
        return null;
      }

      return {
        id: evaluation.id,
        name: `${user.firstName} ${user.lastName}`,
        matricNumber: internProfile.matricNumber,
        program: user.department,
        attendance: evaluation.attendance,
        score: evaluation.overallScore,
        status: evaluation.status,
        createdAt: evaluation.createdAt.toISOString(),
        updatedAt: evaluation.updatedAt.toISOString(),
      } as InternScorecardDTO;
    }).filter((item): item is InternScorecardDTO => item !== null);

    return scorecards;
  }

  async getScorecardRanking(supervisorId: string): Promise<ScorecardRankingDTO> {
    const scorecards = await this.getScorecard(supervisorId);

    // Sort by score descending for top performers
    const sortedByScoreDesc = [...scorecards].sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
    const topPerformers = sortedByScoreDesc.slice(0, 3);

    // At-risk: scored below 30, sorted ascending (worst first)
    const atRisk = scorecards
      .filter(s => (s.score ?? 0) < 30)
      .sort((a, b) => (a.score ?? 0) - (b.score ?? 0));

    return {
      topPerformers,
      atRiskInterns: atRisk,
    };
  }
}
