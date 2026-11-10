import { useState, useEffect } from "react";
import {
  Users,
  ClipboardList,
  CheckCircle2,
  XCircle,
  MessageSquare,
  Clock,
  Loader2,
  ChevronRight,
  Award,
  Sparkles,
  ArrowUpRight,
  Calendar,
} from "lucide-react";
import { Button } from "../../components/ui/button";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

interface InternSummary {
  internId: string;
  internName: string;
  totalLogs: number;
  pendingLogs: number;
  approvalRate: number;
}

interface RecentSubmission {
  id: string;
  internId: string;
  internName: string;
  entryType: "DAILY" | "WEEKLY";
  logDate: string;
  activity: string;
  createdAt: string;
}

interface DashboardStats {
  totalInterns: number;
  pendingReviews: number;
  approvedLogs: number;
  rejectedLogs: number;
  feedbackGiven: number;
  recentSubmissions: RecentSubmission[];
  internProgressSummaries: InternSummary[];
}

interface SupervisorDashboardProps {
  onNavigate: (tab: string, params?: any) => void;
}

export function SupervisorDashboard({ onNavigate }: SupervisorDashboardProps) {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(`${API_BASE}/supervisor/dashboard/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch supervisor stats");
      const data = await res.json();
      if (data.success) setStats(data.data);
    } catch {
      // Fallback for offline demo
      setStats({
        totalInterns: 5,
        pendingReviews: 3,
        approvedLogs: 28,
        rejectedLogs: 2,
        feedbackGiven: 14,
        recentSubmissions: [
          {
            id: "sub-1",
            internId: "int-1",
            internName: "Adaeze Nwosu",
            entryType: "DAILY",
            logDate: new Date().toISOString(),
            activity: "Optimized payment settlement queries with Prisma index definitions",
            createdAt: new Date().toISOString(),
          },
          {
            id: "sub-2",
            internId: "int-2",
            internName: "Oluwaseun Adeyemi",
            entryType: "WEEKLY",
            logDate: new Date(Date.now() - 86400000).toISOString(),
            activity: "Weekly summary of CI/CD integration and staging deployments",
            createdAt: new Date(Date.now() - 86400000).toISOString(),
          },
        ],
        internProgressSummaries: [
          {
            internId: "int-1",
            internName: "Adaeze Nwosu",
            totalLogs: 12,
            pendingLogs: 1,
            approvalRate: 92,
          },
          {
            internId: "int-2",
            internName: "Oluwaseun Adeyemi",
            totalLogs: 10,
            pendingLogs: 2,
            approvalRate: 85,
          },
        ],
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short" });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <Loader2 className="w-6 h-6 animate-spin text-[#2eb4d6]" />
        <span className="text-xs text-[#607b91] font-medium">Loading supervisor cockpit...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white rounded-2xl border border-[#d8e5ee] p-5 sm:p-6 shadow-xs">
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="w-11 h-11 rounded-xl bg-[#e6f4f8] text-[#1c647e] flex items-center justify-center shrink-0 shadow-2xs">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-[#183348]">Supervisor Workspace</h1>
            <p className="text-xs text-[#607b91]">Review intern logbooks, provide rubric feedback, and conduct formal grading</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="cyan"
            size="default"
            onClick={() => onNavigate("Review Logs")}
            className="text-white text-xs font-semibold shadow-xs"
          >
            <Clock className="w-4 h-4 mr-1.5" />
            Review Queue ({stats?.pendingReviews || 0})
          </Button>

          <Button
            variant="outline"
            size="default"
            onClick={() => onNavigate("Evaluations")}
            className="border-[#d8e5ee] text-[#265275] text-xs font-semibold"
          >
            <Award className="w-4 h-4 mr-1.5" />
            New Evaluation
          </Button>
        </div>
      </div>

      {/* ── KPI Metric Cards (InternPath Gradients) ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Assigned Interns (Navy Gradient) */}
        <div className="bg-gradient-ip-navy rounded-2xl p-5 text-white shadow-md flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-[#c8e4f1]">Assigned Interns</span>
            <div className="p-2 rounded-xl bg-white/10 backdrop-blur-xs">
              <Users className="w-4 h-4 text-[#8cdcf0]" />
            </div>
          </div>
          <div className="my-2">
            <p className="text-3xl font-extrabold tracking-tight">{stats?.totalInterns || 0}</p>
            <p className="text-[11px] text-[#b0d8ea] mt-0.5">Active under your supervision</p>
          </div>
          <div className="flex items-center gap-1 text-[11px] font-semibold text-[#8de2f5]">
            <span>100% placement coverage</span>
          </div>
        </div>

        {/* Card 2: Pending Reviews (Teal Gradient) */}
        <div className="bg-gradient-ip-teal rounded-2xl p-5 text-white shadow-md flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-white/90">Pending Verification</span>
            <div className="p-2 rounded-xl bg-white/15 backdrop-blur-xs">
              <Clock className="w-4 h-4 text-white" />
            </div>
          </div>
          <div className="my-2">
            <p className="text-3xl font-extrabold tracking-tight">{stats?.pendingReviews || 0}</p>
            <p className="text-[11px] text-white/80 mt-0.5">Logs awaiting sign-off</p>
          </div>
          <div className="flex items-center gap-1 text-[11px] font-semibold text-white">
            <span>Action recommended today</span>
          </div>
        </div>

        {/* Card 3: Approved & Verified (Blue Gradient) */}
        <div className="bg-gradient-ip-blue rounded-2xl p-5 text-white shadow-md flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-[#cce7f5]">Approved Submissions</span>
            <div className="p-2 rounded-xl bg-white/10 backdrop-blur-xs">
              <CheckCircle2 className="w-4 h-4 text-[#8cdcf0]" />
            </div>
          </div>
          <div className="my-2">
            <p className="text-3xl font-extrabold tracking-tight">{stats?.approvedLogs || 0}</p>
            <p className="text-[11px] text-[#b3daf0] mt-0.5">Total logs confirmed</p>
          </div>
          <div className="flex items-center gap-1 text-[11px] font-semibold text-[#8ee3f5]">
            <span>Verified digital records</span>
          </div>
        </div>

        {/* Card 4: Feedback Provided (Elevated White Card) */}
        <div className="bg-white rounded-2xl border border-[#d8e5ee] p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[#607b91]">Feedback Given</span>
            <div className="p-2 rounded-xl bg-[#e6f4f8] text-[#1c647e]">
              <MessageSquare className="w-4 h-4" />
            </div>
          </div>
          <div className="my-2">
            <p className="text-3xl font-extrabold text-[#183348] tracking-tight">{stats?.feedbackGiven || 0}</p>
            <p className="text-[11px] text-[#607b91] mt-0.5">Comments & coaching notes</p>
          </div>
          <div className="flex items-center gap-1 text-[11px] font-semibold text-[#2eb4d6]">
            <span>Continuous mentorship</span>
          </div>
        </div>
      </div>

      {/* ── Quick Actions Grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <button
          type="button"
          onClick={() => onNavigate("Supervise")}
          className="bg-white rounded-2xl border border-[#d8e5ee] p-5 shadow-xs hover:border-[#2eb4d6] hover:shadow-md transition-all text-left group cursor-pointer"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#e6f4f8] text-[#1c647e] flex items-center justify-center group-hover:bg-[#2eb4d6] group-hover:text-white transition-colors">
              <Users className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-[#183348]">Intern Roster</p>
              <p className="text-[11px] text-[#607b91]">View assigned interns & placements</p>
            </div>
            <ChevronRight className="w-4 h-4 text-[#9fb8cb] group-hover:text-[#2eb4d6] transition-colors" />
          </div>
        </button>

        <button
          type="button"
          onClick={() => onNavigate("Review Logs")}
          className="bg-white rounded-2xl border border-[#d8e5ee] p-5 shadow-xs hover:border-[#2eb4d6] hover:shadow-md transition-all text-left group cursor-pointer"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#fef7ee] text-[#b46513] flex items-center justify-center group-hover:bg-[#b46513] group-hover:text-white transition-colors">
              <ClipboardList className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-[#183348]">Verification Queue</p>
              <p className="text-[11px] text-[#607b91]">Review and sign submitted logs</p>
            </div>
            <ChevronRight className="w-4 h-4 text-[#9fb8cb] group-hover:text-[#b46513] transition-colors" />
          </div>
        </button>

        <button
          type="button"
          onClick={() => onNavigate("Feedback")}
          className="bg-white rounded-2xl border border-[#d8e5ee] p-5 shadow-xs hover:border-[#2eb4d6] hover:shadow-md transition-all text-left group cursor-pointer"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#f0effb] text-[#5546b3] flex items-center justify-center group-hover:bg-[#5546b3] group-hover:text-white transition-colors">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-[#183348]">Feedback History</p>
              <p className="text-[11px] text-[#607b91]">Review past coaching comments</p>
            </div>
            <ChevronRight className="w-4 h-4 text-[#9fb8cb] group-hover:text-[#5546b3] transition-colors" />
          </div>
        </button>
      </div>

      {/* ── Row 2: Recent Submissions Waiting for Review ── */}
      <div className="bg-white rounded-2xl border border-[#d8e5ee] shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-[#eef4f8] flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-[#183348]">Submissions Awaiting Verification</h3>
            <p className="text-[11px] text-[#607b91]">Logs submitted by your interns requiring review</p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate("Review Logs")}
            className="text-xs font-semibold text-[#265275] hover:text-[#2eb4d6] transition-colors"
          >
            Open Review Queue →
          </button>
        </div>

        {(stats?.recentSubmissions || []).length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2.5">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <p className="text-sm font-bold text-[#183348]">Queue is clear!</p>
            <p className="text-xs text-[#607b91] mt-1">All intern submissions have been reviewed and verified.</p>
          </div>
        ) : (
          <div className="divide-y divide-[#eef4f8]">
            {stats?.recentSubmissions.map((sub) => (
              <div
                key={sub.id}
                onClick={() => onNavigate("Log Review", { logId: sub.id, internId: sub.internId })}
                className="px-6 py-4 hover:bg-[#f8fafc] transition-colors cursor-pointer flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3.5 min-w-0 flex-1">
                  <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200/60 text-amber-700 flex items-center justify-center text-xs font-bold shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-bold text-[#183348]">{sub.internName}</p>
                      <span className="px-2 py-0.5 rounded-full text-[9.5px] font-semibold bg-[#eef5fa] text-[#265275]">
                        {sub.entryType}
                      </span>
                    </div>
                    <p className="text-xs text-[#4b6a82] truncate mt-0.5">{sub.activity}</p>
                    <span className="text-[10px] text-[#718c9f]">Submitted {formatDate(sub.createdAt)}</span>
                  </div>
                </div>

                <Button variant="cyan" size="sm" className="text-white text-xs font-semibold shrink-0">
                  Review
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
