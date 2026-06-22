import { LogEntry, Prisma } from '@prisma/client';

export interface ILogEntryRepository {
  findById(id: string): Promise<LogEntry | null>;
  findByInternId(internId: string, params: {
    skip?: number;
    take?: number;
    status?: string;
    entryType?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<{ entries: LogEntry[]; total: number }>;
  findAll(params: {
    skip?: number;
    take?: number;
    status?: string;
    entryType?: string;
    startDate?: string;
    endDate?: string;
    internId?: string;
  }): Promise<{ entries: LogEntry[]; total: number }>;
  create(data: Prisma.LogEntryCreateInput): Promise<LogEntry>;
  update(id: string, data: Prisma.LogEntryUpdateInput): Promise<LogEntry>;
  delete(id: string): Promise<void>;
  getStats(internId: string): Promise<{
    totalLogs: number;
    draftLogs: number;
    submittedLogs: number;
    approvedLogs: number;
    rejectedLogs: number;
    dailyLogs: number;
    weeklyLogs: number;
    thisWeekHours: number;
    thisMonthHours: number;
  }>;
  getRecentEntries(internId: string, limit?: number): Promise<LogEntry[]>;
}