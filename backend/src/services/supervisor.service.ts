import { LogEntry, LogStatus } from '@prisma/client';
import { IFeedbackRepository } from '../repositories/supervisor/feedback.repository';
import { ILogEntryRepository } from '../repositories/interfaces/ILogEntryRepository';
import { ApiError } from '../utils/ApiError';
import { logger } from '../utils/logger';
import prisma from '../config/database';
import {
  AssignedInternDTO,
  SubmittedLogDTO,
  SubmittedLogsListDTO,
  CreateFeedbackDTO,
  FeedbackResponseDTO,
  FeedbackListDTO,
  InternProgressDTO,
  SupervisorDashboardStatsDTO,
} from '../dto/supervisor/supervisor.dto';

export class SupervisorService {
  constructor(
    private readonly feedbackRepo: IFeedbackRepository,
    private readonly logEntryRepo: ILogEntryRepository,
  ) {}

  // ─── Assigned Interns ────────────────────────────────────────────────────

  async getAssignedInterns(supervisorId: string): Promise<AssignedInternDTO[]> {
    const placements = await prisma.placement.findMany({
      where: { supervisorId, status: 'ACTIVE' },
      include: {
        internProfile: {
          include: {
            user: { select: { id: true, firstName: true, lastName: true, email: true } },
          },
        },
      },
    });

    const internDTOs: AssignedInternDTO[] = [];

    for (const placement of placements) {
      const internUserId = placement.internProfile.userId;
      const internProfile = placement.internProfile;

      // Get log stats
      const [totalLogs, submittedLogs, approvedLogs, lastLog] = await Promise.all([
        prisma.logEntry.count({ where: { internId: internUserId } }),
        prisma.logEntry.count({ where: { internId: internUserId, status: 'SUBMITTED' } }),
        prisma.logEntry.count({ where: { internId: internUserId, status: 'APPROVED' } }),
        prisma.logEntry.findFirst({
          where: { internId: internUserId },
          orderBy: { createdAt: 'desc' },
          select: { createdAt: true },
        }),
      ]);

      internDTOs.push({
        id: placement.internProfile.id,
        userId: internUserId,
        firstName: internProfile.user.firstName,
        lastName: internProfile.user.lastName,
        email: internProfile.user.email,
        matricNumber: internProfile.matricNumber,
        institution: internProfile.institution,
        organizationName: internProfile.organizationName,
        startDate: internProfile.startDate?.toISOString() || null,
        endDate: internProfile.endDate?.toISOString() || null,
        placementId: placement.id,
        placementStatus: placement.status,
        totalLogs,
        submittedLogs,
        approvedLogs,
        pendingLogs: submittedLogs,
        lastActivity: lastLog?.createdAt.toISOString() || null,
      } as any);
    }

    return internDTOs;
  }

  // ─── Submitted Logs ──────────────────────────────────────────────────────

