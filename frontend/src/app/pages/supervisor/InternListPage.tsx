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
} from "lucide-react";

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

  useEffect(() => {
    const fetchInterns = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const res = await fetch(`${API_BASE}/supervisor/interns`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed");
        const data = await res.json();
        if (data.success) setInterns(data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchInterns();
  }, []);

  const formatDate = (d: string | null) =>
    d ? new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short" }) : "—";

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Loader2 className="w-4 h-4 animate-spin text-emerald-500" />
          Loading interns...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <button onClick={() => onNavigate("Supervise")} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
          <ArrowLeft className="w-4 h-4 text-gray-600" />
        </button>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white">
            <Users className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-800">My Interns</h1>
            <p className="text-[11px] text-gray-500">{interns.length} assigned intern{interns.length !== 1 ? "s" : ""}</p>
          </div>
        </div>
      </div>

      {interns.length === 0 ? (
        <div className="bg-white rounded-xl border border-black/[0.07] p-8 shadow-sm text-center">
          <div className="w-10 h-10 mx-auto rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-500 mb-3">
            <Users className="w-5 h-5" />
          </div>
          <p className="text-sm font-semibold text-gray-800">No interns assigned</p>
          <p className="text-[11px] text-gray-500 mt-1">You don't have any interns assigned yet.</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {interns.map((intern) => (
            <div
              key={intern.id}
              onClick={() => onNavigate("Intern Progress", { internId: intern.userId })}
              className="bg-white rounded-xl border border-black/[0.07] p-4 shadow-sm hover:shadow-md transition-all cursor-pointer"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center text-white text-sm font-bold shrink-0">
                    {intern.firstName.charAt(0)}{intern.lastName.charAt(0)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-gray-800">{intern.firstName} {intern.lastName}</p>
                    <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-0.5 text-[10px] text-gray-500">
                      {intern.matricNumber && (
                        <span className="flex items-center gap-1">
                          <GraduationCap className="w-3 h-3" />{intern.matricNumber}
                        </span>
                      )}
                      {intern.organizationName && (
                        <span className="flex items-center gap-1">
                          <Building2 className="w-3 h-3" />{intern.organizationName}
                        </span>
                      )}
                      {intern.institution && <span>{intern.institution}</span>}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4 shrink-0">
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-800">{intern.totalLogs}</p>
                    <p className="text-[9px] text-gray-400 uppercase">Logs</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1">
                      {intern.submittedLogs > 0 && <Clock className="w-3 h-3 text-amber-500" />}
                      <p className="text-lg font-bold text-amber-600">{intern.submittedLogs}</p>
                    </div>
                    <p className="text-[9px] text-gray-400 uppercase">Pending</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1">
                      {intern.approvedLogs > 0 && <CheckCircle2 className="w-3 h-3 text-emerald-500" />}
                      <p className="text-lg font-bold text-emerald-600">{intern.approvedLogs}</p>
                    </div>
                    <p className="text-[9px] text-gray-400 uppercase">Done</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-300" />
                </div>
              </div>
              <div className="mt-2 text-[10px] text-gray-400 flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                Last activity: {formatDate(intern.lastActivity)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}