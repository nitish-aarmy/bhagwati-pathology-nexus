# Bhagwati Pathology Nexus

Desktop pathology workflow app for patient registration, test result entry, report preview, print, and local record management.

## Source Code Setup (Developer)

### 1) Prerequisites

- Node.js 20+ (recommended LTS)
- npm 10+
- Windows 10/11 (for desktop build)

### 2) Install dependencies

```bash
npm install
```

### 3) Run in development

```bash
npm run dev
```

### 4) Build production bundle

```bash
npm run build
```

### 5) Package Windows app (Setup + Portable)

```bash
npx electron-builder --win nsis portable --x64 --publish never
```

## Help Section (In-App)

The app includes a dedicated Help page available from the sidebar at `Help`.

It covers:

- End-to-end workflow from patient details feeding to final print.
- Manual `Test ID` entry process in the patient details step.
- Best practices for clean report output and daily operation.
- Update guidance for installing latest setup executable.

## Safe Version Update (No Data Loss)

The app stores records in localStorage keys:

- `bhagwati_patients`
- `bhagwati_reports`
- `bhagwati_custom_doctors`
- `bhagwati_hidden_default_doctors`

The storage versioning now uses safe migration and **does not clear data** on version update.

### Recommended update flow

1. Close running app instances.
2. Install new Setup EXE over existing installation (or replace with new portable EXE).
3. Start the app and verify Patients + Reports list.

### Developer release checklist

1. Keep migration logic in `src/lib/storageVersion.ts` updated for schema changes.
2. Increment schema version only when storage shape changes.
3. Avoid deleting storage keys in migration code.
4. Build and test upgrade using real sample data before shipping EXE.

### Emergency backup/restore (optional)

Migration automatically creates a snapshot under key:

- `bhagwati_migration_backup`

Use this key for manual restore if needed.

## Build and Package

Run locally:

```bash
npm run build
```

Create Windows distributables (NSIS setup + portable):

```bash
npx electron-builder --win nsis portable --x64 --publish never
```
