import React, { useState } from "react";
import { ReportsOverviewPage } from "./pages/ReportsOverviewPage.jsx";
import { NewReportPage } from "./pages/NewReportPage.jsx";
import { PreviewReportPage } from "./pages/PreviewReportPage.jsx";
import { ExportReportPage } from "./pages/ExportReportPage.jsx";

// ─── ROOT — Router ────────────────────────────────────────────────────────────
// Accepts userRole prop so pages know whether the user is a Supervisor or Admin.
export default function ReportsApp({ userRole }) {
  const [page, setPage] = useState("overview");
  const [params, setParams] = useState({});

  const navigate = (nextPage, nextParams = {}) => {
    setPage(nextPage);
    setParams(nextParams);
  };

  return (
    <div className="flex flex-col h-screen bg-[#f8faf9] font-sans overflow-hidden">
      {page === "overview" && <ReportsOverviewPage navigate={navigate} userRole={userRole} />}
      {page === "new-report" && <NewReportPage navigate={navigate} userRole={userRole} />}
      {page === "preview" && <PreviewReportPage navigate={navigate} reportType={params.reportType || "intern"} />}
      {page === "export" && <ExportReportPage navigate={navigate} reportType={params.reportType || "intern"} />}
    </div>
  );
}