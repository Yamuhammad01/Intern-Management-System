// ─── Intern Evaluation Response DTO ────────────────────────────────────────

export interface InternEvaluationListDTO {
  id: string;
  supervisorName: string;
  overallScore: number | null;
  status: string;
  createdAt: string;
}

export interface InternEvaluationDetailDTO {
  id: string;
  supervisorName: string;
  placementRole: string | null;
  placementOrganization: string;
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
  reviewedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface InternEvaluationStatsDTO {
  totalEvaluations: number;
  averageScore: number | null;
  highestScore: number | null;
}