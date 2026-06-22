import { LogEntry, LogStatus } from '@prisma/client';
import { ILogEntryRepository } from '../repositories/interfaces/ILogEntryRepository';
import { ApiError } from '../utils/ApiError';
import { logger } from '../utils/logger';
import {
  CreateLogEntryRequestDTO,
  LogEntryResponseDTO,
  LogEntryListDTO,
  UpdateLogEntryRequestDTO,
  ReviewLogEntryRequestDTO,
  LogDashboardStatsDTO,
} from '../dto/logbook.dto';

export class LogbookService {
  constructor(private readonly logEntryRepo: ILogEntryRepository) {}

  async createLogEntry(internId: string, dto: CreateLogEntryRequestDTO): Promise<LogEntryResponseDTO> {
    const logDate = new Date(dto.logDate);
    const today = new Date();
    today.setHours(23, 59, 59, 999);

    if (logDate > today) {
      throw ApiError.badRequest('Cannot backdate logs. Date cannot be in the future.');
    }

    const entry = await this.logEntryRepo.create({
      intern: { connect: { id: internId } },
      entryType: dto.entryType,
      status: 'DRAFT',
      logDate,
      activity: dto.activity,
      skills: dto.skills || null,
      hoursWorked: dto.hoursWorked || null,
      notes: dto.notes || null,
    } as any);

    return this.mapToResponseDTO(entry);
  }

  async getLogEntryById(id: string, userId: string, userRole: string): Promise<LogEntryResponseDTO> {
    const entry = await this.logEntryRepo.findById(id);
    if (!entry) {
      throw ApiError.notFound('Log entry not found');
    }

    // Only interns can view their own logs; supervisors/admins can view any
    if (userRole === 'INTERN' && entry.internId !== userId) {
      throw ApiError.forbidden('You can only view your own log entries');
    }

    return this.mapToResponseDTO(entry);
  }

