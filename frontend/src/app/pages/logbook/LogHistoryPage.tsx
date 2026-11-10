import { useState, useEffect } from "react";
import {
  ClipboardList,
  ArrowLeft,
  Search,
  Filter,
  Clock,
  CheckCircle2,
  XCircle,
  FileText,
  ChevronRight,
  ChevronLeft,
  Loader2,
  Calendar,
} from "lucide-react";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

interface LogEntry {
  id: string;
  internId: string;
  internName: string;
  entryType: "DAILY" | "WEEKLY";
  status: "DRAFT" | "SUBMITTED" | "APPROVED" | "REJECTED";
  logDate: string;
  activity: string;
  skills: string | null;
  hoursWorked: number | null;
  notes: string | null;
  reviewerName: string | null;
  reviewNotes: string | null;
  reviewedAt: string | null;
  createdAt: string;
}

interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface LogHistoryPageProps {
  onNavigate: (tab: string, params?: any) => void;
}

export function LogHistoryPage({ onNavigate }: LogHistoryPageProps) {
  const [entries, setEntries] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [pagination, setPagination] = useState<Pagination>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });

  const fetchEntries = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      const queryParams = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        ...(statusFilter && { status: statusFilter }),
        ...(typeFilter && { entryType: typeFilter }),
        ...(search && { search }),
      });

      const res = await fetch(`${API_BASE}/logbook?${queryParams}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to fetch log entries");

      const data = await res.json();
      if (data.success) {
        setEntries(data.data.logs || []);
        setPagination(
          data.data.pagination || { total: 0, page: 1, limit: 10, totalPages: 0 }
        );
      }
    } catch {
      setEntries([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, [pagination.page, statusFilter, typeFilter]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPagination((prev) => ({ ...prev, page: 1 }));
    fetchEntries();
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "DRAFT":
        return <FileText className="w-3.5 h-3.5 text-[#607b91]" />;
      case "SUBMITTED":
        return <Clock className="w-3.5 h-3.5 text-amber-600" />;
      case "APPROVED":
        return <CheckCircle2 className="w-3.5 h-3.5 text-[#0d6e46]" />;
      case "REJECTED":
        return <XCircle className="w-3.5 h-3.5 text-red-600" />;
      default:
        return <FileText className="w-3.5 h-3.5 text-[#607b91]" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "DRAFT":
        return "bg-[#edf3f7] text-[#4e6c82] border-[#d4e2eb]";
      case "SUBMITTED":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "APPROVED":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "REJECTED":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-[#edf3f7] text-[#4e6c82] border-[#d4e2eb]";
    }
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => onNavigate("Logbook")}
            className="p-2 rounded-xl bg-white border border-[#d8e5ee] text-[#265275] hover:bg-[#eef5fa] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-lg font-bold text-[#183348]">Logbook History</h1>
            <p className="text-xs text-[#607b91]">Complete chronological archive of all your activity records</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onNavigate("Create Log")}
          className="bg-[#265275] hover:bg-[#1e4361] text-white text-xs font-semibold px-4 py-2 rounded-xl transition-all shadow-xs"
        >
          + New Entry
        </button>
      </div>

      {/* ── Search and Filters ── */}
      <div className="bg-white rounded-2xl border border-[#d8e5ee] p-4 shadow-xs">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-[#2eb4d6] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search activities, keywords, or skills..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#f8fafc] border border-[#d7e4ed] rounded-xl pl-10 pr-4 py-2 text-xs text-[#183348] placeholder:text-[#8ea5b6] outline-none focus:bg-white focus:border-[#2eb4d6] focus:ring-2 focus:ring-[#2eb4d6]/20 transition-all"
            />
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPagination((p) => ({ ...p, page: 1 }));
              }}
              className="bg-[#f8fafc] border border-[#d7e4ed] rounded-xl px-3 py-2 text-xs text-[#183348] outline-none focus:bg-white focus:border-[#2eb4d6] transition-all cursor-pointer flex-1 sm:flex-initial"
            >
              <option value="">All Statuses</option>
              <option value="DRAFT">Draft</option>
              <option value="SUBMITTED">Under Review</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Needs Revision</option>
            </select>

            <select
              value={typeFilter}
              onChange={(e) => {
                setTypeFilter(e.target.value);
                setPagination((p) => ({ ...p, page: 1 }));
              }}
              className="bg-[#f8fafc] border border-[#d7e4ed] rounded-xl px-3 py-2 text-xs text-[#183348] outline-none focus:bg-white focus:border-[#2eb4d6] transition-all cursor-pointer flex-1 sm:flex-initial"
            >
              <option value="">All Types</option>
              <option value="DAILY">Daily Log</option>
              <option value="WEEKLY">Weekly Summary</option>
            </select>
          </div>
        </form>
      </div>

      {/* ── Table Container ── */}
      <div className="bg-white rounded-2xl border border-[#d8e5ee] shadow-xs overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 className="w-6 h-6 animate-spin text-[#2eb4d6]" />
            <span className="text-xs text-[#607b91] font-medium">Loading history archive...</span>
          </div>
        ) : entries.length === 0 ? (
          <div className="p-14 text-center flex flex-col items-center">
            <div className="w-14 h-14 rounded-2xl bg-[#e6f4f8] border border-[#bfe7f3] flex items-center justify-center text-[#248da9] mb-3">
              <ClipboardList className="w-6 h-6" />
            </div>
            <p className="text-sm font-bold text-[#183348]">No log entries found</p>
            <p className="text-xs text-[#607b91] mt-1 max-w-sm leading-relaxed">
              {search || statusFilter || typeFilter
                ? "No records match the current filter criteria. Try resetting your search."
                : "You haven't recorded any activity logs yet."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#f4f7fa] border-b border-[#d8e5ee] text-[11px] font-bold text-[#4d6f88] uppercase tracking-wider">
                  <th className="px-5 py-3">Date</th>
                  <th className="px-5 py-3">Type</th>
                  <th className="px-5 py-3">Activity Description</th>
                  <th className="px-5 py-3">Hours</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#eef4f8] text-xs">
                {entries.map((entry) => (
                  <tr
                    key={entry.id}
                    onClick={() => onNavigate("Log Detail", { logId: entry.id })}
                    className="hover:bg-[#f9fbfd] transition-colors cursor-pointer group"
                  >
                    <td className="px-5 py-3.5 font-semibold text-[#183348] whitespace-nowrap">
                      {formatDate(entry.logDate)}
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <span className="px-2.5 py-1 rounded-full text-[10.5px] font-semibold bg-[#eef5fa] text-[#265275]">
                        {entry.entryType === "DAILY" ? "Daily" : "Weekly"}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 max-w-md">
                      <p className="font-semibold text-[#183348] truncate">
                        {entry.activity}
                      </p>
                      {entry.skills && (
                        <p className="text-[10.5px] text-[#718c9f] truncate mt-0.5">
                          {entry.skills}
                        </p>
                      )}
                    </td>
                    <td className="px-5 py-3.5 font-medium text-[#4b6a82] whitespace-nowrap">
                      {entry.hoursWorked ? `${entry.hoursWorked} hrs` : "—"}
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10.5px] font-bold border ${getStatusBadge(
                          entry.status
                        )}`}
                      >
                        {getStatusIcon(entry.status)}
                        {entry.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right whitespace-nowrap">
                      <span className="inline-flex items-center text-xs font-semibold text-[#265275] group-hover:text-[#2eb4d6] transition-colors">
                        View
                        <ChevronRight className="w-3.5 h-3.5 ml-1" />
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ── Pagination ── */}
        {pagination.totalPages > 1 && (
          <div className="px-6 py-3.5 bg-[#fbfdfd] border-t border-[#eef4f8] flex items-center justify-between text-xs text-[#607b91]">
            <span>
              Showing page <b>{pagination.page}</b> of <b>{pagination.totalPages}</b> ({pagination.total} entries)
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={pagination.page <= 1}
                onClick={() => setPagination((p) => ({ ...p, page: p.page - 1 }))}
                className="px-3 py-1.5 rounded-lg border border-[#d8e5ee] bg-white text-[#183348] disabled:opacity-40 disabled:pointer-events-none hover:bg-[#f4f7fa] transition-colors font-medium flex items-center gap-1"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                Previous
              </button>
              <button
                type="button"
                disabled={pagination.page >= pagination.totalPages}
                onClick={() => setPagination((p) => ({ ...p, page: p.page + 1 }))}
                className="px-3 py-1.5 rounded-lg border border-[#d8e5ee] bg-white text-[#183348] disabled:opacity-40 disabled:pointer-events-none hover:bg-[#f4f7fa] transition-colors font-medium flex items-center gap-1"
              >
                Next
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
