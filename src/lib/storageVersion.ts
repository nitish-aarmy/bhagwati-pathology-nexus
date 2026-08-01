const APP_SCHEMA_VERSION = "3";
const VERSION_KEY = "app_schema_version";
const LEGACY_VERSION_KEY = "app_version";
const MIGRATION_BACKUP_KEY = "bhagwati_migration_backup";

const APP_DATA_KEYS = [
  "bhagwati_reports",
  "bhagwati_patients",
  "bhagwati_custom_doctors",
  "bhagwati_hidden_default_doctors",
];

const parseJson = <T>(value: string | null, fallback: T): T => {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
};

const setSchemaVersion = (version: string) => {
  localStorage.setItem(VERSION_KEY, version);
  localStorage.setItem(LEGACY_VERSION_KEY, version);
};

const backupCurrentData = () => {
  const snapshot: Record<string, string> = {};
  APP_DATA_KEYS.forEach((key) => {
    const value = localStorage.getItem(key);
    if (value !== null) snapshot[key] = value;
  });

  localStorage.setItem(
    MIGRATION_BACKUP_KEY,
    JSON.stringify({
      version: localStorage.getItem(VERSION_KEY) || localStorage.getItem(LEGACY_VERSION_KEY) || "unknown",
      createdAt: new Date().toISOString(),
      data: snapshot,
    })
  );
};

const normalizePatients = () => {
  const patients = parseJson<any[]>(localStorage.getItem("bhagwati_patients"), []);
  const normalized = patients.map((patient) => ({
    ...patient,
    testId: typeof patient?.testId === "string" ? patient.testId : "",
  }));
  localStorage.setItem("bhagwati_patients", JSON.stringify(normalized));
};

const migrateFromLegacyVersions = (fromVersion: string) => {
  // Add explicit migrations here as schema evolves.
  // Current migration path normalizes patient records for Test ID support.
  if (fromVersion === "1" || fromVersion === "2") {
    normalizePatients();
  }
};

export function checkAndUpdateStorageVersion() {
  const storedVersion = localStorage.getItem(VERSION_KEY) || localStorage.getItem(LEGACY_VERSION_KEY);

  // Fresh installation: set version marker only.
  if (!storedVersion) {
    setSchemaVersion(APP_SCHEMA_VERSION);
    return;
  }

  // Already up-to-date.
  if (storedVersion === APP_SCHEMA_VERSION) {
    setSchemaVersion(APP_SCHEMA_VERSION);
    return;
  }

  // Safe migration with backup, never destructive clear.
  backupCurrentData();
  migrateFromLegacyVersions(storedVersion);
  setSchemaVersion(APP_SCHEMA_VERSION);
}
