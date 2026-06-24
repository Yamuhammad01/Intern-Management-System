import React, { useState } from "react";
import {
  ArrowLeft, Calendar, Check, Users, TrendingUp, Building2,
  RefreshCw, Briefcase, Eye, ChevronRight as ChevronR,
} from "lucide-react";
import { Card, Breadcrumb } from "../components/reports/ReportsShared.jsx";

function NewReportPage({ navigate, initialType = "intern" }) {
  const [reportType, setReportType] = useState(initialType);
  const [dateFrom, setDateFrom] = useState("2025-01-01");
  const [dateTo, setDateTo] = useState("2025-06-30");
  const [programs, setPrograms] = useState(["Engineering", "Design", "Marketing", "Research"]);
  const [groupBy, setGroupBy] = useState("Program");
  const [metrics, setMetrics] = useState(["Attendance", "Performance", "Tasks", "Feedback"]);

  const toggleProg = (p) => setPrograms((prev) => prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]);
  const toggleMetric = (m) => setMetrics((prev) => prev.includes(m) ? prev.filter((x) => x !== m) : [...prev, m]);

  const SECTIONS = {
    intern: ["Executive Summary", "Individual Scorecards", "Attendance Breakdown", "Task Completion", "Mentor Feedback", "Skills Assessment"],
    performance: ["Executive Summary", "Performance Trends", "Program Comparison", "Top Performers", "At-Risk Interns", "Goal Achievement"],
    organization: ["Executive Summary", "Department Overview", "Supervisor Effectiveness", "Program ROI", "Cohort Comparison", "Recommendations"],
  };

  const handlePreview = () =>
    navigate("preview", { reportType, dateFrom, dateTo, programs, metrics, groupBy });

  return (
    <main className="flex-1 overflow-hidden flex flex-col">
      {/* Sub-topbar */}
      <div className="bg-white border-b border-gray-100 px-6 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <Breadcrumb
            crumbs={[
              { label: "Reports", action: () => navigate("overview") },
              { label: "New Report" },
            ]}
          />
        </div>
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => navigate("overview")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-[12.5px] font-medium text-gray-600 hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />Back
          </button>
          <button
            onClick={handlePreview}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[12.5px] font-semibold transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />Generate & Preview Report
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden flex">
        {/* ── Left: filter panel ── */}
        <div className="w-[300px] shrink-0 bg-white border-r border-gray-100 overflow-y-auto p-5 space-y-6">
          {/* Report Type */}
          <div>
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-3">Report Type</p>
            <div className="space-y-1.5">
              {[
                { t: "intern", label: "Intern Report" },
                { t: "performance", label: "Performance Report" },
                { t: "organization", label: "Organization Report" },
              ].map(({ t, label }) => (
                <button
                  key={t}
                  onClick={() => setReportType(t)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl border text-left transition-all text-[12.5px] font-medium
                    ${reportType === t ? "border-emerald-500 bg-emerald-50 text-emerald-700" : "border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50"}`}
                >
                  <div className={`w-5 h-5 rounded-md flex items-center justify-center ${reportType === t ? "bg-emerald-500" : "bg-gray-200"}`}>
                    {t === "intern" && <Users className="w-3 h-3 text-white" />}
                    {t === "performance" && <TrendingUp className="w-3 h-3 text-white" />}
                    {t === "organization" && <Building2 className="w-3 h-3 text-white" />}
                  </div>
                  {label}
                  {reportType === t && <Check className="w-3.5 h-3.5 ml-auto text-emerald-600" />}
                </button>
              ))}
            </div>
          </div>

          <div className="h-px bg-gray-100" />

          {/* Date Range */}
          <div>
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-3">Date Range</p>
            <div className="space-y-2.5">
              {[
                { label: "From", value: dateFrom, onChange: setDateFrom },
                { label: "To", value: dateTo, onChange: setDateTo },
              ].map(({ label, value, onChange }) => (
                <div key={label}>
                  <label className="text-[11.5px] font-medium text-gray-600 mb-1 block">{label}</label>
                  <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2 focus-within:border-emerald-400">
                    <Calendar className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    <input
                      type="date" value={value}
                      onChange={(e) => onChange(e.target.value)}
                      className="flex-1 text-[12px] outline-none text-gray-700 bg-transparent"
                    />
                  </div>
                </div>
              ))}
              <div className="flex flex-wrap gap-1.5">
                {["This Month", "Last Quarter", "This Year", "Custom"].map((p) => (
                  <button key={p} className="px-2.5 py-1 rounded-lg border border-gray-200 text-[10.5px] font-medium text-gray-600 hover:border-emerald-400 hover:text-emerald-600 transition-colors">{p}</button>
                ))}
              </div>
            </div>
          </div>

          <div className="h-px bg-gray-100" />

          {/* Programs */}
          <div>
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-3">Programs</p>
            <div className="space-y-2">
              {["Engineering", "Design", "Marketing", "Research"].map((p) => (
                <label key={p} className="flex items-center gap-2.5 cursor-pointer group">
                  <div
                    onClick={() => toggleProg(p)}
                    className={`w-4 h-4 rounded border flex items-center justify-center transition-all flex-shrink-0 cursor-pointer
                      ${programs.includes(p) ? "bg-emerald-600 border-emerald-600" : "border-gray-300 bg-white"}`}
                  >
                    {programs.includes(p) && <Check className="w-2.5 h-2.5 text-white" />}
                  </div>
                  <span className="text-[12.5px] text-gray-700 group-hover:text-gray-900">{p}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="h-px bg-gray-100" />

          {/* Metrics */}
          <div>
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-3">Metrics to Include</p>
            <div className="space-y-2">
              {["Attendance", "Performance", "Tasks", "Feedback", "Skills", "Milestones"].map((m) => (
                <label key={m} className="flex items-center gap-2.5 cursor-pointer group">
                  <div
                    onClick={() => toggleMetric(m)}
                    className={`w-4 h-4 rounded border flex items-center justify-center transition-all flex-shrink-0 cursor-pointer
                      ${metrics.includes(m) ? "bg-emerald-600 border-emerald-600" : "border-gray-300 bg-white"}`}
                  >
                    {metrics.includes(m) && <Check className="w-2.5 h-2.5 text-white" />}
                  </div>
                  <span className="text-[12.5px] text-gray-700 group-hover:text-gray-900">{m}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="h-px bg-gray-100" />

          {/* Group By */}
          <div>
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-3">Group By</p>
            <div className="space-y-1.5">
              {["Program", "Department", "Mentor", "Status", "Cohort"].map((g) => (
                <button
                  key={g}
                  onClick={() => setGroupBy(g)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-[12.5px] font-medium transition-all
                    ${groupBy === g ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "text-gray-600 hover:bg-gray-50 border border-transparent"}`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => { setPrograms(["Engineering", "Design", "Marketing", "Research"]); setMetrics(["Attendance", "Performance", "Tasks", "Feedback"]); setGroupBy("Program"); }}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-lg border border-gray-200 text-[12px] text-gray-500 hover:bg-gray-50 transition-colors font-medium"
          >
            <RefreshCw className="w-3.5 h-3.5" />Reset Filters
          </button>
        </div>

        {/* ── Right: report structure preview ── */}
        <div className="flex-1 bg-[#f4f6f8] overflow-y-auto p-6">
          <div className="max-w-2xl mx-auto">
            <p className="text-[12px] text-gray-500 mb-4 font-medium">
              Report structure preview — based on your current filters
            </p>

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
                  {reportType === "intern" ? "Intern Report" : reportType === "performance" ? "Performance Report" : "Organization Report"}
                </h2>
                <p className="text-emerald-200/70 text-[11px]">
                  Generated for: {programs.join(", ")} · {dateFrom} – {dateTo}
                </p>
              </div>

              {/* Sections list */}
              <div className="p-6 space-y-3">
                {SECTIONS[reportType].map((s, i) => (
                  <div key={s} className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 bg-gray-50/50">
                    <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-[10px] font-bold text-emerald-700 shrink-0">
                      {i + 1}
                    </div>
                    <div className="flex-1">
                      <p className="text-[12.5px] font-semibold text-[#111827]">{s}</p>
                      <div className="flex gap-1.5 mt-1">
                        {metrics.slice(0, 2).map((m) => (
                          <span key={m} className="text-[9.5px] bg-emerald-50 text-emerald-600 px-1.5 py-0.5 rounded-md font-medium">{m}</span>
                        ))}
                      </div>
                    </div>
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                  </div>
                ))}
                <div className="pt-2 flex items-center gap-2">
                  <div className="flex-1 h-px bg-gray-100" />
                  <span className="text-[10.5px] text-gray-400">
                    {SECTIONS[reportType].length} sections · ~{SECTIONS[reportType].length * 2} pages estimated
                  </span>
                  <div className="flex-1 h-px bg-gray-100" />
                </div>
              </div>
            </div>

            <div className="mt-5 flex justify-end">
              <button
                onClick={handlePreview}
                className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-[13px] font-semibold rounded-xl shadow-sm transition-colors"
              >
                <Eye className="w-4 h-4" />Generate & Preview Report
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export { NewReportPage };