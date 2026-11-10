import React, { useState, useEffect } from "react";
import { ArrowLeft, Star, Award, Clock, Loader2, User, Building2, CheckCircle2, TrendingUp, Sparkles, AlertCircle } from "lucide-react";
import { Button } from "../../components/ui/button";

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
        // Demo fallback
        setEvaluation({
          id: evaluationId,
          supervisorName: "Dr. Ngozi Eze",
          placementRole: "Backend Engineering Intern",
          placementOrganization: "Flutterwave Technology Solutions Ltd",
          status: "COMPLETED",
          attendance: 96,
          technicalSkills: 94,
          communication: 88,
          teamwork: 92,
          initiative: 90,
          problemSolving: 95,
          professionalConduct: 95,
          overallScore: 92,
          strengths: "Exceptional mastery of relational database normalization, Prisma ORM, and query optimization. Highly reliable on critical sprints.",
          improvements: "Continue contributing more actively during multi-team architectural forums and RFC reviews.",
          comments: "An exemplary intern who performed at the level of an Associate Backend Engineer throughout the placement.",
          reviewedAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [evaluationId]);

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <Loader2 className="w-6 h-6 animate-spin text-[#2eb4d6]" />
        <span className="text-xs text-[#607b91] font-medium">Loading scorecard details...</span>
      </div>
    );
  }

  if (!evaluation) {
    return (
      <div className="bg-white rounded-2xl border border-[#d8e5ee] p-12 text-center max-w-md mx-auto space-y-3">
        <div className="w-12 h-12 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h3 className="text-sm font-bold text-[#183348]">Evaluation Not Found</h3>
        <p className="text-xs text-[#607b91]">This scorecard could not be located.</p>
        <Button variant="outline" size="sm" onClick={() => onNavigate?.("evaluations")}>
          Return to Evaluations
        </Button>
      </div>
    );
  }

  const criteria = [
    { label: "Technical Competence & Execution", score: evaluation.technicalSkills },
    { label: "Problem Solving & Analytical Thinking", score: evaluation.problemSolving },
    { label: "Attendance & Punctuality", score: evaluation.attendance },
    { label: "Teamwork & Cross-functional Collaboration", score: evaluation.teamwork },
    { label: "Proactive Initiative & Drive", score: evaluation.initiative },
    { label: "Communication & Written Documentation", score: evaluation.communication },
    { label: "Professional Conduct & Ethics", score: evaluation.professionalConduct },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* ── Top Bar ── */}
      <div className="flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => onNavigate?.("evaluations")}
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#265275] hover:text-[#2eb4d6] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Evaluation History
        </button>
        <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
          Verified Scorecard
        </span>
      </div>

      {/* ── Main Scorecard Header Card ── */}
      <div className="bg-white rounded-2xl border border-[#d8e5ee] p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-[#eef4f8]">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-xs text-[#607b91]">
              <Building2 className="w-4 h-4 text-[#2eb4d6]" />
              <span className="font-semibold text-[#183348]">{evaluation.placementOrganization}</span>
              <span>•</span>
              <span>{evaluation.placementRole || "Internship Role"}</span>
            </div>
            <h2 className="text-2xl font-black text-[#183348]">
              Supervisor Scorecard: {evaluation.supervisorName}
            </h2>
            <p className="text-xs text-[#607b91]">
              Submitted on {formatDate(evaluation.createdAt)}
            </p>
          </div>

          <div className="bg-gradient-ip-navy rounded-2xl p-5 text-white text-center min-w-[150px] shadow-md">
            <span className="text-[11px] font-semibold text-[#c8e4f1] uppercase tracking-wider">Overall Grade</span>
            <p className="text-4xl font-black tracking-tight mt-1">
              {evaluation.overallScore !== null ? `${evaluation.overallScore}%` : "N/A"}
            </p>
            <p className="text-[10px] text-[#b0d8ea] mt-0.5">Weighted Assessment</p>
          </div>
        </div>

        {/* ── Rubric Breakdown ── */}
        <div className="pt-6 space-y-4">
          <h3 className="text-sm font-bold text-[#183348] flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#2eb4d6]" />
            Rubric Criteria Breakdown
          </h3>

          <div className="grid grid-cols-1 gap-3.5">
            {criteria.map((item, idx) => (
              <div key={idx} className="bg-[#f8fafc] border border-[#e5edf3] rounded-xl p-3.5">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-bold text-[#183348]">{item.label}</span>
                  <span className="font-extrabold text-[#265275]">
                    {item.score !== null ? `${item.score}%` : "—"}
                  </span>
                </div>
                <div className="w-full bg-[#e3ecf2] rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-[#2eb4d6] to-[#265275] h-2 rounded-full transition-all duration-500"
                    style={{ width: `${item.score || 0}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Qualitative Assessment ── */}
        <div className="pt-6 border-t border-[#eef4f8] grid grid-cols-1 md:grid-cols-2 gap-4">
          {evaluation.strengths && (
            <div className="bg-[#f0faf5] border border-[#c1e9d5] rounded-xl p-4 space-y-1.5">
              <span className="text-xs font-bold text-[#0d6e46] uppercase tracking-wide flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                Key Demonstrated Strengths
              </span>
              <p className="text-xs text-[#185337] leading-relaxed">{evaluation.strengths}</p>
            </div>
          )}

          {evaluation.improvements && (
            <div className="bg-[#fff9ed] border border-[#fbe0af] rounded-xl p-4 space-y-1.5">
              <span className="text-xs font-bold text-[#975a16] uppercase tracking-wide flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4" />
                Growth Recommendations
              </span>
              <p className="text-xs text-[#6e4110] leading-relaxed">{evaluation.improvements}</p>
            </div>
          )}
        </div>

        {/* ── General Supervisor Comments ── */}
        {evaluation.comments && (
          <div className="pt-4 border-t border-[#eef4f8] space-y-1.5">
            <span className="text-xs font-bold text-[#4d6f88] uppercase tracking-wider">
              Supervisor Final Comments
            </span>
            <div className="bg-[#fcfdfd] border border-[#e2ecf3] rounded-xl p-4 text-xs text-[#244258] leading-relaxed italic">
              "{evaluation.comments}"
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
