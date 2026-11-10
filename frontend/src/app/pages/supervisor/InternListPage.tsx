import { useState, useEffect } from "react";
import {
  Users,
  ArrowLeft,
  ClipboardList,
  Clock,
  CheckCircle2,
  ChevronRight,
  Loader2,
  GraduationCap,
  Building2,
  Calendar,
  Search,
  Award,
} from "lucide-react";
import { Button } from "../../components/ui/button";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

interface AssignedIntern {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  matricNumber: string | null;
  institution: string | null;
  organizationName: string | null;
  totalLogs: number;
  submittedLogs: number;
  approvedLogs: number;
  lastActivity: string | null;
}

interface InternListPageProps {
  onNavigate: (tab: string, params?: any) => void;
}

export function InternListPage({ onNavigate }: InternListPageProps) {
  const [interns, setInterns] = useState<AssignedIntern[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchInterns = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("accessToken");
        const res = await fetch(`${API_BASE}/supervisor/interns`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch assigned interns");
        const data = await res.json();
        if (data.success) setInterns(data.data || []);
      } catch {
        // Fallback for demo
        setInterns([
          {
            id: "int-1",
            userId: "u-1",
            firstName: "Adaeze",
            lastName: "Nwosu",
            email: "adaeze@internhub.com",
            matricNumber: "200401045",
            institution: "University of Lagos",
            organizationName: "Flutterwave Technology Solutions",
            totalLogs: 14,
            submittedLogs: 1,
            approvedLogs: 12,
            lastActivity: new Date().toISOString(),
          },
          {
            id: "int-2",
            userId: "u-2",
            firstName: "Oluwaseun",
            lastName: "Adeyemi",
            email: "seun@internhub.com",
            matricNumber: "210203118",
            institution: "Covenant University",
            organizationName: "Andela Nigeria",
            totalLogs: 12,
            submittedLogs: 2,
            approvedLogs: 9,
            lastActivity: new Date(Date.now() - 86400000).toISOString(),
          },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchInterns();
  }, []);

  const formatDate = (d: string | null) =>
    d ? new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short" }) : "—";

  const filtered = interns.filter((i) =>
    `${i.firstName} ${i.lastName} ${i.email} ${i.organizationName || ""}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

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
            <h1 className="text-lg font-bold text-[#183348]">Assigned Interns</h1>
            <p className="text-xs text-[#607b91]">Active students under your direct mentorship and evaluation</p>
          </div>
        </div>

        <span className="text-xs font-semibold text-[#1c647e] bg-[#e6f4f8] border border-[#c4e4ee] px-3 py-1 rounded-full">
          {interns.length} Placed Interns
        </span>
      </div>

      {/* ── Search Bar ── */}
      <div className="bg-white rounded-2xl border border-[#d8e5ee] p-4 shadow-xs">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-[#2eb4d6] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by student name, email, matriculation, or host company..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#f8fafc] border border-[#d7e4ed] rounded-xl pl-10 pr-4 py-2 text-xs text-[#183348] placeholder:text-[#8ea5b6] outline-none focus:bg-white focus:border-[#2eb4d6] focus:ring-2 focus:ring-[#2eb4d6]/20 transition-all"
          />
        </div>
      </div>

      {/* ── Interns Grid ── */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-[#2eb4d6]" />
          <span className="text-xs text-[#607b91] font-medium">Loading intern roster...</span>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#d8e5ee] p-14 text-center flex flex-col items-center">
          <div className="w-14 h-14 rounded-2xl bg-[#e6f4f8] text-[#1c647e] flex items-center justify-center mb-3">
            <Users className="w-7 h-7" />
          </div>
          <p className="text-sm font-bold text-[#183348]">No assigned interns found</p>
          <p className="text-xs text-[#607b91] mt-1 max-w-sm">
            {search ? "No students match your query." : "You do not have any active intern placements assigned."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((intern) => {
            const approvalPct = intern.totalLogs > 0 ? Math.round((intern.approvedLogs / intern.totalLogs) * 100) : 0;
            return (
              <div
                key={intern.id}
                className="bg-white rounded-2xl border border-[#d8e5ee] p-5 shadow-xs hover:border-[#2eb4d6] transition-all space-y-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-11 h-11 rounded-full bg-gradient-ip-teal text-white flex items-center justify-center text-sm font-bold shadow-2xs shrink-0">
                      {intern.firstName.charAt(0)}{intern.lastName.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-[#183348] truncate">
                        {intern.firstName} {intern.lastName}
                      </p>
                      <p className="text-xs text-[#607b91] truncate">{intern.email}</p>
                      {intern.institution && (
                        <p className="text-[10.5px] text-[#718c9f] mt-0.5">{intern.institution}</p>
                      )}
                    </div>
                  </div>

                  {intern.organizationName && (
                    <span className="text-[10px] font-semibold text-[#1c647e] bg-[#e6f4f8] border border-[#c4e4ee] px-2.5 py-1 rounded-full shrink-0 truncate max-w-[140px]">
                      {intern.organizationName}
                    </span>
                  )}
                </div>

                {/* Progress bar */}
                <div className="space-y-1.5 pt-2 border-t border-[#eef4f8]">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#607b91]">Logbook Progress: <b>{intern.approvedLogs}/{intern.totalLogs} verified</b></span>
                    <span className="font-bold text-[#265275]">{approvalPct}%</span>
                  </div>
                  <div className="w-full bg-[#e8f1f6] rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-[#2eb4d6] to-[#265275] h-2 rounded-full"
                      style={{ width: `${approvalPct}%` }}
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-2">
                  <span className="text-[10.5px] text-[#718c9f]">
                    Last active: {formatDate(intern.lastActivity)}
                  </span>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onNavigate("Intern Progress", { internId: intern.id })}
                      className="text-xs border-[#d8e5ee] text-[#265275]"
                    >
                      Progress Deep-dive
                    </Button>
                    <Button
                      variant="cyan"
                      size="sm"
                      onClick={() => onNavigate("New Evaluation", { internId: intern.id })}
                      className="text-xs text-white"
                    >
                      Evaluate
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
