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
} from "lucide-react";

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
      if (!res.ok) throw new Error("Failed to fetch stats");
      const data = await res.json();
      if (data.success) setStats(data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStats(); }, []);

  const formatDate = (d: string) => new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short" });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Loader2 className="w-4 h-4 animate-spin text-emerald-500" />
          Loading dashboard...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
            <ClipboardList className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-800">Supervisor Dashboard</h1>
            <p className="text-[11px] text-gray-500">Review logs and track intern progress</p>
          </div>
        </div>
        <button
          onClick={() => onNavigate("Submitted Logs")}
          className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold px-3 py-2 rounded-lg transition-colors shadow-sm"
        >
          <Clock className="w-3.5 h-3.5" />
          Review Pending ({stats?.pendingReviews || 0})
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="bg-white rounded-xl border border-black/[0.07] p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
              <Users className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-800">{stats?.totalInterns || 0}</p>
          <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wide">Assigned Interns</p>
        </div>
        <div className="bg-white rounded-xl border border-black/[0.07] p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-lg bg-amber-100 flex items-center justify-center text-amber-600">
              <Clock className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-800">{stats?.pendingReviews || 0}</p>
          <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wide">Pending Reviews</p>
        </div>
        <div className="bg-white rounded-xl border border-black/[0.07] p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-800">{stats?.approvedLogs || 0}</p>
          <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wide">Approved</p>
        </div>
        <div className="bg-white rounded-xl border border-black/[0.07] p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-lg bg-red-100 flex items-center justify-center text-red-600">
              <XCircle className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-800">{stats?.rejectedLogs || 0}</p>
          <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wide">Rejected</p>
        </div>
        <div className="bg-white rounded-xl border border-black/[0.07] p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-lg bg-purple-100 flex items-center justify-center text-purple-600">
              <MessageSquare className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-800">{stats?.feedbackGiven || 0}</p>
          <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wide">Feedbacks</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <button
          onClick={() => onNavigate("My Interns")}
          className="bg-white rounded-xl border border-black/[0.07] p-4 shadow-sm hover:shadow-md transition-all text-left group"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 group-hover:bg-blue-200 transition-colors">
              <Users className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-800">My Interns</p>
              <p className="text-[10px] text-gray-500">View and manage assigned interns</p>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-blue-500 transition-colors" />
          </div>
        </button>
        <button
          onClick={() => onNavigate("Submitted Logs")}
          className="bg-white rounded-xl border border-black/[0.07] p-4 shadow-sm hover:shadow-md transition-all text-left group"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-100 flex items-center justify-center text-amber-600 group-hover:bg-amber-200 transition-colors">
              <ClipboardList className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-800">Submitted Logs</p>
              <p className="text-[10px] text-gray-500">Review and approve/reject log entries</p>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-amber-500 transition-colors" />
          </div>
        </button>
        <button
          onClick={() => onNavigate("Feedback History")}
          className="bg-white rounded-xl border border-black/[0.07] p-4 shadow-sm hover:shadow-md transition-all text-left group"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-purple-100 flex items-center justify-center text-purple-600 group-hover:bg-purple-200 transition-colors">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-800">Feedback History</p>
              <p className="text-[10px] text-gray-500">View all feedback you've given</p>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-purple-500 transition-colors" />
          </div>
        </button>
      </div>

      {/* Recent Submissions */}
      <div className="bg-white rounded-xl border border-black/[0.07] shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-800">Recent Submissions</h3>
          <button
            onClick={() => onNavigate("Submitted Logs")}
            className="text-[11px] text-emerald-600 hover:underline font-medium"
          >
            View All
          </button>
        </div>
        {(stats?.recentSubmissions || []).length === 0 ? (
          <div className="p-8 text-center">
            <div className="w-10 h-10 mx-auto rounded-full bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-500 mb-3">
              <ClipboardList className="w-5 h-5" />
            </div>
            <p className="text-sm font-semibold text-gray-800">No pending submissions</p>
            <p className="text-[11px] text-gray-500 mt-1">Interns haven't submitted any logs yet.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {stats?.recentSubmissions.map((sub) => (
              <div
                key={sub.id}
                onClick={() => onNavigate("Log Review", { logId: sub.id, internId: sub.internId })}
                className="px-4 py-3 hover:bg-gray-50/60 transition-colors cursor-pointer"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <div className="w-7 h-7 rounded-lg bg-amber-100 flex items-center justify-center text-amber-600 shrink-0">
                      <Clock className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-xs font-semibold text-gray-800">{sub.internName}</p>
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-medium border bg-amber-100 text-amber-700 border-amber-200">
                          {sub.entryType === "DAILY" ? "Daily" : "Weekly"}
                        </span>
                      </div>
                      <p className="text-[10px] text-gray-500 mt-0.5 truncate">{sub.activity.substring(0, 80)}</p>
                      <p className="text-[9px] text-gray-400 mt-0.5">{formatDate(sub.logDate)}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-gray-300 shrink-0" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Intern Progress Summary */}
      <div className="bg-white rounded-xl border border-black/[0.07] shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100">
          <h3 className="text-sm font-semibold text-gray-800">Intern Progress</h3>
        </div>
        {(stats?.internProgressSummaries || []).length === 0 ? (
          <div className="p-6 text-center text-xs text-gray-500">No interns assigned.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-4 py-3 font-semibold text-gray-600">Intern</th>
                  <th className="px-4 py-3 font-semibold text-gray-600">Total Logs</th>
                  <th className="px-4 py-3 font-semibold text-gray-600">Pending</th>
                  <th className="px-4 py-3 font-semibold text-gray-600">Approval Rate</th>
                  <th className="px-4 py-3 font-semibold text-gray-600 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {stats?.internProgressSummaries.map((intern) => (
                  <tr key={intern.internId} className="hover:bg-gray-50/60 transition-colors">
                    <td className="px-4 py-3 font-medium text-gray-800">{intern.internName}</td>
                    <td className="px-4 py-3 text-gray-600">{intern.totalLogs}</td>
                    <td className="px-4 py-3">
                      {intern.pendingLogs > 0 ? (
                        <span className="text-amber-600 font-medium">{intern.pendingLogs}</span>
                      ) : (
                        <span className="text-gray-400">0</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              intern.approvalRate >= 80 ? "bg-emerald-500" :
                              intern.approvalRate >= 50 ? "bg-amber-500" : "bg-red-500"
                            }`}
                            style={{ width: `${intern.approvalRate}%` }}
                          />
                        </div>
                        <span className="text-[10px] font-medium text-gray-600">{intern.approvalRate}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => onNavigate("Intern Progress", { internId: intern.internId })}
                        className="p-1.5 rounded-md hover:bg-emerald-50 text-emerald-600 transition-colors"
                      >
                        <ChevronRight className="w-3.5 h-3.5" />
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
}