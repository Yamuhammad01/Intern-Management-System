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
      const params = new URLSearchParams({
        page: String(pagination.page),
        limit: String(pagination.limit),
        ...(statusFilter && { status: statusFilter }),
        ...(typeFilter && { entryType: typeFilter }),
      });

      const res = await fetch(`${API_BASE}/logbook/mine?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to fetch log entries");

      const data = await res.json();
      if (data.success) {
        setEntries(data.data.entries);
        setPagination(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, [pagination.page, statusFilter, typeFilter]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPagination((p) => ({ ...p, page: 1 }));
    fetchEntries();
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "DRAFT": return <FileText className="w-3.5 h-3.5 text-gray-500" />;
      case "SUBMITTED": return <Clock className="w-3.5 h-3.5 text-amber-500" />;
      case "APPROVED": return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />;
      case "REJECTED": return <XCircle className="w-3.5 h-3.5 text-red-500" />;
      default: return <FileText className="w-3.5 h-3.5 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "DRAFT": return "bg-gray-100 text-gray-600 border-gray-200";
      case "SUBMITTED": return "bg-amber-100 text-amber-700 border-amber-200";
      case "APPROVED": return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "REJECTED": return "bg-red-100 text-red-700 border-red-200";
      default: return "bg-gray-100 text-gray-600 border-gray-200";
    }
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => onNavigate("Logbook")}
          className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-gray-600" />
        </button>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
            <ClipboardList className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-800">Log History</h1>
            <p className="text-[11px] text-gray-500">Browse all your activity log entries</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-black/[0.07] p-4 shadow-sm">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
            <Search className="w-3.5 h-3.5 text-gray-400 shrink-0" />
            <input
              type="text"
              placeholder="Search activity descriptions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent text-xs outline-none w-full placeholder:text-gray-400"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs border border-gray-200 rounded-lg px-3 py-2 bg-white outline-none"
            >
              <option value="">All Status</option>
              <option value="DRAFT">Draft</option>
              <option value="SUBMITTED">Submitted</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="text-xs border border-gray-200 rounded-lg px-3 py-2 bg-white outline-none"
            >
              <option value="">All Types</option>
              <option value="DAILY">Daily</option>
              <option value="WEEKLY">Weekly</option>
            </select>
          </div>
          <button
            type="submit"
            className="bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors"
          >
            Search
          </button>
        </form>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-black/[0.07] shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-xs text-gray-500">Loading entries...</div>
        ) : entries.length === 0 ? (
          <div className="p-8 text-center">
            <div className="w-10 h-10 mx-auto rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-500 mb-3">
              <ClipboardList className="w-5 h-5" />
            </div>
            <p className="text-sm font-semibold text-gray-800">No log entries found</p>
            <p className="text-[11px] text-gray-500 mt-1">Start logging your activities.</p>
            <button
              onClick={() => onNavigate("Create Log")}
              className="mt-3 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors"
            >
              Create New Entry
            </button>
          </div>
        ) : (
          <div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="px-4 py-3 font-semibold text-gray-600">Date</th>
                    <th className="px-4 py-3 font-semibold text-gray-600">Type</th>
                    <th className="px-4 py-3 font-semibold text-gray-600">Activity</th>
                    <th className="px-4 py-3 font-semibold text-gray-600">Hours</th>
                    <th className="px-4 py-3 font-semibold text-gray-600">Status</th>
                    <th className="px-4 py-3 font-semibold text-gray-600">Reviewer</th>
                    <th className="px-4 py-3 font-semibold text-gray-600 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {entries.map((entry) => (
                    <tr
                      key={entry.id}
                      className="hover:bg-gray-50/60 transition-colors cursor-pointer"
                      onClick={() => onNavigate("Log Detail", { logId: entry.id })}
                    >
                      <td className="px-4 py-3 font-medium text-gray-700">
                        {formatDate(entry.logDate)}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium border ${
                          entry.entryType === "DAILY"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-purple-50 text-purple-700 border-purple-200"
                        }`}>
                          {entry.entryType === "DAILY" ? "Daily" : "Weekly"}
                        </span>
                      </td>
                      <td className="px-4 py-3 max-w-[200px]">
                        <p className="truncate text-gray-700">
                          {entry.activity.length > 60
                            ? entry.activity.substring(0, 60) + "..."
                            : entry.activity}
                        </p>
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {entry.hoursWorked ? `${entry.hoursWorked}h` : "—"}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium border ${getStatusBadge(entry.status)}`}>
                          {getStatusIcon(entry.status)}
                          {entry.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {entry.reviewerName || "—"}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={(e) => { e.stopPropagation(); onNavigate("Log Detail", { logId: entry.id }); }}
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

            {/* Pagination */}
            {!loading && entries.length > 0 && (
              <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between">
                <p className="text-[11px] text-gray-500">
                  Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
                  {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total}
                </p>
                <div className="flex items-center gap-1.5">
                  <button
                    disabled={pagination.page === 1}
                    onClick={() => setPagination((p) => ({ ...p, page: p.page - 1 }))}
                    className="p-1.5 rounded-md border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-3.5 h-3.5 text-gray-600" />
                  </button>
                  {Array.from({ length: pagination.totalPages }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setPagination((p) => ({ ...p, page: i + 1 }))}
                      className={`w-7 h-7 rounded-md text-[11px] font-medium transition-colors ${
                        pagination.page === i + 1
                          ? "bg-emerald-500 text-white"
                          : "hover:bg-gray-50 text-gray-600"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    disabled={pagination.page === pagination.totalPages}
                    onClick={() => setPagination((p) => ({ ...p, page: p.page + 1 }))}
                    className="p-1.5 rounded-md border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-3.5 h-3.5 text-gray-600 rotate-180" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}