import React from "react";

const ReportEditor = ({ report, onChange, onSave, onCancel }) => (
  <div id="print-report" className="bg-white p-8 w-full max-w-[800px] mx-auto text-black font-sans">
    {/* Patient Details */}
    <div className="flex flex-wrap justify-between items-center border-b border-gray-400 pb-4 mb-6">
      <div className="flex flex-col gap-1">
        <label className="font-semibold text-lg">
          Patient Name:
          <input
            className="ml-2 border-b border-gray-400 outline-none"
            value={report.patient?.name || ""}
            onChange={e => onChange(["patient", "name"], e.target.value)}
          />
        </label>
        <label>
          Age:
          <input
            className="ml-2 border-b border-gray-400 outline-none w-12"
            value={report.patient?.age || ""}
            onChange={e => onChange(["patient", "age"], e.target.value)}
          />
        </label>
        <label>
          Gender:
          <input
            className="ml-2 border-b border-gray-400 outline-none w-16"
            value={report.patient?.gender || ""}
            onChange={e => onChange(["patient", "gender"], e.target.value)}
          />
        </label>
      </div>
      <div className="flex flex-col gap-1 text-right">
        <label>
          Doctor:
          <input
            className="ml-2 border-b border-gray-400 outline-none"
            value={report.patient?.doctor || ""}
            onChange={e => onChange(["patient", "doctor"], e.target.value)}
          />
        </label>
        <span>Date: {report.date || "-"}</span>
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
                    <td className="border border-gray-400 px-2 py-1">
                      <input
                        className="w-full border-b border-gray-300 outline-none"
                        value={r.parameter}
                        onChange={e => onChange(["tests", idx, "results", i, "parameter"], e.target.value)}
                      />
                    </td>
                    <td className="border border-gray-400 px-2 py-1">
                      <input
                        className="w-full border-b border-gray-300 outline-none"
                        value={r.value}
                        onChange={e => onChange(["tests", idx, "results", i, "value"], e.target.value)}
                      />
                    </td>
                    <td className="border border-gray-400 px-2 py-1">
                      <input
                        className="w-full border-b border-gray-300 outline-none"
                        value={r.unit}
                        onChange={e => onChange(["tests", idx, "results", i, "unit"], e.target.value)}
                      />
                    </td>
                    <td className="border border-gray-400 px-2 py-1">
                      <input
                        className="w-full border-b border-gray-300 outline-none"
                        value={r.reference}
                        onChange={e => onChange(["tests", idx, "results", i, "reference"], e.target.value)}
                      />
                    </td>
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
      <label className="font-semibold">
        Remarks:
        <input
          className="ml-2 border-b border-gray-400 outline-none w-2/3"
          value={report.remarks || ""}
          onChange={e => onChange(["remarks"], e.target.value)}
        />
      </label>
    </div>

    {/* Action Buttons */}
    <div className="flex justify-end gap-4 mt-8 no-print">
      <button
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        onClick={onSave}
        type="button"
      >
        Save
      </button>
      <button
        className="bg-gray-400 text-white px-6 py-2 rounded hover:bg-gray-500"
        onClick={onCancel}
        type="button"
      >
        Cancel
      </button>
    </div>
  </div>
);

export default ReportEditor;
