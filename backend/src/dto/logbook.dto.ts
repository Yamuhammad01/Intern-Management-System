import { LogEntryType, LogStatus } from '@prisma/client';

// ─── Request DTOs ─────────────────────────────────────────────────────────────

export interface CreateLogEntryRequestDTO {
  entryType: LogEntryType;
  logDate: string; // ISO date string
  activity: string;
  skills?: string;
  hoursWorked?: number;
  notes?: string;
}

export interface UpdateLogEntryRequestDTO {
  entryType?: LogEntryType;
  logDate?: string;
  activity?: string;
  skills?: string;
  hoursWorked?: number;
  notes?: string;
}

export interface ReviewLogEntryRequestDTO {
  status: 'APPROVED' | 'REJECTED';
  reviewNotes?: string;
}

export interface LogEntryQueryParams {
  page?: number;
  limit?: number;
  status?: LogStatus;
  entryType?: LogEntryType;
  startDate?: string;
  endDate?: string;
  internId?: string;
}

// ─── Response DTOs ────────────────────────────────────────────────────────────

export interface LogEntryResponseDTO {
  id: string;
  internId: string;
  internName: string;
  internEmail: string;
  entryType: LogEntryType;
  status: LogStatus;
  logDate: string;
  activity: string;
  skills: string | null;
  hoursWorked: number | null;
  notes: string | null;
  reviewedBy: string | null;
  reviewerName: string | null;
  reviewedAt: string | null;
  reviewNotes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface LogEntryListDTO {
  entries: LogEntryResponseDTO[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface LogDashboardStatsDTO {
  totalLogs: number;
  draftLogs: number;
  submittedLogs: number;
  approvedLogs: number;
  rejectedLogs: number;
  dailyLogs: number;
  weeklyLogs: number;
  recentEntries: LogEntryResponseDTO[];
  thisWeekHours: number;
  thisMonthHours: number;
}