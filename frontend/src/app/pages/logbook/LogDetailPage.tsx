import { useState, useEffect } from "react";
import {
  ArrowLeft,
  Calendar,
  Clock,
  BookOpen,
  FileText,
  CheckCircle2,
  XCircle,
  Send,
  Edit3,
  Trash2,
  Loader2,
  User,
  AlertCircle,
} from "lucide-react";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

interface LogEntryDetail {
  id: string;
  internId: string;
  internName: string;
  internEmail: string;
  entryType: "DAILY" | "WEEKLY";
  status: "DRAFT" | "SUBMITTED" | "APPROVED" | "REJECTED";
  logDate: string;
  activity: string;
  skills: string | null;
  hoursWorked: number | null;
  notes: string | null;
  reviewedBy: string | null;
  reviewerName: string | null;
  reviewedAt: string | null;
  reviewNotes: string | null;
  createdAt: string;
  updatedAt: string;
}

interface LogDetailPageProps {
  onNavigate: (tab: string, params?: any) => void;
  logId: string;
}

export function LogDetailPage({ onNavigate, logId }: LogDetailPageProps) {
  const [entry, setEntry] = useState<LogEntryDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  const fetchEntry = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(`${API_BASE}/logbook/${logId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to fetch log entry");

      const data = await res.json();
      if (data.success) {
        setEntry(data.data);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntry();
  }, [logId]);

  const handleSubmit = async () => {
    if (!confirm("Submit this log entry for review? You won't be able to edit it afterward.")) return;
    setSubmitting(true);
    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(`${API_BASE}/logbook/${logId}/submit`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to submit");
      }
      onNavigate("Logbook");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this log entry? This action cannot be undone.")) return;
    setDeleting(true);
    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(`${API_BASE}/logbook/${logId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to delete");
      }
      onNavigate("Logbook");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setDeleting(false);
    }
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" });
  };

  const formatDateTime = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-GB", {
      day: "2-digit", month: "short", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Loader2 className="w-4 h-4 animate-spin text-emerald-500" />
          Loading entry details...
        </div>
      </div>
    );
  }

  if (!entry) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20">
        <AlertCircle className="w-8 h-8 text-red-400 mx-auto mb-3" />
        <p className="text-sm font-semibold text-gray-800">Entry not found</p>
        <p className="text-xs text-gray-500 mt-1">{error || "The log entry could not be found."}</p>
        <button
          onClick={() => onNavigate("Logbook")}
          className="mt-4 text-xs text-emerald-600 hover:underline font-medium"
        >
          Back to Logbook
        </button>
      </div>
    );
  }

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "DRAFT":
        return { icon: FileText, color: "text-gray-600", bg: "bg-gray-100", border: "border-gray-200", label: "Draft" };
      case "SUBMITTED":
        return { icon: Clock, color: "text-amber-700", bg: "bg-amber-100", border: "border-amber-200", label: "Submitted" };
      case "APPROVED":
        return { icon: CheckCircle2, color: "text-emerald-700", bg: "bg-emerald-100", border: "border-emerald-200", label: "Approved" };
      case "REJECTED":
        return { icon: XCircle, color: "text-red-700", bg: "bg-red-100", border: "border-red-200", label: "Rejected" };
      default:
        return { icon: FileText, color: "text-gray-600", bg: "bg-gray-100", border: "border-gray-200", label: status };
    }
  };

  const statusConfig = getStatusConfig(entry.status);
  const StatusIcon = statusConfig.icon;

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={() => onNavigate("Logbook")}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-gray-600" />
          </button>
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${statusConfig.bg}`}>
              <StatusIcon className={`w-4 h-4 ${statusConfig.color}`} />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-800">{entry.entryType === "DAILY" ? "Daily" : "Weekly"} Activity Log</h1>
              <p className="text-[11px] text-gray-500">{formatDate(entry.logDate)}</p>
            </div>
          </div>
        </div>
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold border ${statusConfig.border} ${statusConfig.bg} ${statusConfig.color}`}>
          <StatusIcon className="w-3.5 h-3.5" />
          {statusConfig.label}
        </span>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-xl border border-black/[0.07] shadow-sm overflow-hidden">
        {/* Activity */}
        <div className="p-5 border-b border-gray-50">
          <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide mb-2">Activity Performed</p>
          <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">{entry.activity}</p>
        </div>

        {/* Skills */}
        {entry.skills && (
          <div className="p-5 border-b border-gray-50">
            <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide mb-2">Skills Acquired</p>
            <p className="text-xs text-gray-700 leading-relaxed whitespace-pre-wrap">{entry.skills}</p>
          </div>
        )}

        {/* Notes */}
        {entry.notes && (
          <div className="p-5 border-b border-gray-50">
            <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide mb-2">Supporting Notes</p>
            <p className="text-xs text-gray-700 leading-relaxed whitespace-pre-wrap">{entry.notes}</p>
          </div>
        )}

        {/* Meta Info Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-gray-50">
          <div className="bg-white p-4">
            <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide mb-1">Date</p>
            <div className="flex items-center gap-1.5 text-xs text-gray-700">
              <Calendar className="w-3.5 h-3.5 text-gray-400" />
              {formatDate(entry.logDate)}
            </div>
          </div>
          <div className="bg-white p-4">
            <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide mb-1">Hours</p>
            <div className="flex items-center gap-1.5 text-xs text-gray-700">
              <Clock className="w-3.5 h-3.5 text-gray-400" />
              {entry.hoursWorked ? `${entry.hoursWorked}h` : "—"}
            </div>
          </div>
          <div className="bg-white p-4">
            <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide mb-1">Type</p>
            <div className="flex items-center gap-1.5 text-xs text-gray-700">
              <BookOpen className="w-3.5 h-3.5 text-gray-400" />
              {entry.entryType === "DAILY" ? "Daily" : "Weekly"}
            </div>
          </div>
          <div className="bg-white p-4">
            <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide mb-1">Intern</p>
            <div className="flex items-center gap-1.5 text-xs text-gray-700">
              <User className="w-3.5 h-3.5 text-gray-400" />
              {entry.internName || "—"}
            </div>
          </div>
        </div>

        {/* Timestamps */}
        <div className="px-4 py-3 bg-gray-50/50 border-t border-gray-50 flex flex-wrap gap-x-6 gap-y-1 text-[10px] text-gray-400">
          <span>Created: {formatDateTime(entry.createdAt)}</span>
          <span>Updated: {formatDateTime(entry.updatedAt)}</span>
          {entry.reviewedAt && <span>Reviewed: {formatDateTime(entry.reviewedAt)}</span>}
        </div>
      </div>

      {/* Review Section */}
      {(entry.status === "APPROVED" || entry.status === "REJECTED") && (
        <div className={`rounded-xl border p-5 shadow-sm ${
          entry.status === "APPROVED"
            ? "bg-emerald-50 border-emerald-200"
            : "bg-red-50 border-red-200"
        }`}>
          <div className="flex items-center gap-2 mb-3">
            {entry.status === "APPROVED"
              ? <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              : <XCircle className="w-5 h-5 text-red-600" />
            }
            <div>
              <p className="text-sm font-semibold text-gray-800">
                {entry.status === "APPROVED" ? "Approved" : "Rejected"}
              </p>
              {entry.reviewerName && (
                <p className="text-[11px] text-gray-500">by {entry.reviewerName}</p>
              )}
            </div>
          </div>
          {entry.reviewNotes && (
            <p className="text-xs text-gray-700 bg-white/80 rounded-lg p-3 border border-inherit">
              {entry.reviewNotes}
            </p>
          )}
        </div>
      )}

      {/* Actions (only for DRAFT logs) */}
      {entry.status === "DRAFT" && (
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50"
          >
            {deleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
            Delete
          </button>
          <button
            onClick={() => onNavigate("Edit Log", { logId: entry.id })}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-gray-700 bg-gray-100 border border-gray-200 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <Edit3 className="w-3.5 h-3.5" />
            Edit Draft
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-emerald-500 rounded-lg hover:bg-emerald-600 transition-colors disabled:opacity-50"
          >
            {submitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
            Submit for Review
          </button>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
          <p className="text-xs text-red-700">{error}</p>
        </div>
      )}
    </div>
  );
}