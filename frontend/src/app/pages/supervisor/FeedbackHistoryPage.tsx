import { useState, useEffect } from "react";
import {
  ArrowLeft,
  MessageSquare,
  ChevronRight,
  Loader2,
  Trash2,
  Star,
  User,
  Calendar,
  Sparkles,
} from "lucide-react";
import { Button } from "../../components/ui/button";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

interface FeedbackItem {
  id: string;
  internId: string;
  internName: string;
  logEntryId: string | null;
  type: string;
  rating: number | null;
  content: string;
  strengths: string | null;
  improvements: string | null;
  isPrivate: boolean;
  createdAt: string;
}

interface FeedbackHistoryPageProps {
  onNavigate: (tab: string, params?: any) => void;
}

export function FeedbackHistoryPage({ onNavigate }: FeedbackHistoryPageProps) {
  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("accessToken");
        const res = await fetch(`${API_BASE}/supervisor/feedback`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch feedback history");
        const data = await res.json();
        if (data.success) setFeedbacks(data.data.feedbacks || []);
      } catch {
        // Fallback demo
        setFeedbacks([
          {
            id: "fb-1",
            internId: "int-1",
            internName: "Adaeze Nwosu",
            logEntryId: "log-1",
            type: "LOG_REVIEW",
            rating: 5,
            content: "Excellent implementation of Prisma transaction queries and indexing. Well-documented pull request.",
            strengths: "Database optimization, attention to edge cases",
            improvements: "None for this sprint",
            isPrivate: false,
            createdAt: new Date().toISOString(),
          },
          {
            id: "fb-2",
            internId: "int-2",
            internName: "Oluwaseun Adeyemi",
            logEntryId: "log-2",
            type: "WEEKLY_SUMMARY",
            rating: 4.5,
            content: "Good progress on CI/CD pipelines. Please ensure integration test results are attached with future PRs.",
            strengths: "Pipeline automation",
            improvements: "Testing rigour",
            isPrivate: false,
            createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
          },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchFeedbacks();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this feedback record? This cannot be undone.")) return;
    setDeletingId(id);
    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(`${API_BASE}/supervisor/feedback/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to delete feedback");
      setFeedbacks((prev) => prev.filter((f) => f.id !== id));
    } catch (err: any) {
      alert(err.message || "Failed to delete feedback");
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => onNavigate("Dashboard")}
            className="p-2 rounded-xl bg-white border border-[#d8e5ee] text-[#265275] hover:bg-[#eef5fa] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-lg font-bold text-[#183348]">Feedback History</h1>
            <p className="text-xs text-[#607b91]">Chronological audit of ratings, comments, and coaching advice issued</p>
          </div>
        </div>

        <span className="text-xs font-semibold text-[#1c647e] bg-[#e6f4f8] border border-[#c4e4ee] px-3.5 py-1 rounded-full">
          {feedbacks.length} Feedback Records
        </span>
      </div>

      {/* ── Feedback List ── */}
      <div className="bg-white rounded-2xl border border-[#d8e5ee] shadow-xs overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 className="w-6 h-6 animate-spin text-[#2eb4d6]" />
            <span className="text-xs text-[#607b91] font-medium">Loading feedback log...</span>
          </div>
        ) : feedbacks.length === 0 ? (
          <div className="p-16 text-center flex flex-col items-center">
            <div className="w-14 h-14 rounded-2xl bg-[#e6f4f8] text-[#1c647e] flex items-center justify-center mb-3">
              <MessageSquare className="w-7 h-7" />
            </div>
            <p className="text-sm font-bold text-[#183348]">No feedback history found</p>
            <p className="text-xs text-[#607b91] mt-1 max-w-sm">
              You haven't left any standalone or logbook feedback comments yet.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-[#eef4f8]">
            {feedbacks.map((f) => (
              <div key={f.id} className="p-6 hover:bg-[#f9fbfd] transition-colors space-y-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-ip-teal text-white flex items-center justify-center text-xs font-bold shadow-2xs">
                      {f.internName.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[#183348]">{f.internName}</p>
                      <span className="text-[10.5px] text-[#718c9f]">Recorded on {formatDate(f.createdAt)}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {f.rating && (
                      <div className="flex items-center gap-1 bg-[#fff8ea] border border-[#fce1b4] px-2.5 py-0.5 rounded-full text-amber-800 text-xs font-bold">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>{f.rating.toFixed(1)}</span>
                      </div>
                    )}

                    <button
                      type="button"
                      disabled={deletingId === f.id}
                      onClick={() => handleDelete(f.id)}
                      className="p-1.5 text-[#8aa3b5] hover:text-red-600 transition-colors cursor-pointer"
                      title="Delete record"
                    >
                      {deletingId === f.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="bg-[#f8fafc] border border-[#e2ecf3] rounded-xl p-3.5 text-xs text-[#204058] leading-relaxed">
                  "{f.content}"
                </div>

                {(f.strengths || f.improvements) && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
                    {f.strengths && (
                      <div className="bg-[#f0faf5] border border-[#c1e9d5] p-2.5 rounded-lg text-[#0d6e46]">
                        <span className="font-bold text-[10px] uppercase tracking-wide block mb-0.5">Strengths</span>
                        <p>{f.strengths}</p>
                      </div>
                    )}
                    {f.improvements && (
                      <div className="bg-[#fff9ed] border border-[#fbe0af] p-2.5 rounded-lg text-[#975a16]">
                        <span className="font-bold text-[10px] uppercase tracking-wide block mb-0.5">Recommendations</span>
                        <p>{f.improvements}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
