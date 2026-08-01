import React from "react";

export interface PrintLayoutProps {
  children: React.ReactNode;
}

const PrintLayout: React.FC<PrintLayoutProps> = ({ children }) => {
  return (
    <div id="print-report" className="print-layout print:bg-white print:text-black">
      {children}
    </div>
  );
};

export default PrintLayout;
