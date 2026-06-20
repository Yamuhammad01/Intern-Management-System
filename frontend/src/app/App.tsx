import { useState } from "react";
import {
  LayoutDashboard,
  Users,
  CalendarCheck,
  ClipboardList,
  TrendingUp,
  MessageSquare,
  BookOpen,
  BarChart2,
  Briefcase,
  Settings,
  Search,
  Bell,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Star,
  ArrowUpRight,
  Zap,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// ─── Data ────────────────────────────────────────────────────────────────────

const NAV = [
  { icon: LayoutDashboard, label: "Dashboard" },
  { icon: Users, label: "Interns" },
  { icon: CalendarCheck, label: "Attendance" },
  { icon: ClipboardList, label: "Tasks & Deliverables" },
  { icon: TrendingUp, label: "Performance Tracking" },
  { icon: MessageSquare, label: "Mentor Feedback" },
  { icon: BookOpen, label: "Learning Milestones" },
  { icon: BarChart2, label: "Reports" },
  { icon: Briefcase, label: "Internship Programs" },
  { icon: Settings, label: "Settings" },
];

const PERF_DATA = [
  { month: "Jan", score: 70 },
  { month: "Feb", score: 73 },
  { month: "Mar", score: 71 },
  { month: "Apr", score: 77 },
  { month: "May", score: 83 },
  { month: "Jun", score: 87 },
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
  [null,null,null, 1, 2, 3, 4],
  [5,   6,   7,   8, 9,10,11],
  [12, 13,  14,  15,16,17,18],
  [19, 20,  21,  22,23,24,25],
  [26, 27,  28,  29,30,null,null],
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
  { name: "Engineering",  value: 38, color: "#16a34a" },
  { name: "Design",       value: 22, color: "#4ade80" },
  { name: "Marketing",    value: 18, color: "#86efac" },
  { name: "Research",     value: 12, color: "#bbf7d0" },
];

const EVENTS = [
  {
    tag: "Mentor Session", tagCls: "bg-emerald-100 text-emerald-700",
    title: "Weekly 1:1 — Aria Chen & David Park",
    room: "Virtual Meet · 10:00 AM",
    avatars: ["AC","DP"],
    highlight: false,
  },
  {
    tag: "Mid-Term Evaluation", tagCls: "bg-amber-100 text-amber-700",
    title: "Performance Review — Design Cohort",
    room: "Evaluation Review Soon · 02:00 PM",
    avatars: ["LT","SG","PN"],
    highlight: true,
  },
  {
    tag: "Program Meeting", tagCls: "bg-blue-100 text-blue-700",
    title: "Q3 Internship Kick-off Planning",
    room: "Conference Room A · 04:00 PM",
    avatars: ["MW","AC"],
    highlight: false,
  },
];

const SATISFACTION = [
  { label: "Mentorship Quality",    score: 4.6, pct: 92 },
  { label: "Program Structure",     score: 4.2, pct: 84 },
  { label: "Work-Life Balance",     score: 4.1, pct: 82 },
  { label: "Learning Opportunities",score: 4.5, pct: 90 },
];

const TASKS = [
  { text: "Complete pre-session survey for leadership track",   tag: "Skills Development",  tagCls: "bg-blue-50 text-blue-600",   date: "14 Jun 2025" },
  { text: "Join Remote Work Compliance Briefing",               tag: "Workplace Engagement", tagCls: "bg-emerald-50 text-emerald-600", date: "14 Jun 2025" },
  { text: "Prepare Q2 evaluation planning materials",           tag: "Talent Acquisition",  tagCls: "bg-amber-50 text-amber-600", date: "15 Jun 2025" },
];

const INTERNS = [
  { name: "Aria Chen",    id: "#INT-2031", program: "Software Engineering", date: "08 Jun 2025", cin: "09:15 AM", cout: "06:00 PM", status: "On Time",  ini: "AC", bg: "bg-emerald-500" },
  { name: "Liam Torres",  id: "#INT-2032", program: "Product Design",       date: "08 Jun 2025", cin: "09:45 AM", cout: "05:30 PM", status: "Late",     ini: "LT", bg: "bg-blue-500" },
  { name: "Priya Nair",   id: "#INT-2033", program: "Data Analytics",       date: "08 Jun 2025", cin: "09:00 AM", cout: "06:00 PM", status: "On Time",  ini: "PN", bg: "bg-violet-500" },
  { name: "Marcus Webb",  id: "#INT-2034", program: "Marketing",            date: "08 Jun 2025", cin: "—",        cout: "—",        status: "On Leave", ini: "MW", bg: "bg-amber-500" },
  { name: "Sophie Grant", id: "#INT-2035", program: "Research",             date: "08 Jun 2025", cin: "09:10 AM", cout: "05:45 PM", status: "On Time",  ini: "SG", bg: "bg-pink-500" },
];

const ACTIVITIES = [
  { ini: "AC", bg: "bg-emerald-500", name: "Aria Chen",      text: "submitted the UI wireframes deliverable",              time: "16 Jun 2025 · 10:40 AM" },
  { ini: "DP", bg: "bg-blue-600",    name: "Mentor: D. Park",text: "left performance feedback for Liam Torres",             time: "16 Jun 2025 · 09:30 AM" },
  { ini: "SY", bg: "bg-gray-400",    name: "System",          text: "Evaluation reminder sent to all supervisors for Q2",   time: "15 Jun 2025 · 08:00 AM" },
];

// ─── Small components ─────────────────────────────────────────────────────────

function Chip({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${className}`}>{children}</span>;
}

function Ini({ s, bg, size = 6 }: { s: string; bg: string; size?: number }) {
  const sz = `w-${size} h-${size}`;
  const fs = size <= 5 ? "text-[9px]" : size <= 6 ? "text-[10px]" : "text-xs";
  return (
    <span className={`${sz} ${bg} rounded-full flex items-center justify-center text-white font-bold shrink-0 ${fs}`}>
      {s}
    </span>
  );
}

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white rounded-xl border border-black/[0.07] shadow-sm ${className}`}>
      {children}
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function App() {
  const [active, setActive] = useState("Dashboard");

  return (
    <div style={{ fontFamily: "Inter, system-ui, sans-serif" }} className="flex h-screen w-full overflow-hidden bg-[#f4f6f8] text-[#111827] text-sm">

      {/* ── Sidebar ── */}
      <aside className="w-[200px] shrink-0 flex flex-col bg-[#0f2d1e] text-[#d1fae5] overflow-y-auto">
        {/* Logo */}
        <div className="px-4 pt-5 pb-4 flex items-center gap-2 border-b border-white/[0.06]">
          <div className="w-7 h-7 rounded-lg bg-emerald-500 flex items-center justify-center">
            <Briefcase className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="text-white font-semibold text-sm tracking-tight">InternHub</span>
        </div>

        {/* Nav items */}
        <nav className="flex-1 px-2.5 py-3 space-y-0.5">
          {NAV.map(({ icon: Icon, label }) => (
            <button
              key={label}
              onClick={() => setActive(label)}
              className={`w-full flex items-center gap-2.5 px-2.5 py-[7px] rounded-lg text-[12.5px] font-medium transition-colors text-left ${
                active === label
                  ? "bg-emerald-600 text-white"
                  : "text-[#a7f3d0] hover:bg-white/[0.07] hover:text-white"
              }`}
            >
              <Icon className="w-[15px] h-[15px] shrink-0" />
              {label}
            </button>
          ))}
        </nav>

        {/* Promo card */}
        <div className="mx-2.5 mb-4 rounded-xl bg-emerald-900/50 p-3 border border-emerald-700/30">
          <div className="flex items-center gap-1.5 mb-1">
            <Zap className="w-3 h-3 text-emerald-300" />
            <p className="text-[11px] font-semibold text-emerald-200">Level Up Your System</p>
          </div>
          <p className="text-[10.5px] text-emerald-300/80 leading-snug mb-2.5">
            InternHub Pro gives you full control with advanced modules and extended layouts.
          </p>
          <button className="w-full bg-emerald-500 hover:bg-emerald-400 text-white text-[11px] font-semibold py-1.5 rounded-lg transition-colors">
            Get InternHub Pro
          </button>
        </div>
      </aside>

      {/* ── Main area ── */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Topbar */}
        <header className="h-[56px] bg-white border-b border-black/[0.07] flex items-center justify-between px-6 shrink-0">
          <div>
            <p className="text-[11px] text-gray-400">Hello, Coordinator</p>
            <p className="text-[15px] font-semibold text-[#111827] leading-tight">Good Morning</p>
          </div>
          <div className="flex items-center gap-2.5">
            <label className="flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-1.5 cursor-text">
              <Search className="w-3.5 h-3.5 text-gray-400" />
              <input className="bg-transparent text-xs outline-none w-36 placeholder:text-gray-400" placeholder="Search anything" />
            </label>
            <button className="relative p-1.5 rounded-lg hover:bg-gray-100">
              <Bell className="w-4 h-4 text-gray-500" />
              <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-red-500 rounded-full" />
            </button>
            <div className="flex items-center gap-2 cursor-pointer">
              <div className="w-7 h-7 rounded-full bg-emerald-600 flex items-center justify-center text-white text-[11px] font-bold">JL</div>
              <div>
                <p className="text-xs font-medium leading-none">Jamie Liu</p>
                <p className="text-[10px] text-gray-400 mt-0.5">Coordinator</p>
              </div>
              <ChevronDown className="w-3 h-3 text-gray-400" />
            </div>
          </div>
        </header>

        {/* Scrollable content */}
        <main className="flex-1 overflow-y-auto p-5 space-y-4">

          {/* ── Stat cards ── */}
          <div className="grid grid-cols-4 gap-4">
            {[
              { label: "Total Interns",     value: "128",   sub: "Active interns across all programs",  change: "+14% from last cohort",    pos: true },
              { label: "Attendance Rate",   value: "92%",   sub: "On-time check-ins this month: 91%",   change: "+3% vs prior month",       pos: true },
              { label: "Tasks Completed",   value: "347",   sub: "48 deliverables still pending",       change: "+22 this week",            pos: true },
              { label: "Performance Score", value: "87.4",  sub: "Average score across all interns",    change: "+4.8 pts vs last month",   pos: true },
            ].map(c => (
              <Card key={c.label} className="p-4 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-gray-500 font-medium">{c.label}</span>
                  <MoreHorizontal className="w-4 h-4 text-gray-400" />
                </div>
                <div className="flex items-end justify-between">
                  <span className="text-[26px] font-semibold leading-none">{c.value}</span>
                  <span className="flex items-center gap-0.5 text-[11px] font-medium text-emerald-600">
                    <ArrowUpRight className="w-3 h-3" />{c.change}
                  </span>
                </div>
                <p className="text-[11px] text-gray-400 leading-snug">{c.sub}</p>
              </Card>
            ))}
          </div>

          {/* ── Row 2 ── */}
          <div className="grid grid-cols-12 gap-4">

            {/* Calendar */}
            <Card className="col-span-4 p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-[13px] font-semibold">Intern Activity Calendar</h3>
                <div className="flex items-center gap-0.5">
                  <button className="p-1 rounded hover:bg-gray-100"><ChevronLeft className="w-3.5 h-3.5 text-gray-400" /></button>
                  <span className="text-[11px] font-medium px-1">June 2025</span>
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
                            ${day === 20 ? "bg-emerald-600 text-white" : "hover:bg-gray-100"}`}>
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
            </Card>

            {/* Attendance Heatmap */}
            <Card className="col-span-5 p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-[13px] font-semibold">Intern Attendance Report</h3>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">This Month</span>
                  <span className="text-[12px] font-bold text-emerald-600">92%</span>
                  <span className="text-[10px] text-emerald-500">↑ +3.4%</span>
                </div>
              </div>
              <div className="flex gap-2">
                {/* Time labels */}
                <div className="flex flex-col">
                  <div className="h-4" />
                  {SLOTS.map(s => (
                    <div key={s.time} className="h-[18px] flex items-center">
                      <span className="text-[9.5px] text-gray-400 pr-1.5 whitespace-nowrap">{s.time}</span>
                    </div>
                  ))}
                </div>
                {/* Grid */}
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
            </Card>

            {/* Performance chart */}
            <Card className="col-span-3 p-4 flex flex-col">
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-[13px] font-semibold">Team Performance</h3>
                <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">Last 6 Months</span>
              </div>
              <div className="mb-2">
                <span className="text-[24px] font-bold">87.4%</span>
                <span className="text-[11px] text-emerald-600 ml-1.5 font-medium">+4.8pts</span>
                <p className="text-[10px] text-gray-400">Improved vs last month</p>
              </div>
              <div className="flex-1 min-h-[100px]">
                <ResponsiveContainer width="100%" height={110}>
                  <LineChart data={PERF_DATA} margin={{ top: 4, right: 4, left: -28, bottom: 0 }}>
                    <XAxis dataKey="month" tick={{ fontSize: 9 }} axisLine={false} tickLine={false} />
                    <YAxis domain={[60,100]} tick={{ fontSize: 9 }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ fontSize: 10, borderRadius: 8, border: "1px solid #e5e7eb", padding: "4px 8px" }} />
                    <Line type="monotone" dataKey="score" stroke="#16a34a" strokeWidth={2} dot={{ r: 3, fill: "#16a34a" }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>

          {/* ── Row 3 ── */}
          <div className="grid grid-cols-12 gap-4">

            {/* Upcoming events */}
            <Card className="col-span-4 p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-[13px] font-semibold">Schedules</h3>
                <span className="text-[11px] text-emerald-600 font-medium flex items-center gap-0.5">21 Jun <ChevronDown className="w-3 h-3" /></span>
              </div>
              <div className="space-y-2.5">
                {EVENTS.map((e, i) => (
                  <div key={i} className={`rounded-xl p-3 border ${e.highlight ? "border-amber-200 bg-amber-50/40" : "border-gray-100 bg-gray-50/60"}`}>
                    <Chip className={e.tagCls}>{e.tag}</Chip>
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
            </Card>

            {/* Intern Satisfaction */}
            <Card className="col-span-4 p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-[13px] font-semibold">Intern Satisfaction</h3>
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
            </Card>

            {/* Program Distribution + Tasks */}
            <div className="col-span-4 flex flex-col gap-4">
              <Card className="p-4 flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-[13px] font-semibold">Program Distribution</h3>
                  <MoreHorizontal className="w-4 h-4 text-gray-400" />
                </div>
                <div className="flex items-center gap-3">
                  <PieChart width={80} height={80}>
                    <Pie data={PROGRAMS} cx={36} cy={36} innerRadius={22} outerRadius={37} dataKey="value" strokeWidth={0}>
                      {PROGRAMS.map((p, i) => <Cell key={i} fill={p.color} />)}
                    </Pie>
                  </PieChart>
                  <div className="flex-1 space-y-1.5">
                    {PROGRAMS.map(p => (
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
              </Card>

              <Card className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-[13px] font-semibold">Tasks</h3>
                  <MoreHorizontal className="w-4 h-4 text-gray-400" />
                </div>
                <div className="space-y-3">
                  {TASKS.map((t, i) => (
                    <div key={i}>
                      <p className="text-[11.5px] leading-snug mb-1">{t.text}</p>
                      <div className="flex items-center justify-between">
                        <Chip className={t.tagCls}>{t.tag}</Chip>
                        <span className="text-[10px] text-gray-400">{t.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>

          {/* ── Row 4: Attendance table + Activity feed ── */}
          <div className="grid grid-cols-12 gap-4">
            <Card className="col-span-9 p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-5">
                  <h3 className="text-[13px] font-semibold">Intern Attendance</h3>
                  {[["82","On Time"],["11","Late"],["6","On Leave"],["3","Absent"]].map(([n,l]) => (
                    <span key={l} className="text-[12px]"><b>{n}</b> <span className="text-gray-400 font-normal text-[11px]">{l}</span></span>
                  ))}
                </div>
                <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">This Month</span>
              </div>
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    {["Name","Program","Date","Check In","Check Out","Status"].map(h => (
                      <th key={h} className="text-left text-[10.5px] text-gray-400 font-medium pb-2 pr-3 first:pl-0">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {INTERNS.map((r, i) => (
                    <tr key={i} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/60 transition-colors">
                      <td className="py-2.5 pr-3">
                        <div className="flex items-center gap-2">
                          <Ini s={r.ini} bg={r.bg} size={6} />
                          <div>
                            <p className="text-[12px] font-medium leading-none">{r.name}</p>
                            <p className="text-[10px] text-gray-400 mt-0.5">{r.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-2.5 pr-3 text-[11.5px]">{r.program}</td>
                      <td className="py-2.5 pr-3 text-[11.5px]">{r.date}</td>
                      <td className="py-2.5 pr-3 text-[11.5px]">{r.cin}</td>
                      <td className="py-2.5 pr-3 text-[11.5px]">{r.cout}</td>
                      <td className="py-2.5">
                        <Chip className={
                          r.status === "On Time" ? "bg-emerald-100 text-emerald-700" :
                          r.status === "Late"    ? "bg-red-100 text-red-600" :
                          "bg-gray-100 text-gray-500"
                        }>{r.status}</Chip>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>

            <Card className="col-span-3 p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-[13px] font-semibold">Recent Activities</h3>
                <MoreHorizontal className="w-4 h-4 text-gray-400" />
              </div>
              <div className="space-y-4">
                {ACTIVITIES.map((a, i) => (
                  <div key={i} className="flex gap-2.5">
                    <Ini s={a.ini} bg={a.bg} size={6} />
                    <div>
                      <p className="text-[11.5px] leading-snug">
                        <span className="font-semibold">{a.name}</span> {a.text}
                      </p>
                      <p className="text-[10px] text-gray-400 mt-0.5">{a.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between text-[10px] text-gray-400 pb-2">
            <span>Copyright © 2025 InternHub — Privacy Policy · Terms and Conditions · Contact</span>
            <div className="flex gap-3">
              {["X","LinkedIn","GitHub","Instagram"].map(s => (
                <span key={s} className="hover:text-gray-600 cursor-pointer transition-colors">{s}</span>
              ))}
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}
