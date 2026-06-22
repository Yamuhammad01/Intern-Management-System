import { Prisma, Evaluation, EvaluationStatus } from '@prisma/client';
import prisma from '../config/database';
import { ApiError } from '../utils/ApiError';
import { logger } from '../utils/logger';

export class EvaluationRepository {
  async findById(id: string): Promise<Evaluation | null> {
    try {
      return await prisma.evaluation.findUnique({
        where: { id },
        include: {
          intern: { select: { id: true, firstName: true, lastName: true, email: true } },
          supervisor: { select: { id: true, firstName: true, lastName: true, email: true } },
          reviewer: { select: { id: true, firstName: true, lastName: true } },
          placement: {
            include: {
              organization: { select: { id: true, name: true } },
              internProfile: {
                include: {
                  user: { select: { id: true, firstName: true, lastName: true, email: true } },
                },
              },
            },
          },
        },
      });
    } catch (error) {
      logger.error('Error finding evaluation by ID:', error);
      throw ApiError.internal('Failed to find evaluation');
    }
  }

  async findByInternId(internId: string, params: { skip?: number; take?: number }): Promise<Evaluation[]> {
    try {
      const { skip = 0, take = 10 } = params;
      return await prisma.evaluation.findMany({
        where: { internId },
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          supervisor: { select: { id: true, firstName: true, lastName: true } },
          reviewer: { select: { id: true, firstName: true, lastName: true } },
          placement: {
            include: {
              organization: { select: { id: true, name: true } },
            },
          },
        },
      });
    } catch (error) {
      logger.error('Error finding evaluations by intern ID:', error);
      throw ApiError.internal('Failed to find evaluations');
    }
  }

  async findBySupervisorId(supervisorId: string, params: { skip?: number; take?: number }): Promise<Evaluation[]> {
    try {
      const { skip = 0, take = 10 } = params;
      return await prisma.evaluation.findMany({
        where: { supervisorId },
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          intern: { select: { id: true, firstName: true, lastName: true, email: true } },
          reviewer: { select: { id: true, firstName: true, lastName: true } },
          placement: {
            include: {
              organization: { select: { id: true, name: true } },
            },
          },
        },
      });
    } catch (error) {
      logger.error('Error finding evaluations by supervisor ID:', error);
      throw ApiError.internal('Failed to find evaluations');
    }
  }

  async findByPlacementId(placementId: string): Promise<Evaluation | null> {
    try {
      return await prisma.evaluation.findFirst({
        where: { placementId },
        include: {
          intern: { select: { id: true, firstName: true, lastName: true, email: true } },
          supervisor: { select: { id: true, firstName: true, lastName: true } },
          reviewer: { select: { id: true, firstName: true, lastName: true } },
          placement: {
            include: {
              organization: { select: { id: true, name: true } },
            },
          },
        },
      });
    } catch (error) {
      logger.error('Error finding evaluation by placement ID:', error);
      throw ApiError.internal('Failed to find evaluation');
    }
  }

  async findAll(params: {
    page?: number;
    limit?: number;
    status?: EvaluationStatus;
    internId?: string;
    placementId?: string;
    startDate?: Date;
    endDate?: Date;
  }): Promise<{ evaluations: Evaluation[]; total: number }> {
    try {
      const { page = 1, limit = 10, status, internId, placementId, startDate, endDate } = params;
      const skip = (page - 1) * limit;

      const where: Prisma.EvaluationWhereInput = {};
      if (status) where.status = status;
      if (internId) where.internId = internId;
      if (placementId) where.placementId = placementId;
      if (startDate || endDate) {
        where.createdAt = {};
        if (startDate) where.createdAt.gte = startDate;
        if (endDate) where.createdAt.lte = endDate;
      }

      const [evaluations, total] = await Promise.all([
        prisma.evaluation.findMany({
          where,
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' },
          include: {
            intern: { select: { id: true, firstName: true, lastName: true, email: true } },
            supervisor: { select: { id: true, firstName: true, lastName: true } },
            reviewer: { select: { id: true, firstName: true, lastName: true } },
            placement: {
              include: {
                organization: { select: { id: true, name: true } },
              },
            },
          },
        }),
        prisma.evaluation.count({ where }),
      ]);

      return { evaluations, total };
    } catch (error) {
      logger.error('Error finding evaluations:', error);
      throw ApiError.internal('Failed to find evaluations');
    }
  }

  async create(data: Prisma.EvaluationCreateInput): Promise<Evaluation> {
    try {
      return await prisma.evaluation.create({
        data,
        include: {
          intern: { select: { id: true, firstName: true, lastName: true, email: true } },
          supervisor: { select: { id: true, firstName: true, lastName: true } },
          reviewer: { select: { id: true, firstName: true, lastName: true } },
          placement: {
            include: {
              organization: { select: { id: true, name: true } },
            },
          },
        },
      });
    } catch (error) {
      logger.error('Error creating evaluation:', error);
      throw ApiError.internal('Failed to create evaluation');
    }
  }

  async update(id: string, data: Prisma.EvaluationUpdateInput): Promise<Evaluation> {
    try {
      return await prisma.evaluation.update({
        where: { id },
        data,
        include: {
          intern: { select: { id: true, firstName: true, lastName: true, email: true } },
          supervisor: { select: { id: true, firstName: true, lastName: true } },
          reviewer: { select: { id: true, firstName: true, lastName: true } },
          placement: {
            include: {
              organization: { select: { id: true, name: true } },
            },
          },
        },
      });
    } catch (error) {
      logger.error('Error updating evaluation:', error);
      throw ApiError.internal('Failed to update evaluation');
    }
  }

  async updateStatus(id: string, status: EvaluationStatus, reviewedBy?: string): Promise<Evaluation> {
    try {
      return await prisma.evaluation.update({
        where: { id },
        data: {
          status,
          ...(reviewedBy ? { reviewedBy, reviewedAt: new Date() } : {}),
        },
        include: {
          intern: { select: { id: true, firstName: true, lastName: true, email: true } },
          supervisor: { select: { id: true, firstName: true, lastName: true } },
          reviewer: { select: { id: true, firstName: true, lastName: true } },
          placement: {
            include: {
              organization: { select: { id: true, name: true } },
            },
          },
        },
      });
    } catch (error) {
      logger.error('Error updating evaluation status:', error);
      throw ApiError.internal('Failed to update evaluation status');
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await prisma.evaluation.delete({ where: { id } });
    } catch (error) {
      logger.error('Error deleting evaluation:', error);
      throw ApiError.internal('Failed to delete evaluation');
    }
  }

  async countEvaluationsByIntern(internId: string): Promise<{ total: number; completed: number; pending: number }> {
    try {
      const [total, completed, pending] = await Promise.all([
        prisma.evaluation.count({ where: { internId } }),
        prisma.evaluation.count({ where: { internId, status: 'COMPLETED' } }),
        prisma.evaluation.count({ where: { internId, status: 'PENDING' } }),
      ]);

      return { total, completed, pending };
    } catch (error) {
      logger.error('Error counting evaluations by intern:', error);
      throw ApiError.internal('Failed to count evaluations');
    }
  }

  async getAverageScore(internId?: string): Promise<number | null> {
    try {
      const where = internId ? { internId } : {};
      
      const result = await prisma.evaluation.aggregate({
        where,
        _avg: { overallScore: true },
      });

      return result._avg.overallScore;
    } catch (error) {
      logger.error('Error calculating average score:', error);
      throw ApiError.internal('Failed to calculate average score');
    }
  }
}