import React from "react";
import TestSection from "./TestSection";

export interface ReportEditorProps {
  report: any;
  testCategories: any[];
  onUpdateReport: (report: any) => void;
}

const ReportEditor: React.FC<ReportEditorProps> = ({ report, testCategories, onUpdateReport }) => {
  const sections = Array.isArray(report?.sections) ? report.sections : [];

  const handleAddSection = (categoryId: string) => {
    const cat = testCategories.find(tc => tc.id === categoryId);
    if (!cat) return;
    const categoryTests = Array.isArray(cat.subcategories) ? cat.subcategories : [];
    const newSection = {
      category: cat.name,
      tests: categoryTests.map(sub => ({
        testName: sub.name,
        result: "",
        unit: sub.unit || "",
        referenceRange: sub.normalRange || "",
        remarks: ""
      }))
    };
    onUpdateReport({
      ...report,
      sections: [...sections, newSection]
    });
  };

  const handleRemoveSection = (idx: number) => {
    const newSections = [...sections];
    newSections.splice(idx, 1);
    onUpdateReport({ ...report, sections: newSections });
  };

  const handleUpdateSection = (idx: number, section: any) => {
    const newSections = [...sections];
    newSections[idx] = section;
    onUpdateReport({ ...report, sections: newSections });
  };

  return (
    <div className="report-editor rounded-2xl bg-slate-100 p-4 shadow-[10px_10px_25px_#d5dbe4,-10px_-10px_25px_#ffffff]">
      <div className="mb-4 flex items-center gap-3">
        <select
          className="neo-input h-11 w-full max-w-sm rounded-xl border-0 bg-slate-100 px-3 shadow-[inset_4px_4px_10px_#d5dbe4,inset_-4px_-4px_10px_#ffffff]"
          onChange={e => handleAddSection(e.target.value)}
          defaultValue=""
        >
          <option value="">Add Section...</option>
          {testCategories.map(tc => (
            <option key={tc.id} value={tc.id}>{tc.name}</option>
          ))}
        </select>
        <span className="text-xs font-medium text-slate-500">Choose test panel to append</span>
      </div>

      {sections.map((section: any, idx: number) => (
        <TestSection
          key={idx}
          section={section}
          onUpdate={sec => handleUpdateSection(idx, sec)}
          onRemove={() => handleRemoveSection(idx)}
        />
      ))}
    </div>
  );
};

export default ReportEditor;
