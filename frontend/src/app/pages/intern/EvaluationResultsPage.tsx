import React, { useState, useEffect } from "react";
import { Star, Eye, Search, TrendingUp, Award, Loader2 } from "lucide-react";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

interface EvaluationResult {
  id: string;
  supervisorName: string;
  overallScore: number | null;
  status: string;
  createdAt: string;
}

interface EvaluationStats {
  totalEvaluations: number;
  averageScore: number | null;
  highestScore: number | null;
}

export const EvaluationResultsPage: React.FC<{ onNavigate?: (view: string, params?: any) => void }> = ({ onNavigate }) => {
  const [evaluations, setEvaluations] = useState<EvaluationResult[]>([]);
  const [stats, setStats] = useState<EvaluationStats>({ totalEvaluations: 0, averageScore: null, highestScore: null });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");

  useEffect(() => {
    const fetchEvaluations = async () => {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("accessToken");
        const res = await fetch(`${API_BASE}/intern/evaluations`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.message || "Failed to fetch evaluations");
        }
        const json = await res.json();
        const data = json.data || json;
        setEvaluations(data.evaluations || []);
        setStats(data.stats || { totalEvaluations: 0, averageScore: null, highestScore: null });
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };
    fetchEvaluations();
  }, []);

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

  const sortedEvaluations = [...evaluations]
    .filter((e) => e.supervisorName.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="w-6 h-6 animate-spin text-emerald-500" />
          <p className="text-[12px] text-gray-500">Loading evaluations...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl border border-black/[0.07] p-8 shadow-sm text-center">
        <div className="w-12 h-12 bg-red-50 border border-red-100 rounded-full flex items-center justify-center text-red-500 mx-auto mb-3">
          <Award className="w-5 h-5" />
        </div>
        <p className="text-[13px] font-semibold text-red-600">Failed to Load</p>
        <p className="text-[11px] text-gray-500 mt-1">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-black/[0.07] shadow-sm p-4">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-gray-500 font-medium">Total Evaluations</span>
            <Star className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="flex items-end justify-between mt-1">
            <span className="text-[26px] font-semibold leading-none">{stats.totalEvaluations}</span>
          </div>
          <p className="text-[10px] text-gray-400 mt-1">Completed performance reviews</p>
        </div>

        <div className="bg-white rounded-xl border border-black/[0.07] shadow-sm p-4">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-gray-500 font-medium">Average Score</span>
            <TrendingUp className="w-4 h-4 text-blue-600" />
          </div>
          <div className="flex items-end justify-between mt-1">
            <span className="text-[26px] font-semibold leading-none">
              {stats.averageScore !== null ? `${Math.round(stats.averageScore)}%` : "N/A"}
            </span>
          </div>
          <p className="text-[10px] text-gray-400 mt-1">Across all evaluations</p>
        </div>

        <div className="bg-white rounded-xl border border-black/[0.07] shadow-sm p-4">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-gray-500 font-medium">Highest Score</span>
            <Award className="w-4 h-4 text-purple-600" />
          </div>
          <div className="flex items-end justify-between mt-1">
            <span className="text-[26px] font-semibold leading-none">
              {stats.highestScore !== null ? `${Math.round(stats.highestScore)}%` : "N/A"}
            </span>
          </div>
          <p className="text-[10px] text-gray-400 mt-1">Best performance grade: {getGrade(stats.highestScore)}</p>
        </div>
      </div>

      {/* List */}
      <div className="bg-white rounded-xl border border-black/[0.07] shadow-sm p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[13px] font-bold text-gray-800">My Evaluation Results</h3>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by supervisor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-3 py-2 rounded-lg border border-gray-200 bg-gray-50/50 text-[12px] focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 w-56"
              />
            </div>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as "newest" | "oldest")}
              className="px-3 py-2 rounded-lg border border-gray-200 bg-gray-50/50 text-[12px] focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
        </div>

        {sortedEvaluations.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-12 h-12 bg-emerald-50 border border-emerald-100 rounded-full flex items-center justify-center text-emerald-500 mx-auto mb-3">
              <Star className="w-5 h-5" />
            </div>
            <p className="text-[13px] font-semibold text-gray-700">No Evaluations Yet</p>
            <p className="text-[11px] text-gray-400 mt-1 max-w-xs mx-auto">
              Your supervisor hasn't completed any evaluations for you yet. Check back after your next performance review.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left text-[10.5px] text-gray-400 font-medium pb-2 pr-3">Supervisor</th>
                  <th className="text-left text-[10.5px] text-gray-400 font-medium pb-2 pr-3">Date</th>
                  <th className="text-left text-[10.5px] text-gray-400 font-medium pb-2 pr-3">Score</th>
                  <th className="text-left text-[10.5px] text-gray-400 font-medium pb-2 pr-3">Grade</th>
                  <th className="text-left text-[10.5px] text-gray-400 font-medium pb-2 pr-3">Status</th>
                  <th className="text-left text-[10.5px] text-gray-400 font-medium pb-2 pr-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedEvaluations.map((evaluation) => (
                  <tr key={evaluation.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/60 transition-colors">
                    <td className="py-3 pr-3">
                      <p className="text-[12px] font-semibold leading-none">{evaluation.supervisorName}</p>
                    </td>
                    <td className="py-3 pr-3 text-[11.5px] text-gray-600">
                      {new Date(evaluation.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                    <td className="py-3 pr-3">
                      {evaluation.overallScore !== null ? (
                        <span className={`text-[11px] font-bold px-2 py-1 rounded-full ${getScoreColor(evaluation.overallScore)}`}>
                          {Math.round(evaluation.overallScore)}%
                        </span>
                      ) : (
                        <span className="text-[11px] text-gray-400">Not scored</span>
                      )}
                    </td>
                    <td className="py-3 pr-3">
                      <span className="text-[12px] font-bold text-gray-700">{getGrade(evaluation.overallScore)}</span>
                    </td>
                    <td className="py-3 pr-3">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        evaluation.status === "COMPLETED"
                          ? "bg-emerald-100 text-emerald-700"
                          : evaluation.status === "REVIEWED"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-amber-100 text-amber-700"
                      }`}>
                        {evaluation.status === "REVIEWED" ? "Reviewed" : "Completed"}
                      </span>
                    </td>
                    <td className="py-3">
                      <button
                        onClick={() => onNavigate?.("evaluation-detail", { evaluationId: evaluation.id })}
                        className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};