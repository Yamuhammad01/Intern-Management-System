import React from "react";
import {
  Users, Building2, FileText, Download, Clock,
  Activity, Plus, ChevronRight as ChevronR, Eye, Printer,
} from "lucide-react";
import { Card, Chip, RECENT_REPORTS } from "../components/reports/ReportsShared.jsx";

function ReportsOverviewPage({ navigate, userRole }) {
  const typeChipCls = (t) =>
    t === "Performance" ? "bg-purple-100 text-purple-700" :
    t === "Attendance" ? "bg-blue-100 text-blue-700" :
    t === "Intern" ? "bg-emerald-100 text-emerald-700" :
    "bg-amber-100 text-amber-700";

  const isSupervisor = userRole === "SUPERVISOR" || userRole === "MENTOR";

  const goNew = (type) => navigate("new-report", { reportType: type });

  const reportCards = isSupervisor
    ? [
        {
          type: "intern", icon: Users, iconBg: "bg-emerald-500",
          title: "Intern Report",
          desc: "Comprehensive report of the interns assigned to you, including attendance, task completion, performance scores, and mentor feedback.",
          includes: ["Individual scorecards", "Attendance breakdown", "Task completion rate", "Mentor feedback summary"],
          lastRun: "28 May 2025", badge: "Assigned Interns", badgeCls: "bg-emerald-100 text-emerald-700",
        },
      ]
    : [
        {
          type: "organization", icon: Building2, iconBg: "bg-blue-500",
          title: "Organization Report",
          desc: "Department-level overview of internship program health, resource utilization, and outcomes across all organizations.",
          includes: ["Department breakdown", "Supervisor effectiveness", "Program ROI metrics", "Cohort comparison"],
          lastRun: "20 May 2025", badge: "Executive View", badgeCls: "bg-blue-100 text-blue-700",
        },
      ];

  return (
    <main className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-[20px] font-bold text-[#0f2d1e]">Reports</h1>
          <p className="text-[12.5px] text-gray-500 mt-0.5">
            {isSupervisor
              ? "View and generate reports for the interns assigned to you."
              : "Generate, preview, and export organization-level reports for your internship programs."}
          </p>
        </div>
        <button
          onClick={() => goNew(reportCards[0]?.type || "intern")}
          className="flex items-center justify-center gap-2 px-4 py-2.5 sm:py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-[13px] font-semibold rounded-xl shadow-sm transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />New Report
        </button>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {[
          { icon: FileText, label: "Reports Generated", value: "47", sub: "This quarter", color: "bg-emerald-50 text-emerald-600" },
          { icon: Download, label: "Total Exports", value: "183", sub: "Across all formats", color: "bg-blue-50 text-blue-600" },
          { icon: Clock, label: "Last Generated", value: "2h", sub: "ago by Jamie Liu", color: "bg-amber-50 text-amber-600" },
          { icon: Activity, label: "Scheduled Reports", value: "5", sub: "Auto-generating", color: "bg-purple-50 text-purple-600" },
        ].map((s) => (
          <Card key={s.label} className="p-3 sm:p-4 flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className={`w-9 h-9 rounded-xl ${s.color} flex items-center justify-center shrink-0`}>
              <s.icon className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] text-gray-500 font-medium">{s.label}</p>
              <div className="flex items-baseline gap-1.5 flex-wrap">
                <span className="text-[20px] font-bold text-[#111827] leading-none">{s.value}</span>
                <span className="text-[10.5px] text-gray-400">{s.sub}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Report type cards */}
      <div>
        <h2 className="text-[14px] font-semibold text-[#111827] mb-3">
          {isSupervisor ? "Generate an Intern Report" : "Generate an Organization Report"}
        </h2>
        <div className="grid grid-cols-1 gap-4 max-w-lg">
          {reportCards.map((r) => (
            <Card
              key={r.type}
              className="p-5 flex flex-col hover:shadow-md transition-shadow cursor-pointer group"
              onClick={() => goNew(r.type)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 ${r.iconBg} rounded-xl flex items-center justify-center shadow-sm`}>
                  <r.icon className="w-5 h-5 text-white" />
                </div>
                <Chip className={r.badgeCls}>{r.badge}</Chip>
              </div>
              <h3 className="text-[14px] font-bold text-[#111827] mb-1.5">{r.title}</h3>
              <p className="text-[12px] text-gray-500 leading-relaxed mb-4 flex-1">{r.desc}</p>
              <div className="space-y-1.5 mb-4">
                {r.includes.map((inc) => (
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
      <Card className="p-4 sm:p-5">
        <div className="flex items-center justify-between gap-2 mb-4">
          <h2 className="text-[14px] font-semibold text-[#111827]">Recent Reports</h2>
          <button className="text-[12px] text-emerald-600 font-medium hover:underline">View all</button>
        </div>
        <div className="scroll-x-contained -mx-1 px-1">
        <table className="w-full min-w-[640px]">
          <thead>
            <tr className="border-b border-gray-100">
              {["Report Name", "Type", "Generated", "By", "Size", "Status", "Actions"].map((h) => (
                <th key={h} className="text-left text-[10.5px] text-gray-400 font-semibold pb-2.5 pr-4">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {RECENT_REPORTS.map((r, i) => (
              <tr key={i} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                <td className="py-3 pr-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                      <FileText className="w-3.5 h-3.5 text-gray-500" />
                    </div>
                    <span className="text-[12.5px] font-medium text-[#111827]">{r.name}</span>
                  </div>
                </td>
                <td className="py-3 pr-4"><Chip className={typeChipCls(r.type)}>{r.type}</Chip></td>
                <td className="py-3 pr-4 text-[12px] text-gray-600">{r.generated}</td>
                <td className="py-3 pr-4 text-[12px] text-gray-600">{r.by}</td>
                <td className="py-3 pr-4 text-[12px] text-gray-400">{r.size}</td>
                <td className="py-3 pr-4">
                  <Chip className={r.status === "Ready" ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500"}>{r.status}</Chip>
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
        </div>
      </Card>
    </main>
  );
}

export { ReportsOverviewPage };