import React, { useState } from "react";
import { ArrowLeft, Star, Award, Clock, User, Building2 } from "lucide-react";

interface EvaluationDetail {
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

// ─── Seed / Mock Data ───────────────────────────────────────────────────────

const MOCK_DETAILS: Record<string, EvaluationDetail> = {
  "eval-001": {
    id: "eval-001",
    supervisorName: "Mr. Bello",
    placementRole: "Frontend Developer",
    placementOrganization: "TechCorp Solutions",
    status: "COMPLETED",
    attendance: 9,
    technicalSkills: 8,
    communication: 7,
    teamwork: 9,
    initiative: 8,
    problemSolving: 8,
    professionalConduct: 9,
    overallScore: 85,
    strengths: "Excellent problem-solving abilities. Shows great initiative in tackling complex tasks and consistently meets deadlines. Strong team player who contributes positively to group discussions.",
    improvements: "Could improve technical documentation skills. Consider writing more detailed comments in code and maintaining a personal knowledge base. Communication with stakeholders could be more proactive.",
    comments: "Overall a strong performer. Has shown consistent growth throughout the internship period. I recommend focusing on deepening technical expertise in React and exploring backend technologies.",
    reviewedAt: "2026-06-16T14:30:00Z",
    createdAt: "2026-06-15T10:30:00Z",
    updatedAt: "2026-06-16T14:30:00Z",
  },
  "eval-002": {
    id: "eval-002",
    supervisorName: "Mrs. Amina",
    placementRole: "Product Designer",
    placementOrganization: "DesignLab Studios",
    status: "COMPLETED",
    attendance: 7,
    technicalSkills: 7,
    communication: 8,
    teamwork: 8,
    initiative: 6,
    problemSolving: 7,
    professionalConduct: 7,
    overallScore: 72,
    strengths: "Good design sense with attention to user experience details. Communicates design decisions clearly and collaborates well with the development team.",
    improvements: "Needs to take more initiative in proposing design improvements rather than waiting for instructions. Time management could be improved to meet sprint deadlines more consistently.",
    comments: "Showing promise as a designer. Would benefit from more exposure to user research methodologies and design systems.",
    reviewedAt: null,
    createdAt: "2026-06-14T14:15:00Z",
    updatedAt: "2026-06-14T14:15:00Z",
  },
  "eval-003": {
    id: "eval-003",
    supervisorName: "Ms. Sarah",
    placementRole: "Data Analyst",
    placementOrganization: "DataPulse Analytics",
    status: "REVIEWED",
    attendance: 10,
    technicalSkills: 9,
    communication: 9,
    teamwork: 9,
    initiative: 10,
    problemSolving: 9,
    professionalConduct: 9,
    overallScore: 91,
    strengths: "Outstanding analytical skills with exceptional attention to data accuracy. Proactively identifies trends and presents insights clearly. Highly reliable and consistently exceeds expectations.",
    improvements: "Continue developing advanced statistical modeling skills. Consider contributing more to team knowledge sharing sessions, as your expertise is highly valuable to others.",
    comments: "One of the top interns I've supervised. Demonstrates a professional attitude and a genuine passion for data. Highly recommended for a full-time role upon graduation.",
    reviewedAt: "2026-06-14T11:00:00Z",
    createdAt: "2026-06-13T09:00:00Z",
    updatedAt: "2026-06-14T11:00:00Z",
  },
  "eval-004": {
    id: "eval-004",
    supervisorName: "Mr. David",
    placementRole: "Backend Developer",
    placementOrganization: "CloudBase Systems",
    status: "COMPLETED",
    attendance: 6,
    technicalSkills: 7,
    communication: 6,
    teamwork: 7,
    initiative: 5,
    problemSolving: 7,
    professionalConduct: 6,
    overallScore: 68,
    strengths: "Solid understanding of database design and API development. Shows willingness to learn new technologies when guided.",
    improvements: "Needs significant improvement in punctuality and attendance. Should communicate more openly about challenges faced during development. Needs to take more ownership of assigned tasks.",
    comments: "Has the technical foundation but needs to develop professional work habits. I recommend setting clear daily goals and improving time management skills.",
    reviewedAt: null,
    createdAt: "2026-06-10T11:45:00Z",
    updatedAt: "2026-06-10T11:45:00Z",
  },
  "eval-005": {
    id: "eval-005",
    supervisorName: "Mrs. Grace",
    placementRole: "Marketing Intern",
    placementOrganization: "BrandWave Media",
    status: "COMPLETED",
    attendance: 8,
    technicalSkills: 7,
    communication: 9,
    teamwork: 8,
    initiative: 7,
    problemSolving: 7,
    professionalConduct: 8,
    overallScore: 78,
    strengths: "Excellent written and verbal communication skills. Creates engaging content and understands brand voice well. Adaptable and quick to learn new marketing tools.",
    improvements: "Could develop stronger data analysis skills to better measure campaign performance. Recommend taking courses on marketing analytics and SEO strategy.",
    comments: "A creative thinker with good potential in digital marketing. Would benefit from more hands-on experience with campaign management and A/B testing.",
    reviewedAt: null,
    createdAt: "2026-06-08T08:30:00Z",
    updatedAt: "2026-06-08T08:30:00Z",
  },
  "eval-006": {
    id: "eval-006",
    supervisorName: "Dr. Emmanuel",
    placementRole: "Machine Learning Intern",
    placementOrganization: "AI Research Labs",
    status: "REVIEWED",
    attendance: 10,
    technicalSkills: 10,
    communication: 9,
    teamwork: 9,
    initiative: 10,
    problemSolving: 10,
    professionalConduct: 10,
    overallScore: 95,
    strengths: "Exceptional technical aptitude with deep understanding of machine learning algorithms. Independently developed a model that improved prediction accuracy by 15%. Excellent research and documentation skills.",
    improvements: "Continue building expertise in MLOps and model deployment. Consider mentoring junior interns as a way to solidify understanding and develop leadership skills.",
    comments: "Truly outstanding performance. The quality of work produced is comparable to that of a junior engineer. Strongly recommend for a full-time offer and potential fast-track career progression.",
    reviewedAt: "2026-06-07T16:30:00Z",
    createdAt: "2026-06-05T16:00:00Z",
    updatedAt: "2026-06-07T16:30:00Z",
  },
};

// If the evaluationId is not in mock data, use a default
const getDefaultDetail = (id: string): EvaluationDetail => ({
  id,
  supervisorName: "Unknown",
  placementRole: null,
  placementOrganization: "N/A",
  status: "COMPLETED",
  attendance: null,
  technicalSkills: null,
  communication: null,
  teamwork: null,
  initiative: null,
  problemSolving: null,
  professionalConduct: null,
  overallScore: null,
  strengths: null,
  improvements: null,
  comments: null,
  reviewedAt: null,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

export const EvaluationDetailPage: React.FC<{
  evaluationId: string;
  onNavigate?: (view: string, params?: any) => void;
}> = ({ evaluationId, onNavigate }) => {
  const [evaluation] = useState<EvaluationDetail>(
    MOCK_DETAILS[evaluationId] || getDefaultDetail(evaluationId)
  );

  const getScoreColor = (score: number | null) => {
    if (!score) return "bg-gray-100 text-gray-500";
    if (score >= 90) return "bg-emerald-100 text-emerald-700";
    if (score >= 80) return "bg-blue-100 text-blue-700";
    if (score >= 70) return "bg-amber-100 text-amber-700";
    return "bg-red-100 text-red-700";
  };

  const getGrade = (score: number | null) => {
    if (!score) return "N/A";
    if (score >= 90) return "A";
    if (score >= 80) return "B";
    if (score >= 70) return "C";
    if (score >= 60) return "D";
    return "F";
  };

  const getBarColor = (score: number | null) => {
    if (!score) return "bg-gray-200";
    if (score >= 9) return "bg-emerald-500";
    if (score >= 7) return "bg-blue-500";
    if (score >= 5) return "bg-amber-500";
    return "bg-red-500";
  };

  const criteriaLabels: Record<string, string> = {
    attendance: "Attendance",
    technicalSkills: "Technical Skills",
    communication: "Communication",
    teamwork: "Teamwork",
    initiative: "Initiative",
    problemSolving: "Problem Solving",
    professionalConduct: "Professional Conduct",
  };

  const criteriaEntries = Object.entries(criteriaLabels).map(([key, label]) => ({
    key,
    label,
    score: (evaluation as any)[key] as number | null,
  }));

  return (
    <div className="space-y-4">
      {/* Back Button */}
      <button
        onClick={() => onNavigate?.("evaluations", {})}
        className="flex items-center gap-1.5 text-[12px] text-gray-500 hover:text-gray-800 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Evaluations
      </button>

      {/* Header Card */}
      <div className="bg-white rounded-xl border border-black/[0.07] shadow-sm p-5">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h2 className="text-[15px] font-bold text-gray-800">Performance Evaluation</h2>
            <div className="flex items-center gap-3 text-[11px] text-gray-500">
              <span className="flex items-center gap-1">
                <User className="w-3.5 h-3.5" />
                {evaluation.supervisorName}
              </span>
              <span className="flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5" />
                {evaluation.placementOrganization}
              </span>
              {evaluation.placementRole && (
                <span className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5" />
                  {evaluation.placementRole}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {new Date(evaluation.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
          </div>
          <div className="text-right">
            <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold ${getScoreColor(evaluation.overallScore)}`}>
              <span>{evaluation.overallScore !== null ? `${Math.round(evaluation.overallScore)}%` : "N/A"}</span>
            </div>
            <p className="text-[10px] text-gray-400 mt-1">Grade: {getGrade(evaluation.overallScore)}</p>
          </div>
        </div>
      </div>

      {/* Performance Breakdown */}
      <div className="bg-white rounded-xl border border-black/[0.07] shadow-sm p-5">
        <h3 className="text-[13px] font-bold text-gray-800 mb-4">Performance Breakdown</h3>
        <div className="space-y-3">
          {criteriaEntries.map(({ key, label, score }) => (
            <div key={key}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[12px] font-medium text-gray-700">{label}</span>
                <span className="text-[11px] font-bold text-gray-800">{score ?? "—"}/10</span>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${getBarColor(score)}`}
                  style={{ width: score ? `${(score / 10) * 100}%` : "0%" }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Overall Score Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-black/[0.07] shadow-sm p-4">
          <span className="text-[11px] text-gray-500 font-medium">Overall Score</span>
          <div className="mt-1 flex items-end gap-2">
            <span className="text-[26px] font-semibold leading-none">
              {evaluation.overallScore !== null ? `${Math.round(evaluation.overallScore)}%` : "N/A"}
            </span>
            <span className={`text-[11px] font-bold mb-1 ${getScoreColor(evaluation.overallScore)} px-2 py-0.5 rounded-full`}>
              {getGrade(evaluation.overallScore)}
            </span>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-black/[0.07] shadow-sm p-4">
          <span className="text-[11px] text-gray-500 font-medium">Status</span>
          <div className="mt-1">
            <span className={`text-[11px] font-semibold px-2 py-1 rounded-full ${
              evaluation.status === "REVIEWED"
                ? "bg-blue-100 text-blue-700"
                : "bg-emerald-100 text-emerald-700"
            }`}>
              {evaluation.status === "REVIEWED" ? "Reviewed" : "Completed"}
            </span>
          </div>
          {evaluation.reviewedAt && (
            <p className="text-[10px] text-gray-400 mt-1">
              Reviewed on {new Date(evaluation.reviewedAt).toLocaleDateString()}
            </p>
          )}
        </div>
        <div className="bg-white rounded-xl border border-black/[0.07] shadow-sm p-4">
          <span className="text-[11px] text-gray-500 font-medium">Date Completed</span>
          <div className="mt-1 flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-gray-400" />
            <span className="text-[13px] font-semibold">
              {new Date(evaluation.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </span>
          </div>
        </div>
      </div>

      {/* Supervisor Feedback */}
      {(evaluation.strengths || evaluation.improvements || evaluation.comments) && (
        <div className="bg-white rounded-xl border border-black/[0.07] shadow-sm p-5">
          <h3 className="text-[13px] font-bold text-gray-800 mb-4">Supervisor Feedback</h3>
          <div className="space-y-4">
            {evaluation.strengths && (
              <div>
                <p className="text-[11px] font-semibold text-gray-500 uppercase mb-1">Strengths</p>
                <p className="text-[12.5px] text-gray-700 leading-relaxed">{evaluation.strengths}</p>
              </div>
            )}
            {evaluation.improvements && (
              <div>
                <p className="text-[11px] font-semibold text-gray-500 uppercase mb-1">Areas for Improvement</p>
                <p className="text-[12.5px] text-gray-700 leading-relaxed">{evaluation.improvements}</p>
              </div>
            )}
            {evaluation.comments && (
              <div>
                <p className="text-[11px] font-semibold text-gray-500 uppercase mb-1">Additional Comments</p>
                <p className="text-[12.5px] text-gray-700 leading-relaxed italic">"{evaluation.comments}"</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};