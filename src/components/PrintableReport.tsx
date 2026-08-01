import React from "react";

const SIGNATURE_ASSET_VERSION = "20260726a";
const PATHOLOGIST_SIGNATURE_SRC = `${import.meta.env.BASE_URL}pathologist-signature.jpeg?v=${SIGNATURE_ASSET_VERSION}`;
const PATHOLOGIST_SIGNATURE_FALLBACK_SRC = `${import.meta.env.BASE_URL}pathologist-signature.svg?v=${SIGNATURE_ASSET_VERSION}`;

// Types for new clinical report structure
export interface ClinicalTestRow {
  id: string;
  testName: string;
  result: string;
  unit: string;
  referenceRange: string;
}

export interface ClinicalReportSection {
  id: string;
  category: string;
  tests: ClinicalTestRow[];
}

export interface ClinicalReport {
  id: string;
  patient: {
    name: string;
    age: string;
    sex: string;
    refBy: string;
    testId: string;
    date: string;
    collectionDate: string;
  };
  sections: ClinicalReportSection[];
  remarks?: string;
}

// Printable report component
const PrintableReport: React.FC<{ report: ClinicalReport }> = ({ report }) => {
  const hasFedValue = (value: unknown): boolean => {
    const text = String(value ?? "").trim();
    if (!text) return false;
    const upper = text.toUpperCase();
    return upper !== "N/A" && text !== "-";
  };

  const parsedDate = new Date(report.patient.date || report.patient.collectionDate || "");
  const printableDate = Number.isNaN(parsedDate.getTime())
    ? (report.patient.date || report.patient.collectionDate || "-")
    : parsedDate.toLocaleDateString("en-IN");
  const printableTime = Number.isNaN(parsedDate.getTime())
    ? "-"
    : parsedDate.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });

  return (
    <div id="print-report" style={{ fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 11, width: '100%' }}>
      {/* Patient Details - compact, full width, no branding */}
      <table style={{ width: '100%', marginBottom: 8, borderCollapse: 'collapse', tableLayout: 'fixed' }}>
        <tbody>
          <tr>
            <td style={{ padding: '2px 6px' }}><b>Patient Name:</b> {report.patient.name}</td>
            <td style={{ padding: '2px 6px' }}><b>Age:</b> {report.patient.age}</td>
            <td style={{ padding: '2px 6px' }}><b>Gender:</b> {report.patient.sex}</td>
            <td style={{ padding: '2px 6px' }}><b>Ref Doctor:</b> {report.patient.refBy}</td>
          </tr>
          <tr>
            <td style={{ padding: '2px 6px' }}><b>Date:</b> {printableDate}</td>
            <td style={{ padding: '2px 6px' }}><b>Time:</b> {printableTime}</td>
            <td style={{ padding: '2px 6px' }}><b>Report ID:</b> {report.patient.testId}</td>
            <td style={{ padding: '2px 6px' }}></td>
          </tr>
        </tbody>
      </table>
      {/* Sections - full width, dense, professional table */}
      {report.sections.map(section => {
        const filledTests = section.tests.filter(test => hasFedValue(test.result));
        if (filledTests.length === 0) return null;

        return (
          <div key={section.id} style={{ marginBottom: 10 }}>
            <div style={{ fontWeight: 'bold', fontSize: 12, letterSpacing: 1, marginBottom: 2, borderBottom: '1px solid #222', paddingBottom: 2, textTransform: 'uppercase' }}>
              {section.category}
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 2, tableLayout: 'fixed', fontSize: 11 }}>
              <thead>
                <tr>
                  <th style={{ textAlign: 'left', border: '1px solid #222', padding: '2px 4px', fontWeight: 'bold', background: '#f8f8f8' }}>Parameter</th>
                  <th style={{ textAlign: 'left', border: '1px solid #222', padding: '2px 4px', fontWeight: 'bold', background: '#f8f8f8' }}>Result</th>
                  <th style={{ textAlign: 'left', border: '1px solid #222', padding: '2px 4px', fontWeight: 'bold', background: '#f8f8f8' }}>Unit</th>
                  <th style={{ textAlign: 'left', border: '1px solid #222', padding: '2px 4px', fontWeight: 'bold', background: '#f8f8f8' }}>Reference Range</th>
                </tr>
              </thead>
              <tbody>
                {filledTests.map(test => (
                  <tr key={test.id}>
                    <td style={{ padding: '2px 4px', border: '1px solid #222', wordBreak: 'break-word' }}>{test.testName}</td>
                    <td style={{ padding: '2px 4px', border: '1px solid #222', fontWeight: 'bold', wordBreak: 'break-word' }}>{test.result}</td>
                    <td style={{ padding: '2px 4px', border: '1px solid #222', wordBreak: 'break-word' }}>{test.unit}</td>
                    <td style={{ padding: '2px 4px', border: '1px solid #222', wordBreak: 'break-word' }}>{test.referenceRange}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      })}
      {/* Signature Area */}
      <div style={{ marginTop: 32, display: 'flex', justifyContent: 'space-between', fontSize: 11 }}>
        <div>Technician Signature</div>
        <div style={{ textAlign: 'right' }}>
          <img
            src={PATHOLOGIST_SIGNATURE_SRC}
            alt="Pathologist signature"
            style={{ height: 42, width: 'auto', objectFit: 'contain', display: 'block', marginLeft: 'auto' }}
            onError={(event) => {
              const img = event.currentTarget;
              if (img.src.includes("pathologist-signature.jpeg")) {
                img.src = PATHOLOGIST_SIGNATURE_FALLBACK_SRC;
                return;
              }
              img.style.display = 'none';
            }}
          />
          <div style={{ borderTop: '1px solid #222', paddingTop: 4 }}>Pathologist Signature</div>
        </div>
      </div>
    </div>
  );
};

export default PrintableReport;
