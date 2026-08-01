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
                        const options = getDropdownOptions(sub.normalRange);
                        const currentValue = normalizeReportValue(results[testId]?.[sub.id] ?? "");

                        if (options) {
                          return (
                            <select
                              className="neo-input w-full px-2 py-1 uppercase"
                              value={currentValue}
                              onChange={(e) =>
                                setResults((r: any) => ({
                                  ...r,
                                  [testId]: { ...r[testId], [sub.id]: normalizeReportValue(e.target.value) },
                                }))
                              }
                            >
                              <option value="">SELECT</option>
                              {options.map((option) => (
                                <option key={option} value={option}>{option}</option>
                              ))}
                            </select>
                          );
                        }

                        return (
                          <input
                            className="neo-input w-full px-2 py-1 uppercase"
                            autoCapitalize="characters"
                            value={currentValue}
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
