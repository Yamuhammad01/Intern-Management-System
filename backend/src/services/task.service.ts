import prisma from '../config/database';
import { TaskStatsDTO } from '../dto/task.dto';

export class TaskService {
  async getInternTaskStats(internId: string): Promise<TaskStatsDTO> {
    const [total, completed, inProgress, draft] = await Promise.all([
      prisma.logEntry.count({
        where: { internId },
      }),
      prisma.logEntry.count({
        where: { internId, status: 'APPROVED' },
      }),
      prisma.logEntry.count({
        where: { internId, status: 'SUBMITTED' },
      }),
      prisma.logEntry.count({
        where: { internId, status: 'DRAFT' },
      }),
    ]);

    return {
      total,
      completed,
      inProgress,
      pendingOverdue: draft,
    };
  }

  async getSupervisorTaskStats(supervisorId: string): Promise<TaskStatsDTO> {
    // Get all interns under this supervisor
    const placements = await prisma.placement.findMany({
      where: { supervisorId },
      select: { internId: true },
    });

    const internIds = placements.map(p => p.internId);

    if (internIds.length === 0) {
      return { total: 0, completed: 0, inProgress: 0, pendingOverdue: 0 };
    }

    const [total, completed, inProgress, draft] = await Promise.all([
      prisma.logEntry.count({
        where: { internId: { in: internIds } },
      }),
      prisma.logEntry.count({
        where: { internId: { in: internIds }, status: 'APPROVED' },
      }),
      prisma.logEntry.count({
        where: { internId: { in: internIds }, status: 'SUBMITTED' },
      }),
      prisma.logEntry.count({
        where: { internId: { in: internIds }, status: 'DRAFT' },
      }),
    ]);

    return {
      total,
      completed,
      inProgress,
      pendingOverdue: draft,
    };
  }

  async getAdminTaskStats(): Promise<TaskStatsDTO> {
    const [total, completed, inProgress, draft] = await Promise.all([
      prisma.logEntry.count(),
      prisma.logEntry.count({ where: { status: 'APPROVED' } }),
      prisma.logEntry.count({ where: { status: 'SUBMITTED' } }),
      prisma.logEntry.count({ where: { status: 'DRAFT' } }),
    ]);

    return {
      total,
      completed,
      inProgress,
      pendingOverdue: draft,
    };
  }
}