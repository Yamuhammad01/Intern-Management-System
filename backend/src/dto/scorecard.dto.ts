export interface InternScorecardDTO {
  id: string;
  name: string;
  matricNumber: string | null;
  program: string | null;
  attendance: number | null;
  score: number | null;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface ScorecardResponseDTO {
  success: boolean;
  statusCode: number;
  message: string;
  data: InternScorecardDTO[];
}