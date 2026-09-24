import React from "react";

export interface ResultEntryProps {
  selectedTestIds: string[];
  testCategories: any[];
  results: { [sectionId: string]: { [paramId: string]: string } };
  setResults: (r: any) => void;
}

const ResultEntry: React.FC<ResultEntryProps> = ({
  selectedTestIds,
  testCategories,
  results,
  setResults,
}) => {
  const normalizeReportValue = (value: string) => value.toUpperCase();

  const formatDropdownLabel = (value: string) => {
    const normalized = String(value || "").trim().toUpperCase();

    if (
      normalized === "NON-REACTIVE" ||
      normalized === "NON REACTIVE" ||
      normalized === "-VE" ||
      normalized.startsWith("-") ||
      normalized.includes("NONREACTIVE") ||
      normalized.includes("NEGATIVE")
    ) {
      // Prefer explicit Negative label for NEGATIVE and NON-REACTIVE variants
      if (normalized === "NEGATIVE" || normalized.includes("NEGATIVE")) return "Negative";
      return "Non Reactive";
    }

    if (
      normalized === "REACTIVE" ||
      normalized === "+VE" ||
      normalized.startsWith("+") ||
      normalized.includes("POSITIVE")
    ) {
      // Prefer explicit Positive label for POSITIVE variants
      if (normalized === "POSITIVE" || normalized.includes("POSITIVE")) return "Positive";
      return "Reactive";
    }

    return value;
  };

  const getDropdownOptions = (normalRange?: string): string[] | null => {
    const range = String(normalRange || "").toUpperCase();

    if (range.includes("NEGATIVE") && range.includes("POSITIVE")) {
      return ["NEGATIVE", "POSITIVE"];
    }

    if (range.includes("NON-REACTIVE") || range.includes("REACTIVE")) {
      return ["NON-REACTIVE", "REACTIVE"];
    }

    return null;
  };

  const handleKeyNavigation = (event: React.KeyboardEvent<HTMLElement>) => {
    const key = event.key;
    if (!(key === "ArrowDown" || key === "ArrowUp" || key === "Enter")) return;
    event.preventDefault();
    const current = event.currentTarget as HTMLElement;
    // Find the container for this result block
    const container = current.closest(".result-entry") as HTMLElement | null;
    if (!container) return;
    const focusables = Array.from(container.querySelectorAll('select.neo-input, input.neo-input, textarea.neo-input')) as HTMLElement[];
    if (focusables.length === 0) return;

    // Determine current index
    let idx = focusables.findIndex((el) => el === current || el.contains(current));
    if (idx === -1) {
      // if current not found, try to find by activeElement
      idx = focusables.findIndex((el) => el === document.activeElement);
    }

    if (key === "ArrowDown" || key === "Enter") {
      const next = Math.min(focusables.length - 1, Math.max(0, idx + 1));
      focusables[next]?.focus();
      if (focusables[next] && (focusables[next] as HTMLInputElement).select) {
        try { (focusables[next] as HTMLInputElement).select(); } catch (e) {}
      }
      return;
    }

    if (key === "ArrowUp") {
      const prev = Math.max(0, idx - 1);
      focusables[prev]?.focus();
      if (focusables[prev] && (focusables[prev] as HTMLInputElement).select) {
        try { (focusables[prev] as HTMLInputElement).select(); } catch (e) {}
      }
      return;
    }
  };

  return (
    <div className="result-entry space-y-4">
      {selectedTestIds.length === 0 && (
        <div className="rounded-xl border border-slate-200 bg-white/70 px-4 py-3 text-sm text-slate-600">
          No tests selected yet. Go back and select at least one test section.
        </div>
      )}

      {selectedTestIds.map((testId) => {
        const cat = testCategories.find((tc) => tc.id === testId);
        if (!cat) return null;

        return (
          <div key={testId} className="overflow-hidden rounded-xl border border-slate-200 bg-white/80 shadow-sm">
            <div className="border-b border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-800">
              {cat.name}
            </div>

            <table className="w-full text-xs">
              <thead>
                <tr className="bg-slate-100/90 text-slate-700">
                  <th className="w-[34%] px-2 py-2 text-left">Parameter</th>
                  <th className="w-[24%] px-2 py-2 text-left">Result</th>
                  <th className="w-[16%] px-2 py-2 text-left">Unit</th>
                  <th className="w-[26%] px-2 py-2 text-left">Reference Range</th>
                </tr>
              </thead>
              <tbody>
                {cat.subcategories.map((sub) => (
                  <tr key={sub.id} className="border-t border-slate-200/80 align-top">
                    <td className="px-2 py-1.5 font-medium text-slate-800">{sub.name}</td>
                    <td className="px-2 py-1.5">
                      {(() => {
                        let options = getDropdownOptions(sub.normalRange);
                        // If this is a malaria or dengue parameter, force Positive/Negative dropdown
                        const subId = String(sub.id || "").toLowerCase();
                        const subName = String(sub.name || "").toUpperCase();
                        if (!options && (subId.includes("malaria") || subId.includes("dengue") || subName.includes("MALARIA") || subName.includes("DENGUE"))) {
                          options = ["NEGATIVE", "POSITIVE"];
                        }
                        const currentValue = normalizeReportValue(results[testId]?.[sub.id] ?? "");

                        if (options) {
                          return (
                            <select
                              className="neo-input w-full px-2 py-1"
                              value={currentValue}
                              onKeyDown={handleKeyNavigation}
                              onChange={(e) =>
                                setResults((r: any) => ({
                                  ...r,
                                  [testId]: { ...r[testId], [sub.id]: normalizeReportValue(e.target.value) },
                                }))
                              }
                            >
                              <option value="">Select</option>
                              {options.map((option) => (
                                <option key={option} value={option}>{formatDropdownLabel(option)}</option>
                              ))}
                            </select>
                          );
                        }

                        return (
                          <input
                            className="neo-input w-full px-2 py-1 uppercase"
                            autoCapitalize="characters"
                            value={currentValue}
                            onKeyDown={handleKeyNavigation}
                            onChange={(e) =>
                              setResults((r: any) => ({
                              ...r,
                                [testId]: { ...r[testId], [sub.id]: normalizeReportValue(e.target.value) },
                              }))
                            }
                            placeholder="N/A"
                          />
                        );
                      })()}
                    </td>
                    <td className="px-2 py-1.5 text-slate-700">{sub.unit || "-"}</td>
                    <td className="px-2 py-1.5 text-slate-700">{sub.normalRange || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      })}
    </div>
  );
};

export default ResultEntry;
