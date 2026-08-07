import React from "react";
import { formatPatientAge } from "@/lib/data";
import { formatDateDMY } from "@/lib/utils";

const SIGNATURE_ASSET_VERSION = "20260726a";
const PATHOLOGIST_SIGNATURE_SRC = `${import.meta.env.BASE_URL}pathologist-signature.jpeg?v=${SIGNATURE_ASSET_VERSION}`;
const PATHOLOGIST_SIGNATURE_FALLBACK_SRC = `${import.meta.env.BASE_URL}pathologist-signature.svg?v=${SIGNATURE_ASSET_VERSION}`;

export interface ReportPreviewProps {
  patient?: any;
  report?: any;
  selectedTestIds?: string[];
  testCategories?: any[];
  results?: { [sectionId: string]: { [paramId: string]: string } };
}

const ReportPreview: React.FC<ReportPreviewProps> = ({
  patient,
  report,
  selectedTestIds,
  testCategories,
  results,
}) => {
  const safePatient = patient || report?.patient || {};
  const reportSections = Array.isArray(report?.sections) ? report.sections : [];
  const safeSelectedTestIds = Array.isArray(selectedTestIds) ? selectedTestIds : [];
  const safeCategories = Array.isArray(testCategories) ? testCategories : [];
  const safeResults = results || {};

  const getDateTime = (value: unknown) => {
    if (!value) return { date: "-", time: "-" };
    const parsed = new Date(String(value));
    if (Number.isNaN(parsed.getTime())) {
      return { date: formatDateDMY(value), time: safePatient?.time || "-" };
    }
    return {
      date: formatDateDMY(value),
      time: parsed.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
    };
  };

  const collectionDateTime = getDateTime(safePatient?.date || report?.createdAt);
  const reportingDateTime = getDateTime(report?.reportedAt || report?.updatedAt || report?.createdAt || safePatient?.time);
  const patientAgeGender = `${formatPatientAge(safePatient)}/${safePatient?.gender || "-"}`;

  const hasFedValue = (value: unknown): boolean => {
    const text = String(value ?? "").trim();
    if (!text) return false;
    const upper = text.toUpperCase();
    return upper !== "N/A" && text !== "-";
  };

  const parseNumber = (value: string): number | null => {
    if (!value) return null;
    const normalized = value.replace(/,/g, ".");
    const match = normalized.match(/[+-]?\d+(?:\.\d+)?/);
    if (!match) return null;
    const parsed = Number(match[0]);
    return Number.isFinite(parsed) ? parsed : null;
  };

  const normalizeRangeText = (range: string): string => {
    return range
      .toLowerCase()
      .replace(/,/g, ".")
      .replace(/[–—]/g, "-")
      .replace(/\bto\b/g, "-")
      .replace(/\s+/g, " ")
      .trim();
  };

  const extractNumbers = (text: string): number[] => {
    const matches = text.match(/[+-]?\d+(?:\.\d+)?/g) || [];
    return matches.map(Number).filter((num) => Number.isFinite(num));
  };

  const parseRangeBounds = (range: string): { low: number; high: number } | null => {
    if (!range) return null;

    const normalized = normalizeRangeText(range);
    const pairMatch = normalized.match(/([+-]?\d+(?:\.\d+)?)\s*-\s*([+-]?\d+(?:\.\d+)?)/);
    if (!pairMatch) return null;

    const first = Number(pairMatch[1]);
    const second = Number(pairMatch[2]);
    if (!Number.isFinite(first) || !Number.isFinite(second)) return null;

    return { low: Math.min(first, second), high: Math.max(first, second) };
  };

  const getGenderSpecificRange = (range: string, gender?: string): string => {
    if (!range) return range;

    const normalizedGender = (gender || "").toLowerCase();
    const maleMatch = range.match(/male\s*[:\-]?\s*([+-]?\d+(?:\.\d+)?)\s*[-–—]\s*([+-]?\d+(?:\.\d+)?)/i);
    const femaleMatch = range.match(/female\s*[:\-]?\s*([+-]?\d+(?:\.\d+)?)\s*[-–—]\s*([+-]?\d+(?:\.\d+)?)/i);

    if (normalizedGender.startsWith("m") && maleMatch) {
      return `${maleMatch[1]}-${maleMatch[2]}`;
    }

    if (normalizedGender.startsWith("f") && femaleMatch) {
      return `${femaleMatch[1]}-${femaleMatch[2]}`;
    }

    return range;
  };

  const getResultFlag = (result: string, range: string): "high" | "low" | "normal" | "na" => {
    const value = parseNumber(result);
    if (value === null || !range) return "na";

    const normalizedRange = normalizeRangeText(range);
    const bounds = parseRangeBounds(normalizedRange);
    if (bounds) {
      if (value < bounds.low) return "low";
      if (value > bounds.high) return "high";
      return "normal";
    }

    const nums = extractNumbers(normalizedRange);

    if (nums.length >= 2) {
      const low = Math.min(nums[0], nums[1]);
      const high = Math.max(nums[0], nums[1]);
      if (value < low) return "low";
      if (value > high) return "high";
      return "normal";
    }

    if (nums.length === 1) {
      const bound = nums[0];
      if (normalizedRange.includes("<") || normalizedRange.includes("below") || normalizedRange.includes("upto") || normalizedRange.includes("up to")) {
        return value > bound ? "high" : "normal";
      }
      if (normalizedRange.includes(">") || normalizedRange.includes("above")) {
        return value < bound ? "low" : "normal";
      }
    }

    return "na";
  };

  const getFlagClasses = (flag: "high" | "low" | "normal" | "na") => {
    if (flag === "high") {
      return {
        row: "bg-rose-100/90 border-l-2 border-l-rose-500 print:bg-transparent",
        result: "font-bold text-rose-800 print:text-red-700",
        parameter: "print:text-black print:font-semibold",
        badge: "HIGH",
        label: "(HIGH)",
        badgeClass: "bg-rose-600 text-white print:bg-transparent print:text-black print:border print:border-black",
      };
    }

    if (flag === "low") {
      return {
        row: "bg-sky-100/90 border-l-2 border-l-sky-600 print:bg-transparent",
        result: "font-bold text-sky-800 print:text-red-700",
        parameter: "print:text-black print:font-semibold",
        badge: "LOW",
        label: "(LOW)",
        badgeClass: "bg-sky-700 text-white print:bg-transparent print:text-black print:border print:border-black",
      };
    }

    return {
      row: "",
      result: "",
      parameter: "",
      badge: "",
      label: "",
      badgeClass: "",
    };
  };

  const formatReportValue = (value: string) => {
    const raw = String(value || "").trim();
    const normalized = raw.toUpperCase();

    if (normalized === "NON-REACTIVE" || normalized === "NON REACTIVE") {
      return "Non Reactive";
    }

    if (normalized === "REACTIVE") {
      return "Reactive";
    }

    if (normalized === "NEGATIVE") {
      return "Negative";
    }

    if (normalized === "POSITIVE") {
      return "Positive";
    }

    return raw;
  };

  const getPositiveNegativePrintClass = (value: string, sectionName?: string) => {
    const normalized = String(value || "").trim().toUpperCase();
    const compact = normalized.replace(/[^A-Z0-9+\-]/g, "");
    const isPositiveLike =
      compact === "POSITIVE" ||
      compact.includes("POSITIVE") ||
      compact === "REACTIVE" ||
      compact.includes("REACTIVE") ||
      compact === "+VE" ||
      compact.startsWith("+");
    const isNegativeLike =
      compact === "NEGATIVE" ||
      compact.includes("NEGATIVE") ||
      compact === "NONREACTIVE" ||
      compact.includes("NONREACTIVE") ||
      compact === "-VE" ||
      compact.startsWith("-");
    const isBloodGroupingSection = String(sectionName || "")
      .toUpperCase()
      .includes("BLOOD GROUPING & TYPING");

    if (isBloodGroupingSection) {
      if (isNegativeLike) {
        return "text-red-700 font-semibold print:text-red-700 print:font-semibold";
      }

      if (isPositiveLike) {
        return "text-black font-semibold print:text-black print:font-semibold";
      }
    }

    if (isNegativeLike) {
      return "print:text-black print:font-semibold";
    }

    if (isPositiveLike) {
      return "print:text-red-700 print:font-semibold";
    }

    return "";
  };

  const getPrintableSectionTitle = (sectionName: unknown) => {
    const rawName = String(sectionName || "").trim();
    if (!rawName) return "Section";

    const normalized = rawName.toUpperCase().replace(/\s+/g, " ").trim();
    const isCbc = normalized.includes("COMPLETE BLOOD COUNT(CBC)") || normalized.includes("COMPLETE BLOOD COUNT (CBC)");
    const withCbcSample = isCbc ? "Complete Blood Count(CBC)-whole blood" : rawName;

    // Print-only casing request: show SERUM as Serum.
    return withCbcSample.replace(/\bSERUM\b/gi, "Serum");
  };

  const formatPrintableText = (value: unknown) => {
    return String(value ?? "").replace(/\bSERUM\b/gi, "Serum");
  };

  const tableHeadClass = "px-2 py-1 text-left text-[10px] font-semibold uppercase tracking-wide text-slate-700 print:px-2 print:py-[3px] print:text-[10.5px]";
  const tableCellClass = "px-2 py-1 align-top break-words text-[10px] text-slate-800 print:px-2 print:py-[3px] print:text-[11px]";

  const sectionBlocks: React.ReactNode[] = [];

  if (reportSections.length > 0) {
    reportSections.forEach((section: any, sectionIndex: number) => {
      const filledTests = (Array.isArray(section?.tests) ? section.tests : []).filter((test: any) => hasFedValue(test?.result));
      if (filledTests.length === 0) return;

      sectionBlocks.push(
        <div
          key={`${section?.category || "section"}-${sectionIndex}`}
          className="report-section-block mb-3 overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-[8px_8px_18px_#d5dbe4,-8px_-8px_18px_#ffffff] print:mb-1 print:rounded-none print:border-black/60 print:bg-white print:shadow-none"
        >
          <div className="border-b border-slate-300 bg-slate-100 px-2 py-1 text-[10.5px] font-semibold tracking-wide text-slate-800 shadow-[inset_2px_2px_6px_#d5dbe4,inset_-2px_-2px_6px_#ffffff] print:bg-transparent print:px-2 print:py-[3px] print:shadow-none print:text-[11px]">
            {getPrintableSectionTitle(section?.category)}
          </div>
          <table className="report-results-table w-full table-fixed border-collapse bg-white/70 print:bg-white">
            <colgroup>
              <col style={{ width: "31%" }} />
              <col style={{ width: "20%" }} />
              <col style={{ width: "14%" }} />
              <col style={{ width: "25%" }} />
              <col style={{ width: "10%" }} />
            </colgroup>
            <thead>
              <tr className="border-b border-slate-300 bg-slate-50/80 print:bg-transparent">
                <th className={tableHeadClass}>Parameter</th>
                <th className={tableHeadClass}>Result</th>
                <th className={tableHeadClass}>Unit</th>
                <th className={tableHeadClass}>Reference</th>
                <th className={`${tableHeadClass} print:hidden`}>Flag</th>
              </tr>
            </thead>
            <tbody>
              {filledTests.map((test: any, testIndex: number) => {
                const rawResultValue = String(test?.result ?? "").trim();
                const resultValue = formatReportValue(rawResultValue);
                const referenceRange = test?.referenceRange || "-";
                const effectiveRange = getGenderSpecificRange(String(referenceRange), safePatient?.gender);
                const flag = getResultFlag(String(rawResultValue), String(effectiveRange));
                const style = getFlagClasses(flag);
                const positiveNegativePrintClass = getPositiveNegativePrintClass(rawResultValue, section?.category);

                return (
                  <tr key={`${test?.testName || "test"}-${testIndex}`} className={`border-b border-slate-200/80 ${style.row}`}>
                    <td className={`${tableCellClass} font-medium ${style.parameter}`}>{formatPrintableText(test?.testName || "-")}</td>
                    <td className={`${tableCellClass} ${style.result} ${positiveNegativePrintClass} print:font-bold`}>
                      <span className="font-bold print:font-bold">{resultValue}</span>
                      {style.label && <span className="ml-1 text-[8.5px] font-bold print:hidden">{style.label}</span>}
                    </td>
                    <td className={tableCellClass}>{test?.unit || "-"}</td>
                    <td className={tableCellClass}>{effectiveRange}</td>
                    <td className={`${tableCellClass} text-center print:hidden`}>
                      {style.badge ? (
                        <span className={`inline-block min-w-8 rounded px-1 py-[1px] text-[7px] font-bold tracking-wide ${style.badgeClass}`}>
                          {style.badge}
                        </span>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      );
    });
  } else {
    safeSelectedTestIds.forEach((testId: string) => {
      const cat = safeCategories.find(tc => tc.id === testId);
      if (!cat) return;
      const subcategories = Array.isArray(cat.subcategories) ? cat.subcategories : [];
      const filledSubcategories = subcategories.filter((sub: any) => hasFedValue(safeResults[testId]?.[sub.id]));
      if (filledSubcategories.length === 0) return;

      sectionBlocks.push(
        <div
          key={testId}
          className="report-section-block mb-3 overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-[8px_8px_18px_#d5dbe4,-8px_-8px_18px_#ffffff] print:mb-1 print:rounded-none print:border-black/60 print:bg-white print:shadow-none"
        >
          <div className="border-b border-slate-300 bg-slate-100 px-2 py-1 text-[10.5px] font-semibold tracking-wide text-slate-800 shadow-[inset_2px_2px_6px_#d5dbe4,inset_-2px_-2px_6px_#ffffff] print:bg-transparent print:px-2 print:py-[3px] print:shadow-none print:text-[11px]">
            {getPrintableSectionTitle(cat.name)}
          </div>
          <table className="report-results-table w-full table-fixed border-collapse bg-white/70 print:bg-white">
            <colgroup>
              <col style={{ width: "31%" }} />
              <col style={{ width: "20%" }} />
              <col style={{ width: "14%" }} />
              <col style={{ width: "25%" }} />
              <col style={{ width: "10%" }} />
            </colgroup>
            <thead>
              <tr className="border-b border-slate-300 bg-slate-50/80 print:bg-transparent">
                <th className={tableHeadClass}>Parameter</th>
                <th className={tableHeadClass}>Result</th>
                <th className={tableHeadClass}>Unit</th>
                <th className={tableHeadClass}>Reference</th>
                <th className={`${tableHeadClass} print:hidden`}>Flag</th>
              </tr>
            </thead>
            <tbody>
              {filledSubcategories.map((sub: any) => {
                const rawResultValue = String(safeResults[testId]?.[sub.id] ?? "").trim();
                const resultValue = formatReportValue(rawResultValue);
                const referenceRange = sub.normalRange || "-";
                const effectiveRange = getGenderSpecificRange(String(referenceRange), safePatient?.gender);
                const flag = getResultFlag(String(rawResultValue), String(effectiveRange));
                const style = getFlagClasses(flag);
                const positiveNegativePrintClass = getPositiveNegativePrintClass(rawResultValue, cat?.name);

                return (
                  <tr key={sub.id} className={`border-b border-slate-200/80 ${style.row}`}>
                    <td className={`${tableCellClass} font-medium ${style.parameter}`}>{formatPrintableText(sub.name)}</td>
                    <td className={`${tableCellClass} ${style.result} ${positiveNegativePrintClass} print:font-bold`}>
                      <span className="font-bold print:font-bold">{resultValue}</span>
                      {style.label && <span className="ml-1 text-[8.5px] font-bold print:hidden">{style.label}</span>}
                    </td>
                    <td className={tableCellClass}>{sub.unit || "-"}</td>
                    <td className={tableCellClass}>{effectiveRange}</td>
                    <td className={`${tableCellClass} text-center print:hidden`}>
                      {style.badge ? (
                        <span className={`inline-block min-w-8 rounded px-1 py-[1px] text-[7px] font-bold tracking-wide ${style.badgeClass}`}>
                          {style.badge}
                        </span>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      );
    });
  }

  return (
    <div className="report-preview rounded-2xl border border-slate-200/80 bg-slate-100 p-4 shadow-[10px_10px_24px_#d6dce5,-10px_-10px_24px_#ffffff] print:rounded-none print:border-black/70 print:bg-white print:p-0 print:shadow-none print:text-[11px] print:text-black">
      <table className="report-print-shell w-full border-collapse">
        <thead className="report-print-header">
          <tr>
            <td>
              <div className="report-meta mb-3 rounded-2xl border border-slate-200 bg-slate-100 px-3 py-2 shadow-[inset_4px_4px_10px_#d6dce5,inset_-4px_-4px_10px_#ffffff] print:mb-1 print:rounded-none print:border-black/50 print:bg-transparent print:px-1.5 print:py-1 print:shadow-none">
                <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 text-[10px] text-slate-700 print:hidden">
                  <div><span className="font-semibold">Patient:</span> <span className="font-bold">{safePatient?.name || "-"}</span></div>
                  <div><span className="font-semibold">Test ID:</span> {safePatient?.testId || safePatient?.id || "-"}</div>
                  <div><span className="font-semibold">Age/Gender:</span> {formatPatientAge(safePatient)} / {safePatient?.gender || "-"}</div>
                  <div><span className="font-semibold">Mobile:</span> {safePatient?.phone || "-"}</div>
                  <div><span className="font-semibold">Ref. By:</span> {safePatient?.refBy || "-"}</div>
                  <div><span className="font-semibold">Address:</span> {safePatient?.address || "-"}</div>
                  <div><span className="font-semibold">Date:</span> <span className="font-bold">{collectionDateTime.date}</span></div>
                  <div><span className="font-semibold">Reporting Time:</span> {reportingDateTime.time}</div>
                </div>

                <div className="hidden print:block">
                  <table className="w-full table-fixed border-collapse text-[11px] text-black">
                    <colgroup>
                      <col style={{ width: "60%" }} />
                      <col style={{ width: "40%" }} />
                    </colgroup>
                    <tbody>
                      <tr>
                        <td className="px-1 py-[2px] align-top">
                          <table className="w-full border-collapse text-[11px] leading-tight">
                            <tbody>
                              <tr>
                                <td className="w-[90px] py-[2px] pr-1 font-semibold">Patient Name</td>
                                <td className="w-[8px] py-[2px] font-semibold">:</td>
                                <td className="py-[2px] font-bold">{safePatient?.name || "-"}</td>
                              </tr>
                              <tr>
                                <td className="w-[90px] py-[2px] pr-1 font-semibold">Age/Gender</td>
                                <td className="w-[8px] py-[2px] font-semibold">:</td>
                                <td className="py-[2px]">{patientAgeGender}</td>
                              </tr>
                              <tr>
                                <td className="w-[90px] py-[2px] pr-1 font-semibold">Ref Doctor</td>
                                <td className="w-[8px] py-[2px] font-semibold">:</td>
                                <td className="py-[2px]">{safePatient?.refBy || "-"}</td>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                        <td className="px-1 py-[2px] align-top">
                          <table className="w-full border-collapse text-[11px] leading-tight">
                            <tbody>
                              <tr>
                                <td className="w-[90px] py-[2px] pr-1 font-semibold">Test ID</td>
                                <td className="w-[8px] py-[2px] font-semibold">:</td>
                                <td className="py-[2px]">{safePatient?.testId || safePatient?.id || "-"}</td>
                              </tr>
                              <tr>
                                <td className="w-[90px] py-[2px] pr-1 font-semibold">Date</td>
                                <td className="w-[8px] py-[2px] font-semibold">:</td>
                                <td className="py-[2px] font-bold">{collectionDateTime.date}</td>
                              </tr>
                              <tr>
                                <td className="w-[90px] py-[2px] pr-1 font-semibold">Reporting Time</td>
                                <td className="w-[8px] py-[2px] font-semibold">:</td>
                                <td className="py-[2px]">{reportingDateTime.time}</td>
                              </tr>
                              <tr>
                                <td className="w-[90px] py-[2px] pr-1 font-semibold">Mobile</td>
                                <td className="w-[8px] py-[2px] font-semibold">:</td>
                                <td className="py-[2px]">{safePatient?.phone || "-"}</td>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </td>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <div className="report-sections-grid">{sectionBlocks}</div>

              <div className="mt-5 text-[10px] text-slate-700 print:mt-1.5 print:text-[11px]">
                <div className="mt-2 flex justify-end">
                  <div className="text-right">
                    <img
                      src={PATHOLOGIST_SIGNATURE_SRC}
                      alt="Pathologist signature"
                      className="ml-auto h-20 w-auto max-w-[340px] object-contain print:h-16 print:max-w-[280px]"
                      onError={(event) => {
                        const img = event.currentTarget;
                        if (img.src.includes("pathologist-signature.jpeg")) {
                          img.src = PATHOLOGIST_SIGNATURE_FALLBACK_SRC;
                          return;
                        }
                        img.style.display = "none";
                      }}
                    />
                    <div className="border-t border-slate-500 pt-1 text-[10px] font-medium print:border-black print:text-[10px]">Pathologist Signature</div>
                  </div>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <div className="report-page-counter hidden print:block" aria-hidden="true" />
    </div>
  );
};

export default ReportPreview;