  async getMyLogs(
    internId: string,
    params: {
      page?: number;
      limit?: number;
      status?: string;
      entryType?: string;
      startDate?: string;
      endDate?: string;
    },
  ): Promise<LogEntryListDTO> {
    const { page = 1, limit = 10, status, entryType, startDate, endDate } = params;
    const skip = (page - 1) * limit;

    const { entries, total } = await this.logEntryRepo.findByInternId(internId, {
      skip,
      take: limit,
      status,
      entryType,
      startDate,
      endDate,
    });

    return {
      entries: entries.map((e) => this.mapToResponseDTO(e)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getAllLogs(params: {
    page?: number;
    limit?: number;
    status?: string;
    entryType?: string;
    startDate?: string;
    endDate?: string;
    internId?: string;
  }): Promise<LogEntryListDTO> {
    const { page = 1, limit = 10, status, entryType, startDate, endDate, internId } = params;
    const skip = (page - 1) * limit;

    const { entries, total } = await this.logEntryRepo.findAll({
      skip,
      take: limit,
      status,
      entryType,
      startDate,
      endDate,
      internId,
    });

    return {
      entries: entries.map((e) => this.mapToResponseDTO(e)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async updateLogEntry(
    id: string,
    userId: string,
    dto: UpdateLogEntryRequestDTO,
  ): Promise<LogEntryResponseDTO> {
    const entry = await this.logEntryRepo.findById(id);
    if (!entry) {
      throw ApiError.notFound('Log entry not found');
    }

    // Only the intern who owns the log can edit, and only if it's still a draft
    if (entry.internId !== userId) {
      throw ApiError.forbidden('You can only edit your own log entries');
    }

    if (entry.status !== 'DRAFT') {
      throw ApiError.badRequest('Only draft logs can be edited. Submitted logs must be recalled first.');
    }

    const updateData: any = {};
    if (dto.entryType) updateData.entryType = dto.entryType;
    if (dto.logDate) {
      const logDate = new Date(dto.logDate);
      const today = new Date();
      today.setHours(23, 59, 59, 999);
      if (logDate > today) {
        throw ApiError.badRequest('Cannot set a future date.');
      }
      updateData.logDate = logDate;
    }
    if (dto.activity !== undefined) updateData.activity = dto.activity;
    if (dto.skills !== undefined) updateData.skills = dto.skills;
    if (dto.hoursWorked !== undefined) updateData.hoursWorked = dto.hoursWorked;
    if (dto.notes !== undefined) updateData.notes = dto.notes;

    const updated = await this.logEntryRepo.update(id, updateData as any);
    return this.mapToResponseDTO(updated);
  }

  async submitLog(id: string, userId: string): Promise<LogEntryResponseDTO> {
    const entry = await this.logEntryRepo.findById(id);
    if (!entry) {
      throw ApiError.notFound('Log entry not found');
    }

    if (entry.internId !== userId) {
      throw ApiError.forbidden('You can only submit your own log entries');
    }

    if (entry.status !== 'DRAFT') {
      throw ApiError.badRequest('Only draft logs can be submitted');
    }

    const updated = await this.logEntryRepo.update(id, { status: 'SUBMITTED' } as any);
    return this.mapToResponseDTO(updated);
  }

  async deleteLogEntry(id: string, userId: string): Promise<void> {
    const entry = await this.logEntryRepo.findById(id);
    if (!entry) {
      throw ApiError.notFound('Log entry not found');
    }

    if (entry.internId !== userId) {
      throw ApiError.forbidden('You can only delete your own log entries');
    }

    if (entry.status !== 'DRAFT') {
      throw ApiError.badRequest('Only draft logs can be deleted');
    }

    await this.logEntryRepo.delete(id);
  }

  async reviewLogEntry(
    id: string,
    reviewerId: string,
    dto: ReviewLogEntryRequestDTO,
  ): Promise<LogEntryResponseDTO> {
    const entry = await this.logEntryRepo.findById(id);
    if (!entry) {
      throw ApiError.notFound('Log entry not found');
    }

    if (entry.status !== 'SUBMITTED') {
      throw ApiError.badRequest('Only submitted logs can be reviewed');
    }

    // Prevent self-review
    if (entry.internId === reviewerId) {
      throw ApiError.badRequest('You cannot review your own log entry');
    }

    const updateData: any = {
      status: dto.status,
      reviewedBy: reviewerId,
      reviewedAt: new Date(),
      reviewNotes: dto.reviewNotes || null,
    };

    const updated = await this.logEntryRepo.update(id, updateData as any);
    return this.mapToResponseDTO(updated);
  }

  async getDashboardStats(internId: string): Promise<LogDashboardStatsDTO> {
    const stats = await this.logEntryRepo.getStats(internId);
    const recentEntries = await this.logEntryRepo.getRecentEntries(internId, 5);

    return {
      ...stats,
      recentEntries: recentEntries.map((e) => this.mapToResponseDTO(e)),
    };
  }

  private mapToResponseDTO(entry: any): LogEntryResponseDTO {
    const internName = entry.intern
      ? `${entry.intern.firstName} ${entry.intern.lastName}`.trim()
      : '';
    const reviewerName = entry.reviewer
      ? `${entry.reviewer.firstName} ${entry.reviewer.lastName}`.trim()
      : null;

    return {
      id: entry.id,
      internId: entry.internId,
      internName,
      internEmail: entry.intern?.email || '',
      entryType: entry.entryType,
      status: entry.status,
      logDate: entry.logDate.toISOString(),
      activity: entry.activity,
      skills: entry.skills || null,
      hoursWorked: entry.hoursWorked || null,
      notes: entry.notes || null,
      reviewedBy: entry.reviewedBy || null,
      reviewerName,
      reviewedAt: entry.reviewedAt?.toISOString() || null,
      reviewNotes: entry.reviewNotes || null,
      createdAt: entry.createdAt.toISOString(),
      updatedAt: entry.updatedAt.toISOString(),
    };
  }
}