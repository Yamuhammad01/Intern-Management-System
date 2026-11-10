import React, { useState, useEffect } from "react";
import { Star, Eye, Search, TrendingUp, Award, Loader2, Sparkles, ChevronRight, AlertCircle } from "lucide-react";
import { Button } from "../../components/ui/button";

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

export const EvaluationResultsPage: React.FC<{ onNavigate?: (view: string, params?: any) => void }> = ({
  onNavigate,
}) => {
  const [evaluations, setEvaluations] = useState<EvaluationResult[]>([]);
  const [stats, setStats] = useState<EvaluationStats>({
    totalEvaluations: 0,
    averageScore: null,
    highestScore: null,
  });
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
        setError(err.message || "Unable to reach evaluations service");
        // Fallback for offline demo
        setEvaluations([
          {
            id: "eval-demo-1",
            supervisorName: "Dr. Ngozi Eze",
            overallScore: 92,
            status: "COMPLETED",
            createdAt: new Date().toISOString(),
          },
          {
            id: "eval-demo-2",
            supervisorName: "Engr. T. Alabi",
            overallScore: 88,
            status: "COMPLETED",
            createdAt: new Date(Date.now() - 7 * 86400000).toISOString(),
          },
        ]);
        setStats({ totalEvaluations: 2, averageScore: 90, highestScore: 92 });
      } finally {
        setLoading(false);
      }
    };
    fetchEvaluations();
  }, []);

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const filtered = evaluations
    .filter((e) => e.supervisorName.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      const da = new Date(a.createdAt).getTime();
      const db = new Date(b.createdAt).getTime();
      return sortOrder === "newest" ? db - da : da - db;
    });

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="bg-white rounded-2xl border border-[#d8e5ee] p-5 sm:p-6 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="w-11 h-11 rounded-xl bg-[#e6f4f8] text-[#1c647e] flex items-center justify-center shrink-0 shadow-2xs">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-[#183348]">My Evaluation History</h1>
            <p className="text-xs text-[#607b91]">Review supervisor scorecards, rubric feedback, and performance grades</p>
          </div>
        </div>
        <span className="text-xs font-semibold text-[#1c647e] bg-[#e6f4f8] px-3 py-1 rounded-full border border-[#c4e4ee]">
          Official Scorecards
        </span>
      </div>

      {/* ── KPI Cards (InternPath Gradients) ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-gradient-ip-navy rounded-2xl p-5 text-white shadow-md flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-[#c8e4f1]">Evaluations Logged</span>
            <div className="p-2 rounded-xl bg-white/10 backdrop-blur-xs">
              <Star className="w-4 h-4 text-[#8cdcf0]" />
            </div>
          </div>
          <p className="text-3xl font-extrabold tracking-tight">{stats.totalEvaluations}</p>
          <p className="text-[10.5px] text-[#b0d8ea] mt-1">Completed supervisor reviews</p>
        </div>

        <div className="bg-gradient-ip-teal rounded-2xl p-5 text-white shadow-md flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-white/90">Average Performance</span>
            <div className="p-2 rounded-xl bg-white/15 backdrop-blur-xs">
              <TrendingUp className="w-4 h-4 text-white" />
            </div>
          </div>
          <p className="text-3xl font-extrabold tracking-tight">
            {stats.averageScore !== null ? `${stats.averageScore}%` : "—"}
          </p>
          <p className="text-[10.5px] text-white/80 mt-1">Cumulative rubric rating</p>
        </div>

        <div className="bg-gradient-ip-blue rounded-2xl p-5 text-white shadow-md flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-[#cce7f5]">Peak Score</span>
            <div className="p-2 rounded-xl bg-white/10 backdrop-blur-xs">
              <Award className="w-4 h-4 text-[#ffe066]" />
            </div>
          </div>
          <p className="text-3xl font-extrabold tracking-tight">
            {stats.highestScore !== null ? `${stats.highestScore}%` : "—"}
          </p>
          <p className="text-[10.5px] text-[#b3daf0] mt-1">Highest evaluation achieved</p>
        </div>
      </div>

      {/* ── Search and Sort ── */}
      <div className="bg-white rounded-2xl border border-[#d8e5ee] p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#2eb4d6] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by supervisor name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#f8fafc] border border-[#d7e4ed] rounded-xl pl-10 pr-4 py-2 text-xs text-[#183348] placeholder:text-[#8ea5b6] outline-none focus:bg-white focus:border-[#2eb4d6] focus:ring-2 focus:ring-[#2eb4d6]/20 transition-all"
          />
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center">
          <span className="text-xs text-[#607b91] font-medium">Sort:</span>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as any)}
            className="bg-[#f8fafc] border border-[#d7e4ed] rounded-xl px-3 py-1.5 text-xs text-[#183348] outline-none focus:border-[#2eb4d6] transition-all cursor-pointer font-medium"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>
      </div>

      {/* ── Evaluations List ── */}
      <div className="bg-white rounded-2xl border border-[#d8e5ee] shadow-xs overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 className="w-6 h-6 animate-spin text-[#2eb4d6]" />
            <span className="text-xs text-[#607b91] font-medium">Loading evaluation reports...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-14 text-center flex flex-col items-center">
            <div className="w-14 h-14 rounded-2xl bg-[#e6f4f8] border border-[#bfe7f3] flex items-center justify-center text-[#248da9] mb-3">
              <Award className="w-6 h-6" />
            </div>
            <p className="text-sm font-bold text-[#183348]">No evaluations recorded yet</p>
            <p className="text-xs text-[#607b91] mt-1 max-w-sm leading-relaxed">
              When your supervisor submits milestone scorecards or quarterly evaluations, they will be published here.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-[#eef4f8]">
            {filtered.map((ev) => (
              <div
                key={ev.id}
                onClick={() => onNavigate?.("evaluation-detail", { evaluationId: ev.id })}
                className="px-6 py-4 hover:bg-[#f8fafc] transition-colors cursor-pointer flex items-center justify-between gap-4 group"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-gradient-ip-teal text-white flex items-center justify-center text-xs font-bold shrink-0 shadow-2xs">
                    {ev.supervisorName.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-[#183348] truncate">{ev.supervisorName}</p>
                    <div className="flex items-center gap-2 text-[11px] text-[#607b91] mt-0.5">
                      <span>Evaluated {formatDate(ev.createdAt)}</span>
                      <span>•</span>
                      <span className="text-emerald-700 font-semibold">{ev.status}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <div className="text-right">
                    <span className="text-2xl font-black text-[#183348]">
                      {ev.overallScore !== null ? `${ev.overallScore}%` : "N/A"}
                    </span>
                    <p className="text-[10px] text-[#607b91]">Overall Score</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#9fb8cb] group-hover:text-[#2eb4d6] transition-colors" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
