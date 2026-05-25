import React from "react";

const ReportToolbar = ({
  isEditing,
  onEdit,
  onSave,
  onCancel,
  onPrint
}) => (
  <div className="report-toolbar no-print flex gap-2">
    {!isEditing && (
      <button
        className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 font-semibold"
        onClick={onEdit}
      >Edit</button>
    )}
    {isEditing && (
      <>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-semibold"
          onClick={onSave}
        >Save</button>
        <button
          className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 font-semibold"
          onClick={onCancel}
        >Cancel</button>
      </>
    )}
    <button
      className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 font-semibold"
      onClick={onPrint}
    >Print</button>
  </div>
);

export default ReportToolbar;
