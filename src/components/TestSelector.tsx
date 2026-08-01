import React from "react";

export interface TestSelectorProps {
  testCategories: any[];
  selectedTestIds: string[];
  onSelectTest: (testId: string) => void;
  testSearch: string;
  setTestSearch: (s: string) => void;
}

const TestSelector: React.FC<TestSelectorProps> = ({
  testCategories,
  selectedTestIds,
  onSelectTest,
  testSearch,
  setTestSearch,
}) => {
  const filteredCategories = testCategories.filter((tc) =>
    tc.name.toLowerCase().includes(testSearch.toLowerCase())
  );

  return (
    <div className="test-selector space-y-3">
      <input
        className="neo-input w-full px-3 py-2 text-sm"
        placeholder="Search test by name..."
        value={testSearch}
        onChange={(e) => setTestSearch(e.target.value)}
      />
      <div className="max-h-[26rem] overflow-y-auto rounded-2xl border border-slate-200 bg-white/70 p-2">
        {filteredCategories.map((tc) => {
          const isSelected = selectedTestIds.includes(tc.id);

          return (
            <label
              key={tc.id}
              className={`mb-2 block cursor-pointer rounded-xl border px-3 py-2 transition-colors ${
                isSelected
                  ? "border-primary/50 bg-primary/10"
                  : "border-slate-200 bg-white hover:border-primary/30"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-slate-800">{tc.name}</div>
                  <div className="mt-0.5 text-[11px] text-slate-500">
                    {tc.subcategories.length} parameters
                  </div>
                </div>

                <input
                  type="checkbox"
                  className="mt-1 h-4 w-4 accent-blue-600"
                  checked={isSelected}
                  onChange={() => onSelectTest(tc.id)}
                />
              </div>

              <div className="mt-2 line-clamp-2 text-[11px] text-slate-600">
                {tc.subcategories.slice(0, 6).map((sub) => sub.name).join(", ")}
                {tc.subcategories.length > 6 ? "..." : ""}
              </div>
            </label>
          );
        })}

        {filteredCategories.length === 0 && (
          <div className="px-2 py-3 text-xs text-muted-foreground">No tests found</div>
        )}

        {selectedTestIds.length > 0 && (
          <div className="sticky bottom-0 mt-2 rounded-lg border border-primary/20 bg-primary/10 px-3 py-2 text-xs text-primary">
            {selectedTestIds.length} test section(s) selected
          </div>
        )}
      </div>
    </div>
  );
};

export default TestSelector;
