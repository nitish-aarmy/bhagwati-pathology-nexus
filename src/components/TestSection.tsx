import React from "react";

export interface TestSectionProps {
  section: any;
  onUpdate: (section: any) => void;
  onRemove: () => void;
}

const TestSection: React.FC<TestSectionProps> = ({ section, onUpdate, onRemove }) => {
  const tests = Array.isArray(section?.tests) ? section.tests : [];

  const handleChange = (idx: number, field: string, value: string) => {
    const normalized = value.toUpperCase();
    const newTests = [...tests];
    newTests[idx] = { ...newTests[idx], [field]: normalized };
    onUpdate({ ...section, tests: newTests });
  };

  const handleAddRow = () => {
    onUpdate({
      ...section,
      tests: [...tests, { testName: "", result: "", unit: "", referenceRange: "", remarks: "" }]
    });
  };

  const handleRemoveRow = (idx: number) => {
    const newTests = [...tests];
    newTests.splice(idx, 1);
    onUpdate({ ...section, tests: newTests });
  };

  return (
    <div className="test-section mb-4 rounded-2xl border border-slate-200/70 bg-slate-100 p-3 shadow-[8px_8px_18px_#d6dce5,-8px_-8px_18px_#ffffff]">
      <div className="flex justify-between items-center mb-1">
        <div className="font-bold text-primary">{section.category}</div>
        <button
          className="rounded-xl bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700 shadow-[4px_4px_10px_#d5dbe4,-4px_-4px_10px_#ffffff] transition hover:bg-rose-100"
          onClick={onRemove}
        >
          Remove Section
        </button>
      </div>
      <table className="w-full text-xs border border-slate-200">
        <thead>
          <tr className="bg-muted-foreground/10">
            <th className="text-left py-1 px-2">Test Name</th>
            <th className="text-left py-1 px-2">Result</th>
            <th className="text-left py-1 px-2">Unit</th>
            <th className="text-left py-1 px-2">Reference Range</th>
            <th className="text-left py-1 px-2">Remarks</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {tests.map((test: any, idx: number) => (
            <tr key={idx} className="border-t">
              <td className="py-1 px-2">
                <input className="neo-input w-32 uppercase" autoCapitalize="characters" value={test.testName || ""} onChange={e => handleChange(idx, "testName", e.target.value)} />
              </td>
              <td className="py-1 px-2">
                <input
                  className="neo-input w-20 uppercase"
                  autoCapitalize="characters"
                  value={test.result || ""}
                  placeholder="N/A"
                  onChange={e => handleChange(idx, "result", e.target.value)}
                />
              </td>
              <td className="py-1 px-2">
                <input className="neo-input w-16 uppercase" autoCapitalize="characters" value={test.unit || ""} onChange={e => handleChange(idx, "unit", e.target.value)} />
              </td>
              <td className="py-1 px-2">
                <input className="neo-input w-24 uppercase" autoCapitalize="characters" value={test.referenceRange || ""} onChange={e => handleChange(idx, "referenceRange", e.target.value)} />
              </td>
              <td className="py-1 px-2">
                <input className="neo-input w-32 uppercase" autoCapitalize="characters" value={test.remarks || ""} onChange={e => handleChange(idx, "remarks", e.target.value)} />
              </td>
              <td className="py-1 px-2">
                <button
                  className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700 shadow-[3px_3px_8px_#d5dbe4,-3px_-3px_8px_#ffffff] transition hover:text-slate-900"
                  onClick={() => handleRemoveRow(idx)}
                >
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button
        className="mt-3 rounded-xl bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 shadow-[4px_4px_10px_#d5dbe4,-4px_-4px_10px_#ffffff] transition hover:bg-emerald-100"
        onClick={handleAddRow}
      >
        Add Test Row
      </button>
    </div>
  );
};

export default TestSection;
