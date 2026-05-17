import React from "react";

const PrintableReport = ({ report }) => (
  <div id="print-report" className="bg-white p-8 w-full max-w-[800px] mx-auto text-black font-sans">
    {/* Patient Details */}
    <div className="flex flex-wrap justify-between items-center border-b border-gray-400 pb-4 mb-6">
      <div className="flex flex-col gap-1">
        <span className="font-semibold text-lg">Patient Name: <span className="font-normal">{report.patient?.name || "-"}</span></span>
        <span>Age: <span className="font-normal">{report.patient?.age || "-"}</span></span>
        <span>Gender: <span className="font-normal">{report.patient?.gender || "-"}</span></span>
      </div>
      <div className="flex flex-col gap-1 text-right">
        <span>Doctor: <span className="font-normal">{report.patient?.doctor || "-"}</span></span>
        <span>Date: <span className="font-normal">{report.date || "-"}</span></span>
      </div>
    </div>

    {/* Test Sections */}
    {Array.isArray(report.tests) && report.tests.length > 0 ? (
      report.tests.map((test, idx) => (
        <div key={idx} className="mb-8">
          <div className="font-bold text-base border-b border-gray-300 pb-1 mb-2 uppercase tracking-wide">{test.name}</div>
          <table className="w-full border border-gray-400 mb-2 text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-400 px-2 py-1 text-left">Parameter</th>
                <th className="border border-gray-400 px-2 py-1 text-left">Result</th>
                <th className="border border-gray-400 px-2 py-1 text-left">Unit</th>
                <th className="border border-gray-400 px-2 py-1 text-left">Reference Range</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(test.results) && test.results.length > 0 ? (
                test.results.map((r, i) => (
                  <tr key={i}>
                    <td className="border border-gray-400 px-2 py-1">{r.parameter}</td>
                    <td className="border border-gray-400 px-2 py-1">{r.value}</td>
                    <td className="border border-gray-400 px-2 py-1">{r.unit}</td>
                    <td className="border border-gray-400 px-2 py-1">{r.reference}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="border border-gray-400 px-2 py-1 text-center text-gray-400">No results</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      ))
    ) : (
      <div className="text-center text-gray-400 mb-8">No tests available</div>
    )}

    {/* Remarks */}
    <div className="mb-8">
      <span className="font-semibold">Remarks:</span>
      <span className="ml-2">{report.remarks || "-"}</span>
    </div>

    {/* Signature Area */}
    <div className="flex justify-between mt-16 pt-8">
      <div className="flex flex-col items-center">
        <div className="w-48 border-t border-gray-400 mb-1"></div>
        <span className="text-sm">Technician Signature</span>
      </div>
      <div className="flex flex-col items-center">
        <div className="w-48 border-t border-gray-400 mb-1"></div>
        <span className="text-sm">Doctor Signature</span>
      </div>
    </div>
  </div>
);

export default PrintableReport;
