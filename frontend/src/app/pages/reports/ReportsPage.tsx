import React, { useState } from "react";
import {
  LayoutDashboard, Users, CalendarCheck, ClipboardList, TrendingUp,
  MessageSquare, BookOpen, BarChart2, Briefcase, Settings, Search,
  Bell, ChevronDown, ChevronLeft, ChevronRight, MoreHorizontal, Star,
  ArrowUpRight, Zap, FileText, Download, Printer, Filter, Eye,
  CheckSquare, Square, X, Calendar, Building2, User, RefreshCw,
  Clock, GraduationCap, Award, ArrowLeft, Plus, Layers, Activity,
  ChevronRight as ChevronR, Check, FileDown, SlidersHorizontal,
  TrendingDown, AlertTriangle,
} from "lucide-react";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, CartesianGrid, Legend,
} from "recharts";

// ─── Types ────────────────────────────────────────────────────────────────────
type ReportView = "overview" | "filters" | "preview" | "export";
type ReportType = "intern" | "performance" | "organization";

// ─── Shared primitives ────────────────────────────────────────────────────────
function Card({ children, className = "", onClick }: { children: React.ReactNode; className?: string; onClick?: () => void }) {
  return (
    <div onClick={onClick} className={`bg-white rounded-xl border border-black/[0.07] shadow-sm ${className}`}>
      {children}
    </div>
  );
}

