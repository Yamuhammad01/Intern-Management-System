import React, { useState } from "react";
import {
  ArrowLeft, Check, Users, Building2,
  Briefcase, Eye,
} from "lucide-react";
import { Breadcrumb } from "../components/reports/ReportsShared.jsx";

function NewReportPage({ navigate, userRole }) {
  const isSupervisor = userRole === "SUPERVISOR" || userRole === "MENTOR";
  const reportType = isSupervisor ? "intern" : "organization";

  const SECTIONS = {
    intern: ["Executive Summary", "Individual Scorecards", "Attendance Breakdown", "Task Completion", "Mentor Feedback", "Skills Assessment"],
    organization: ["Executive Summary", "Department Overview", "Supervisor Effectiveness", "Program ROI", "Cohort Comparison", "Recommendations"],
  };

  const handlePreview = () =>
    navigate("preview", { reportType });

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
        {/* ── Left: report type panel ── */}
        <div className="w-[300px] shrink-0 bg-white border-r border-gray-100 overflow-y-auto p-5 space-y-6">
          {/* Report Type */}
          <div>
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-3">Report Type</p>
            <div className="space-y-1.5">
              <div
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl border text-left text-[12.5px] font-medium border-emerald-500 bg-emerald-50 text-emerald-700`}
              >
                <div className="w-5 h-5 rounded-md flex items-center justify-center bg-emerald-500">
                  {isSupervisor
                    ? <Users className="w-3 h-3 text-white" />
                    : <Building2 className="w-3 h-3 text-white" />}
                </div>
                {isSupervisor ? "Intern Report" : "Organization Report"}
                <Check className="w-3.5 h-3.5 ml-auto text-emerald-600" />
              </div>
            </div>
          </div>
        </div>

        {/* ── Right: report structure preview ── */}
        <div className="flex-1 bg-[#f4f6f8] overflow-y-auto p-6">
          <div className="max-w-2xl mx-auto">
            <p className="text-[12px] text-gray-500 mb-4 font-medium">
              Report structure preview
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
                  {isSupervisor ? "Intern Report" : "Organization Report"}
                </h2>
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