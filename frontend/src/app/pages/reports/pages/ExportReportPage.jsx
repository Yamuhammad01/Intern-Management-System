import React, { useState } from "react";
import {
  ArrowLeft, Check, RefreshCw, Briefcase, Download,
  FileText, Layers, Activity, ChevronRight as ChevronR,
} from "lucide-react";
import { Card, Chip, Breadcrumb } from "../components/reports/ReportsShared.jsx";

function ExportReportPage({ navigate, reportType = "intern" }) {
  const [format, setFormat] = useState("pdf");
  const [paper, setPaper] = useState("A4");
  const [orient, setOrient] = useState("Portrait");
  const [exporting, setExporting] = useState(false);
  const [done, setDone] = useState(false);
  const [sections, setSections] = useState([
    "Executive Summary", "Intern Scorecards", "Skills Assessment", "Task Completion",
  ]);

  const toggleSection = (s) =>
    setSections((p) => p.includes(s) ? p.filter((x) => x !== s) : [...p, s]);

  const handleExport = () => {
    setExporting(true);
    setTimeout(() => { setExporting(false); setDone(true); }, 1800);
    setTimeout(() => navigate("overview"), 3400);
  };

  const allSections = [
    "Executive Summary", "Intern Scorecards",
    "Skills Assessment", "Task Completion", "Mentor Feedback", "Recommendations",
  ];

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

      {done ? (
        /* ── Success state ── */
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-56px)] p-8">
          <div className="w-20 h-20 rounded-full bg-emerald-50 border-2 border-emerald-200 flex items-center justify-center mb-6">
            <Check className="w-10 h-10 text-emerald-600" />
          </div>
          <h2 className="text-[22px] font-bold text-[#111827] mb-2">Export Complete!</h2>
          <p className="text-[14px] text-gray-500 mb-1">Your report has been exported successfully.</p>
          <p className="text-[13px] text-emerald-600 font-semibold mb-8">
            Q2 2025 {reportType === "intern" ? "Intern" : "Organization"} Report.{format} · 2.4 MB
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => navigate("overview")}
              className="px-5 py-2.5 rounded-xl border border-gray-200 text-[13px] font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Back to Reports
            </button>
            <button
              onClick={() => { setDone(false); setExporting(false); }}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-[13px] font-semibold transition-colors"
            >
              Export Again
            </button>
          </div>
        </div>
      ) : (
        /* ── Configuration layout ── */
        <div className="max-w-4xl mx-auto p-8 grid grid-cols-[1fr_340px] gap-8">
          {/* Left: config panel */}
          <div className="space-y-6">
            <div>
              <h1 className="text-[20px] font-bold text-[#0f2d1e]">Export Report</h1>
              <p className="text-[12.5px] text-gray-500 mt-0.5">Configure your download settings before exporting.</p>
            </div>

            {/* Format */}
            <Card className="p-5">
              <p className="text-[13px] font-bold text-[#111827] mb-4">Export Format</p>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: "pdf", icon: FileText, label: "PDF", desc: "Best for sharing" },
                  { id: "excel", icon: Layers, label: "Excel", desc: "Editable data" },
                  { id: "csv", icon: Activity, label: "CSV", desc: "Raw data" },
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setFormat(f.id)}
                    className={`flex flex-col items-center p-4 rounded-xl border-2 transition-all
                      ${format === f.id ? "border-emerald-500 bg-emerald-50" : "border-gray-200 hover:border-gray-300"}`}
                  >
                    <f.icon className={`w-6 h-6 mb-2 ${format === f.id ? "text-emerald-600" : "text-gray-400"}`} />
                    <span className={`text-[13px] font-bold ${format === f.id ? "text-emerald-700" : "text-gray-700"}`}>{f.label}</span>
                    <span className={`text-[11px] mt-0.5 ${format === f.id ? "text-emerald-500" : "text-gray-400"}`}>{f.desc}</span>
                  </button>
                ))}
              </div>
            </Card>

            {/* Paper + orientation (PDF only) */}
            {format === "pdf" && (
              <Card className="p-5">
                <p className="text-[13px] font-bold text-[#111827] mb-4">Page Settings</p>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-[12px] font-semibold text-gray-600 mb-2">Paper Size</p>
                    <div className="flex flex-wrap gap-2">
                      {["A4", "Letter", "Legal", "A3"].map((p) => (
                        <button
                          key={p}
                          onClick={() => setPaper(p)}
                          className={`px-3 py-1.5 rounded-lg text-[12px] font-medium border transition-all
                            ${paper === p ? "bg-emerald-600 border-emerald-600 text-white" : "border-gray-200 text-gray-600 hover:border-gray-300"}`}
                        >{p}</button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-[12px] font-semibold text-gray-600 mb-2">Orientation</p>
                    <div className="flex gap-2">
                      {["Portrait", "Landscape"].map((o) => (
                        <button
                          key={o}
                          onClick={() => setOrient(o)}
                          className={`flex-1 py-1.5 rounded-lg text-[12px] font-medium border transition-all
                            ${orient === o ? "bg-emerald-600 border-emerald-600 text-white" : "border-gray-200 text-gray-600 hover:border-gray-300"}`}
                        >{o}</button>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {/* Sections */}
            <Card className="p-5">
              <p className="text-[13px] font-bold text-[#111827] mb-4">Sections to Include</p>
              <div className="space-y-3">
                {allSections.map((s) => (
                  <label key={s} className="flex items-center gap-3 cursor-pointer group">
                    <div
                      onClick={() => s !== "Executive Summary" && toggleSection(s)}
                      className={`w-4 h-4 rounded border flex items-center justify-center transition-all flex-shrink-0 cursor-pointer
                        ${sections.includes(s) ? "bg-emerald-600 border-emerald-600" : "border-gray-300 bg-white"}
                        ${s === "Executive Summary" ? "opacity-60 cursor-not-allowed" : ""}`}
                    >
                      {sections.includes(s) && <Check className="w-2.5 h-2.5 text-white" />}
                    </div>
                    <span className="text-[13px] text-gray-700 group-hover:text-gray-900 flex-1">{s}</span>
                    {s === "Executive Summary" && <Chip className="bg-gray-100 text-gray-500">Required</Chip>}
                  </label>
                ))}
              </div>
            </Card>

            {/* Additional options */}
            <Card className="p-5">
              <p className="text-[13px] font-bold text-[#111827] mb-4">Additional Options</p>
              <div className="space-y-3">
                {[
                  { label: "Include cover page", checked: true },
                  { label: "Include table of contents", checked: true },
                  { label: "Add watermark (Confidential)", checked: false },
                  { label: "Include page numbers", checked: true },
                ].map((o) => (
                  <label key={o.label} className="flex items-center gap-3 cursor-pointer">
                    <div className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 ${o.checked ? "bg-emerald-600 border-emerald-600" : "border-gray-300 bg-white"}`}>
                      {o.checked && <Check className="w-2.5 h-2.5 text-white" />}
                    </div>
                    <span className="text-[13px] text-gray-700">{o.label}</span>
                  </label>
                ))}
              </div>
            </Card>
          </div>

          {/* Right: summary + export CTA */}
          <div className="space-y-5">
            {/* Summary card */}
            <Card className="p-5 sticky top-[72px]">
              <p className="text-[13px] font-bold text-[#111827] mb-4">Export Summary</p>
              <div className="bg-[#0f2d1e] rounded-xl p-4 mb-4">
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

              <div className="space-y-2.5 mb-5">
                {[
                  { label: "Format", value: format.toUpperCase() },
                  { label: "Paper", value: format === "pdf" ? `${paper} · ${orient}` : "—" },
                  { label: "Sections", value: `${sections.length} of ${allSections.length}` },
                  { label: "Est. size", value: "~2.4 MB" },
                  { label: "Est. pages", value: format === "pdf" ? "~6 pages" : "—" },
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
                  <><RefreshCw className="w-4 h-4 animate-spin" />Generating…</>
                ) : (
                  <><Download className="w-4 h-4" />Export as {format.toUpperCase()}</>
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
      )}
    </main>
  );
}

export { ExportReportPage };