function Chip({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${className}`}>{children}</span>;
}

function Ini({ s, bg, size = 6 }: { s: string; bg: string; size?: number }) {
  return (
    <span className={`w-${size} h-${size} ${bg} rounded-full flex items-center justify-center text-white font-bold shrink-0 ${size <= 6 ? "text-[10px]" : "text-xs"}`}>
      {s}
    </span>
  );
}

// ─── Report data ──────────────────────────────────────────────────────────────
const REPORT_PERF = [
  {month:"Jan",Engineering:68,Design:72,Marketing:65,Research:70},
  {month:"Feb",Engineering:71,Design:74,Marketing:68,Research:73},
  {month:"Mar",Engineering:70,Design:71,Marketing:67,Research:72},
  {month:"Apr",Engineering:76,Design:78,Marketing:72,Research:77},
  {month:"May",Engineering:82,Design:84,Marketing:78,Research:80},
  {month:"Jun",Engineering:87,Design:89,Marketing:82,Research:85},
];
const ATTENDANCE_TREND = [
  {week:"W1",rate:88},{week:"W2",rate:91},{week:"W3",rate:89},{week:"W4",rate:94},
  {week:"W5",rate:92},{week:"W6",rate:95},{week:"W7",rate:93},{week:"W8",rate:96},
];
const TASK_COMPLETION = [
  {program:"Engineering",completed:84,pending:16},{program:"Design",completed:78,pending:22},
  {program:"Marketing",completed:71,pending:29},{program:"Research",completed:88,pending:12},
];
const REPORT_INTERNS = [
  {name:"Aria Chen",   id:"#INT-2031",program:"Software Eng.",mentor:"David Park",attendance:96,score:91,tasks:"12/13",status:"Excellent",ini:"AC",bg:"bg-emerald-500"},
  {name:"Liam Torres", id:"#INT-2032",program:"Product Design",mentor:"Sarah Kim",  attendance:88,score:84,tasks:"9/11", status:"Good",     ini:"LT",bg:"bg-blue-500"},
  {name:"Priya Nair",  id:"#INT-2033",program:"Data Analytics",mentor:"James Wu",   attendance:97,score:93,tasks:"14/14",status:"Excellent",ini:"PN",bg:"bg-violet-500"},
  {name:"Marcus Webb", id:"#INT-2034",program:"Marketing",      mentor:"Lisa Chen",  attendance:72,score:76,tasks:"7/12", status:"At Risk",  ini:"MW",bg:"bg-amber-500"},
  {name:"Sophie Grant",id:"#INT-2035",program:"Research",       mentor:"Tom Reed",   attendance:94,score:88,tasks:"11/12",status:"Good",     ini:"SG",bg:"bg-pink-500"},
];
const RECENT_REPORTS = [
  {name:"Q2 2025 Intern Performance Summary",type:"Performance",generated:"15 Jun 2025",by:"Jamie Liu",size:"2.4 MB",status:"Ready"},
  {name:"May 2025 Attendance Report",        type:"Attendance", generated:"01 Jun 2025",by:"System",   size:"1.1 MB",status:"Ready"},
  {name:"Spring Cohort Intern Overview",     type:"Intern",     generated:"28 May 2025",by:"Jamie Liu",size:"3.2 MB",status:"Ready"},
  {name:"Organization Program Analysis",     type:"Organization",generated:"20 May 2025",by:"Admin",   size:"4.8 MB",status:"Ready"},
  {name:"April Performance Scorecard",       type:"Performance",generated:"01 May 2025",by:"System",   size:"2.1 MB",status:"Archived"},
];
const ORG_STATS = [
  {dept:"Engineering",interns:38,avgScore:87,completion:84,risk:2},
  {dept:"Product Design",interns:22,avgScore:84,completion:78,risk:3},
  {dept:"Marketing",interns:18,avgScore:76,completion:71,risk:5},
  {dept:"Research",interns:12,avgScore:88,completion:88,risk:1},
];

// ─── Breadcrumb ───────────────────────────────────────────────────────────────
function Breadcrumb({ crumbs, onNav }: { crumbs: {label:string;action?:()=>void}[]; onNav?: ()=>void }) {
  return (
    <div className="flex items-center gap-1.5 text-[12px] text-gray-500 mb-5">
      {crumbs.map((c, i) => (
        <div key={i} className="flex items-center gap-1.5">
          {i > 0 && <ChevronR className="w-3 h-3 text-gray-400" />}
          {c.action
            ? <button onClick={c.action} className="hover:text-emerald-700 transition-colors font-medium">{c.label}</button>
            : <span className={i===crumbs.length-1?"text-[#111827] font-semibold":""}>{c.label}</span>
          }
        </div>
      ))}
    </div>
  );
}

// ─── SCREEN 1: Reports Overview ───────────────────────────────────────────────
function ReportsOverview({ onGenerate }: { onGenerate: (t: ReportType) => void }) {
  const typeStatusCls = (t: string) =>
    t==="Performance"?"bg-purple-100 text-purple-700":
    t==="Attendance"?"bg-blue-100 text-blue-700":
    t==="Intern"?"bg-emerald-100 text-emerald-700":
    "bg-amber-100 text-amber-700";

  return (
    <main className="flex-1 overflow-y-auto p-6 space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[20px] font-bold text-[#0f2d1e]">Reports</h1>
          <p className="text-[12.5px] text-gray-500 mt-0.5">Generate, preview, and export professional reports for your internship programs.</p>
        </div>
        <button onClick={() => onGenerate("intern")}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-[13px] font-semibold rounded-xl shadow-sm transition-colors">
          <Plus className="w-4 h-4" />New Report
        </button>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          {icon:FileText,  label:"Reports Generated", value:"47",  sub:"This quarter",       color:"bg-emerald-50 text-emerald-600"},
          {icon:Download,  label:"Total Exports",      value:"183", sub:"Across all formats", color:"bg-blue-50 text-blue-600"},
          {icon:Clock,     label:"Last Generated",     value:"2h",  sub:"ago by Jamie Liu",   color:"bg-amber-50 text-amber-600"},
          {icon:Activity,  label:"Scheduled Reports",  value:"5",   sub:"Auto-generating",    color:"bg-purple-50 text-purple-600"},
        ].map(s => (
          <Card key={s.label} className="p-4 flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl ${s.color} flex items-center justify-center shrink-0`}>
              <s.icon className="w-4.5 h-4.5" />
            </div>
            <div>
              <p className="text-[11px] text-gray-500 font-medium">{s.label}</p>
              <div className="flex items-baseline gap-1.5">
                <span className="text-[20px] font-bold text-[#111827] leading-none">{s.value}</span>
                <span className="text-[10.5px] text-gray-400">{s.sub}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Report type cards */}
      <div>
        <h2 className="text-[14px] font-semibold text-[#111827] mb-3">Generate a Report</h2>
        <div className="grid grid-cols-3 gap-4">
          {[
            {
              type:"intern" as ReportType,
              icon:Users, iconBg:"bg-emerald-500",
              title:"Intern Report",
              desc:"Comprehensive profile of each intern including attendance, task completion, performance scores, and mentor feedback.",
              includes:["Individual scorecards","Attendance breakdown","Task completion rate","Mentor feedback summary"],
              lastRun:"28 May 2025",badge:"Most Used",badgeCls:"bg-emerald-100 text-emerald-700",
            },
            {
              type:"performance" as ReportType,
              icon:TrendingUp, iconBg:"bg-purple-500",
              title:"Performance Report",
              desc:"Aggregate performance analytics across cohorts, programs, and time periods with trend analysis.",
              includes:["Score trends by program","Top & at-risk interns","Goal completion rates","Comparative benchmarks"],
              lastRun:"15 Jun 2025",badge:"Recently Used",badgeCls:"bg-purple-100 text-purple-700",
            },
            {
              type:"organization" as ReportType,
              icon:Building2, iconBg:"bg-blue-500",
              title:"Organization Report",
              desc:"Department-level overview of internship program health, resource utilization, and outcomes by team.",
              includes:["Department breakdown","Supervisor effectiveness","Program ROI metrics","Cohort comparison"],
              lastRun:"20 May 2025",badge:"Executive View",badgeCls:"bg-blue-100 text-blue-700",
            },
          ].map(r => (
            <Card key={r.type} className="p-5 flex flex-col hover:shadow-md transition-shadow cursor-pointer group" onClick={() => onGenerate(r.type)}>
              <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 ${r.iconBg} rounded-xl flex items-center justify-center shadow-sm`}>
                  <r.icon className="w-5 h-5 text-white" />
                </div>
                <Chip className={r.badgeCls}>{r.badge}</Chip>
              </div>
              <h3 className="text-[14px] font-bold text-[#111827] mb-1.5">{r.title}</h3>
              <p className="text-[12px] text-gray-500 leading-relaxed mb-4 flex-1">{r.desc}</p>
              <div className="space-y-1.5 mb-4">
                {r.includes.map(inc => (
                  <div key={inc} className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span className="text-[11.5px] text-gray-600">{inc}</span>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <span className="text-[10.5px] text-gray-400">Last run: {r.lastRun}</span>
                <button className="flex items-center gap-1.5 text-[12px] font-semibold text-emerald-600 group-hover:text-emerald-700 transition-colors">
                  Generate <ChevronR className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent reports table */}
      <Card className="p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[14px] font-semibold text-[#111827]">Recent Reports</h2>
          <button className="text-[12px] text-emerald-600 font-medium hover:underline">View all</button>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              {["Report Name","Type","Generated","By","Size","Status","Actions"].map(h => (
                <th key={h} className="text-left text-[10.5px] text-gray-400 font-semibold pb-2.5 pr-4">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {RECENT_REPORTS.map((r,i) => (
              <tr key={i} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                <td className="py-3 pr-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                      <FileText className="w-3.5 h-3.5 text-gray-500" />
                    </div>
                    <span className="text-[12.5px] font-medium text-[#111827]">{r.name}</span>
                  </div>
                </td>
                <td className="py-3 pr-4"><Chip className={typeStatusCls(r.type)}>{r.type}</Chip></td>
                <td className="py-3 pr-4 text-[12px] text-gray-600">{r.generated}</td>
                <td className="py-3 pr-4 text-[12px] text-gray-600">{r.by}</td>
                <td className="py-3 pr-4 text-[12px] text-gray-400">{r.size}</td>
                <td className="py-3 pr-4">
                  <Chip className={r.status==="Ready"?"bg-emerald-100 text-emerald-700":"bg-gray-100 text-gray-500"}>{r.status}</Chip>
                </td>
                <td className="py-3">
                  <div className="flex items-center gap-1">
                    <button className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors" title="Preview">
                      <Eye className="w-3.5 h-3.5 text-gray-500" />
                    </button>
                    <button className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors" title="Download">
                      <Download className="w-3.5 h-3.5 text-gray-500" />
                    </button>
                    <button className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors" title="Print">
                      <Printer className="w-3.5 h-3.5 text-gray-500" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </main>
  );
}

// ─── SCREEN 2: Report Filters ─────────────────────────────────────────────────
function ReportFilters({
  reportType, setReportType, onBack, onPreview,
}: {
  reportType: ReportType; setReportType: (t:ReportType)=>void;
  onBack: ()=>void; onPreview: ()=>void;
}) {
  const [dateFrom, setDateFrom] = useState("2025-01-01");
  const [dateTo,   setDateTo]   = useState("2025-06-30");
  const [programs, setPrograms] = useState(["Engineering","Design","Marketing","Research"]);
  const [groupBy,  setGroupBy]  = useState("Program");
  const [metrics,  setMetrics]  = useState(["Attendance","Performance","Tasks","Feedback"]);

  const toggleProg = (p: string) =>
    setPrograms(prev => prev.includes(p) ? prev.filter(x=>x!==p) : [...prev, p]);
  const toggleMetric = (m: string) =>
    setMetrics(prev => prev.includes(m) ? prev.filter(x=>x!==m) : [...prev, m]);

  const sections: Record<ReportType,string[]> = {
    intern:["Executive Summary","Individual Scorecards","Attendance Breakdown","Task Completion","Mentor Feedback","Skills Assessment"],
    performance:["Executive Summary","Performance Trends","Program Comparison","Top Performers","At-Risk Interns","Goal Achievement"],
    organization:["Executive Summary","Department Overview","Supervisor Effectiveness","Program ROI","Cohort Comparison","Recommendations"],
  };

  return (
    <main className="flex-1 overflow-hidden flex flex-col">
      {/* Sub-topbar */}
      <div className="bg-white border-b border-gray-100 px-6 py-3 flex items-center justify-between shrink-0">
        <Breadcrumb crumbs={[{label:"Reports",action:onBack},{label:"Configure Filters"}]} />
        <div className="flex items-center gap-2.5">
          <button onClick={onBack} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-[12.5px] font-medium text-gray-600 hover:bg-gray-50 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" />Back
          </button>
          <button onClick={onPreview}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[12.5px] font-semibold transition-colors">
            <Eye className="w-3.5 h-3.5" />Preview Report
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden flex gap-0">
        {/* ── Filter panel ── */}
        <div className="w-[300px] shrink-0 bg-white border-r border-gray-100 overflow-y-auto p-5 space-y-6">
          <div>
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-3">Report Type</p>
            <div className="space-y-1.5">
              {([["intern","Intern Report","Users"],["performance","Performance Report","TrendingUp"],["organization","Organization Report","Building2"]] as const).map(([t,l]) => (
                <button key={t} onClick={() => setReportType(t)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl border text-left transition-all text-[12.5px] font-medium
                    ${reportType===t?"border-emerald-500 bg-emerald-50 text-emerald-700":"border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50"}`}>
                  <div className={`w-5 h-5 rounded-md flex items-center justify-center ${reportType===t?"bg-emerald-500":"bg-gray-200"}`}>
                    {t==="intern"&&<Users className="w-3 h-3 text-white"/>}
                    {t==="performance"&&<TrendingUp className="w-3 h-3 text-white"/>}
                    {t==="organization"&&<Building2 className="w-3 h-3 text-white"/>}
                  </div>
                  {l}
                  {reportType===t&&<Check className="w-3.5 h-3.5 ml-auto text-emerald-600"/>}
                </button>
              ))}
            </div>
          </div>

          <div className="h-px bg-gray-100" />

          <div>
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-3">Date Range</p>
            <div className="space-y-2.5">
              <div>
                <label className="text-[11.5px] font-medium text-gray-600 mb-1 block">From</label>
                <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2 focus-within:border-emerald-400">
                  <Calendar className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                  <input type="date" value={dateFrom} onChange={e=>setDateFrom(e.target.value)}
                    className="flex-1 text-[12px] outline-none text-gray-700 bg-transparent" />
                </div>
              </div>
              <div>
                <label className="text-[11.5px] font-medium text-gray-600 mb-1 block">To</label>
                <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2 focus-within:border-emerald-400">
                  <Calendar className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                  <input type="date" value={dateTo} onChange={e=>setDateTo(e.target.value)}
                    className="flex-1 text-[12px] outline-none text-gray-700 bg-transparent" />
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {["This Month","Last Quarter","This Year","Custom"].map(p => (
                  <button key={p} className="px-2.5 py-1 rounded-lg border border-gray-200 text-[10.5px] font-medium text-gray-600 hover:border-emerald-400 hover:text-emerald-600 transition-colors">{p}</button>
                ))}
              </div>
            </div>
          </div>

          <div className="h-px bg-gray-100" />

          <div>
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-3">Programs</p>
            <div className="space-y-2">
              {["Engineering","Design","Marketing","Research"].map(p => (
                <label key={p} className="flex items-center gap-2.5 cursor-pointer group">
                  <div onClick={() => toggleProg(p)}
                    className={`w-4 h-4 rounded border flex items-center justify-center transition-all flex-shrink-0 cursor-pointer
                      ${programs.includes(p)?"bg-emerald-600 border-emerald-600":"border-gray-300 bg-white"}`}>
                    {programs.includes(p) && <Check className="w-2.5 h-2.5 text-white" />}
                  </div>
                  <span className="text-[12.5px] text-gray-700 group-hover:text-gray-900">{p}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="h-px bg-gray-100" />

          <div>
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-3">Metrics to Include</p>
            <div className="space-y-2">
              {["Attendance","Performance","Tasks","Feedback","Skills","Milestones"].map(m => (
                <label key={m} className="flex items-center gap-2.5 cursor-pointer group">
                  <div onClick={() => toggleMetric(m)}
                    className={`w-4 h-4 rounded border flex items-center justify-center transition-all flex-shrink-0 cursor-pointer
                      ${metrics.includes(m)?"bg-emerald-600 border-emerald-600":"border-gray-300 bg-white"}`}>
                    {metrics.includes(m) && <Check className="w-2.5 h-2.5 text-white" />}
                  </div>
                  <span className="text-[12.5px] text-gray-700 group-hover:text-gray-900">{m}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="h-px bg-gray-100" />

          <div>
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-3">Group By</p>
            <div className="space-y-1.5">
              {["Program","Department","Mentor","Status","Cohort"].map(g => (
                <button key={g} onClick={() => setGroupBy(g)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-[12.5px] font-medium transition-all
                    ${groupBy===g?"bg-emerald-50 text-emerald-700 border border-emerald-200":"text-gray-600 hover:bg-gray-50 border border-transparent"}`}>
                  {g}
                </button>
              ))}
            </div>
          </div>

          <button onClick={() => { setPrograms(["Engineering","Design","Marketing","Research"]); setMetrics(["Attendance","Performance","Tasks","Feedback"]); setGroupBy("Program"); }}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-lg border border-gray-200 text-[12px] text-gray-500 hover:bg-gray-50 transition-colors font-medium">
            <RefreshCw className="w-3.5 h-3.5" />Reset Filters
          </button>
        </div>

        {/* ── Report structure preview ── */}
        <div className="flex-1 bg-[#f4f6f8] overflow-y-auto p-6">
          <div className="max-w-2xl mx-auto">
            <p className="text-[12px] text-gray-500 mb-4 font-medium">Report structure preview — based on your filters</p>

            {/* Mock document */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
              {/* Doc header */}
              <div className="bg-[#0f2d1e] px-8 py-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-md bg-emerald-500 flex items-center justify-center">
                      <Briefcase className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-white font-bold text-[13px]">InternHub</span>
                  </div>
                  <span className="text-emerald-300 text-[10px]">CONFIDENTIAL</span>
                </div>
                <h2 className="text-white text-[18px] font-bold mb-1">
                  {reportType==="intern"?"Intern Report":reportType==="performance"?"Performance Report":"Organization Report"}
                </h2>
                <p className="text-emerald-200/70 text-[11px]">Generated for: {programs.join(", ")} · {dateFrom} – {dateTo}</p>
              </div>

              {/* Sections */}
              <div className="p-6 space-y-3">
                {sections[reportType].map((s, i) => (
                  <div key={s} className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 bg-gray-50/50">
                    <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-[10px] font-bold text-emerald-700 shrink-0">
                      {i+1}
                    </div>
                    <div className="flex-1">
                      <p className="text-[12.5px] font-semibold text-[#111827]">{s}</p>
                      <div className="flex gap-1.5 mt-1">
                        {metrics.slice(0,2).map(m => (
                          <span key={m} className="text-[9.5px] bg-emerald-50 text-emerald-600 px-1.5 py-0.5 rounded-md font-medium">{m}</span>
                        ))}
                      </div>
                    </div>
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                  </div>
                ))}

                <div className="pt-2 flex items-center gap-2">
                  <div className="flex-1 h-px bg-gray-100" />
                  <span className="text-[10.5px] text-gray-400">{sections[reportType].length} sections · ~{sections[reportType].length * 2} pages estimated</span>
                  <div className="flex-1 h-px bg-gray-100" />
                </div>
              </div>
            </div>

            {/* Action */}
            <div className="mt-5 flex justify-end">
              <button onClick={onPreview}
                className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-[13px] font-semibold rounded-xl shadow-sm transition-colors">
                <Eye className="w-4 h-4" />Generate & Preview Report
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

// ─── SCREEN 3: Report Preview ─────────────────────────────────────────────────
function ReportPreview({
  reportType, onBack, onExport,
}: {
  reportType: ReportType; onBack:()=>void; onExport:()=>void;
}) {
  const titles: Record<ReportType,string> = {
    intern: "Intern Performance Report — Q2 2025",
    performance: "Program Performance Analytics — Q2 2025",
    organization: "Organization Internship Overview — Q2 2025",
  };
  const statusCls = (s: string) =>
    s==="Excellent"?"bg-emerald-100 text-emerald-700":
    s==="Good"?"bg-blue-100 text-blue-700":
    "bg-red-100 text-red-600";

  return (
    <main className="flex-1 overflow-hidden flex flex-col">
      {/* Action bar */}
      <div className="bg-white border-b border-gray-100 px-6 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <Breadcrumb crumbs={[{label:"Reports",action:onBack},{label:"Filters",action:onBack},{label:"Preview"}]} />
        </div>
        <div className="flex items-center gap-2">
          <button onClick={onBack} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-[12.5px] font-medium text-gray-600 hover:bg-gray-50 transition-colors">
            <SlidersHorizontal className="w-3.5 h-3.5" />Edit Filters
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-[12.5px] font-medium text-gray-600 hover:bg-gray-50 transition-colors">
            <Printer className="w-3.5 h-3.5" />Print
          </button>
          <button onClick={onExport}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[12.5px] font-semibold transition-colors shadow-sm">
            <Download className="w-3.5 h-3.5" />Export Report
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden flex">
        {/* Document preview */}
        <div className="flex-1 bg-[#e8eaed] overflow-y-auto p-8">
          {/* A4-style document */}
          <div className="max-w-[780px] mx-auto bg-white shadow-2xl rounded-sm" style={{minHeight:"1060px"}}>
            {/* Report header */}
            <div className="bg-[#0f2d1e] px-10 py-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center">
                    <Briefcase className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <span className="text-white font-bold text-[15px] block leading-none">InternHub</span>
                    <span className="text-emerald-300/70 text-[10px]">Internship Management System</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-emerald-200/60 text-[10px]">Generated: 20 Jun 2025, 09:42 AM</p>
                  <p className="text-emerald-200/60 text-[10px] mt-0.5">Prepared by: Jamie Liu · Confidential</p>
                </div>
              </div>
              <h1 className="text-white text-[22px] font-bold mb-1">{titles[reportType]}</h1>
              <p className="text-emerald-200/70 text-[12px]">Period: January 1, 2025 – June 30, 2025 · Programs: Engineering, Design, Marketing, Research</p>
            </div>

            {/* Colored accent strip */}
            <div className="h-1 bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-300" />

            <div className="px-10 py-8 space-y-8">
              {/* Executive Summary */}
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-5 h-5 rounded-full bg-emerald-600 flex items-center justify-center text-[9px] text-white font-bold">1</div>
                  <h2 className="text-[15px] font-bold text-[#0f2d1e]">Executive Summary</h2>
                </div>
                <div className="grid grid-cols-4 gap-3 mb-4">
                  {[
                    {label:"Total Interns",value:"128",delta:"+14%",pos:true},
                    {label:"Avg. Performance",value:"87.4",delta:"+4.8pts",pos:true},
                    {label:"Attendance Rate",value:"92%",delta:"+3%",pos:true},
                    {label:"Tasks Completed",value:"347",delta:"48 pending",pos:false},
                  ].map(s => (
                    <div key={s.label} className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                      <p className="text-[10px] text-gray-500 font-medium mb-1">{s.label}</p>
                      <p className="text-[20px] font-bold text-[#111827] leading-none">{s.value}</p>
                      <p className={`text-[10px] mt-1 font-medium ${s.pos?"text-emerald-600":"text-amber-600"}`}>{s.delta}</p>
                    </div>
                  ))}
                </div>
                <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4">
                  <p className="text-[12px] text-[#0f2d1e] leading-relaxed font-medium">
                    The Q2 2025 internship cohort demonstrated strong performance growth across all four programs, with a 4.8-point improvement in average scores compared to Q1. Attendance rates remained consistently high, and the majority of interns are on track to complete their program deliverables by the end of the term.
                  </p>
                </div>
              </section>

              <div className="h-px bg-gray-100" />

              {/* Performance trend chart */}
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-5 h-5 rounded-full bg-emerald-600 flex items-center justify-center text-[9px] text-white font-bold">2</div>
                  <h2 className="text-[15px] font-bold text-[#0f2d1e]">
                    {reportType==="organization"?"Department Performance Overview":"Performance Trends by Program"}
                  </h2>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                  <ResponsiveContainer width="100%" height={180}>
                    <LineChart data={REPORT_PERF} margin={{top:4,right:8,left:-20,bottom:0}}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="month" tick={{fontSize:10}} axisLine={false} tickLine={false} />
                      <YAxis domain={[60,100]} tick={{fontSize:10}} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={{fontSize:11,borderRadius:8,border:"1px solid #e5e7eb"}} />
                      <Legend iconType="circle" iconSize={8} wrapperStyle={{fontSize:11}} />
                      <Line type="monotone" dataKey="Engineering" stroke="#16a34a" strokeWidth={2} dot={false} />
                      <Line type="monotone" dataKey="Design"      stroke="#7c3aed" strokeWidth={2} dot={false} />
                      <Line type="monotone" dataKey="Marketing"   stroke="#2563eb" strokeWidth={2} dot={false} />
                      <Line type="monotone" dataKey="Research"    stroke="#d97706" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </section>

              <div className="h-px bg-gray-100" />

              {/* Intern table / org table */}
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-5 h-5 rounded-full bg-emerald-600 flex items-center justify-center text-[9px] text-white font-bold">3</div>
                  <h2 className="text-[15px] font-bold text-[#0f2d1e]">
                    {reportType==="organization"?"Department Breakdown":reportType==="performance"?"Top & At-Risk Interns":"Individual Intern Scorecards"}
                  </h2>
                </div>

                {reportType==="organization" ? (
                  <table className="w-full">
                    <thead>
                      <tr className="border-b-2 border-gray-200">
                        {["Department","Interns","Avg. Score","Task Completion","At-Risk"].map(h=>(
                          <th key={h} className="text-left text-[10.5px] text-gray-500 font-semibold pb-2 pr-4">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {ORG_STATS.map((r,i)=>(
                        <tr key={i} className="border-b border-gray-100 last:border-0">
                          <td className="py-2.5 pr-4 text-[12.5px] font-semibold text-[#111827]">{r.dept}</td>
                          <td className="py-2.5 pr-4 text-[12px] text-gray-600">{r.interns}</td>
                          <td className="py-2.5 pr-4">
                            <div className="flex items-center gap-2">
                              <div className="flex-1 h-1.5 bg-gray-100 rounded-full"><div className="h-full bg-emerald-500 rounded-full" style={{width:`${r.avgScore}%`}}/></div>
                              <span className="text-[12px] font-semibold text-[#111827]">{r.avgScore}</span>
                            </div>
                          </td>
                          <td className="py-2.5 pr-4 text-[12px] text-gray-600">{r.completion}%</td>
                          <td className="py-2.5">
                            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${r.risk>3?"bg-red-100 text-red-600":"bg-amber-100 text-amber-700"}`}>{r.risk} interns</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <table className="w-full">
                    <thead>
                      <tr className="border-b-2 border-gray-200">
                        {["Intern","Program","Mentor","Attendance","Score","Tasks","Status"].map(h=>(
                          <th key={h} className="text-left text-[10.5px] text-gray-500 font-semibold pb-2 pr-3">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {REPORT_INTERNS.map((r,i)=>(
                        <tr key={i} className="border-b border-gray-100 last:border-0">
                          <td className="py-2.5 pr-3">
                            <div className="flex items-center gap-2">
                              <Ini s={r.ini} bg={r.bg} size={6}/>
                              <div>
                                <p className="text-[11.5px] font-semibold leading-none">{r.name}</p>
                                <p className="text-[9.5px] text-gray-400 mt-0.5">{r.id}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-2.5 pr-3 text-[11px] text-gray-600">{r.program}</td>
                          <td className="py-2.5 pr-3 text-[11px] text-gray-600">{r.mentor}</td>
                          <td className="py-2.5 pr-3">
                            <span className={`text-[11px] font-semibold ${r.attendance>=90?"text-emerald-600":r.attendance>=80?"text-amber-600":"text-red-500"}`}>{r.attendance}%</span>
                          </td>
                          <td className="py-2.5 pr-3">
                            <span className={`text-[11px] font-semibold ${r.score>=90?"text-emerald-600":r.score>=80?"text-blue-600":"text-amber-600"}`}>{r.score}</span>
                          </td>
                          <td className="py-2.5 pr-3 text-[11px] text-gray-600">{r.tasks}</td>
                          <td className="py-2.5">
                            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${statusCls(r.status)}`}>{r.status}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </section>

              <div className="h-px bg-gray-100" />

              {/* Attendance + task charts */}
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-5 h-5 rounded-full bg-emerald-600 flex items-center justify-center text-[9px] text-white font-bold">4</div>
                  <h2 className="text-[15px] font-bold text-[#0f2d1e]">Attendance & Task Completion</h2>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <p className="text-[11px] font-semibold text-gray-600 mb-3">Weekly Attendance Trend</p>
                    <ResponsiveContainer width="100%" height={120}>
                      <LineChart data={ATTENDANCE_TREND} margin={{top:4,right:4,left:-24,bottom:0}}>
                        <XAxis dataKey="week" tick={{fontSize:9}} axisLine={false} tickLine={false}/>
                        <YAxis domain={[80,100]} tick={{fontSize:9}} axisLine={false} tickLine={false}/>
                        <Tooltip contentStyle={{fontSize:10,borderRadius:6}} formatter={(v:number) => [`${v}%`,"Rate"]}/>
                        <Line type="monotone" dataKey="rate" stroke="#16a34a" strokeWidth={2} dot={{r:2,fill:"#16a34a"}}/>
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <p className="text-[11px] font-semibold text-gray-600 mb-3">Task Completion by Program</p>
                    <ResponsiveContainer width="100%" height={120}>
                      <BarChart data={TASK_COMPLETION} margin={{top:4,right:4,left:-24,bottom:0}}>
                        <XAxis dataKey="program" tick={{fontSize:9}} axisLine={false} tickLine={false}/>
                        <YAxis tick={{fontSize:9}} axisLine={false} tickLine={false}/>
                        <Tooltip contentStyle={{fontSize:10,borderRadius:6}}/>
                        <Bar dataKey="completed" fill="#16a34a" radius={[3,3,0,0]} stackId="a"/>
                        <Bar dataKey="pending"   fill="#dcfce7" radius={[3,3,0,0]} stackId="a"/>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </section>

              {/* Footer */}
              <div className="border-t border-gray-100 pt-5 flex items-center justify-between">
                <p className="text-[10px] text-gray-400">InternHub · Confidential — For internal use only. Generated on 20 Jun 2025.</p>
                <p className="text-[10px] text-gray-400">Page 1 of 4</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right sidebar: TOC + export panel */}
        <div className="w-[220px] shrink-0 bg-white border-l border-gray-100 overflow-y-auto p-4 space-y-5">
          <div>
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-3">Contents</p>
            <div className="space-y-1">
              {["Executive Summary","Performance Trends","Intern Scorecards","Attendance & Tasks"].map((s,i)=>(
                <button key={s} className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-gray-50 text-left transition-colors">
                  <span className="text-[10px] text-gray-400 w-4 shrink-0">{i+1}.</span>
                  <span className="text-[11.5px] text-gray-700">{s}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="h-px bg-gray-100" />

          <div>
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-3">Quick Export</p>
            <div className="space-y-2">
              <button onClick={onExport} className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white transition-colors">
                <FileDown className="w-3.5 h-3.5 shrink-0"/>
                <div className="text-left">
                  <p className="text-[11.5px] font-semibold leading-none">Export as PDF</p>
                  <p className="text-[10px] text-emerald-100 mt-0.5">Recommended</p>
                </div>
              </button>
              <button className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-700 transition-colors">
                <Printer className="w-3.5 h-3.5 shrink-0"/>
                <span className="text-[11.5px] font-medium">Print Report</span>
              </button>
            </div>
          </div>

          <div className="h-px bg-gray-100" />

          <div>
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Report Info</p>
            <div className="space-y-2">
              {[
                {label:"Type",value:reportType==="intern"?"Intern":reportType==="performance"?"Performance":"Organization"},
                {label:"Period",value:"Q2 2025"},
                {label:"Pages",value:"~4"},
                {label:"Sections",value:"4"},
              ].map(r=>(
                <div key={r.label} className="flex justify-between">
                  <span className="text-[11px] text-gray-400">{r.label}</span>
                  <span className="text-[11px] font-medium text-gray-700">{r.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

// ─── SCREEN 4: Export Modal ───────────────────────────────────────────────────
function ExportModal({ onClose, onDone }: { onClose:()=>void; onDone:()=>void }) {
  const [format, setFormat]   = useState<"pdf"|"excel"|"csv">("pdf");
  const [paper,  setPaper]    = useState("A4");
  const [orient, setOrient]   = useState("Portrait");
  const [exporting, setExp]   = useState(false);
  const [done, setDone]       = useState(false);
  const [sections, setSections] = useState(["Executive Summary","Performance Trends","Intern Scorecards","Attendance & Tasks"]);

  const toggleSection = (s: string) =>
    setSections(p => p.includes(s) ? p.filter(x=>x!==s) : [...p,s]);

  const handleExport = () => {
    setExp(true);
    setTimeout(() => { setExp(false); setDone(true); }, 1800);
    setTimeout(() => { setDone(false); onDone(); }, 3200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-[520px] max-h-[90vh] overflow-y-auto border border-gray-100 z-10">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center">
              <Download className="w-4.5 h-4.5 text-emerald-600" />
            </div>
            <div>
              <h3 className="text-[15px] font-bold text-[#111827]">Export Report</h3>
              <p className="text-[11.5px] text-gray-500">Configure your export settings</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
            <X className="w-4 h-4 text-gray-400" />
          </button>
        </div>

        {!done ? (
          <div className="px-6 py-5 space-y-5">
            {/* Format */}
            <div>
              <p className="text-[12px] font-bold text-gray-600 mb-3">Export Format</p>
              <div className="grid grid-cols-3 gap-2.5">
                {([
                  {id:"pdf" as const,   icon:FileText,  label:"PDF",   desc:"Best for sharing"},
                  {id:"excel" as const, icon:Layers,    label:"Excel", desc:"Editable data"},
                  {id:"csv" as const,   icon:Activity,  label:"CSV",   desc:"Raw data"},
                ] as const).map(f => (
                  <button key={f.id} onClick={() => setFormat(f.id)}
                    className={`flex flex-col items-center p-3.5 rounded-xl border-2 transition-all
                      ${format===f.id?"border-emerald-500 bg-emerald-50":"border-gray-200 hover:border-gray-300"}`}>
                    <f.icon className={`w-5 h-5 mb-1.5 ${format===f.id?"text-emerald-600":"text-gray-500"}`}/>
                    <span className={`text-[12.5px] font-bold ${format===f.id?"text-emerald-700":"text-gray-700"}`}>{f.label}</span>
                    <span className={`text-[10px] mt-0.5 ${format===f.id?"text-emerald-500":"text-gray-400"}`}>{f.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Paper + Orientation (PDF only) */}
            {format==="pdf" && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[12px] font-bold text-gray-600 mb-2">Paper Size</p>
                  <div className="flex flex-wrap gap-1.5">
                    {["A4","Letter","Legal","A3"].map(p=>(
                      <button key={p} onClick={()=>setPaper(p)}
                        className={`px-3 py-1.5 rounded-lg text-[12px] font-medium border transition-all
                          ${paper===p?"bg-emerald-600 border-emerald-600 text-white":"border-gray-200 text-gray-600 hover:border-gray-300"}`}>{p}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-[12px] font-bold text-gray-600 mb-2">Orientation</p>
                  <div className="flex gap-1.5">
                    {["Portrait","Landscape"].map(o=>(
                      <button key={o} onClick={()=>setOrient(o)}
                        className={`flex-1 py-1.5 rounded-lg text-[12px] font-medium border transition-all
                          ${orient===o?"bg-emerald-600 border-emerald-600 text-white":"border-gray-200 text-gray-600 hover:border-gray-300"}`}>{o}</button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Include sections */}
            <div>
              <p className="text-[12px] font-bold text-gray-600 mb-2">Include Sections</p>
              <div className="space-y-2">
                {["Executive Summary","Performance Trends","Intern Scorecards","Attendance & Tasks","Mentor Feedback","Recommendations"].map(s=>(
                  <label key={s} className="flex items-center gap-2.5 cursor-pointer group">
                    <div onClick={()=>toggleSection(s)}
                      className={`w-4 h-4 rounded border flex items-center justify-center transition-all flex-shrink-0 cursor-pointer
                        ${sections.includes(s)?"bg-emerald-600 border-emerald-600":"border-gray-300 bg-white"}`}>
                      {sections.includes(s)&&<Check className="w-2.5 h-2.5 text-white"/>}
                    </div>
                    <span className="text-[12.5px] text-gray-700 group-hover:text-gray-900">{s}</span>
                    {s==="Executive Summary"&&<Chip className="bg-gray-100 text-gray-500 ml-auto">Required</Chip>}
                  </label>
                ))}
              </div>
            </div>

            {/* Additional options */}
            <div className="bg-gray-50 rounded-xl p-4 space-y-2.5">
              <p className="text-[11.5px] font-bold text-gray-600">Additional Options</p>
              {[
                {label:"Include cover page", checked:true},
                {label:"Include table of contents", checked:true},
                {label:"Add watermark (Confidential)", checked:false},
                {label:"Include page numbers", checked:true},
              ].map(o=>(
                <label key={o.label} className="flex items-center gap-2.5 cursor-pointer">
                  <div className="w-4 h-4 rounded border bg-emerald-600 border-emerald-600 flex items-center justify-center flex-shrink-0">
                    {o.checked&&<Check className="w-2.5 h-2.5 text-white"/>}
                  </div>
                  <span className="text-[12px] text-gray-600">{o.label}</span>
                </label>
              ))}
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-1">
              <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-[13px] font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
                Cancel
              </button>
              <button onClick={handleExport} disabled={exporting}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-[13px] font-semibold transition-all shadow-md disabled:opacity-70">
                {exporting ? (
                  <><RefreshCw className="w-4 h-4 animate-spin"/>Generating…</>
                ) : (
                  <><Download className="w-4 h-4"/>Export as {format.toUpperCase()}</>
                )}
              </button>
            </div>
          </div>
        ) : (
          <div className="px-6 py-10 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-50 border-2 border-emerald-200 flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-emerald-600" />
            </div>
            <h3 className="text-[17px] font-bold text-[#111827] mb-1">Export Complete!</h3>
            <p className="text-[13px] text-gray-500 mb-2">Your report has been exported successfully.</p>
            <p className="text-[12px] text-emerald-600 font-medium">Q2 2025 Intern Report.{format} · 2.4 MB</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main Reports Component ───────────────────────────────────────────────────
export const ReportsPage: React.FC<{ onNavigate?: (view: string) => void }> = ({ onNavigate }) => {
  const [reportView, setReportView] = useState<ReportView>("overview");
  const [reportType, setReportType] = useState<ReportType>("intern");
  const [showExport, setShowExport] = useState(false);

  const handleGenerate = (t: ReportType) => {
    setReportType(t);
    setReportView("filters");
  };

  return (
    <div className="space-y-4">
      {reportView === "overview" && (
        <ReportsOverview onGenerate={handleGenerate} />
      )}
      {reportView === "filters" && (
        <ReportFilters
          reportType={reportType}
          setReportType={setReportType}
          onBack={() => setReportView("overview")}
          onPreview={() => setReportView("preview")}
        />
      )}
      {reportView === "preview" && (
        <ReportPreview
          reportType={reportType}
          onBack={() => setReportView("filters")}
          onExport={() => setShowExport(true)}
        />
      )}
      {showExport && (
        <ExportModal
          onClose={() => setShowExport(false)}
          onDone={() => { setShowExport(false); setReportView("overview"); }}
        />
      )}
    </div>
  );
};