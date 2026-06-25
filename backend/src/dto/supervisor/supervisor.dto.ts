import { LogEntryType, LogStatus, FeedbackType } from '@prisma/client';

// ─── Assigned Intern DTO ────────────────────────────────────────────────────

export interface AssignedInternDTO {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  matricNumber: string | null;
  institution: string | null;
  organizationName: string | null;
  startDate: string | null;
  endDate: string | null;
  placementId: string;
  placementStatus: string;
  totalLogs: number;
  submittedLogs: number;
  approvedLogs: number;
  pendingLogs: number;
  lastActivity: string | null;
}

// ─── Submitted Log DTO ──────────────────────────────────────────────────────

export interface SubmittedLogDTO {
  id: string;
  internId: string;
  internName: string;
  internEmail: string;
  matricNumber: string | null;
  entryType: LogEntryType;
  status: LogStatus;
  logDate: string;
  activity: string;
  skills: string | null;
  hoursWorked: number | null;
  notes: string | null;
  createdAt: string;
}

export interface SubmittedLogsListDTO {
  logs: SubmittedLogDTO[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ─── Review DTO ──────────────────────────────────────────────────────────────

export interface ReviewLogDTO {
  status: 'APPROVED' | 'REJECTED';
  reviewNotes?: string;
}

// ─── Feedback DTOs ───────────────────────────────────────────────────────────

export interface CreateFeedbackDTO {
  internId: string;
  logEntryId?: string;
  type: FeedbackType;
  rating?: number;
  content: string;
  strengths?: string;
  improvements?: string;
  isPrivate?: boolean;
}

export interface UpdateFeedbackDTO {
  type?: FeedbackType;
  rating?: number;
  content?: string;
  strengths?: string;
  improvements?: string;
  isPrivate?: boolean;
}

export interface FeedbackResponseDTO {
  id: string;
  supervisorId: string;
  supervisorName: string;
  internId: string;
  internName: string;
  logEntryId: string | null;
  type: FeedbackType;
  rating: number | null;
  content: string;
  strengths: string | null;
  improvements: string | null;
  isPrivate: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface FeedbackListDTO {
  feedbacks: FeedbackResponseDTO[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ─── Progress DTO ────────────────────────────────────────────────────────────

export interface InternProgressDTO {
  intern: {
    id: string;
    userId: string;
    firstName: string;
    lastName: string;
    email: string;
    matricNumber: string | null;
    institution: string | null;
    organizationName: string | null;
  };
  stats: {
    totalLogs: number;
    submittedLogs: number;
    approvedLogs: number;
    rejectedLogs: number;
    totalHours: number;
    weeklyHours: number;
    monthlyHours: number;
    approvalRate: number;
    streak: number;
  };
  recentLogs: SubmittedLogDTO[];
  recentFeedback: FeedbackResponseDTO[];
}

// ─── Supervisor Stats DTO ────────────────────────────────────────────────────

export interface SupervisorDashboardStatsDTO {
  totalInterns: number;
  pendingReviews: number;
  approvedLogs: number;
  rejectedLogs: number;
  feedbackGiven: number;
  recentSubmissions: SubmittedLogDTO[];
  internProgressSummaries: Array<{
    internId: string;
    internName: string;
    totalLogs: number;
    pendingLogs: number;
    approvalRate: number;
  }>;
}

// ─── Supervisor Report Summary DTO ────────────────────────────────────────────

export interface SupervisorReportSummaryDTO {
  totalInterns: number;
  averagePerformance: number | null;
  averageAttendance: number;
  tasksCompleted: number;
  tasksPending: number;
}