import React, { useMemo, useState } from "react";
import { formatPatientAge } from "@/lib/data";

export interface PatientRecordProps {
  patients: any[];
  reports: any[];
  onSelectPatient: (id: string) => void;
  onOpenReport: (reportId: string) => void;
  onCreateReport: (patientId: string) => void;
  patientSearch: string;
  setPatientSearch: (s: string) => void;
  selectedPatientId: string | null;
}

const PatientRecord: React.FC<PatientRecordProps> = ({
  patients,
  reports,
  onSelectPatient,
  onOpenReport,
  onCreateReport,
  patientSearch,
  setPatientSearch,
  selectedPatientId,
}) => {
  const [reportSortField, setReportSortField] = useState<"date" | "name" | "mobile" | "testId">("date");
  const [reportSortDirection, setReportSortDirection] = useState<"asc" | "desc">("desc");

  const getPatientForReport = (report: any) => {
    if (report?.patient) return report.patient;
    return patients.find((patient) => patient.id === report?.patientId) || null;
  };

  const getReportDateValue = (report: any) => {
    const dateText = report?.reportedAt || report?.createdAt || "";
    const timestamp = new Date(dateText).getTime();
    return Number.isFinite(timestamp) ? timestamp : 0;
  };

  const getReportNameValue = (report: any) => {
    const reportPatient = getPatientForReport(report);
    return String(reportPatient?.name || report?.patientName || "").toUpperCase();
  };

  const getReportMobileValue = (report: any) => {
    const reportPatient = getPatientForReport(report);
    return String(reportPatient?.phone || "").toUpperCase();
  };

  const getReportTestIdValue = (report: any) => {
    const reportPatient = getPatientForReport(report);
    return String(reportPatient?.testId || report?.testId || report?.id || "").toUpperCase();
  };

  const sortedReports = useMemo(() => {
    const items = [...reports];
    items.sort((a, b) => {
      let comparison = 0;

      if (reportSortField === "date") {
        comparison = getReportDateValue(a) - getReportDateValue(b);
      } else if (reportSortField === "name") {
        comparison = getReportNameValue(a).localeCompare(getReportNameValue(b));
      } else if (reportSortField === "mobile") {
        comparison = getReportMobileValue(a).localeCompare(getReportMobileValue(b));
      } else {
        comparison = getReportTestIdValue(a).localeCompare(getReportTestIdValue(b));
      }

      return reportSortDirection === "asc" ? comparison : -comparison;
    });

    return items;
  }, [reports, reportSortField, reportSortDirection]);

  const selectedPatient = patients.find(p => p.id === selectedPatientId);
  const patientReports = reports.filter(r => r.patientId === selectedPatientId);
  return (
    <div className="patient-record rounded-2xl border border-slate-200 bg-white/60 p-4">
      <input
        className="neo-input mb-2 w-full px-3 py-2 text-sm"
        placeholder="Search by name, mobile, or ID..."
        value={patientSearch}
        onChange={e => setPatientSearch(e.target.value)}
      />
      <div className="mb-4 max-h-56 overflow-y-auto rounded-xl border border-slate-200 bg-white text-xs">
        {patients.filter(p =>
          p.name.toLowerCase().includes(patientSearch.toLowerCase()) ||
          p.phone.includes(patientSearch) ||
          p.id.includes(patientSearch)
        ).map(p => (
          <div
            key={p.id}
            className={`cursor-pointer border-b border-slate-100 px-3 py-2 hover:bg-primary/10 ${selectedPatientId === p.id ? "bg-primary/15" : ""}`}
            onClick={() => onSelectPatient(p.id)}
          >
            <div className="font-semibold text-slate-800">{p.name} ({p.gender}, {formatPatientAge(p)})</div>
            <div className="text-slate-500">{p.phone} | ID: {p.id}</div>
          </div>
        ))}
        {patients.length === 0 && <div className="px-2 py-1 text-muted-foreground">No patients found</div>}
      </div>
      {selectedPatient && (
        <div className="mb-4 rounded-xl border border-slate-200 bg-white p-3 text-xs text-slate-700">
          <div><b>Name:</b> {selectedPatient.name}</div>
          <div><b>Test ID:</b> {selectedPatient.testId || "-"}</div>
          <div><b>Age/Gender:</b> {formatPatientAge(selectedPatient)} / {selectedPatient.gender}</div>
          <div><b>Mobile:</b> {selectedPatient.phone}</div>
          <div><b>Doctor:</b> {selectedPatient.refBy || "-"}</div>
          <div><b>Visit History:</b> {patientReports.length} reports</div>
          <button className="neo-btn mt-2 px-3 py-1 text-sm" onClick={() => onCreateReport(selectedPatient.id)}>Create New Report</button>
        </div>
      )}
      {selectedPatient && patientReports.length > 0 && (
        <div className="mb-2">
          <div className="mb-1 font-bold text-slate-700">Previous Reports</div>
          <div className="max-h-40 overflow-y-auto rounded-xl border border-slate-200 bg-white text-xs">
            {patientReports.map(r => (
              <div key={r.id} className="cursor-pointer border-b border-slate-100 px-3 py-2 hover:bg-primary/10" onClick={() => onOpenReport(r.id)}>
                <div>Report ID: {r.id}</div>
                <div>Date: {new Date(r.createdAt).toLocaleDateString()}</div>
              </div>
            ))}
          </div>
        </div>
      )}
      {reports.length > 0 && (
        <div className="mt-4 mb-2">
          <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
            <div className="font-bold text-slate-700">All Reports Till Date</div>
            <div className="flex items-center gap-2 text-xs">
              <label htmlFor="report-sort-field" className="text-slate-600">Sort by</label>
              <select
                id="report-sort-field"
                className="neo-input px-2 py-1"
                value={reportSortField}
                onChange={(e) => setReportSortField(e.target.value as "date" | "name" | "mobile" | "testId")}
              >
                <option value="date">Date</option>
                <option value="name">Name</option>
                <option value="mobile">Mobile Number</option>
                <option value="testId">Test ID</option>
              </select>
              <button
                className="neo-btn px-2 py-1"
                onClick={() => setReportSortDirection((direction) => (direction === "asc" ? "desc" : "asc"))}
              >
                {reportSortDirection === "asc" ? "Ascending" : "Descending"}
              </button>
            </div>
          </div>
          <div className="max-h-56 overflow-y-auto rounded-xl border border-slate-200 bg-white text-xs">
            {sortedReports.map((report) => {
              const reportPatient = getPatientForReport(report);
              const reportDateText = report?.reportedAt || report?.createdAt;

              return (
                <div
                  key={report.id}
                  className="cursor-pointer border-b border-slate-100 px-3 py-2 hover:bg-primary/10"
                  onClick={() => onOpenReport(report.id)}
                >
                  <div className="font-semibold text-slate-800">{reportPatient?.name || report.patientName || "-"}</div>
                  <div className="text-slate-500">Mobile: {reportPatient?.phone || "-"} | Test ID: {reportPatient?.testId || report.testId || "-"}</div>
                  <div className="text-slate-500">Report ID: {report.id} | Date: {reportDateText ? new Date(reportDateText).toLocaleDateString() : "-"}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientRecord;
