import { useLocation } from "react-router-dom";
import PrintableReport, { ClinicalReport, ClinicalReportSection, ClinicalTestRow } from "@/components/PrintableReport";
import "@/styles/print.css";
import { useRef, useState } from "react";


// Dummy loader for demonstration; replace with real data loader
function loadClinicalReport(reportId: string): ClinicalReport | null {
  return {
    id: reportId,
    patient: {
      name: "Ravi Kumar",
      age: "35",
      sex: "Male",
      refBy: "Dr. S. Pandey",
      testId: "RPT-2026-0012",
      date: "27/05/2026",
      collectionDate: "27/05/2026",
    },
    sections: [
      {
        id: "haem",
        category: "HAEMATOLOGY",
        tests: [
          { id: "hb", testName: "Haemoglobin", result: "12.4", unit: "gm%", referenceRange: "11.5-16.5" },
          { id: "wbc", testName: "WBC Count", result: "7800", unit: "/cumm", referenceRange: "4000-11000" },
          { id: "plt", testName: "Platelet Count", result: "N/A", unit: "lakh/cumm", referenceRange: "1.5-3.5" },
        ],
      },
      {
        id: "bio",
        category: "BIOCHEMISTRY",
        tests: [
          { id: "fbs", testName: "Fasting Blood Sugar", result: "98", unit: "mg/dl", referenceRange: "70-110" },
        ],
      },
    ],
    remarks: "All values within normal limits.",
  };
}

export default function ClinicalReportView() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const reportId = params.get("reportId") || "demo";
  const [report, setReport] = useState<ClinicalReport | null>(() => loadClinicalReport(reportId));
  const printRef = useRef<HTMLDivElement>(null);

  function handlePrint() {
    const originalTitle = document.title;
    document.title = `Bhagwati Pathology - ${report?.id || "REPORT"}`;

    const restoreTitle = () => {
      document.title = originalTitle;
    };

    window.addEventListener("afterprint", restoreTitle, { once: true });
    window.print();
    setTimeout(restoreTitle, 1500);
  }

  // Add Section
  function handleAddSection() {
    if (!report) return;
    const newSection: ClinicalReportSection = {
      id: `section-${Date.now()}`,
      category: "NEW SECTION",
      tests: [],
    };
    setReport({ ...report, sections: [...report.sections, newSection] });
  }

  // Add Test to Section
  function handleAddTest(sectionId: string) {
    if (!report) return;
    setReport({
      ...report,
      sections: report.sections.map(sec =>
        sec.id === sectionId
          ? {
              ...sec,
              tests: [
                ...sec.tests,
                {
                  id: `test-${Date.now()}`,
                  testName: "New Test",
                  result: "",
                  unit: "",
                  referenceRange: "",
                },
              ],
            }
          : sec
      ),
    });
  }

  if (!report) return <div>Report not found.</div>;
  return (
    <div style={{ maxWidth: 900, margin: "0 auto", background: "#e0e5ec", borderRadius: 24, boxShadow: "8px 8px 24px #b8bac0, -8px -8px 24px #ffffff", padding: 24 }}>
      <div className="print-hide" style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
        <button className="neo-btn" style={{ marginRight: 8, borderRadius: 16, boxShadow: "4px 4px 12px #b8bac0, -4px -4px 12px #ffffff", background: "#e0e5ec", color: "#222", fontWeight: 600, padding: "8px 20px" }} onClick={handleAddSection}>
          + Add Section
        </button>
        <button className="neo-btn" style={{ borderRadius: 16, boxShadow: "4px 4px 12px #b8bac0, -4px -4px 12px #ffffff", background: "#e0e5ec", color: "#222", fontWeight: 600, padding: "8px 20px" }} onClick={handlePrint}>
          Print Report
        </button>
      </div>
      {/* Render sections with Add Test button */}
      <div ref={printRef}>
        <div id="print-report">
          {/* Patient Header and Remarks via PrintableReport */}
          <PrintableReport report={report} />
          {/* Add Test buttons for each section (edit mode only, not in print) */}
          <div className="print-hide" style={{ marginTop: 12 }}>
            {report.sections.map(section => (
              <div key={section.id} style={{ margin: "8px 0", display: "flex", justifyContent: "flex-end" }}>
                <button
                  className="neo-btn"
                  style={{ borderRadius: 16, boxShadow: "4px 4px 12px #b8bac0, -4px -4px 12px #ffffff", background: "#e0e5ec", color: "#222", fontWeight: 600, padding: "6px 16px" }}
                  onClick={() => handleAddTest(section.id)}
                >
                  + Add Test in {section.category}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}