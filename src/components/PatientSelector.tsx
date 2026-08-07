import React from "react";
import { formatPatientAge } from "@/lib/data";
import { toast } from "@/hooks/use-toast";
import { capitalizeWords } from "@/lib/utils";

export interface PatientSelectorProps {
  mode: "existing" | "new";
  onModeChange: (mode: "existing" | "new") => void;
  onSelectPatient: (patientId: string) => void;
  onRegisterPatient: (patient: any) => void;
  patients: any[];
  selectedPatientId: string | null;
  patientSearch: string;
  setPatientSearch: (s: string) => void;
  newPatientForm: any;
  setNewPatientForm: (f: any) => void;
  doctorNames: string[];
  onAddDoctor: (doctorName: string) => boolean;
  onDeleteDoctor: (doctorName: string) => boolean;
}

const PatientSelector: React.FC<PatientSelectorProps> = ({
  mode,
  onModeChange,
  onSelectPatient,
  onRegisterPatient,
  patients,
  selectedPatientId,
  patientSearch,
  setPatientSearch,
  newPatientForm,
  setNewPatientForm,
  doctorNames,
  onAddDoctor,
  onDeleteDoctor,
}) => {
  const handleAddDoctor = () => {
    const doctorName = String(newPatientForm.refBy || "").trim().toUpperCase();
    if (!doctorName) {
      toast({ title: "Enter doctor name first", variant: "destructive" });
      return;
    }

    const added = onAddDoctor(doctorName);
    if (added) {
      toast({ title: "Doctor added to suggestions", variant: "success" });
      return;
    }

    toast({ title: "Doctor already exists" });
  };

  const handleDeleteDoctor = (doctorName: string) => {
    const removed = onDeleteDoctor(doctorName);
    if (removed) {
      toast({ title: "Doctor removed from suggestions", variant: "success" });
      return;
    }
    toast({ title: "Unable to remove doctor", variant: "destructive" });
  };

  return (
    <div className="patient-selector rounded-2xl border border-slate-200 bg-white/60 p-4">
      <div className="mb-4 flex gap-2">
        <button
          className={`neo-btn px-4 py-2 text-sm ${mode === "existing" ? "bg-primary text-white" : ""}`}
          onClick={() => onModeChange("existing")}
        >
          Existing Patient
        </button>
        <button
          className={`neo-btn px-4 py-2 text-sm ${mode === "new" ? "bg-primary text-white" : ""}`}
          onClick={() => onModeChange("new")}
        >
          New Patient
        </button>
      </div>
      {mode === "existing" ? (
        <div className="space-y-2">
          <input
            className="neo-input w-full px-3 py-2 text-sm"
            placeholder="Search by name, mobile, or ID..."
            value={patientSearch}
            onChange={e => setPatientSearch(e.target.value)}
          />
          <div className="max-h-56 overflow-y-auto rounded-xl border border-slate-200 bg-white text-xs">
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
                <div className="text-slate-500">Last Visit: {p.lastVisit || "-"}</div>
              </div>
            ))}
            {patients.length === 0 && <div className="px-2 py-1 text-muted-foreground">No patients found</div>}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-2 text-xs sm:grid-cols-2">
          <input
            className="neo-input px-2 py-1 uppercase"
            placeholder="Patient Name *"
            autoCapitalize="characters"
            value={newPatientForm.name}
            onChange={e => setNewPatientForm({ ...newPatientForm, name: e.target.value.toUpperCase() })}
          />
          <input
            className="neo-input px-2 py-1"
            placeholder="Test ID"
            value={newPatientForm.testId || ""}
            onChange={e => setNewPatientForm({ ...newPatientForm, testId: e.target.value.toUpperCase() })}
          />
          <div className="col-span-2 grid grid-cols-2 gap-2">
            <input className="neo-input px-2 py-1" placeholder="Age *" type="number" min="0" value={newPatientForm.age} onChange={e => setNewPatientForm({ ...newPatientForm, age: e.target.value })} />
            <select className="neo-input px-2 py-1" value={newPatientForm.ageUnit || "Years"} onChange={e => setNewPatientForm({ ...newPatientForm, ageUnit: e.target.value })}>
              <option value="Years">Years</option>
              <option value="Months">Months</option>
              <option value="Days">Days</option>
            </select>
          </div>
          <select className="neo-input px-2 py-1" value={newPatientForm.gender} onChange={e => setNewPatientForm({ ...newPatientForm, gender: e.target.value })}>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          <input className="neo-input px-2 py-1" placeholder="Mobile *" value={newPatientForm.phone} onChange={e => setNewPatientForm({ ...newPatientForm, phone: e.target.value })} />
          <input className="neo-input px-2 py-1 col-span-2" placeholder="Address" value={newPatientForm.address} onChange={e => setNewPatientForm({ ...newPatientForm, address: capitalizeWords(e.target.value) })} />
          <input
            className="neo-input px-2 py-1 col-span-2"
            list="doctor-name-suggestions"
            placeholder="Referred Doctor"
            value={newPatientForm.refBy}
            onChange={e => setNewPatientForm({ ...newPatientForm, refBy: capitalizeWords(e.target.value) })}
          />
          <button className="neo-btn px-3 py-1 col-span-2 text-sm" type="button" onClick={handleAddDoctor}>+ Add Doctor</button>
          <datalist id="doctor-name-suggestions">
            {doctorNames.map((doctorName) => (
              <option key={doctorName} value={doctorName} />
            ))}
          </datalist>
          <details className="col-span-2 rounded border border-slate-200 bg-white/60 px-2 py-1">
            <summary className="cursor-pointer text-[11px] font-semibold text-slate-700">Manage Doctors</summary>
            <div className="mt-2 max-h-32 space-y-1 overflow-y-auto">
              {doctorNames.length === 0 ? (
                <div className="text-[11px] text-slate-500">No doctors in list</div>
              ) : (
                doctorNames.map((doctorName) => (
                  <div key={doctorName} className="flex items-center justify-between gap-2 rounded border border-slate-200 bg-white px-2 py-1">
                    <span className="text-[11px] font-medium text-slate-700">{doctorName}</span>
                    <button className="neo-btn px-2 py-[2px] text-[10px] text-destructive" type="button" onClick={() => handleDeleteDoctor(doctorName)}>
                      Delete
                    </button>
                  </div>
                ))
              )}
            </div>
          </details>
          <input className="neo-input px-2 py-1 col-span-2" type="date" value={newPatientForm.date} onChange={e => setNewPatientForm({ ...newPatientForm, date: e.target.value })} />
          <button className="neo-btn col-span-2 mt-2 px-4 py-2 text-sm" onClick={() => onRegisterPatient(newPatientForm)}>Register Patient</button>
        </div>
      )}
    </div>
  );
};

export default PatientSelector;
