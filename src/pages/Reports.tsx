import { useState } from "react";
import Layout from "@/components/Layout";
import PatientRecord from "@/components/PatientRecord";
import ReportEditor from "@/components/ReportEditor";
import ReportPreview from "@/components/ReportPreview";
import ReportToolbar from "@/components/ReportToolbar";
import PrintLayout from "@/components/PrintLayout";
import { getReports, saveReport, getPatients } from "@/lib/store";
import { TEST_CATEGORIES } from "@/lib/data";
import { toast } from "@/hooks/use-toast";

const Reports = () => {
  const [patients, setPatients] = useState(getPatients());
  const [reports, setReports] = useState(getReports());
  const [patientSearch, setPatientSearch] = useState("");
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
  const [editingReport, setEditingReport] = useState<any>(null);
  const [step, setStep] = useState(1);

  // Step 1: Patient Record
  const handleSelectPatient = (id: string) => {
    setSelectedPatientId(id);
    setStep(1);
  };
  const handleOpenReport = (reportId: string) => {
    setSelectedReportId(reportId);
    const report = reports.find(r => r.id === reportId);
    setEditingReport(report ? { ...report } : null);
    setStep(2);
  };
  const handleCreateReport = (patientId: string) => {
    const patient = patients.find(p => p.id === patientId);
    if (!patient) return;
    const now = new Date().toISOString();
    const newReport = {
      id: Date.now().toString(),
      patientId: patient.id,
      patient: patient,
      createdAt: now,
      reportedAt: now,
      sections: []
    };
    setEditingReport(newReport);
    setStep(2);
  };

  // Step 2: Edit
  const handleUpdateReport = (report: any) => {
    setEditingReport(report);
  };

  // Step 3: Preview
  const handlePreview = () => {
    setStep(3);
  };

  // Step 4: Print & Save
  const handleSave = () => {
    if (!editingReport) return;
    const reportToSave = {
      ...editingReport,
      reportedAt: new Date().toISOString(),
    };
    let updatedReports = [...reports];
    const idx = updatedReports.findIndex(r => r.id === reportToSave.id);
    if (idx !== -1) {
      updatedReports[idx] = reportToSave;
    } else {
      updatedReports.push(reportToSave);
    }
    setReports(updatedReports);
    saveReport(reportToSave);
    toast({ title: "Report saved!", variant: "success" });
    setStep(1);
  };
  const handlePrint = () => {
    const originalTitle = document.title;
    const suffix = editingReport?.id || new Date().toISOString().slice(0, 10);
    document.title = `Bhagwati Pathology - ${suffix}`;

    const restoreTitle = () => {
      document.title = originalTitle;
    };

    window.addEventListener("afterprint", restoreTitle, { once: true });
    window.print();
    setTimeout(restoreTitle, 1500);
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-4">
        {step === 1 && (
          <PatientRecord
            patients={patients}
            reports={reports}
            onSelectPatient={handleSelectPatient}
            onOpenReport={handleOpenReport}
            onCreateReport={handleCreateReport}
            patientSearch={patientSearch}
            setPatientSearch={setPatientSearch}
            selectedPatientId={selectedPatientId}
          />
        )}
        {step === 2 && editingReport && (
          <>
            <ReportEditor
              report={editingReport}
              testCategories={TEST_CATEGORIES}
              onUpdateReport={handleUpdateReport}
            />
            <div className="mt-5 flex gap-3">
              <button
                className="rounded-xl bg-slate-100 px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-[6px_6px_14px_#d5dbe4,-6px_-6px_14px_#ffffff] transition hover:text-slate-900"
                onClick={() => setStep(1)}
              >
                Back
              </button>
              <button
                className="rounded-xl bg-cyan-50 px-5 py-2.5 text-sm font-semibold text-cyan-700 shadow-[6px_6px_14px_#d5dbe4,-6px_-6px_14px_#ffffff] transition hover:bg-cyan-100"
                onClick={handlePreview}
              >
                Preview
              </button>
            </div>
          </>
        )}
        {step === 3 && editingReport && (
          <>
            <PrintLayout>
              <ReportPreview report={editingReport} patient={patients.find(p => p.id === editingReport.patientId)} />
            </PrintLayout>
            <ReportToolbar onSave={handleSave} onPrint={handlePrint} />
            <button
              className="mt-4 rounded-xl bg-amber-50 px-5 py-2.5 text-sm font-semibold text-amber-700 shadow-[6px_6px_14px_#d5dbe4,-6px_-6px_14px_#ffffff] transition hover:bg-amber-100"
              onClick={() => setStep(2)}
            >
              Edit
            </button>
          </>
        )}
      </div>
    </Layout>
  );
};

export default Reports;

