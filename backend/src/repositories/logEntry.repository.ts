import { PrismaClient, Prisma, LogEntry } from '@prisma/client';
import { ILogEntryRepository } from './interfaces/ILogEntryRepository';
import prisma from '../config/database';

export class LogEntryRepository implements ILogEntryRepository {
  private readonly prisma: PrismaClient;

  constructor() {
    this.prisma = prisma;
  }

  async findById(id: string): Promise<LogEntry | null> {
    return this.prisma.logEntry.findUnique({
      where: { id },
      include: {
        intern: { select: { id: true, firstName: true, lastName: true, email: true } },
        reviewer: { select: { id: true, firstName: true, lastName: true } },
      },
    });
  }

  async findByInternId(
    internId: string,
    params: {
      skip?: number;
      take?: number;
      status?: string;
      entryType?: string;
      startDate?: string;
      endDate?: string;
    },
  ): Promise<{ entries: LogEntry[]; total: number }> {
    const { skip = 0, take = 10, status, entryType, startDate, endDate } = params;

    const where: Prisma.LogEntryWhereInput = { internId };

    if (status) where.status = status as any;
    if (entryType) where.entryType = entryType as any;
    if (startDate || endDate) {
      where.logDate = {};
      if (startDate) where.logDate.gte = new Date(startDate);
      if (endDate) where.logDate.lte = new Date(endDate);
    }

    const [entries, total] = await Promise.all([
      this.prisma.logEntry.findMany({
        where,
        skip,
        take,
        orderBy: { logDate: 'desc' },
        include: {
          intern: { select: { id: true, firstName: true, lastName: true, email: true } },
          reviewer: { select: { id: true, firstName: true, lastName: true } },
        },
      }),
      this.prisma.logEntry.count({ where }),
    ]);

    return { entries, total };
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    status?: string;
    entryType?: string;
    startDate?: string;
    endDate?: string;
    internId?: string;
  }): Promise<{ entries: LogEntry[]; total: number }> {
    const { skip = 0, take = 10, status, entryType, startDate, endDate, internId } = params;

    const where: Prisma.LogEntryWhereInput = {};

    if (internId) where.internId = internId;
    if (status) where.status = status as any;
    if (entryType) where.entryType = entryType as any;
    if (startDate || endDate) {
      where.logDate = {};
      if (startDate) where.logDate.gte = new Date(startDate);
      if (endDate) where.logDate.lte = new Date(endDate);
    }

    const [entries, total] = await Promise.all([
      this.prisma.logEntry.findMany({
        where,
        skip,
        take,
        orderBy: { logDate: 'desc' },
        include: {
          intern: { select: { id: true, firstName: true, lastName: true, email: true } },
          reviewer: { select: { id: true, firstName: true, lastName: true } },
        },
      }),
      this.prisma.logEntry.count({ where }),
    ]);

    return { entries, total };
  }

  async create(data: Prisma.LogEntryCreateInput): Promise<LogEntry> {
    return this.prisma.logEntry.create({
      data,
      include: {
        intern: { select: { id: true, firstName: true, lastName: true, email: true } },
        reviewer: { select: { id: true, firstName: true, lastName: true } },
      },
    });
  }

  async update(id: string, data: Prisma.LogEntryUpdateInput): Promise<LogEntry> {
    return this.prisma.logEntry.update({
      where: { id },
      data,
      include: {
        intern: { select: { id: true, firstName: true, lastName: true, email: true } },
        reviewer: { select: { id: true, firstName: true, lastName: true } },
      },
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.logEntry.delete({ where: { id } });
  }

  async getStats(internId: string): Promise<{
    totalLogs: number;
    draftLogs: number;
    submittedLogs: number;
    approvedLogs: number;
    rejectedLogs: number;
    dailyLogs: number;
    weeklyLogs: number;
    thisWeekHours: number;
    thisMonthHours: number;
  }> {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [
      totalLogs,
      draftLogs,
      submittedLogs,
      approvedLogs,
      rejectedLogs,
      dailyLogs,
      weeklyLogs,
      weekAgg,
      monthAgg,
    ] = await Promise.all([
      this.prisma.logEntry.count({ where: { internId } }),
      this.prisma.logEntry.count({ where: { internId, status: 'DRAFT' } }),
      this.prisma.logEntry.count({ where: { internId, status: 'SUBMITTED' } }),
      this.prisma.logEntry.count({ where: { internId, status: 'APPROVED' } }),
      this.prisma.logEntry.count({ where: { internId, status: 'REJECTED' } }),
      this.prisma.logEntry.count({ where: { internId, entryType: 'DAILY' } }),
      this.prisma.logEntry.count({ where: { internId, entryType: 'WEEKLY' } }),
      this.prisma.logEntry.aggregate({
        where: { internId, logDate: { gte: startOfWeek } },
        _sum: { hoursWorked: true },
      }),
      this.prisma.logEntry.aggregate({
        where: { internId, logDate: { gte: startOfMonth } },
        _sum: { hoursWorked: true },
      }),
    ]);

    return {
      totalLogs,
      draftLogs,
      submittedLogs,
      approvedLogs,
      rejectedLogs,
      dailyLogs,
      weeklyLogs,
      thisWeekHours: weekAgg._sum.hoursWorked || 0,
      thisMonthHours: monthAgg._sum.hoursWorked || 0,
    };
  }

  async getRecentEntries(internId: string, limit = 5): Promise<LogEntry[]> {
    return this.prisma.logEntry.findMany({
      where: { internId },
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: {
        intern: { select: { id: true, firstName: true, lastName: true, email: true } },
        reviewer: { select: { id: true, firstName: true, lastName: true } },
      },
    });
  }
}