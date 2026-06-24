import React, { useState, useEffect } from "react";
import { ArrowLeft, Star, Award, Clock, Loader2, User, Building2 } from "lucide-react";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

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

export const EvaluationDetailPage: React.FC<{
  evaluationId: string;
  onNavigate?: (view: string, params?: any) => void;
}> = ({ evaluationId, onNavigate }) => {
  const [evaluation, setEvaluation] = useState<EvaluationDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("accessToken");
        const res = await fetch(`${API_BASE}/intern/evaluations/${evaluationId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.message || "Failed to fetch evaluation details");
        }
        const json = await res.json();
        const data = json.data || json;
        setEvaluation(data);
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [evaluationId]);

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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="w-6 h-6 animate-spin text-emerald-500" />
          <p className="text-[12px] text-gray-500">Loading evaluation details...</p>
        </div>
      </div>
    );
  }

  if (error || !evaluation) {
    return (
      <div className="bg-white rounded-xl border border-black/[0.07] p-8 shadow-sm text-center">
        <div className="w-12 h-12 bg-red-50 border border-red-100 rounded-full flex items-center justify-center text-red-500 mx-auto mb-3">
          <Award className="w-5 h-5" />
        </div>
        <p className="text-[13px] font-semibold text-red-600">Failed to Load</p>
        <p className="text-[11px] text-gray-500 mt-1">{error || "Evaluation not found"}</p>
      </div>
    );
  }

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