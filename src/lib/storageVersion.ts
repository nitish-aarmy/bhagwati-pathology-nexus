const APP_VERSION = "2"; // Increment this on breaking changes
const VERSION_KEY = "app_version";
const DATA_KEYS = ["bhagwati_reports", "bhagwati_patients"]; // Add all your keys here

export function checkAndUpdateStorageVersion() {
  const storedVersion = localStorage.getItem(VERSION_KEY);
  if (storedVersion !== APP_VERSION) {
    // Clear only app-specific keys
    DATA_KEYS.forEach((key) => localStorage.removeItem(key));
    localStorage.setItem(VERSION_KEY, APP_VERSION);
  }
}
