import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Layout from "@/components/Layout";
import Stepper from "@/components/Stepper";
import PatientSelector from "@/components/PatientSelector";
import TestSelector from "@/components/TestSelector";
import ResultEntry from "@/components/ResultEntry";
import ReportPreview from "@/components/ReportPreview";
import { TEST_CATEGORIES } from "@/lib/data";
import { addDoctorName, getDoctorNames, getPatients, savePatient, generateId, getReports, removeDoctorName } from "@/lib/store";
import { toast } from "@/hooks/use-toast";
import { capitalizeWords } from "@/lib/utils";


function NewTest() {
  const navigate = useNavigate();
  const location = useLocation();
  const [patients, setPatients] = useState(getPatients());
  const [doctorNames, setDoctorNames] = useState(getDoctorNames());
  const [patientMode, setPatientMode] = useState<'existing' | 'new'>("existing");
  const [step, setStep] = useState(1);
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [patientSearch, setPatientSearch] = useState("");
  const [newPatientForm, setNewPatientForm] = useState({ name: "", testId: "", age: "", ageUnit: "Years" as const, gender: "Male" as const, phone: "", address: "", refBy: "", date: new Date().toISOString().slice(0,10) });
  const [testSearch, setTestSearch] = useState("");
  const [selectedTestIds, setSelectedTestIds] = useState<string[]>([]);
  const [results, setResults] = useState<{ [sectionId: string]: { [paramId: string]: string } }>({});
  const [addMode, setAddMode] = useState<'new' | 'append'>('new');
  const [selectedReportId, setSelectedReportId] = useState<string>("");

  const handleAddDoctor = (doctorName: string): boolean => {
    const normalized = String(doctorName || "").trim().toUpperCase();
    if (!normalized || doctorNames.includes(normalized)) return false;
    addDoctorName(normalized);
    setDoctorNames(getDoctorNames());
    return true;
  };

  const handleDeleteDoctor = (doctorName: string): boolean => {
    const normalized = String(doctorName || "").trim().toUpperCase();
    if (!normalized || !doctorNames.includes(normalized)) return false;
    removeDoctorName(normalized);
    setDoctorNames(getDoctorNames());
    return true;
  };

  // Stepper labels
  const steps = ["Patient Name", "Test", "Results", "Preview"];

  // Register new patient
  const handleRegisterPatient = (form: any) => {
    if (!form.name || !form.age || !form.phone) {
      toast({ title: "Fill required fields", variant: "destructive" });
      return;
    }
    const newId = generateId();
    const patient = {
      ...form,
      id: newId,
      name: String(form.name || "").trim().toUpperCase(),
      testId: String(form.testId || "").trim().toUpperCase(),
      refBy: capitalizeWords(String(form.refBy || "")),
      address: capitalizeWords(String(form.address || "")),
      age: Number(form.age),
      ageUnit: form.ageUnit || "Years",
      createdAt: new Date().toISOString()
    };
    savePatient(patient);
    if (patient.refBy) {
      addDoctorName(patient.refBy);
      setDoctorNames(getDoctorNames());
    }
    setPatients(getPatients());
    setSelectedPatientId(newId);
    setPatientMode("existing");
    setStep(2);
    toast({ title: "Patient registered!" });
  };

  // Select patient
  const handleSelectPatient = (id: string) => {
    setSelectedPatientId(id);
    setStep(2);
  };

  // Select test
  const handleSelectTest = (testId: string) => {
    setSelectedTestIds(ids => ids.includes(testId) ? ids.filter(id => id !== testId) : [...ids, testId]);
  };

  // Prepare results for all selected tests/parameters
  const handleNextResults = () => {
    const newResults: { [sectionId: string]: { [paramId: string]: string } } = {};
    selectedTestIds.forEach(testId => {
      const cat = TEST_CATEGORIES.find(tc => tc.id === testId);
      if (cat) {
        newResults[testId] = {};
        cat.subcategories.forEach(sub => {
          newResults[testId][sub.id] = "";
        });
      }
    });
    setResults(newResults);
    setStep(3);
  };

  // Save report
  const handleSaveReport = () => {
    const patient = patients.find(p => p.id === selectedPatientId);
    if (!patient) return;
    const now = new Date().toISOString();
    const newReport = {
      id: generateId(),
      patientId: patient.id,
      patientName: patient.name,
      doctorId: "",
      doctorName: "",
      testCategoryId: "",
      testCategoryName: "",
      testType: "",
      results: [],
      createdAt: now,
      reportedAt: now,
      status: "pending",
      sections: selectedTestIds.map(testId => {
        const cat = TEST_CATEGORIES.find(tc => tc.id === testId);
        return cat ? {
          category: cat.name,
          tests: cat.subcategories.map(sub => ({
            testName: sub.name,
            result: results[testId]?.[sub.id] || "N/A",
            unit: sub.unit || "",
            referenceRange: sub.normalRange || ""
          }))
        } : null;
      }).filter(Boolean)
    };
    const allReports = getReports();
    allReports.push(newReport);
    localStorage.setItem('bhagwati_reports', JSON.stringify(allReports));
    toast({ title: "Report saved!", variant: "success" });
    navigate("/reports");
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto p-4">
        <Stepper step={step} steps={steps} />
        {step === 1 && (
          <PatientSelector
            mode={patientMode}
            onModeChange={setPatientMode}
            onSelectPatient={handleSelectPatient}
            onRegisterPatient={handleRegisterPatient}
            patients={patients}
            selectedPatientId={selectedPatientId}
            patientSearch={patientSearch}
            setPatientSearch={setPatientSearch}
            newPatientForm={newPatientForm}
            setNewPatientForm={setNewPatientForm}
            doctorNames={doctorNames}
            onAddDoctor={handleAddDoctor}
            onDeleteDoctor={handleDeleteDoctor}
          />
        )}
        {step === 2 && (
          <TestSelector
            testCategories={TEST_CATEGORIES}
            selectedTestIds={selectedTestIds}
            onSelectTest={handleSelectTest}
            testSearch={testSearch}
            setTestSearch={setTestSearch}
          />
        )}
        {step === 3 && (
          <ResultEntry
            selectedTestIds={selectedTestIds}
            testCategories={TEST_CATEGORIES}
            results={results}
            setResults={setResults}
          />
        )}
        {step === 4 && (
          <ReportPreview
            patient={patients.find(p => p.id === selectedPatientId)}
            selectedTestIds={selectedTestIds}
            testCategories={TEST_CATEGORIES}
            results={results}
          />
        )}
        <div className="flex gap-2 mt-6">
          {step > 1 && <button className="neo-btn px-4 py-2" onClick={() => setStep(step - 1)}>Back</button>}
          {step < 4 && <button className="neo-btn px-4 py-2" onClick={() => step === 2 ? handleNextResults() : setStep(step + 1)}>Next</button>}
          {step === 4 && <button className="neo-btn px-4 py-2 bg-primary text-white" onClick={handleSaveReport}>Save Report</button>}
        </div>
      </div>
    </Layout>
  );
}

export default NewTest;
