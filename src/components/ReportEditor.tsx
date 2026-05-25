import React, { useRef, useState } from "react";
import { TEST_CATEGORIES } from "../lib/data";

const ReportEditor = ({ report, onChange, onSave, onCancel }) => {
  const originalReport = useRef(JSON.parse(JSON.stringify(report)));
  const [newTestCategoryId, setNewTestCategoryId] = useState("");
  const [newTestResults, setNewTestResults] = useState({});

  const handleReset = () => {
    onChange("patientName", originalReport.current.patientName);
    onChange("doctorName", originalReport.current.doctorName);
    onChange("remarks", originalReport.current.remarks);
    onChange("tests", originalReport.current.tests);
  };

  // Add new test section
  const handleAddTest = () => {
    if (!newTestCategoryId) return;
    if (report.tests.some(t => t.testCategoryId === newTestCategoryId)) return;
    const cat = TEST_CATEGORIES.find(c => c.id === newTestCategoryId);
    if (!cat) return;
    const newTest = {
      testCategoryId: cat.id,
      testCategoryName: cat.name,
      testType: cat.type,
      results: cat.subcategories.map(sub => ({ subCategoryId: sub.id, value: newTestResults[sub.id] || "" })),
    };
    onChange("tests", [...report.tests, newTest]);
    setNewTestCategoryId("");
    setNewTestResults({});
  };

  // Update result for a test section
  const handleResultChange = (testIdx, subCategoryId, value) => {
    const updatedTests = report.tests.map((t, idx) => {
      if (idx !== testIdx) return t;
      return {
        ...t,
        results: t.results.map(r => r.subCategoryId === subCategoryId ? { ...r, value } : r),
      };
    });
    onChange("tests", updatedTests);
  };

  return (
    <div id="print-report" className="bg-white p-8 w-full max-w-[900px] mx-auto text-black font-sans">
      {/* Summary */}
      <div className="mb-6 p-4 rounded bg-blue-50 border border-blue-200">
        <div className="font-bold text-lg mb-1">Editing Report</div>
        <div className="text-sm text-gray-600">Patient: <b>{report.patientName || "-"}</b> | Doctor: <b>{report.doctorName || "-"}</b> | Date: <b>{report.createdAt ? new Date(report.createdAt).toLocaleDateString() : "-"}</b></div>
      </div>

      {/* Patient Details */}
      <div className="flex flex-wrap gap-8 items-end border-b border-gray-200 pb-4 mb-6">
        <div className="flex flex-col gap-2">
          <label className="font-semibold">Patient Name
            <input className="ml-2 border-b border-gray-400 outline-none" value={report.patientName || ""} onChange={e => onChange("patientName", e.target.value)} />
          </label>
        </div>
        <div className="flex flex-col gap-2">
          <label>Doctor
            <input className="ml-2 border-b border-gray-400 outline-none" value={report.doctorName || ""} onChange={e => onChange("doctorName", e.target.value)} />
          </label>
        </div>
      </div>

      {/* Multi-Test Sections */}
      {report.tests && report.tests.length > 0 && report.tests.map((test, testIdx) => {
        const cat = TEST_CATEGORIES.find(c => c.id === test.testCategoryId);
        return (
          <div key={test.testCategoryId} className="mb-6">
            <div className="font-bold text-base border-b border-gray-300 pb-1 mb-2 uppercase tracking-wide">{cat?.name || test.testCategoryName}</div>
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
                {cat?.subcategories.map((param, i) => {
                  const result = test.results.find(r => r.subCategoryId === param.id) || { value: "" };
                  return (
                    <tr key={param.id}>
                      <td className="border border-gray-400 px-2 py-1 font-semibold">{param.name}</td>
                      <td className="border border-gray-400 px-2 py-1">
                        <input
                          className="w-full border-b border-blue-400 outline-none bg-blue-50 focus:bg-white px-1"
                          value={result.value}
                          placeholder="Enter value"
                          onChange={e => handleResultChange(testIdx, param.id, e.target.value)}
                        />
                      </td>
                      <td className="border border-gray-400 px-2 py-1 text-gray-600">{param.unit || ""}</td>
                      <td className="border border-gray-400 px-2 py-1 text-gray-600">{param.normalRange || ""}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        );
      })}

      {/* Add New Test Section */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <select
            className="border px-2 py-1 rounded"
            value={newTestCategoryId}
            onChange={e => setNewTestCategoryId(e.target.value)}
          >
            <option value="">Select Test to Add</option>
            {TEST_CATEGORIES.filter(cat => !report.tests.some(t => t.testCategoryId === cat.id)).map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
          <button
            className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700"
            type="button"
            onClick={handleAddTest}
          >Add New Test</button>
        </div>
        {/* Show parameters for new test before adding */}
        {newTestCategoryId && (
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
              {TEST_CATEGORIES.find(cat => cat.id === newTestCategoryId)?.subcategories.map(param => (
                <tr key={param.id}>
                  <td className="border border-gray-400 px-2 py-1 font-semibold">{param.name}</td>
                  <td className="border border-gray-400 px-2 py-1">
                    <input
                      className="w-full border-b border-blue-400 outline-none bg-blue-50 focus:bg-white px-1"
                      value={newTestResults[param.id] || ""}
                      placeholder="Enter value"
                      onChange={e => setNewTestResults({ ...newTestResults, [param.id]: e.target.value })}
                    />
                  </td>
                  <td className="border border-gray-400 px-2 py-1 text-gray-600">{param.unit || ""}</td>
                  <td className="border border-gray-400 px-2 py-1 text-gray-600">{param.normalRange || ""}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Remarks */}
      <div className="mb-8">
        <label className="font-semibold">
          Remarks:
          <input className="ml-2 border-b border-gray-400 outline-none w-2/3" value={report.remarks || ""} onChange={e => onChange("remarks", e.target.value)} />
        </label>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-4 mt-8 no-print">
        <button className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700" onClick={onSave} type="button">Save</button>
        <button className="bg-gray-400 text-white px-6 py-2 rounded hover:bg-gray-500" onClick={onCancel} type="button">Cancel</button>
        <button className="bg-yellow-500 text-white px-6 py-2 rounded hover:bg-yellow-600" onClick={handleReset} type="button">Reset</button>
        <button
          className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700"
          type="button"
          onClick={() => {
            if (window.confirm("Are you sure you want to delete this report?")) {
              import("../lib/store").then(mod => {
                mod.deleteReport(report.id);
                window.location.href = "/reports";
              });
            }
          }}
        >Delete Report</button>
      </div>
    </div>
  );
};

export default ReportEditor;
