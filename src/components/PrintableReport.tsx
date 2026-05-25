import React from "react";
import { TEST_CATEGORIES } from "../lib/data";
import { getPatients } from "../lib/store";

const PrintableReport = ({ report }) => {
  // Patient details
  const patientName = report.patientName || "-";
  const doctorName = report.doctorName || "-";
  const date = report.createdAt ? new Date(report.createdAt).toLocaleDateString() : "-";
  const time = report.createdAt ? new Date(report.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "-";
  const testId = report.id || "-";
  const patientId = report.patientId || "-";

  // Fetch patient details for age/sex
  let age = "-", gender = "-";
  try {
    const patients = getPatients();
    const patient = patients.find(p => p.id === patientId);
    if (patient) {
      age = patient.age ? String(patient.age) : "-";
      gender = patient.gender || "-";
    }
  } catch {}

  return (
    <div id="print-report" className="bg-white p-4 w-full max-w-[1100px] mx-auto text-black font-sans text-xs leading-tight">
      {/* Patient & Report Info */}
      <div className="flex flex-wrap justify-between items-center border-b border-gray-400 pb-2 mb-4">
        <div className="flex flex-col gap-1">
          <span className="font-semibold text-base">Patient Name: <span className="font-normal">{patientName}</span></span>
          <span>Patient ID: <span className="font-normal">{patientId}</span></span>
          <span>Age/Sex: <span className="font-normal">{age} / {gender}</span></span>
          <span>Test ID: <span className="font-normal">{testId}</span></span>
          <span>Doctor: <span className="font-normal">{doctorName}</span></span>
        </div>
        <div className="flex flex-col gap-1 text-right">
          <span>Date: <span className="font-normal">{date}</span></span>
          <span>Collection Time: <span className="font-normal">{time}</span></span>
        </div>
      </div>

      {/* Only performed test sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {report.tests && report.tests.length > 0 ? report.tests.map((test, idx) => {
          const cat = TEST_CATEGORIES.find(c => c.id === test.testCategoryId);
          return (
            <div key={test.testCategoryId} className="mb-2 border border-gray-300 rounded">
              <div className="font-bold text-xs bg-gray-100 border-b border-gray-300 px-2 py-1 uppercase tracking-wide">{cat?.name || test.testCategoryName}</div>
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-300 px-1 py-0.5 text-left">Parameter</th>
                    <th className="border border-gray-300 px-1 py-0.5 text-left">Result</th>
                    <th className="border border-gray-300 px-1 py-0.5 text-left">Unit</th>
                    <th className="border border-gray-300 px-1 py-0.5 text-left">Reference</th>
                  </tr>
                </thead>
                <tbody>
                  {cat?.subcategories.map(param => {
                    const result = test.results.find(r => r.subCategoryId === param.id);
                    return (
                      <tr key={param.id}>
                        <td className="border border-gray-300 px-1 py-0.5 font-semibold">{param.name}</td>
                        <td className="border border-gray-300 px-1 py-0.5">{result?.value || "N/A"}</td>
                        <td className="border border-gray-300 px-1 py-0.5 text-gray-600">{param.unit || ""}</td>
                        <td className="border border-gray-300 px-1 py-0.5 text-gray-600">{param.normalRange || ""}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          );
        }) : <div className="text-gray-400">No tests performed.</div>}
      </div>

      {/* Remarks */}
      <div className="mb-4 mt-2">
        <span className="font-semibold">Remarks:</span>
        <span className="ml-2">{report.remarks || "-"}</span>
      </div>

      {/* Signature Area */}
      <div className="flex justify-between mt-8 pt-4">
        <div className="flex flex-col items-center">
          <div className="w-32 border-t border-gray-400 mb-1"></div>
          <span className="text-xs">Technician Signature</span>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-32 border-t border-gray-400 mb-1"></div>
          <span className="text-xs">Doctor Signature</span>
        </div>
      </div>
    </div>
  );
};

export default PrintableReport;
