import React, { useState } from "react";
import {
  ArrowLeft, RefreshCw, Briefcase, Download,
} from "lucide-react";
import { Card, Breadcrumb } from "../components/reports/ReportsShared.jsx";

function ExportReportPage({ navigate, reportType = "intern" }) {
  const [exporting, setExporting] = useState(false);

  const handleExport = () => {
    setExporting(true);
    // Navigate to report view which will auto-trigger print
    setTimeout(() => {
      navigate("report-view", { reportType });
    }, 300);
  };

  return (
    <main className="flex-1 overflow-y-auto">
      {/* Sub-topbar */}
      <div className="bg-white border-b border-gray-100 px-6 py-3 flex items-center justify-between sticky top-0 z-10">
        <Breadcrumb
          crumbs={[
            { label: "Reports", action: () => navigate("overview") },
            { label: "New Report", action: () => navigate("new-report", { reportType }) },
            { label: "Preview", action: () => navigate("preview", { reportType }) },
            { label: "Export" },
          ]}
        />
        <button
          onClick={() => navigate("preview", { reportType })}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-[12.5px] font-medium text-gray-600 hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />Back to Preview
        </button>
      </div>

      {/* Export layout */}
      <div className="max-w-4xl mx-auto p-8 flex justify-center">
        <div className="w-full max-w-2xl">
          <div className="mb-8">
            <h1 className="text-[20px] font-bold text-[#0f2d1e]">Export Report</h1>
            <p className="text-[12.5px] text-gray-500 mt-0.5">Export your complete report as a PDF file.</p>
          </div>

          {/* Summary + export CTA */}
          <Card className="p-5">
            <p className="text-[13px] font-bold text-[#111827] mb-4">Export Summary</p>
            <div className="bg-[#0f2d1e] rounded-xl p-4 mb-6">
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center">
                  <Briefcase className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-white font-bold text-[12px] leading-none">InternHub</p>
                  <p className="text-emerald-300/70 text-[10px] mt-0.5">Internship Management System</p>
                </div>
              </div>
              <p className="text-white text-[13px] font-semibold mb-0.5">
                Q2 2025 {reportType === "intern" ? "Intern" : "Organization"} Report
              </p>
              <p className="text-emerald-200/60 text-[10px]">Jan 1, 2025 – Jun 30, 2025</p>
            </div>

            <div className="space-y-2.5 mb-6">
              {[
                { label: "Format", value: "PDF" },
                { label: "Est. size", value: "~2.4 MB" },
                { label: "Est. pages", value: "~6 pages" },
              ].map((r) => (
                <div key={r.label} className="flex justify-between items-center py-1.5 border-b border-gray-50 last:border-0">
                  <span className="text-[12px] text-gray-400">{r.label}</span>
                  <span className="text-[12px] font-semibold text-gray-700">{r.value}</span>
                </div>
              ))}
            </div>

            <button
              onClick={handleExport}
              disabled={exporting}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-[13px] font-bold transition-all shadow-md disabled:opacity-70"
            >
              {exporting ? (
                <><RefreshCw className="w-4 h-4 animate-spin" />Generating PDF…</>
              ) : (
                <><Download className="w-4 h-4" />Export as PDF</>
              )}
            </button>

            <button
              onClick={() => navigate("preview", { reportType })}
              className="w-full mt-2 py-2.5 rounded-xl border border-gray-200 text-[13px] font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </Card>
        </div>
      </div>
    </main>
  );
}

export { ExportReportPage };