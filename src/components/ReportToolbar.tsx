import React from "react";

export interface ReportToolbarProps {
  onSave: () => void;
  onPrint: () => void;
  onExportPDF?: () => void;
}

const ReportToolbar: React.FC<ReportToolbarProps> = ({ onSave, onPrint, onExportPDF }) => {
  return (
    <div className="flex gap-2 mb-4 print:hidden">
      <button className="neo-btn px-4 py-2 !bg-emerald-700 !text-white hover:!bg-emerald-800 border border-emerald-900" onClick={onSave}>Save Report</button>
      <button className="neo-btn px-4 py-2" onClick={onPrint}>Print Report</button>
      {onExportPDF && <button className="neo-btn px-4 py-2" onClick={onExportPDF}>Export PDF</button>}
    </div>
  );
};

export default ReportToolbar;
