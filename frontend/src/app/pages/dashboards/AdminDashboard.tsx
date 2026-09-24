import React, { useState, useEffect } from "react";
import { 
  ChevronLeft, ChevronRight, MoreHorizontal, ArrowUpRight, 
  Star, ChevronDown, CheckCircle, XCircle, ShieldAlert,
  Building2, Briefcase
} from "lucide-react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from "recharts";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1";

interface AdminDashboardProps {
  user: any;
  activities: any[];
  onAddActivity: (activity: any) => void;
}

/** Aggregate figures rendered on the administrator dashboard. */
interface AdminKpis {
  totalInterns: number;
  totalOrganizations: number;
  activeOrganizations: number;
  totalPlacements: number;
  activePlacements: number;
  pendingPlacements: number;
  completedPlacements: number;
  tasksTotal: number;
  tasksCompleted: number;
  tasksPending: number;
  attendanceRate: number;
  performanceScore: number;
}

/** One row of the intern roster table. */
interface RosterRow {
  name: string;
  ref: string;
  role: string;
  organization: string;
  start: string;
  end: string;
  status: string;
  ini: string;
  bg: string;
}

interface PerfPoint {
  month: string;
  score: number;
}

interface ProgramSlice {
  name: string;
  value: number;
  color: string;
}

// Demo values used only when the API is unreachable (mirrors the Nigerian seed).
const FALLBACK_KPIS: AdminKpis = {
  totalInterns: 8,
  totalOrganizations: 8,
  activeOrganizations: 6,
  totalPlacements: 8,
  activePlacements: 5,
  pendingPlacements: 1,
  completedPlacements: 1,
  tasksTotal: 37,
  tasksCompleted: 24,
  tasksPending: 2,
  attendanceRate: 88,
  performanceScore: 77,
};

const FALLBACK_ROSTER: RosterRow[] = [
  { name: "Adaeze Nwosu", ref: "#INT-200401045", role: "Backend Engineering Intern", organization: "Flutterwave Technology Solutions Ltd", start: "18 Jun 2026", end: "15 Dec 2026", status: "ACTIVE", ini: "AN", bg: "bg-emerald-500" },
  { name: "Oluwaseun Adeyemi", ref: "#INT-210203118", role: "Software Engineering Intern", organization: "Andela Nigeria", start: "26 Jun 2026", end: "23 Dec 2026", status: "ACTIVE", ini: "OA", bg: "bg-blue-500" },
  { name: "Tunde Balogun", ref: "#INT-190702233", role: "Mechanical Engineering Intern", organization: "Seplat Energy Plc", start: "10 Jun 2026", end: "07 Dec 2026", status: "ACTIVE", ini: "TB", bg: "bg-violet-500" },
  { name: "Chiamaka Obi", ref: "#INT-200803091", role: "Internal Audit Intern", organization: "Zenith Bank Plc", start: "14 Jul 2026", end: "10 Jan 2027", status: "ACTIVE", ini: "CO", bg: "bg-amber-500" },
  { name: "Ibrahim Musa", ref: "#INT-200105477", role: "Spectrum Management Intern", organization: "Nigerian Communications Commission (NCC)", start: "24 Jul 2026", end: "20 Jan 2027", status: "ACTIVE", ini: "IM", bg: "bg-pink-500" },
  { name: "Fatima Bello", ref: "#INT-190305862", role: "Corporate Affairs Intern", organization: "Nigerian Breweries Plc", start: "31 Mar 2026", end: "02 Sep 2026", status: "COMPLETED", ini: "FB", bg: "bg-teal-500" },
  { name: "Emeka Okafor", ref: "#INT-200604719", role: "QA Engineering Intern", organization: "Interswitch Group", start: "25 May 2026", end: "21 Nov 2026", status: "ON_HOLD", ini: "EO", bg: "bg-slate-500" },
  { name: "Zainab Yusuf", ref: "#INT-210409255", role: "Retail Banking Intern", organization: "Wema Bank Plc", start: "04 Oct 2026", end: "01 Feb 2027", status: "PENDING", ini: "ZY", bg: "bg-indigo-500" },
];

