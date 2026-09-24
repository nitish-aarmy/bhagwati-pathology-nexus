import React from "react";
import { formatPatientAge } from "@/lib/data";
import { formatDateDMY } from "@/lib/utils";

const SIGNATURE_ASSET_VERSION = "20260726a";
const PATHOLOGIST_SIGNATURE_CUSTOM_SRC = `${import.meta.env.BASE_URL}pathologist-signature-custom.jpeg?v=${SIGNATURE_ASSET_VERSION}`;
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

    // Treat common positive/negative variants consistently
    if (
      normalized === "NON-REACTIVE" ||
      normalized === "NON REACTIVE" ||
      normalized === "-VE" ||
      normalized.startsWith("-") ||
      normalized.includes("NONREACTIVE") ||
      normalized.includes("NEGATIVE")
    ) {
      return "Non Reactive";
    }

    if (
      normalized === "REACTIVE" ||
      normalized === "+VE" ||
      normalized.startsWith("+") ||
      normalized.includes("POSITIVE")
    ) {
      return "Reactive";
    }

    return raw;
  };

  const getPositiveNegativePrintClass = (value: string, sectionName?: string) => {
    const normalized = String(value || "").trim().toUpperCase();
    const compact = normalized.replace(/[^A-Z0-9+\-]/g, "");
    const containsReactive = normalized.includes("REACTIVE");
    const containsNon = normalized.includes("NON") || normalized.includes("NON-");
    const isPositiveLike =
      compact === "POSITIVE" ||
      compact.includes("POSITIVE") ||
      compact === "REACTIVE" ||
      (containsReactive && !containsNon) ||
      compact === "+VE" ||
      compact.startsWith("+");
    const isNegativeLike =
      compact === "NEGATIVE" ||
      compact.includes("NEGATIVE") ||
      compact === "NONREACTIVE" ||
      compact.includes("NONREACTIVE") ||
      normalized === "NON-REACTIVE" ||
      normalized === "NON REACTIVE" ||
      compact === "-VE" ||
      compact.startsWith("-");
    const isBloodGroupingSection = String(sectionName || "")
      .toUpperCase()
      .includes("BLOOD GROUPING & TYPING");

    const upperSection = String(sectionName || "").toUpperCase();
    const isSerologySection = upperSection.includes("SEROLOGY") || upperSection.includes("IMMUNOLOGY");

    if (isBloodGroupingSection) {
      if (isNegativeLike) {
        return "text-red-700 font-semibold print:text-red-700 print:font-semibold";
      }

      if (isPositiveLike) {
        return "text-black font-semibold print:text-black print:font-semibold";
      }
    }

    if (isSerologySection) {
      if (isNegativeLike) {
        return "text-black font-semibold print:text-black print:font-semibold";
      }

      if (isPositiveLike) {
        return "text-red-700 font-semibold print:text-red-700 print:font-semibold";
      }
    }

    if (isNegativeLike) {
      return "text-black print:text-black print:font-semibold";
    }

    if (isPositiveLike) {
      return "text-red-700 print:text-red-700 print:font-semibold";
    }

    return "";
  };

  const getResultColorStyle = (value: string, sectionName?: string): string | undefined => {
    const normalized = String(value || "").trim().toUpperCase();
    const compact = normalized.replace(/[^A-Z0-9+\-]/g, "");

    const containsReactive = normalized.includes("REACTIVE");
    const containsNon = normalized.includes("NON");
    const isPositiveLike =
      compact === "POSITIVE" ||
      compact.includes("POSITIVE") ||
      compact === "REACTIVE" ||
      (containsReactive && !containsNon) ||
      compact === "+VE" ||
      compact.startsWith("+");
    const isNegativeLike =
      compact === "NEGATIVE" ||
      compact.includes("NEGATIVE") ||
      compact === "NONREACTIVE" ||
      compact.includes("NONREACTIVE") ||
      normalized === "NON-REACTIVE" ||
      normalized === "NON REACTIVE" ||
      compact === "-VE" ||
      compact.startsWith("-");

    const isBloodGroupingSection = String(sectionName || "")
      .toUpperCase()
      .includes("BLOOD GROUPING & TYPING");
    const upperSection = String(sectionName || "").toUpperCase();
    const isSerologySection = upperSection.includes("SEROLOGY") || upperSection.includes("IMMUNOLOGY");

    // Blood grouping: NEGATIVE should print red, POSITIVE should print black
    if (isBloodGroupingSection) {
      if (isPositiveLike) return "#000000";
      if (isNegativeLike) return "#b91c1c";
    }

    // Serology: keep existing convention (positive -> red)
    if (isSerologySection) {
      if (isPositiveLike) return "#b91c1c";
      if (isNegativeLike) return "#000000";
    }

    // Default behaviour: positive -> red, negative -> black
    if (isPositiveLike) return "#b91c1c"; // Tailwind red-700
    if (isNegativeLike) return "#000000";
    return undefined;
  };

  const formatRhResult = (raw: string): "Positive" | "Negative" | null => {
    const normalized = String(raw || "").trim().toUpperCase();
    if (!normalized) return null;
    const compact = normalized.replace(/[^A-Z0-9+\-]/g, "");
    const containsReactive = normalized.includes("REACTIVE");
    const containsNon = normalized.includes("NON");
    const isPositiveLike =
      compact === "POSITIVE" ||
      compact.includes("POSITIVE") ||
      compact === "REACTIVE" ||
      (containsReactive && !containsNon) ||
      compact === "+VE" ||
      compact.startsWith("+");
    const isNegativeLike =
      compact === "NEGATIVE" ||
      compact.includes("NEGATIVE") ||
      compact === "NONREACTIVE" ||
      compact.includes("NONREACTIVE") ||
      normalized === "NON-REACTIVE" ||
      normalized === "NON REACTIVE" ||
      compact === "-VE" ||
      compact.startsWith("-");

    if (isPositiveLike) return "Positive";
    if (isNegativeLike) return "Negative";
    return null;
  };

  const formatPosNegResult = (raw: string): "Positive" | "Negative" | null => {
    const normalized = String(raw || "").trim().toUpperCase();
    if (!normalized) return null;
    const compact = normalized.replace(/[^A-Z0-9+\-]/g, "");
    const containsReactive = normalized.includes("REACTIVE");
    const containsNon = normalized.includes("NON");
    const isPositiveLike =
      compact === "POSITIVE" ||
      compact.includes("POSITIVE") ||
      compact === "REACTIVE" ||
      (containsReactive && !containsNon) ||
      compact === "+VE" ||
      compact.startsWith("+");
    const isNegativeLike =
      compact === "NEGATIVE" ||
      compact.includes("NEGATIVE") ||
      compact === "NONREACTIVE" ||
      compact.includes("NONREACTIVE") ||
      normalized === "NON-REACTIVE" ||
      normalized === "NON REACTIVE" ||
      compact === "-VE" ||
      compact.startsWith("-");

    if (isPositiveLike) return "Positive";
    if (isNegativeLike) return "Negative";
    return null;
  };

  const isMalariaOrDengue = (sectionName?: unknown, test?: any) => {
    const upperSection = String(sectionName || "").toUpperCase();
    if (upperSection.includes("MALARIA") || upperSection.includes("DENGUE")) return true;
    const idCandidates = [test?.id, test?.testId, test?.testName, test?.name];
    for (const c of idCandidates) {
      if (!c) continue;
      const s = String(c).toLowerCase();
      if (s.includes("malaria") || s.includes("dengue")) return true;
    }
    return false;
  };

  const isRhTest = (sectionName?: unknown, test?: any) => {
    const upperSection = String(sectionName || "").toUpperCase();
    if (!upperSection.includes("BLOOD GROUPING & TYPING")) return false;
    const idCandidates = [test?.id, test?.testId, test?.testName, test?.name];
    for (const c of idCandidates) {
      if (!c) continue;
      const s = String(c).toLowerCase();
      if (s === "rh" || s.includes("rh factor") || s === "rh factor" || s === "rh_factor") return true;
      // sometimes label may be just 'Rh'
      if (s === "rh") return true;
    }
    return false;
  };

  const printColorStyles = `@media print {
    /* Allow print color to inherit from context-specific utility classes (no hardcoded color here) */
    .report-results-table td .rp-positive-print, .report-results-table td.rp-positive-print, td .rp-positive-print { -webkit-print-color-adjust: exact !important; color-adjust: exact !important; }
    .report-results-table td .rp-negative-print, .report-results-table td.rp-negative-print, td .rp-negative-print { -webkit-print-color-adjust: exact !important; color-adjust: exact !important; }

    /* Reserve space at bottom of each page for the fixed signature */
    .report-preview { padding-bottom: 36mm !important; }

    /* Hide the in-component print wrapper (we use the portal appended to body instead) */
    .report-signature-fixed-wrapper { display: none !important; }
    .report-signature-fixed { display: block !important; max-height: 48px !important; width: auto !important; -webkit-print-color-adjust: exact !important; color-adjust: exact !important; }

    /* Use table footer group so signature repeats at bottom of every page */
    tfoot.report-signature-footer { display: table-footer-group !important; }
    /* Ensure print tables use the container width and allow normal wrapping */
    .report-print-shell, .report-print-shell table { width: 100% !important; table-layout: auto !important; }
    /* Ensure table cells wrap words normally and do not break characters into separate lines */
    .report-print-shell th, .report-print-shell td, .report-results-table th, .report-results-table td {
      white-space: normal !important;
      overflow-wrap: normal !important;
      word-break: normal !important;
    }

    /* Prevent table rows from being printed underneath the footer: keep rows intact and avoid breaking inside rows/sections */
    .report-results-table tbody tr { page-break-inside: avoid !important; break-inside: avoid !important; }
    .report-section-block { page-break-inside: avoid !important; break-inside: avoid !important; }

    @page { margin-bottom: 40mm; }
  }`;

  // No body-level portal: use table footer (`tfoot`) so signature repeats automatically on printed pages.


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
                const isUrineHcgSection = String(section?.category || "").toUpperCase().includes("HCG");
                let resultValue = isUrineHcgSection ? rawResultValue.toUpperCase() : formatReportValue(rawResultValue);
                const rhMapped = isRhTest(section?.category, test) ? formatRhResult(rawResultValue) : null;
                const mdMapped = isMalariaOrDengue(section?.category, test) ? formatPosNegResult(rawResultValue) : null;
                if (rhMapped) resultValue = rhMapped;
                else if (mdMapped) resultValue = mdMapped;
                const referenceRange = test?.referenceRange || "-";
                const effectiveRange = getGenderSpecificRange(String(referenceRange), safePatient?.gender);
                const flag = getResultFlag(String(rawResultValue), String(effectiveRange));
                const style = getFlagClasses(flag);
                const positiveNegativePrintClass = getPositiveNegativePrintClass(rawResultValue, section?.category);

                const resultColor = getResultColorStyle(rawResultValue, section?.category);
                let normalizedCompact = String(rawResultValue || "").toUpperCase();
                let compact = normalizedCompact.replace(/[^A-Z0-9+\-]/g, "");
                let containsReactive = normalizedCompact.includes("REACTIVE");
                let containsNon = normalizedCompact.includes("NON");
                let isPositiveLike =
                  compact === "POSITIVE" ||
                  compact.includes("POSITIVE") ||
                  compact === "REACTIVE" ||
                  (containsReactive && !containsNon) ||
                  compact === "+VE" ||
                  compact.startsWith("+");
                let isNegativeLike =
                  compact === "NEGATIVE" ||
                  compact.includes("NEGATIVE") ||
                  compact === "NONREACTIVE" ||
                  compact.includes("NONREACTIVE") ||
                  normalizedCompact === "NON-REACTIVE" ||
                  normalizedCompact === "NON REACTIVE" ||
                  compact === "-VE" ||
                  compact.startsWith("-");

                // If this is the Rh / Malaria / Dengue test, force Positive/Negative booleans from the mapped value
                if (isRhTest(section?.category, test)) {
                  const rh = formatRhResult(rawResultValue);
                  isPositiveLike = rh === "Positive";
                  isNegativeLike = rh === "Negative";
                } else if (isMalariaOrDengue(section?.category, test)) {
                  const md = formatPosNegResult(rawResultValue);
                  isPositiveLike = md === "Positive";
                  isNegativeLike = md === "Negative";
                }

                return (
                  <tr key={`${test?.testName || "test"}-${testIndex}`} className={`border-b border-slate-200/80 ${style.row}`}>
                    <td className={`${tableCellClass} font-medium ${style.parameter}`}>{formatPrintableText(test?.testName || "-")}</td>
                    <td className={`${tableCellClass} ${style.result} ${positiveNegativePrintClass} print:font-bold`}>
                      <span
                        className={`font-bold print:font-bold ${isPositiveLike ? "rp-positive-print" : isNegativeLike ? "rp-negative-print" : ""}`}
                        style={resultColor ? { color: resultColor, WebkitPrintColorAdjust: "exact" as any } : undefined}
                      >
                        {resultValue}
                      </span>
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
                const isUrineHcgCat = String(cat?.id || "").toLowerCase() === "urine_hcg" || String(sub?.id || "").toLowerCase() === "urine_hcg_result";
                let resultValue = isUrineHcgCat ? rawResultValue.toUpperCase() : formatReportValue(rawResultValue);
                const rhMapped = (String(sub?.id || "").toLowerCase() === "rh" || isRhTest(cat?.name, sub)) ? formatRhResult(rawResultValue) : null;
                const mdMapped = (String(sub?.id || "").toLowerCase().includes("malaria") || String(sub?.id || "").toLowerCase().includes("dengue") || isMalariaOrDengue(cat?.name, sub)) ? formatPosNegResult(rawResultValue) : null;
                if (rhMapped) resultValue = rhMapped;
                else if (mdMapped) resultValue = mdMapped;
                const referenceRange = sub.normalRange || "-";
                const effectiveRange = getGenderSpecificRange(String(referenceRange), safePatient?.gender);
                const flag = getResultFlag(String(rawResultValue), String(effectiveRange));
                const style = getFlagClasses(flag);
                const positiveNegativePrintClass = getPositiveNegativePrintClass(rawResultValue, cat?.name);

                const resultColor = getResultColorStyle(rawResultValue, cat?.name);
                let normalizedCompact = String(rawResultValue || "").toUpperCase();
                let compact = normalizedCompact.replace(/[^A-Z0-9+\-]/g, "");
                let containsReactive = normalizedCompact.includes("REACTIVE");
                let containsNon = normalizedCompact.includes("NON");
                let isPositiveLike =
                  compact === "POSITIVE" || compact.includes("POSITIVE") || compact === "REACTIVE" || (containsReactive && !containsNon) || compact === "+VE" || compact.startsWith("+");
                let isNegativeLike =
                  compact === "NEGATIVE" || compact.includes("NEGATIVE") || compact === "NONREACTIVE" || compact.includes("NONREACTIVE") || normalizedCompact === "NON-REACTIVE" || normalizedCompact === "NON REACTIVE" || compact === "-VE" || compact.startsWith("-");

                // If this is the Rh / Malaria / Dengue subcategory, force Positive/Negative booleans
                if (String(sub?.id || "").toLowerCase() === "rh" || isRhTest(cat?.name, sub)) {
                  const rh = formatRhResult(rawResultValue);
                  isPositiveLike = rh === "Positive";
                  isNegativeLike = rh === "Negative";
                } else if (String(sub?.id || "").toLowerCase().includes("malaria") || String(sub?.id || "").toLowerCase().includes("dengue") || isMalariaOrDengue(cat?.name, sub)) {
                  const md = formatPosNegResult(rawResultValue);
                  isPositiveLike = md === "Positive";
                  isNegativeLike = md === "Negative";
                }

                return (
                  <tr key={sub.id} className={`border-b border-slate-200/80 ${style.row}`}>
                    <td className={`${tableCellClass} font-medium ${style.parameter}`}>{formatPrintableText(sub.name)}</td>
                    <td className={`${tableCellClass} ${style.result} ${positiveNegativePrintClass} print:font-bold`}>
                      <span
                        className={`font-bold print:font-bold ${isPositiveLike ? "rp-positive-print" : isNegativeLike ? "rp-negative-print" : ""}`}
                        style={resultColor ? { color: resultColor, WebkitPrintColorAdjust: "exact" as any } : undefined}
                      >
                        {resultValue}
                      </span>
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
      <style>{printColorStyles}</style>
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

              {/* Inline signature removed for print; footer tfoot will repeat on printed pages */}
            </td>
          </tr>
        </tbody>
        <tfoot className="report-signature-footer hidden print:table-footer-group">
          <tr>
            <td colSpan={5}>
              <div className="w-full">
                <div className="text-right" style={{ width: 320, marginLeft: "auto" }}>
                  <img
                    src={PATHOLOGIST_SIGNATURE_CUSTOM_SRC}
                    alt="Pathologist signature"
                    className="report-signature-fixed mx-0 inline-block"
                    style={{ maxHeight: 48, width: "auto", display: "inline-block", marginLeft: "auto" }}
                    onError={(event) => {
                      const img = event.currentTarget as HTMLImageElement;
                      if (img.src.includes("pathologist-signature-custom.jpeg")) {
                        img.src = PATHOLOGIST_SIGNATURE_SRC;
                        return;
                      }
                      if (img.src.includes("pathologist-signature.jpeg")) {
                        img.src = PATHOLOGIST_SIGNATURE_FALLBACK_SRC;
                        return;
                      }
                      img.style.display = "none";
                    }}
                  />
                  <div className="text-[10px] font-medium print:text-[10px] print:pt-1">Pathologist Signature</div>
                </div>
              </div>
            </td>
          </tr>
        </tfoot>
      </table>
      <div className="report-page-counter hidden print:block" aria-hidden="true" />
      {/* Print-only fixed signature wrapper: prints on every page, right aligned, with text fallback if image missing */}
      {/* removed legacy print wrapper; using tfoot footer for printed signature */}
    </div>
  );
};

export default ReportPreview;