  async getSubmittedLogs(
    supervisorId: string,
    params: {
      page?: number;
      limit?: number;
      internId?: string;
      status?: string;
    },
  ): Promise<SubmittedLogsListDTO> {
    const { page = 1, limit = 10, internId, status = 'SUBMITTED' } = params;
    const skip = (page - 1) * limit;

    // Get assigned intern IDs
    const placements = await prisma.placement.findMany({
      where: { supervisorId, status: 'ACTIVE' },
      select: { internProfile: { select: { userId: true } } },
    });
    const assignedInternIds = placements.map((p) => p.internProfile.userId);

    if (assignedInternIds.length === 0) {
      return { logs: [], total: 0, page, limit, totalPages: 0 };
    }

    const where: any = {
      internId: internId || { in: assignedInternIds },
      status: status as LogStatus,
    };

    const [logs, total] = await Promise.all([
      prisma.logEntry.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          intern: { select: { id: true, firstName: true, lastName: true, email: true } },
        },
      }),
      prisma.logEntry.count({ where }),
    ]);

    return {
      logs: logs.map((log) => ({
        id: log.id,
        internId: log.internId,
        internName: `${log.intern.firstName} ${log.intern.lastName}`,
        internEmail: log.intern.email,
        matricNumber: null,
        entryType: log.entryType,
        status: log.status,
        logDate: log.logDate.toISOString(),
        activity: log.activity,
        skills: log.skills,
        hoursWorked: log.hoursWorked,
        notes: log.notes,
        createdAt: log.createdAt.toISOString(),
      })),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  // ─── Review Log ──────────────────────────────────────────────────────────

  async reviewLog(
    logId: string,
    reviewerId: string,
    status: 'APPROVED' | 'REJECTED',
    reviewNotes?: string,
  ): Promise<SubmittedLogDTO> {
    const entry = await this.logEntryRepo.findById(logId);
    if (!entry) {
      throw ApiError.notFound('Log entry not found');
    }
    if (entry.status !== 'SUBMITTED') {
      throw ApiError.badRequest('Only submitted logs can be reviewed');
    }
    if (entry.internId === reviewerId) {
      throw ApiError.badRequest('You cannot review your own log entry');
    }

    const updated = await this.logEntryRepo.update(logId, {
      status: status as any,
      reviewedBy: reviewerId,
      reviewedAt: new Date(),
      reviewNotes: reviewNotes || null,
    } as any);

    return {
      id: updated.id,
      internId: updated.internId,
      internName: '',
      internEmail: '',
      matricNumber: null,
      entryType: updated.entryType,
      status: updated.status,
      logDate: updated.logDate.toISOString(),
      activity: updated.activity,
      skills: updated.skills,
      hoursWorked: updated.hoursWorked,
      notes: updated.notes,
      createdAt: updated.createdAt.toISOString(),
    };
  }

  // ─── Feedback ────────────────────────────────────────────────────────────

  async createFeedback(supervisorId: string, dto: CreateFeedbackDTO): Promise<FeedbackResponseDTO> {
    // Verify intern is assigned to this supervisor
    const placement = await prisma.placement.findFirst({
      where: { supervisorId, internProfile: { userId: dto.internId } },
    });
    if (!placement) {
      throw ApiError.forbidden('This intern is not assigned to you');
    }

    const feedback = await this.feedbackRepo.create({
      supervisor: { connect: { id: supervisorId } },
      intern: { connect: { id: dto.internId } },
      ...(dto.logEntryId ? { logEntry: { connect: { id: dto.logEntryId } } } : {}),
      type: dto.type,
      rating: dto.rating || null,
      content: dto.content,
      strengths: dto.strengths || null,
      improvements: dto.improvements || null,
      isPrivate: dto.isPrivate || false,
    } as any);

    return this.mapFeedbackToDTO(feedback);
  }

  async getFeedbacksForIntern(
    internId: string,
    supervisorId: string,
    params: { page?: number; limit?: number },
  ): Promise<FeedbackListDTO> {
    // Verify access
    const placement = await prisma.placement.findFirst({
      where: { supervisorId, internProfile: { userId: internId } },
    });
    if (!placement) {
      throw ApiError.forbidden('This intern is not assigned to you');
    }

    const { page = 1, limit = 10 } = params;
    const skip = (page - 1) * limit;

    const { feedbacks, total } = await this.feedbackRepo.findByInternId(internId, { skip, take: limit });

    return {
      feedbacks: feedbacks.map((f) => this.mapFeedbackToDTO(f)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getMyFeedbacks(supervisorId: string, params: { page?: number; limit?: number }): Promise<FeedbackListDTO> {
    const { page = 1, limit = 10 } = params;
    const skip = (page - 1) * limit;

    const { feedbacks, total } = await this.feedbackRepo.findBySupervisorId(supervisorId, { skip, take: limit });

    return {
      feedbacks: feedbacks.map((f) => this.mapFeedbackToDTO(f)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async deleteFeedback(feedbackId: string, supervisorId: string): Promise<void> {
    const feedback = await this.feedbackRepo.findById(feedbackId);
    if (!feedback) {
      throw ApiError.notFound('Feedback not found');
    }
    if (feedback.supervisorId !== supervisorId) {
      throw ApiError.forbidden('You can only delete your own feedback');
    }
    await this.feedbackRepo.delete(feedbackId);
  }

  // ─── Intern Progress ─────────────────────────────────────────────────────

  async getInternProgress(internId: string, supervisorId: string): Promise<InternProgressDTO> {
    const placement = await prisma.placement.findFirst({
      where: { supervisorId, internProfile: { userId: internId } },
      include: {
        internProfile: {
          include: {
            user: { select: { id: true, firstName: true, lastName: true, email: true } },
          },
        },
      },
    });

    if (!placement) {
      throw ApiError.forbidden('This intern is not assigned to you');
    }

    const internProfile = placement.internProfile;
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [
      totalLogs, submittedLogs, approvedLogs, rejectedLogs,
      totalHoursAgg, weekHoursAgg, monthHoursAgg,
      recentLogs, recentFeedback,
    ] = await Promise.all([
      prisma.logEntry.count({ where: { internId } }),
      prisma.logEntry.count({ where: { internId, status: 'SUBMITTED' } }),
      prisma.logEntry.count({ where: { internId, status: 'APPROVED' } }),
      prisma.logEntry.count({ where: { internId, status: 'REJECTED' } }),
      prisma.logEntry.aggregate({ where: { internId }, _sum: { hoursWorked: true } }),
      prisma.logEntry.aggregate({ where: { internId, logDate: { gte: startOfWeek } }, _sum: { hoursWorked: true } }),
      prisma.logEntry.aggregate({ where: { internId, logDate: { gte: startOfMonth } }, _sum: { hoursWorked: true } }),
      prisma.logEntry.findMany({
        where: { internId },
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),
      prisma.feedback.findMany({
        where: { internId },
        orderBy: { createdAt: 'desc' },
        take: 5,
        include: {
          supervisor: { select: { id: true, firstName: true, lastName: true } },
        },
      }),
    ]);

    const totalHours = totalHoursAgg._sum.hoursWorked || 0;
    const reviewed = approvedLogs + rejectedLogs;
    const approvalRate = reviewed > 0 ? Math.round((approvedLogs / reviewed) * 100) : 0;

    return {
      intern: {
        id: internProfile.id,
        userId: internProfile.userId,
        firstName: internProfile.user.firstName,
        lastName: internProfile.user.lastName,
        email: internProfile.user.email,
        matricNumber: internProfile.matricNumber,
        institution: internProfile.institution,
        organizationName: internProfile.organizationName,
      },
      stats: {
        totalLogs,
        submittedLogs,
        approvedLogs,
        rejectedLogs,
        totalHours,
        weeklyHours: weekHoursAgg._sum.hoursWorked || 0,
        monthlyHours: monthHoursAgg._sum.hoursWorked || 0,
        approvalRate,
        streak: 0,
      },
      recentLogs: recentLogs.map((log) => ({
        id: log.id,
        internId: log.internId,
        internName: '',
        internEmail: '',
        matricNumber: null,
        entryType: log.entryType,
        status: log.status,
        logDate: log.logDate.toISOString(),
        activity: log.activity,
        skills: log.skills,
        hoursWorked: log.hoursWorked,
        notes: log.notes,
        createdAt: log.createdAt.toISOString(),
      })),
      recentFeedback: recentFeedback.map((f) => this.mapFeedbackToDTO(f)),
    };
  }

  // ─── Dashboard Stats ─────────────────────────────────────────────────────

  async getDashboardStats(supervisorId: string): Promise<SupervisorDashboardStatsDTO> {
    const placements = await prisma.placement.findMany({
      where: { supervisorId, status: 'ACTIVE' },
      select: { internProfile: { select: { userId: true } } },
    });
    const internIds = placements.map((p) => p.internProfile.userId);

    if (internIds.length === 0) {
      return {
        totalInterns: 0,
        pendingReviews: 0,
        approvedLogs: 0,
        rejectedLogs: 0,
        feedbackGiven: 0,
        recentSubmissions: [],
        internProgressSummaries: [],
      };
    }

    const [pendingReviews, approvedLogs, rejectedLogs, feedbackGiven, recentSubmissions] = await Promise.all([
      prisma.logEntry.count({ where: { internId: { in: internIds }, status: 'SUBMITTED' } }),
      prisma.logEntry.count({ where: { internId: { in: internIds }, status: 'APPROVED' } }),
      prisma.logEntry.count({ where: { internId: { in: internIds }, status: 'REJECTED' } }),
      prisma.feedback.count({ where: { supervisorId } }),
      prisma.logEntry.findMany({
        where: { internId: { in: internIds }, status: 'SUBMITTED' },
        orderBy: { createdAt: 'desc' },
        take: 10,
        include: {
          intern: { select: { id: true, firstName: true, lastName: true, email: true } },
        },
      }),
    ]);

    // Intern progress summaries
    const internProgressSummaries = [];
    for (const internId of internIds) {
      const [totalLogs, pending, approved, rejected] = await Promise.all([
        prisma.logEntry.count({ where: { internId } }),
        prisma.logEntry.count({ where: { internId, status: 'SUBMITTED' } }),
        prisma.logEntry.count({ where: { internId, status: 'APPROVED' } }),
        prisma.logEntry.count({ where: { internId, status: 'REJECTED' } }),
      ]);

      const user = await prisma.user.findUnique({
        where: { id: internId },
        select: { firstName: true, lastName: true },
      });

      const reviewed = approved + rejected;
      internProgressSummaries.push({
        internId,
        internName: user ? `${user.firstName} ${user.lastName}` : 'Unknown',
        totalLogs,
        pendingLogs: pending,
        approvalRate: reviewed > 0 ? Math.round((approved / reviewed) * 100) : 0,
      });
    }

    return {
      totalInterns: internIds.length,
      pendingReviews,
      approvedLogs,
      rejectedLogs,
      feedbackGiven,
      recentSubmissions: recentSubmissions.map((log) => ({
        id: log.id,
        internId: log.internId,
        internName: `${log.intern.firstName} ${log.intern.lastName}`,
        internEmail: log.intern.email,
        matricNumber: null,
        entryType: log.entryType,
        status: log.status,
        logDate: log.logDate.toISOString(),
        activity: log.activity,
        skills: log.skills,
        hoursWorked: log.hoursWorked,
        notes: log.notes,
        createdAt: log.createdAt.toISOString(),
      })),
      internProgressSummaries,
    };
  }

  // ─── Mapper ──────────────────────────────────────────────────────────────

  private mapFeedbackToDTO(feedback: any): FeedbackResponseDTO {
    return {
      id: feedback.id,
      supervisorId: feedback.supervisorId,
      supervisorName: feedback.supervisor
        ? `${feedback.supervisor.firstName} ${feedback.supervisor.lastName}`.trim()
        : '',
      internId: feedback.internId,
      internName: feedback.intern
        ? `${feedback.intern.firstName} ${feedback.intern.lastName}`.trim()
        : '',
      logEntryId: feedback.logEntryId || null,
      type: feedback.type,
      rating: feedback.rating || null,
      content: feedback.content,
      strengths: feedback.strengths || null,
      improvements: feedback.improvements || null,
      isPrivate: feedback.isPrivate,
      createdAt: feedback.createdAt.toISOString(),
      updatedAt: feedback.updatedAt.toISOString(),
    };
  }
}