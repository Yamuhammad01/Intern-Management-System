import { useState, useEffect } from "react";
import {
  ArrowLeft,
  ClipboardList,
  Calendar,
  Clock,
  BookOpen,
  Send,
  XCircle,
  CheckCircle2,
  Loader2,
  MessageSquare,
  User,
  Star,
  AlertCircle,
  ShieldCheck,
} from "lucide-react";
import { Button } from "../../components/ui/button";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

interface LogReviewPageProps {
  onNavigate: (tab: string, params?: any) => void;
  logId: string;
  internId: string;
}

export function LogReviewPage({ onNavigate, logId, internId }: LogReviewPageProps) {
  const [log, setLog] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [reviewNotes, setReviewNotes] = useState("");
  const [rating, setRating] = useState<number>(5);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLog = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const res = await fetch(`${API_BASE}/logbook/${logId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to load log details");
        const data = await res.json();
        if (data.success) {
          setLog(data.data);
          if (data.data.reviewNotes) setReviewNotes(data.data.reviewNotes);
        }
      } catch (err: any) {
        setError(err.message || "Unable to reach logbook service");
        // Offline demo fallback
        setLog({
          id: logId,
          internName: "Adaeze Nwosu",
          internEmail: "adaeze@internhub.com",
          entryType: "DAILY",
          logDate: new Date().toISOString(),
          hoursWorked: 8,
          activity:
            "Implemented composite indexing on settlement transactions to optimize database latency. Profiled queries using EXPLAIN ANALYZE and reduced index scan overhead from 450ms down to 18ms.",
          skills: "PostgreSQL, Prisma ORM, Query Optimization, Database Indexing",
          notes: "Need guidance on whether to partition the monthly settlement table ahead of Q4 high volumes.",
          status: "SUBMITTED",
          createdAt: new Date().toISOString(),
        });
      } finally {
        setLoading(false);
      }
    };
    fetchLog();
  }, [logId]);

  const handleReview = async (status: "APPROVED" | "REJECTED") => {
    setSubmitting(true);
    setError("");
    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(`${API_BASE}/supervisor/logs/${logId}/review`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status,
          reviewNotes: reviewNotes || (status === "APPROVED" ? "Approved and verified." : "Please revise with more technical detail."),
          rating,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || `Failed to set log status to ${status}`);
      }

      onNavigate("Review Logs");
    } catch (err: any) {
      setError(err.message || "Failed to process review");
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <Loader2 className="w-6 h-6 animate-spin text-[#2eb4d6]" />
        <span className="text-xs text-[#607b91] font-medium">Loading submission for verification...</span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* ── Top Bar ── */}
      <div className="flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => onNavigate("Review Logs")}
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#265275] hover:text-[#2eb4d6] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Review Queue
        </button>

        <span className="text-xs font-semibold text-amber-800 bg-amber-50 border border-amber-200 px-3.5 py-1 rounded-full">
          Pending Verification
        </span>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200/80 rounded-xl p-3.5 flex items-start gap-2.5 text-xs text-red-700 animate-shake">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span className="leading-relaxed">{error}</span>
        </div>
      )}

      {/* ── Split Layout: Submission on Left, Review Actions on Right ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Intern Submission Content */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-[#d8e5ee] p-6 sm:p-7 shadow-xs space-y-5">
          <div className="border-b border-[#eef4f8] pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-ip-teal text-white flex items-center justify-center text-xs font-bold shadow-2xs">
                {(log?.internName || "IN").split(" ").map((n: string) => n[0]).slice(0, 2).join("")}
              </div>
              <div>
                <h3 className="text-base font-bold text-[#183348]">{log?.internName}</h3>
                <p className="text-xs text-[#607b91]">{log?.internEmail}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 mt-4 text-xs text-[#607b91]">
              <span className="px-2.5 py-0.5 rounded-full bg-[#eef5fa] text-[#265275] font-semibold text-[11px]">
                {log?.entryType === "DAILY" ? "Daily Activity Log" : "Weekly Summary"}
              </span>
              <span>•</span>
              <span>Activity Date: <b>{formatDate(log?.logDate)}</b></span>
              {log?.hoursWorked && (
                <>
                  <span>•</span>
                  <span>Hours: <b>{log.hoursWorked} hrs</b></span>
                </>
              )}
            </div>
          </div>

          {/* Activity Description */}
          <div className="space-y-1.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#4d6f88]">
              Reported Activities & Deliverables
            </h4>
            <div className="bg-[#f8fafc] border border-[#dce7ef] rounded-xl p-4 text-xs text-[#183348] leading-relaxed whitespace-pre-wrap">
              {log?.activity}
            </div>
          </div>

          {/* Skills */}
          {log?.skills && (
            <div className="space-y-1.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#4d6f88]">
                Applied Technologies & Skills
              </h4>
              <div className="flex flex-wrap gap-2">
                {log.skills.split(",").map((s: string, i: number) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#e6f4f8] text-[#1c647e] border border-[#c4e5ee]"
                  >
                    {s.trim()}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Challenges / Reflection */}
          {log?.notes && (
            <div className="space-y-1.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#4d6f88]">
                Intern Notes / Question for Supervisor
              </h4>
              <div className="bg-[#fcfdfd] border border-[#e2ecf3] rounded-xl p-3.5 text-xs text-[#3a586e] leading-relaxed italic">
                "{log.notes}"
              </div>
            </div>
          )}
        </div>

        {/* Right: Supervisor Sign-off & Feedback Pane */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-[#d8e5ee] p-6 shadow-xs flex flex-col justify-between space-y-5">
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-[#eef4f8] pb-3">
              <ShieldCheck className="w-5 h-5 text-[#2eb4d6]" />
              <div>
                <h4 className="text-sm font-bold text-[#183348]">Verification & Feedback</h4>
                <p className="text-[11px] text-[#607b91]">Attest to hours and quality of deliverables</p>
              </div>
            </div>

            {/* Rating Stars */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#1d3d56]">Quality & Execution Rating</label>
              <div className="flex items-center gap-1.5 p-2.5 bg-[#f8fafc] border border-[#d7e4ed] rounded-xl">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1 hover:scale-110 transition-transform cursor-pointer"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        star <= rating
                          ? "fill-[#f59e0b] text-[#f59e0b]"
                          : "text-[#d0dee8]"
                      }`}
                    />
                  </button>
                ))}
                <span className="text-xs font-bold text-[#183348] ml-2">
                  {rating}.0 / 5.0
                </span>
              </div>
            </div>

            {/* Written Comments */}
            <div className="space-y-1.5">
              <label htmlFor="reviewNotes" className="text-xs font-semibold text-[#1d3d56]">
                Supervisor Feedback Notes
              </label>
              <textarea
                id="reviewNotes"
                rows={5}
                value={reviewNotes}
                onChange={(e) => setReviewNotes(e.target.value)}
                placeholder="Leave constructive guidance, commend exceptional execution, or specify required revisions..."
                className="w-full bg-[#f8fafc] border border-[#d7e4ed] rounded-xl p-3 text-xs text-[#183348] placeholder:text-[#8ea5b6] outline-none focus:bg-white focus:border-[#2eb4d6] focus:ring-2 focus:ring-[#2eb4d6]/20 transition-all resize-y leading-relaxed"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2.5 pt-4 border-t border-[#eef4f8]">
            <Button
              type="button"
              variant="navy"
              disabled={submitting}
              onClick={() => handleReview("APPROVED")}
              className="w-full text-white text-xs font-semibold py-2.5 shadow-xs"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />
                  Recording Verification...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 mr-1.5" />
                  Approve & Sign Log Entry
                </>
              )}
            </Button>

            <Button
              type="button"
              variant="outline"
              disabled={submitting}
              onClick={() => handleReview("REJECTED")}
              className="w-full border-red-200 text-red-700 hover:bg-red-50 text-xs font-semibold"
            >
              <XCircle className="w-3.5 h-3.5 mr-1.5" />
              Request Revision
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