const FALLBACK_PERF: PerfPoint[] = [
  { month: "Apr", score: 74 },
  { month: "May", score: 76 },
  { month: "Jun", score: 79 },
  { month: "Jul", score: 81 },
  { month: "Aug", score: 84 },
  { month: "Sep", score: 87 },
];

const FALLBACK_PROGRAMS: ProgramSlice[] = [
  { name: "Software Eng", value: 2, color: "#16a34a" },
  { name: "Engineering Ops", value: 2, color: "#4ade80" },
  { name: "Finance & Audit", value: 2, color: "#86efac" },
  { name: "Telecom & Networks", value: 1, color: "#bbf7d0" },
];

const AVATAR_COLORS = ["bg-emerald-500", "bg-blue-500", "bg-violet-500", "bg-amber-500", "bg-pink-500", "bg-teal-500", "bg-indigo-500", "bg-slate-500"];

const initialsOf = (name: string): string =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join("")
    .toUpperCase();

const fmtDate = (value: string | null): string => {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
};

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ user, activities, onAddActivity }) => {

  // ── Live cohort data (falls back to the seeded demo snapshot offline) ──────
  const [kpis, setKpis] = useState<AdminKpis>(FALLBACK_KPIS);
  const [roster, setRoster] = useState<RosterRow[]>(FALLBACK_ROSTER);
  const [perfData, setPerfData] = useState<PerfPoint[]>(FALLBACK_PERF);
  const [programs, setPrograms] = useState<ProgramSlice[]>(FALLBACK_PROGRAMS);
  const [apiLive, setApiLive] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) return;
    const headers = { Authorization: `Bearer ${token}` };

    const load = async () => {
      try {
        const [internsRes, tasksRes, evalSummaryRes, evalListRes, orgRes, placeRes] = await Promise.all([
          fetch(`${API_BASE}/users?role=INTERN`, { headers }),
          fetch(`${API_BASE}/tasks/stats`, { headers }),
          fetch(`${API_BASE}/evaluations/summary`, { headers }),
          fetch(`${API_BASE}/evaluations?page=1&limit=100`, { headers }),
          fetch(`${API_BASE}/organizations?limit=100`, { headers }),
          fetch(`${API_BASE}/placements?page=1&limit=100`, { headers }),
        ]);

        if (![internsRes, tasksRes, evalSummaryRes, evalListRes, orgRes, placeRes].every((r) => r.ok)) {
          throw new Error("One or more admin endpoints rejected the request");
        }

        const [internsJson, tasksJson, evalSummaryJson, evalListJson, orgJson, placeJson] = await Promise.all([
          internsRes.json(),
          tasksRes.json(),
          evalSummaryRes.json(),
          evalListRes.json(),
          orgRes.json(),
          placeRes.json(),
        ]);

        const interns: any[] = internsJson.data || [];
        const tasks = tasksJson.data || {};
        const evalSummary = evalSummaryJson.data || {};
        const evaluations: any[] = evalListJson.data?.evaluations || [];
        const organizations: any[] = orgJson.data?.organizations || [];
        const placements: any[] = placeJson.data?.placements || [];

        // Placement status tallies
        const countByStatus = (status: string) => placements.filter((p) => p.status === status).length;
        const activePlacements = countByStatus("ACTIVE");

        // Attendance is stored 1-10 on the evaluation, displayed as a percentage
        const withAttendance = evaluations.filter((e) => typeof e.attendance === "number");
        const attendanceRate = withAttendance.length
          ? Math.round((withAttendance.reduce((sum, e) => sum + e.attendance, 0) / withAttendance.length) * 10)
          : FALLBACK_KPIS.attendanceRate;

        setKpis({
          totalInterns: interns.length,
          totalOrganizations: organizations.length,
          activeOrganizations:
            new Set(placements.filter((p) => p.status === "ACTIVE").map((p) => p.organizationId)).size ||
            FALLBACK_KPIS.activeOrganizations,
          totalPlacements: placements.length,
          activePlacements,
          pendingPlacements: countByStatus("PENDING"),
          completedPlacements: countByStatus("COMPLETED"),
          tasksTotal: tasks.total ?? FALLBACK_KPIS.tasksTotal,
          tasksCompleted: tasks.completed ?? FALLBACK_KPIS.tasksCompleted,
          tasksPending: tasks.pendingOverdue ?? FALLBACK_KPIS.tasksPending,
          attendanceRate,
          performanceScore:
            typeof evalSummary.averageScore === "number" ? evalSummary.averageScore : FALLBACK_KPIS.performanceScore,
        });

        // Intern roster built from placements (matric number comes from the profile)
        const profileById = new Map<string, any>();
        interns.forEach((i) => {
          if (i.internProfile) profileById.set(i.internProfile.id, i.internProfile);
        });

        if (placements.length) {
          setRoster(
            placements.map((p, index) => ({
              name: p.internName,
              ref: `#INT-${profileById.get(p.internId)?.matricNumber || "—"}`,
              role: p.role || "Intern",
              organization: p.organizationName,
              start: fmtDate(p.startDate),
              end: fmtDate(p.endDate),
              status: p.status,
              ini: initialsOf(p.internName) || "IN",
              bg: AVATAR_COLORS[index % AVATAR_COLORS.length],
            }))
          );
        }

        // Monthly average performance trend from evaluation records
        const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const buckets = new Map<number, number[]>();
        evaluations.forEach((e) => {
          if (typeof e.overallScore !== "number" || !e.createdAt) return;
          const d = new Date(e.createdAt);
          const key = d.getFullYear() * 12 + d.getMonth();
          buckets.set(key, [...(buckets.get(key) || []), e.overallScore]);
        });
        if (buckets.size >= 2) {
          setPerfData(
            [...buckets.entries()]
              .sort((a, b) => a[0] - b[0])
              .slice(-6)
              .map(([key, scores]) => ({
                month: MONTHS[key % 12],
                score: Math.round(scores.reduce((sum, s) => sum + s, 0) / scores.length),
              }))
          );
        }

        // Programme mix from the interns' departments
        const deptCounts = new Map<string, number>();
        interns.forEach((i) => {
          const dept = i.department || "Unassigned";
          deptCounts.set(dept, (deptCounts.get(dept) || 0) + 1);
        });
        if (deptCounts.size) {
          setPrograms(
            [...deptCounts.entries()]
              .sort((a, b) => b[1] - a[1])
              .slice(0, 4)
              .map(([name, value], index) => ({
                name,
                value,
                color: FALLBACK_PROGRAMS[index % FALLBACK_PROGRAMS.length].color,
              }))
          );
        }

        setApiLive(true);
      } catch (err) {
        console.warn("Admin dashboard: falling back to the seeded demo snapshot.", err);
      }
    };

    load();
  }, []);

  const statCards = [
    {
      label: "Total Interns",
      value: String(kpis.totalInterns),
      sub: `${kpis.activePlacements} on active placement · ${kpis.pendingPlacements} awaiting onboarding`,
      change: `${kpis.totalPlacements} placements`,
    },
    {
      label: "Attendance Rate",
      value: `${kpis.attendanceRate}%`,
      sub: "Weighted from supervisor evaluation attendance scores",
      change: apiLive ? "live" : "demo",
    },
    {
      label: "Tasks Completed",
      value: String(kpis.tasksCompleted),
      sub: `${kpis.tasksPending} deliverables still pending review`,
      change: `${kpis.tasksTotal} total logged`,
    },
    {
      label: "Performance Score",
      value: `${kpis.performanceScore}`,
      sub: "Average evaluation score across all interns",
      change: apiLive ? "live" : "demo",
    },
  ];

  const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"] as const;
  const SLOTS = [
    { time: "8:00AM",  Mon: 3, Tue: 4, Wed: 4, Thu: 3, Fri: 2 },
    { time: "9:00AM",  Mon: 4, Tue: 4, Wed: 4, Thu: 4, Fri: 4 },
    { time: "10:00AM", Mon: 4, Tue: 4, Wed: 4, Thu: 4, Fri: 4 },
    { time: "11:00AM", Mon: 3, Tue: 4, Wed: 4, Thu: 3, Fri: 3 },
    { time: "12:00PM", Mon: 2, Tue: 2, Wed: 2, Thu: 2, Fri: 2 },
    { time: "1:00PM",  Mon: 4, Tue: 3, Wed: 4, Thu: 4, Fri: 3 },
    { time: "2:00PM",  Mon: 4, Tue: 4, Wed: 3, Thu: 4, Fri: 3 },
    { time: "3:00PM",  Mon: 3, Tue: 4, Wed: 4, Thu: 3, Fri: 2 },
    { time: "4:00PM",  Mon: 2, Tue: 3, Wed: 3, Thu: 2, Fri: 1 },
  ];

  const heatCls = (v: number) =>
    v === 0 ? "bg-gray-100" :
    v === 1 ? "bg-emerald-100" :
    v === 2 ? "bg-emerald-200" :
    v === 3 ? "bg-emerald-400" : "bg-emerald-600";

  const CAL_WEEKS = [
    [null, null, 1, 2, 3, 4, 5],
    [6, 7, 8, 9, 10, 11, 12],
    [13, 14, 15, 16, 17, 18, 19],
    [20, 21, 22, 23, 24, 25, 26],
    [27, 28, 29, 30, null, null, null],
  ];
  
  const CAL_EVENTS: Record<number, { type: string; color: string }> = {
    5:  { type: "Mentor Meeting",       color: "bg-emerald-500" },
    8:  { type: "Submission Deadline",  color: "bg-red-400" },
    12: { type: "Training Session",     color: "bg-blue-400" },
    15: { type: "Evaluation",           color: "bg-purple-400" },
    19: { type: "Check-in",             color: "bg-teal-400" },
    22: { type: "Project Milestone",    color: "bg-amber-400" },
    26: { type: "Mentor Meeting",       color: "bg-emerald-500" },
  };

  const PROGRAMS = [
    { name: "Software Eng", value: 38, color: "#16a34a" },
    { name: "Product Design", value: 22, color: "#4ade80" },
    { name: "Data Analytics", value: 18, color: "#86efac" },
    { name: "Academic Research", value: 12, color: "#bbf7d0" },
  ];

  const EVENTS = [
    { tag: "Mentor Session", tagCls: "bg-emerald-100 text-emerald-700", title: "Weekly 1:1 — Adaeze Nwosu & Dr. Ngozi Eze", room: "Virtual Meet · 10:00 AM", avatars: ["AN","NE"] },
    { tag: "Mid-Term Evaluation", tagCls: "bg-amber-100 text-amber-700", title: "Performance Review — Engineering Cohort", room: "Evaluation Review Soon · 02:00 PM", avatars: ["AN","OA","TB"], highlight: true },
    { tag: "Program Meeting", tagCls: "bg-blue-100 text-blue-700", title: "Q3 SIWES Placement Kick-off Planning", room: "Conference Room A · 04:00 PM", avatars: ["MA","NE"] },
  ];

  const SATISFACTION = [
    { label: "Mentorship Quality", score: 4.6, pct: 92 },
    { label: "Program Structure", score: 4.2, pct: 84 },
    { label: "Work-Life Balance", score: 4.1, pct: 82 },
    { label: "Learning Opportunities", score: 4.5, pct: 90 },
  ];

  const TASKS = [
    { text: "Complete pre-session survey for the leadership track", tag: "Skills Development", tagCls: "bg-blue-50 text-blue-600", date: "18 Sep 2026" },
    { text: "Join the hybrid work compliance briefing", tag: "Workplace Engagement", tagCls: "bg-emerald-50 text-emerald-600", date: "19 Sep 2026" },
    { text: "Prepare Q3 evaluation planning materials", tag: "Talent Acquisition", tagCls: "bg-amber-50 text-amber-600", date: "24 Sep 2026" },
  ];

  // Demo registration queue awaiting administrator verification (no backend
  // endpoint yet — mirrors the accounts created during onboarding).
  const [registrations, setRegistrations] = useState([
    { email: "suleiman.sani@student.unilag.edu.ng", name: "Suleiman Sani", role: "INTERN", entity: "Data Analytics", date: "Just now" },
    { email: "chinedu.okeke@faculty.abu.edu.ng", name: "Chinedu Okeke", role: "SUPERVISOR", entity: "Product & UX Design", date: "10m ago" }
  ]);

  const handleApproveRegistration = (email: string, action: "Approve" | "Reject") => {
    const target = registrations.find(r => r.email === email);
    if (!target) return;

    setRegistrations(prev => prev.filter(r => r.email !== email));

    // Log this registration approval in activity feed
    onAddActivity({
      ini: "SA",
      bg: "bg-[#0f2d1e]",
      name: `Admin: ${(user?.firstName || "Admin").charAt(0)}. ${user?.lastName || ""}`.trim(),
      text: `${action.toLowerCase()}d user registration for ${target.name} (${target.role})`,
      time: "Just now"
    });
  };

  return (
    <div className="space-y-4">
      {/* ── Stat cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((c, i) => (
          <div key={i} className="bg-white rounded-xl border border-black/[0.07] shadow-sm p-4 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-gray-500 font-medium">{c.label}</span>
              <MoreHorizontal className="w-4 h-4 text-gray-400" />
            </div>
            <div className="flex items-end justify-between">
              <span className="text-[26px] font-semibold leading-none">{c.value}</span>
              <span className="flex items-center gap-0.5 text-[11px] font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                <ArrowUpRight className="w-3 h-3" />{c.change}
              </span>
            </div>
            <p className="text-[11px] text-gray-400 leading-snug">{c.sub}</p>
          </div>
        ))}
      </div>

      {/* Row 1.5: Admin Quick Access */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-black/[0.07] shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
                <Building2 className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-[13px] font-bold text-gray-800">Organizations</h4>
                <p className="text-[10px] text-gray-500">Manage partner organizations</p>
              </div>
            </div>
            <button
              onClick={() => window.location.hash = "organizations"}
              className="text-[11px] font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-0.5"
            >
              View All <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2 text-center">
            <div className="bg-gray-50 rounded-lg p-2">
              <p className="text-[10px] text-gray-500">Total</p>
              <p className="text-sm font-bold text-gray-800">{kpis.totalOrganizations}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-2">
              <p className="text-[10px] text-gray-500">Active</p>
              <p className="text-sm font-bold text-emerald-600">{kpis.activeOrganizations}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-2">
              <p className="text-[10px] text-gray-500">Placements</p>
              <p className="text-sm font-bold text-gray-800">{kpis.totalPlacements}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-black/[0.07] shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
                <Briefcase className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-[13px] font-bold text-gray-800">Placements</h4>
                <p className="text-[10px] text-gray-500">Manage intern assignments</p>
              </div>
            </div>
            <button
              onClick={() => window.location.hash = "placements"}
              className="text-[11px] font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-0.5"
            >
              View All <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2 text-center">
            <div className="bg-gray-50 rounded-lg p-2">
              <p className="text-[10px] text-gray-500">Active</p>
              <p className="text-sm font-bold text-emerald-600">{kpis.activePlacements}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-2">
              <p className="text-[10px] text-gray-500">Pending</p>
              <p className="text-sm font-bold text-amber-600">{kpis.pendingPlacements}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-2">
              <p className="text-[10px] text-gray-500">Completed</p>
              <p className="text-sm font-bold text-blue-600">{kpis.completedPlacements}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Row 1.5: Pending Registration Approvals (Real RBAC admin module) */}
      {registrations.length > 0 && (
        <div className="bg-amber-50/50 border border-amber-200/50 rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <ShieldAlert className="w-4 h-4 text-amber-600" />
            <h4 className="text-xs font-bold text-amber-800">Pending Registrations Verification ({registrations.length})</h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {registrations.map(r => (
              <div key={r.email} className="bg-white rounded-xl border border-amber-200/40 p-3 flex flex-wrap items-center justify-between gap-3 shadow-xs">
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-gray-800">{r.name}</span>
                    <span className="text-[9px] bg-slate-100 text-slate-600 px-1 rounded font-bold">{r.role}</span>
                  </div>
                  <p className="text-[10px] text-gray-400 break-anywhere">{r.email}</p>
                  <p className="text-[9.5px] text-gray-500 mt-1">Track/Dept: {r.entity}</p>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleApproveRegistration(r.email, "Reject")}
                    className="p-1.5 rounded-lg border border-red-200 hover:bg-red-50 text-red-600 transition-colors"
                    title="Reject Registration"
                  >
                    <XCircle className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleApproveRegistration(r.email, "Approve")}
                    className="p-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white transition-colors"
                    title="Approve Registration"
                  >
                    <CheckCircle className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Row 2 ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Calendar */}
        <div className="lg:col-span-4 bg-white rounded-xl border border-black/[0.07] p-4 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <h3 className="text-[13px] font-semibold text-gray-800">Intern Activity Calendar</h3>
            <div className="flex items-center gap-0.5">
              <button className="p-1 rounded hover:bg-gray-100"><ChevronLeft className="w-3.5 h-3.5 text-gray-400" /></button>
              <span className="text-[11px] font-medium px-1">September 2026</span>
              <button className="p-1 rounded hover:bg-gray-100"><ChevronRight className="w-3.5 h-3.5 text-gray-400" /></button>
            </div>
          </div>
          <div className="grid grid-cols-7 mb-1">
            {["S","M","T","W","T","F","S"].map((d, i) => (
              <div key={i} className="text-center text-[10px] text-gray-400 font-medium py-0.5">{d}</div>
            ))}
          </div>
          {CAL_WEEKS.map((week, wi) => (
            <div key={wi} className="grid grid-cols-7">
              {week.map((day, di) => {
                const evt = day ? CAL_EVENTS[day] : null;
                return (
                  <div key={di} className="flex flex-col items-center py-0.5">
                    {day ? (
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-medium cursor-pointer transition-colors
                        ${day === 22 ? "bg-emerald-600 text-white" : "hover:bg-gray-100"}`}>
                        {day}
                      </div>
                    ) : <div className="w-6 h-6" />}
                    {evt && <div className={`w-1.5 h-1.5 rounded-full mt-0.5 ${evt.color}`} />}
                  </div>
                );
              })}
            </div>
          ))}
          <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1">
            {[
              ["bg-emerald-500","Mentor Meeting"],
              ["bg-red-400","Submission"],
              ["bg-blue-400","Training"],
              ["bg-purple-400","Evaluation"],
              ["bg-teal-400","Check-in"],
              ["bg-amber-400","Milestone"],
            ].map(([c,l]) => (
              <div key={l} className="flex items-center gap-1">
                <div className={`w-1.5 h-1.5 rounded-full ${c}`} />
                <span className="text-[10px] text-gray-400">{l}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Attendance Heatmap */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-black/[0.07] p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[13px] font-semibold text-gray-800">Intern Attendance Report</h3>
            <div className="flex items-center gap-2">
              <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">This Month</span>
              <span className="text-[12px] font-bold text-emerald-600">92%</span>
              <span className="text-[10px] text-emerald-500">↑ +3.4%</span>
            </div>
          </div>
          <div className="flex gap-2">
            <div className="flex flex-col">
              <div className="h-4" />
              {SLOTS.map(s => (
                <div key={s.time} className="h-[18px] flex items-center">
                  <span className="text-[9.5px] text-gray-400 pr-1.5 whitespace-nowrap">{s.time}</span>
                </div>
              ))}
            </div>
            <div className="flex-1 min-w-0">
              <div className="grid grid-cols-5 gap-0.5 mb-0.5">
                {DAYS.map(d => <div key={d} className="text-center text-[10px] text-gray-400 font-medium">{d}</div>)}
              </div>
              {SLOTS.map(row => (
                <div key={row.time} className="grid grid-cols-5 gap-0.5 mb-0.5">
                  {DAYS.map(d => (
                    <div key={d} className={`h-[18px] rounded-sm ${heatCls(row[d as keyof typeof row] as number)}`} />
                  ))}
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-1 mt-2">
            <span className="text-[10px] text-gray-400">Less</span>
            {["bg-gray-100","bg-emerald-100","bg-emerald-200","bg-emerald-400","bg-emerald-600"].map(c => (
              <div key={c} className={`w-3.5 h-3.5 rounded-sm ${c}`} />
            ))}
            <span className="text-[10px] text-gray-400">More</span>
          </div>
        </div>

        {/* Performance chart */}
        <div className="lg:col-span-3 bg-white rounded-xl border border-black/[0.07] p-4 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-[13px] font-semibold text-gray-800">Team Performance</h3>
              <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">Last 6 Months</span>
            </div>
            <div className="mb-2">
              <span className="text-[24px] font-bold">87.4%</span>
              <span className="text-[11px] text-emerald-600 ml-1.5 font-medium">+4.8pts</span>
              <p className="text-[10px] text-gray-400">Improved vs last month</p>
            </div>
          </div>
          <div className="flex-1 min-h-[100px] mt-2">
            <ResponsiveContainer width="100%" height={110}>
              <LineChart data={perfData} margin={{ top: 4, right: 4, left: -28, bottom: 0 }}>
                <XAxis dataKey="month" tick={{ fontSize: 9 }} axisLine={false} tickLine={false} />
                <YAxis domain={[60,100]} tick={{ fontSize: 9 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ fontSize: 10, borderRadius: 8, padding: "4px 8px" }} />
                <Line type="monotone" dataKey="score" stroke="#16a34a" strokeWidth={2} dot={{ r: 3, fill: "#16a34a" }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ── Row 3 ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Upcoming events */}
        <div className="lg:col-span-4 bg-white rounded-xl border border-black/[0.07] p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[13px] font-semibold text-gray-800">Schedules</h3>
            <span className="text-[11px] text-emerald-600 font-medium flex items-center gap-0.5">21 Jun <ChevronDown className="w-3 h-3" /></span>
          </div>
          <div className="space-y-2.5">
            {EVENTS.map((e, i) => (
              <div key={i} className={`rounded-xl p-3 border ${e.highlight ? "border-amber-200 bg-amber-50/40" : "border-gray-100 bg-gray-50/60"}`}>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${e.tagCls}`}>{e.tag}</span>
                <p className="text-[12px] font-semibold mt-1.5 leading-snug">{e.title}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-[10px] text-gray-500">{e.room}</span>
                  <div className="flex -space-x-1.5">
                    {e.avatars.map((a, ai) => (
                      <div key={ai} className="w-5 h-5 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-[8px] text-white font-bold">{a}</div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Intern Satisfaction */}
        <div className="lg:col-span-4 bg-white rounded-xl border border-black/[0.07] p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-[13px] font-semibold text-gray-800">Intern Satisfaction</h3>
            <MoreHorizontal className="w-4 h-4 text-gray-400" />
          </div>
          <div className="flex items-center gap-4 mb-3">
            <span className="text-[34px] font-bold leading-none">78%</span>
            <div>
              <div className="flex gap-0.5">
                {[1,2,3,4,5].map(s => (
                  <Star key={s} className={`w-3.5 h-3.5 ${s <= 4 ? "text-amber-400 fill-amber-400" : "text-gray-300"}`} />
                ))}
                <span className="text-[11px] text-gray-500 ml-1">4.2/5</span>
              </div>
              <p className="text-[10px] text-emerald-600 font-medium mt-0.5">+6% from last survey</p>
            </div>
          </div>
          <div className="space-y-2.5">
            {SATISFACTION.map(r => (
              <div key={r.label}>
                <div className="flex justify-between mb-1">
                  <span className="text-[11px]">{r.label}</span>
                  <span className="text-[11px] text-gray-400">{r.score}/5</span>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full transition-all" style={{ width: `${r.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Program Distribution + Tasks */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <div className="bg-white rounded-xl border border-black/[0.07] p-4 shadow-sm flex-1">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-[13px] font-semibold text-gray-800">Program Distribution</h3>
              <MoreHorizontal className="w-4 h-4 text-gray-400" />
            </div>
            <div className="flex items-center gap-3 min-w-0">
              <PieChart width={80} height={80}>
                <Pie data={PROGRAMS} cx={36} cy={36} innerRadius={22} outerRadius={37} dataKey="value" strokeWidth={0}>
                  {programs.map((p, i) => <Cell key={i} fill={p.color} />)}
                </Pie>
              </PieChart>
              <div className="flex-1 min-w-0 space-y-1.5">
                {programs.map(p => (
                  <div key={p.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
                      <span className="text-[11px]">{p.name}</span>
                    </div>
                    <span className="text-[11px] text-gray-400">{p.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-black/[0.07] p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-[13px] font-semibold text-gray-800">Tasks</h3>
              <MoreHorizontal className="w-4 h-4 text-gray-400" />
            </div>
            <div className="space-y-3">
              {TASKS.map((t, i) => (
                <div key={i}>
                  <p className="text-[11.5px] leading-snug mb-1">{t.text}</p>
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${t.tagCls}`}>{t.tag}</span>
                    <span className="text-[10px] text-gray-400">{t.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Row 4: Attendance table + Activity feed ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-9 bg-white rounded-xl border border-black/[0.07] p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
              <h3 className="text-[13px] font-semibold text-gray-800">Intern Placements</h3>
              {[
                [String(kpis.activePlacements), "Active"],
                [String(kpis.pendingPlacements), "Pending"],
                [String(kpis.completedPlacements), "Completed"],
                [String(kpis.totalOrganizations), "Organizations"],
              ].map(([n, l]) => (
                <span key={l} className="text-[12px]"><b>{n}</b> <span className="text-gray-400 font-normal text-[11px]">{l}</span></span>
              ))}
            </div>
            <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">This Month</span>
          </div>
          <div className="overflow-x-auto scroll-x-contained">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="border-b border-gray-100">
                  {["Name", "Role", "Organization", "Start", "End", "Status"].map(h => (
                    <th key={h} className="text-left text-[10.5px] text-gray-400 font-medium pb-2 pr-3 first:pl-0">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {roster.map((r, i) => (
                  <tr key={i} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/60 transition-colors">
                    <td className="py-2.5 pr-3">
                      <div className="flex items-center gap-2">
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-white font-bold text-[10px] ${r.bg}`}>
                          {r.ini}
                        </span>
                        <div>
                          <p className="text-[12px] font-semibold leading-none">{r.name}</p>
                          <p className="text-[10px] text-gray-400 mt-0.5">{r.ref}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-2.5 pr-3 text-[11.5px] text-gray-700">{r.role}</td>
                    <td className="py-2.5 pr-3 text-[11.5px] text-gray-600">{r.organization}</td>
                    <td className="py-2.5 pr-3 text-[11.5px] text-gray-600">{r.start}</td>
                    <td className="py-2.5 pr-3 text-[11.5px] text-gray-600">{r.end}</td>
                    <td className="py-2.5">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        r.status === "ACTIVE"    ? "bg-emerald-100 text-emerald-700" :
                        r.status === "COMPLETED" ? "bg-blue-100 text-blue-700" :
                        r.status === "PENDING"   ? "bg-amber-100 text-amber-700" :
                        r.status === "ON_HOLD"   ? "bg-purple-100 text-purple-700" :
                        "bg-gray-100 text-gray-500"
                      }`}>{r.status.replace(/_/g, " ")}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="lg:col-span-3 bg-white rounded-xl border border-black/[0.07] p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[13px] font-semibold text-gray-800">Recent Activities</h3>
            <MoreHorizontal className="w-4 h-4 text-gray-400" />
          </div>
          <div className="space-y-4 max-h-[350px] overflow-y-auto pr-1">
            {activities.map((a, i) => (
              <div key={i} className="flex gap-2.5 items-start">
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-white font-bold text-[9px] shrink-0 ${a.bg}`}>
                  {a.ini}
                </span>
                <div>
                  <p className="text-[11.5px] leading-snug text-gray-700">
                    <span className="font-semibold text-gray-800">{a.name}</span> {a.text}
                  </p>
                  <p className="text-[9.5px] text-gray-400 mt-0.5">{a.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
