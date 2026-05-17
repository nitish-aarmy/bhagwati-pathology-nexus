import React from "react";

const ReportToolbar = ({
  isEditing,
  onEdit,
  onSave,
  onCancel,
  onPrint
}) => (
  <div className="report-toolbar no-print">
    {!isEditing && <button onClick={onEdit}>Edit</button>}
    {isEditing && (
      <>
        <button onClick={onSave}>Save</button>
        <button onClick={onCancel}>Cancel</button>
      </>
    )}
    <button onClick={onPrint}>Print</button>
  </div>
);

export default ReportToolbar;
