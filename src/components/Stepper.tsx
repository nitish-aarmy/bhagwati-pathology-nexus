import React from "react";

export interface StepperProps {
  step: number;
  steps: string[];
}

const Stepper: React.FC<StepperProps> = ({ step, steps }) => {
  return (
    <div className="mb-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
      {steps.map((label, idx) => (
        <div
          key={idx}
          className={`rounded-xl border px-3 py-2 transition-colors ${
            step === idx + 1
              ? "border-primary/50 bg-primary/10"
              : step > idx + 1
              ? "border-emerald-200 bg-emerald-50/70"
              : "border-slate-200 bg-white/70"
          }`}
        >
          <div className="flex items-center gap-2">
            <div
              className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
                step === idx + 1
                  ? "bg-primary text-white"
                  : step > idx + 1
                  ? "bg-emerald-600 text-white"
                  : "bg-slate-200 text-slate-700"
              }`}
            >
              {idx + 1}
            </div>
            <div className="text-xs font-semibold text-slate-700">{label}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Stepper;
