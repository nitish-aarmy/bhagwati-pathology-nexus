import { DOCTORS, Patient, TestReport } from "./data";

const PATIENTS_KEY = "bhagwati_patients";
const REPORTS_KEY = "bhagwati_reports";
const CUSTOM_DOCTORS_KEY = "bhagwati_custom_doctors";
const HIDDEN_DEFAULT_DOCTORS_KEY = "bhagwati_hidden_default_doctors";

export function getPatients(): Patient[] {
  const data = localStorage.getItem(PATIENTS_KEY);
  return data ? JSON.parse(data) : [];
}

export function savePatient(patient: Patient): void {
  const patients = getPatients();
  const idx = patients.findIndex((p) => p.id === patient.id);
  if (idx >= 0) patients[idx] = patient;
  else patients.push(patient);
  localStorage.setItem(PATIENTS_KEY, JSON.stringify(patients));
}

export function deletePatient(id: string): void {
  const patients = getPatients().filter((p) => p.id !== id);
  localStorage.setItem(PATIENTS_KEY, JSON.stringify(patients));
}

export function getReports(): TestReport[] {
  const data = localStorage.getItem(REPORTS_KEY);
  return data ? JSON.parse(data) : [];
}

export function saveReport(report: TestReport): void {
  const reports = getReports();
  const idx = reports.findIndex((r) => r.id === report.id);
  if (idx >= 0) reports[idx] = report;
  else reports.push(report);
  localStorage.setItem(REPORTS_KEY, JSON.stringify(reports));
}

export function deleteReport(id: string): void {
  // Report deletion is intentionally disabled.
  void id;
}

export function getReportsByPatient(patientId: string): TestReport[] {
  return getReports().filter((r) => r.patientId === patientId);
}

export function getDoctorNames(): string[] {
  const defaults = DOCTORS.map((d) => d.name.toUpperCase());
  const hiddenDefaultsData = localStorage.getItem(HIDDEN_DEFAULT_DOCTORS_KEY);
  const hiddenDefaults = hiddenDefaultsData
    ? (JSON.parse(hiddenDefaultsData) as string[]).map((name) => String(name).toUpperCase())
    : [];
  const visibleDefaults = defaults.filter((name) => !hiddenDefaults.includes(name));

  const customData = localStorage.getItem(CUSTOM_DOCTORS_KEY);
  const custom = customData
    ? (JSON.parse(customData) as string[]).map((name) => String(name).toUpperCase())
    : [];

  return Array.from(new Set([...visibleDefaults, ...custom])).sort((a, b) => a.localeCompare(b));
}

export function addDoctorName(name: string): void {
  const normalized = String(name || "").trim().toUpperCase();
  if (!normalized) return;

  const hiddenDefaultsData = localStorage.getItem(HIDDEN_DEFAULT_DOCTORS_KEY);
  const hiddenDefaults = hiddenDefaultsData
    ? (JSON.parse(hiddenDefaultsData) as string[]).map((doctorName) => String(doctorName).toUpperCase())
    : [];
  if (hiddenDefaults.includes(normalized)) {
    const updatedHiddenDefaults = hiddenDefaults.filter((doctorName) => doctorName !== normalized);
    localStorage.setItem(HIDDEN_DEFAULT_DOCTORS_KEY, JSON.stringify(updatedHiddenDefaults));
  }

  const existing = getDoctorNames();
  if (existing.includes(normalized)) return;

  const customData = localStorage.getItem(CUSTOM_DOCTORS_KEY);
  const custom = customData
    ? (JSON.parse(customData) as string[]).map((doctorName) => String(doctorName).toUpperCase())
    : [];
  custom.push(normalized);
  localStorage.setItem(CUSTOM_DOCTORS_KEY, JSON.stringify(Array.from(new Set(custom))));
}

export function removeDoctorName(name: string): void {
  const normalized = String(name || "").trim().toUpperCase();
  if (!normalized) return;

  const customData = localStorage.getItem(CUSTOM_DOCTORS_KEY);
  const custom = customData
    ? (JSON.parse(customData) as string[]).map((doctorName) => String(doctorName).toUpperCase())
    : [];

  if (custom.includes(normalized)) {
    const updatedCustom = custom.filter((doctorName) => doctorName !== normalized);
    localStorage.setItem(CUSTOM_DOCTORS_KEY, JSON.stringify(Array.from(new Set(updatedCustom))));
    return;
  }

  const defaults = DOCTORS.map((d) => d.name.toUpperCase());
  if (defaults.includes(normalized)) {
    const hiddenDefaultsData = localStorage.getItem(HIDDEN_DEFAULT_DOCTORS_KEY);
    const hiddenDefaults = hiddenDefaultsData
      ? (JSON.parse(hiddenDefaultsData) as string[]).map((doctorName) => String(doctorName).toUpperCase())
      : [];
    hiddenDefaults.push(normalized);
    localStorage.setItem(HIDDEN_DEFAULT_DOCTORS_KEY, JSON.stringify(Array.from(new Set(hiddenDefaults))));
  }
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}
