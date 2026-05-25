
import React, { useState, useEffect } from "react";
import { generateId, getReports, saveReport as saveReportToStore } from "../lib/store";
import PrintableReport from "../components/PrintableReport";
import ReportEditor from "../components/ReportEditor";
import ReportToolbar from "../components/ReportToolbar";
import Layout from "../components/Layout";
import { Dialog, DialogTrigger, DialogContent, DialogClose } from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { TEST_CATEGORIES } from "../lib/data";
import "../styles/print.css";

// Example persistent storage helpers

import { useLocation } from "react-router-dom";

export default function Reports() {
  const location = useLocation();
  const [reports, setReports] = useState(getReports());
  const [selectedReportId, setSelectedReportId] = useState(reports.length > 0 ? reports[0].id : null);
  const [editMode, setEditMode] = useState(false);
  const [backup, setBackup] = useState(null);

  // Auto-refresh reports list every time the page is shown
  useEffect(() => {
    const updated = getReports();
    setReports(updated);
    if (updated.length > 0) {
      // Keep current selection if possible, else select latest
      const stillExists = updated.find(r => r.id === selectedReportId);
      if (stillExists) {
        setSelectedReportId(selectedReportId);
      } else {
        const latest = updated.reduce((a, b) => new Date(a.createdAt) > new Date(b.createdAt) ? a : b);
        setSelectedReportId(latest.id);
      }
    } else {
      setSelectedReportId(null);
    }
    // eslint-disable-next-line
  }, [location]);

  // Find the selected report object
  const report = reports.find(r => r.id === selectedReportId) || null;

  // Handle field changes (including nested 'tests')
  const handleChange = (field, value) => {
    setReports(reports => {
      const updated = reports.map(r =>
        r.id === selectedReportId ? { ...r, [field]: value } : r
      );
      return updated;
    });
  };

  // Edit/save/cancel logic
  const handleEdit = () => { setBackup(JSON.parse(JSON.stringify(report))); setEditMode(true); };
  const handleSave = () => {
    // Find the latest version of the report from state
    const latest = reports.find(r => r.id === selectedReportId);
    if (latest) {
      saveReportToStore(latest);
      const updatedReports = getReports();
      setReports(updatedReports);
      setBackup(JSON.parse(JSON.stringify(latest)));
      // Automatically select and display the latest saved report
      setSelectedReportId(latest.id);
    }
    setEditMode(false);
  };
  const handleCancel = () => {
    setReports(reports => reports.map(r =>
      r.id === selectedReportId ? backup : r
    ));
    setEditMode(false);
  };
  const handlePrint = () => window.print();

  return (
    <Layout>
      <div className="flex gap-8">
        {/* Report List Sidebar */}
        <div className="w-80 min-w-[260px] border-r border-gray-200 pr-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-bold text-lg">All Reports</h2>
            <button
              className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
              onClick={() => {
                const updated = getReports();
                setReports(updated);
                if (updated.length > 0) {
                  // Select the most recently created report
                  const latest = updated.reduce((a, b) => new Date(a.createdAt) > new Date(b.createdAt) ? a : b);
                  setSelectedReportId(latest.id);
                }
              }}
            >Refresh</button>
          </div>
          <div className="flex flex-col gap-2">
            {reports.length === 0 && <div className="text-gray-400">No reports found.</div>}
            {reports.map(r => (
              <div
                key={r.id}
                className={`p-2 rounded cursor-pointer border ${selectedReportId === r.id ? "bg-blue-100 border-blue-400" : "border-gray-200 hover:bg-gray-50"}`}
                onClick={() => { setSelectedReportId(r.id); setEditMode(false); }}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-semibold">{r.patientName || "Unnamed Patient"}</div>
                    <div className="text-xs text-gray-500">{r.createdAt ? new Date(r.createdAt).toLocaleDateString() : "-"} | {r.testCategoryName}</div>
                  </div>
                  <button
                    className="ml-2 px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700"
                    onClick={e => {
                      e.stopPropagation();
                      if (window.confirm("Are you sure you want to delete this report?")) {
                        import("../lib/store").then(mod => {
                          mod.deleteReport(r.id);
                          const updated = getReports();
                          setReports(updated);
                          // If the deleted report was selected, select another
                          if (selectedReportId === r.id) {
                            setSelectedReportId(updated.length > 0 ? updated[0].id : null);
                          }
                        });
                      }
                    }}
                  >Delete</button>
                </div>
                <button
                  className="mt-1 px-3 py-1 text-xs bg-yellow-600 text-white rounded hover:bg-yellow-700"
                  onClick={e => { e.stopPropagation(); setSelectedReportId(r.id); setEditMode(true); setBackup(r); }}
                >Edit</button>
              </div>
            ))}
          </div>
        </div>
        {/* Main Report View */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-4">
            <ReportToolbar
              isEditing={editMode}
              onEdit={handleEdit}
              onSave={handleSave}
              onCancel={handleCancel}
              onPrint={handlePrint}
            />
          </div>
          {report ? (
            editMode
              ? <ReportEditor
                  report={report}
                  onChange={handleChange}
                  onSave={handleSave}
                  onCancel={handleCancel}
                />
              : <PrintableReport report={report} />
          ) : (
            <div className="text-gray-400">Select a report to view.</div>
          )}
        </div>
      </div>
    </Layout>
  );
}
// removed stray return statement
