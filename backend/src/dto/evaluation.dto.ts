export interface CreateEvaluationDTO {
  placementId: string;
  internId: string;
  attendance?: number;
  technicalSkills?: number;
  communication?: number;
  teamwork?: number;
  initiative?: number;
  problemSolving?: number;
  professionalConduct?: number;
  strengths?: string;
  improvements?: string;
  comments?: string;
  status?: string;
}

export interface UpdateEvaluationDTO {
  attendance?: number;
  technicalSkills?: number;
  communication?: number;
  teamwork?: number;
  initiative?: number;
  problemSolving?: number;
  professionalConduct?: number;
  strengths?: string;
  improvements?: string;
  comments?: string;
  status?: string;
}

export interface EvaluationResponseDTO {
  id: string;
  internId: string;
  internName: string;
  internEmail: string;
  supervisorId: string;
  supervisorName: string;
  placementId: string;
  status: string;
  attendance: number | null;
  technicalSkills: number | null;
  communication: number | null;
  teamwork: number | null;
  initiative: number | null;
  problemSolving: number | null;
  professionalConduct: number | null;
  overallScore: number | null;
  strengths: string | null;
  improvements: string | null;
  comments: string | null;
  reviewedBy: string | null;
  reviewerName: string | null;
  reviewedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface EvaluationSummaryDTO {
  totalEvaluations: number;
  completedEvaluations: number;
  pendingEvaluations: number;
  averageScore: number | null;
}
