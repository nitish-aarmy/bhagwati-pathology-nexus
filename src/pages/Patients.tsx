import { useState } from "react";
import Layout from "@/components/Layout";
import { addDoctorName, getDoctorNames, getPatients, savePatient, deletePatient, generateId, getReportsByPatient, removeDoctorName } from "@/lib/store";
import { Patient, formatPatientAge } from "@/lib/data";
import { toast } from "@/hooks/use-toast";
import { Trash2, Plus, Search, Pencil } from "lucide-react";
import { capitalizeWords } from "@/lib/utils";

export default function Patients() {
  const [patients, setPatients] = useState(getPatients());
  const [doctorNames, setDoctorNames] = useState(getDoctorNames());
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [editingPatientId, setEditingPatientId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", testId: "", age: "", ageUnit: "Years" as const, gender: "Male" as const, phone: "", address: "", refBy: "" });

  const filtered = patients.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.phone.includes(search)
  );

  function handleAddDoctor() {
    const doctorName = String(form.refBy || "").trim().toUpperCase();
    if (!doctorName) {
      toast({ title: "Enter doctor name first", variant: "destructive" });
      return;
    }
    if (doctorNames.includes(doctorName)) {
      toast({ title: "Doctor already exists" });
      return;
    }
    addDoctorName(doctorName);
    setDoctorNames(getDoctorNames());
    setForm({ ...form, refBy: doctorName });
    toast({ title: "Doctor added to suggestions", variant: "success" });
  }

  function handleDeleteDoctor(doctorName: string) {
    const normalized = String(doctorName || "").trim().toUpperCase();
    if (!normalized || !doctorNames.includes(normalized)) {
      toast({ title: "Unable to remove doctor", variant: "destructive" });
      return;
    }
    removeDoctorName(normalized);
    setDoctorNames(getDoctorNames());
    if (String(form.refBy || "").toUpperCase() === normalized) {
      setForm({ ...form, refBy: "" });
    }
    toast({ title: "Doctor removed from suggestions", variant: "success" });
  }

  function resetFormAndMode() {
    setForm({ name: "", testId: "", age: "", ageUnit: "Years", gender: "Male", phone: "", address: "", refBy: "" });
    setEditingPatientId(null);
    setShowAdd(false);
  }

  function handleEdit(patient: Patient) {
    setEditingPatientId(patient.id);
    setForm({
      name: patient.name || "",
      testId: patient.testId || "",
      age: String(patient.age ?? ""),
      ageUnit: (patient.ageUnit || "Years") as "Years" | "Months" | "Days",
      gender: patient.gender || "Male",
      phone: patient.phone || "",
      address: patient.address || "",
      refBy: patient.refBy || "",
    });
    setShowAdd(true);
  }

  function handleSavePatient() {
    if (!form.name || !form.age || !form.phone) {
      toast({ title: "Fill required fields", variant: "destructive" });
      return;
    }

    const existingPatient = editingPatientId
      ? patients.find((p) => p.id === editingPatientId)
      : null;

    const p: Patient = {
      id: existingPatient?.id || generateId(),
      name: capitalizeWords(form.name),
      testId: String(form.testId || "").trim().toUpperCase(),
      age: Number(form.age),
      ageUnit: form.ageUnit || "Years",
      gender: form.gender,
      phone: form.phone,
      address: capitalizeWords(form.address),
      refBy: capitalizeWords(String(form.refBy || "")),
      createdAt: existingPatient?.createdAt || new Date().toISOString(),
    };

    savePatient(p);
    if (p.refBy) {
      addDoctorName(p.refBy);
      setDoctorNames(getDoctorNames());
    }

    setPatients(getPatients());
    if (editingPatientId) {
      toast({ title: "Patient updated!", variant: "success" });
    } else {
      toast({ title: "Patient added!", variant: "success" });
    }
    resetFormAndMode();
  }

  function handleDelete(id: string) {
    deletePatient(id);
    setPatients(getPatients());
    toast({ title: "Patient deleted" });
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <h1 className="font-heading text-2xl font-bold text-foreground">Patients</h1>
          <button
            className="neo-btn px-4 py-2 text-sm font-semibold text-primary flex items-center gap-2"
            onClick={() => {
              if (showAdd) {
                resetFormAndMode();
              } else {
                setShowAdd(true);
              }
            }}
          >
            <Plus size={16} /> {showAdd ? "Close" : "Add Patient"}
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
          <input
            className="neo-input w-full pl-10 pr-4 py-3 text-sm text-foreground"
            placeholder="Search by name or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Add form */}
        {showAdd && (
          <div className="neo-flat p-6 space-y-4">
            <h2 className="font-heading font-semibold text-foreground text-sm">
              {editingPatientId ? "Edit Patient" : "New Patient"}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input className="neo-input px-4 py-3 text-sm text-foreground" placeholder="Name *" value={form.name} onChange={(e) => setForm({ ...form, name: capitalizeWords(e.target.value) })} />
              <input className="neo-input px-4 py-3 text-sm text-foreground" placeholder="Test ID" value={form.testId} onChange={(e) => setForm({ ...form, testId: e.target.value.toUpperCase() })} />
              <div className="grid grid-cols-2 gap-4">
                <input className="neo-input px-4 py-3 text-sm text-foreground" placeholder="Age *" type="number" min="0" value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} />
                <select className="neo-input px-4 py-3 text-sm text-foreground" value={form.ageUnit} onChange={(e) => setForm({ ...form, ageUnit: e.target.value as any })}>
                  <option value="Years">Years</option>
                  <option value="Months">Months</option>
                  <option value="Days">Days</option>
                </select>
              </div>
              <select className="neo-input px-4 py-3 text-sm text-foreground" value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value as any })}>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              <input className="neo-input px-4 py-3 text-sm text-foreground" placeholder="Phone *" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              <input className="neo-input px-4 py-3 text-sm text-foreground col-span-full" placeholder="Address" value={form.address} onChange={(e) => setForm({ ...form, address: capitalizeWords(e.target.value) })} />
              <input
                className="neo-input px-4 py-3 text-sm text-foreground col-span-full"
                list="patients-doctor-name-suggestions"
                placeholder="Referred Doctor"
                value={form.refBy}
                onChange={(e) => setForm({ ...form, refBy: capitalizeWords(e.target.value) })}
              />
              <button className="neo-btn px-4 py-2 text-sm col-span-full" type="button" onClick={handleAddDoctor}>
                + Add Doctor
              </button>
              <datalist id="patients-doctor-name-suggestions">
                {doctorNames.map((doctorName) => (
                  <option key={doctorName} value={doctorName} />
                ))}
              </datalist>
              <details className="col-span-full rounded border border-slate-200 bg-white/60 px-3 py-2">
                <summary className="cursor-pointer text-xs font-semibold text-slate-700">Manage Doctors</summary>
                <div className="mt-2 max-h-40 space-y-1 overflow-y-auto">
                  {doctorNames.length === 0 ? (
                    <div className="text-xs text-slate-500">No doctors in list</div>
                  ) : (
                    doctorNames.map((doctorName) => (
                      <div key={doctorName} className="flex items-center justify-between gap-2 rounded border border-slate-200 bg-white px-2 py-1">
                        <span className="text-xs font-medium text-slate-700">{doctorName}</span>
                        <button className="neo-btn px-2 py-[2px] text-[11px] text-destructive" type="button" onClick={() => handleDeleteDoctor(doctorName)}>
                          Delete
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </details>
            </div>
            <div className="flex flex-wrap gap-2">
              <button className="neo-btn px-6 py-3 text-sm font-semibold text-primary" onClick={handleSavePatient}>
                {editingPatientId ? "Update Patient" : "Save Patient"}
              </button>
              {editingPatientId && (
                <button className="neo-btn px-6 py-3 text-sm font-semibold" onClick={resetFormAndMode}>
                  Cancel Edit
                </button>
              )}
            </div>
          </div>
        )}

        {/* List */}
        <div className="space-y-3">
          {filtered.length === 0 ? (
            <div className="neo-concave p-8 text-center text-muted-foreground text-sm">
              No patients found
            </div>
          ) : (
            filtered.map((p) => {
              const reportCount = getReportsByPatient(p.id).length;
              return (
                <div key={p.id} className="neo-flat p-4 flex items-center gap-4">
                  <div className="neo-concave w-12 h-12 flex items-center justify-center shrink-0">
                    <span className="font-heading font-bold text-primary text-lg">{p.name[0]}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-foreground truncate">{p.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatPatientAge(p)}, {p.gender} • {p.phone}
                    </p>
                    <p className="text-[10px] text-muted-foreground">{reportCount} report(s)</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="neo-btn p-2 text-primary" onClick={() => handleEdit(p)} title="Edit patient">
                      <Pencil size={16} />
                    </button>
                    <button className="neo-btn p-2 text-destructive" onClick={() => handleDelete(p.id)} title="Delete patient">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </Layout>
  );
}
