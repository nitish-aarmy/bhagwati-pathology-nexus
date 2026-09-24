export const HOSPITAL_INFO = {
  name: "Bhagwati Hospital",
  tagline: "Pathology & Diagnostic Centre",
  address: "Daltonganj, Jharkhand - 822101",
  phone: "+91-XXXXXXXXXX",
};

export const DOCTORS = [
  { id: "d1", name: "Dr. Sushil Pandey" },
  { id: "d2", name: "Dr. Gautam" },
  { id: "d3", name: "Dr. Ram Kinker Trivedi" },
  { id: "d4", name: "Dr. Archana Pandey" },
  { id: "d5", name: "Dr. Pranav" },
];

export interface TestSubCategory {
  id: string;
  name: string;
  unit?: string;
  normalRange?: string;
}

export interface TestCategory {
  id: string;
  name: string;
  type: "blood" | "urine" | "other";
  subcategories: TestSubCategory[];
}

export const TEST_CATEGORIES: TestCategory[] = [
  // BLOOD TESTS
  {
    id: "cbc",
    name: "COMPLETE BLOOD COUNT(CBC)",
    type: "blood",
    subcategories: [
      { id: "hb", name: "Haemoglobin (Hb)", unit: "gm%", normalRange: "11.5-16.5" },
      { id: "rbc", name: "RBC Count", unit: "million/cumm", normalRange: "4.5-6.5" },
      { id: "wbc", name: "WBC Count (TLC)", unit: "/cumm", normalRange: "4000-11000" },
      { id: "platelet", name: "Platelet Count", unit: "lakh/cumm", normalRange: "1.5-3.5" },
      { id: "pcv", name: "PCV / Hematocrit", unit: "%", normalRange: "36-54" },
      { id: "mcv", name: "MCV", unit: "fL", normalRange: "80-100" },
      { id: "mch", name: "MCH", unit: "pg", normalRange: "27-33" },
      { id: "mchc", name: "MCHC", unit: "g/dL", normalRange: "32-36" },
      { id: "neutrophils", name: "Neutrophils", unit: "%", normalRange: "55-70" },
      { id: "lymphocytes", name: "Lymphocytes", unit: "%", normalRange: "20-35" },
      { id: "eosinophils", name: "Eosinophils", unit: "%", normalRange: "02-06" },
      { id: "monocytes", name: "Monocytes", unit: "%", normalRange: "01-05%" },
      { id: "basophils", name: "Basophils", unit: "%", normalRange: "00-01" },
      { id: "esr", name: "ESR", unit: "mm/hr", normalRange: "0-12" },
    ],
  },
  {
    id: "blood_sugar",
    name: "BLOOD SUGAR (SERUM)",
    type: "blood",
    subcategories: [
      { id: "fbs", name: "Fasting Blood Sugar", unit: "mg/dl", normalRange: "70-110" },
      { id: "ppbs", name: "Post Prandial Blood Sugar", unit: "mg/dl", normalRange: "Up to 140" },
      { id: "rbs", name: "Random Blood Sugar", unit: "mg/dL", normalRange: "70-140" },
      { id: "hba1c", name: "HbA1c", unit: "%", normalRange: "< 5.7" },
      { id: "gtt", name: "Glucose Tolerance Test (GTT)", unit: "mg/dL", normalRange: "Varies" },
    ],
  },
  {
    id: "lipid",
    name: "LIPID PROFILE",
    type: "blood",
    subcategories: [
      { id: "total_chol", name: "Total Cholesterol", unit: "mg/dL", normalRange: "< 200" },
      { id: "hdl", name: "HDL Cholesterol", unit: "mg/dL", normalRange: "> 40" },
      { id: "ldl", name: "LDL Cholesterol", unit: "mg/dL", normalRange: "< 100" },
      { id: "vldl", name: "VLDL Cholesterol", unit: "mg/dL", normalRange: "< 30" },
      { id: "triglycerides", name: "Triglycerides", unit: "mg/dL", normalRange: "< 150" },
    ],
  },
  {
    id: "lft",
    name: "LIVER FUNCTION TEST (LFT) (SERUM)",
    type: "blood",
    subcategories: [
      { id: "bilirubin_total", name: "Total Bilirubin", unit: "mg/dl", normalRange: "0.2-1.1" },
      { id: "bilirubin_direct", name: "Direct Bilirubin", unit: "mg/dl", normalRange: "Up to 0.25" },
      { id: "bilirubin_indirect", name: "Indirect Bilirubin", unit: "mg/dL", normalRange: "0.1-0.9" },
      { id: "sgot", name: "SGOT (AST)", unit: "IU/L", normalRange: "8-40" },
      { id: "sgpt", name: "SGPT (ALT)", unit: "IU/L", normalRange: "5-35" },
      { id: "ggt_male", name: "GGT (Gamma Glutamyl Transferase) - Male", unit: "IU/L", normalRange: "8.61" },
      { id: "ggt_female", name: "GGT (Gamma Glutamyl Transferase) - Female", unit: "IU/L", normalRange: "6.35" },
      { id: "alp", name: "Alkaline Phosphatase", unit: "IU/L", normalRange: "70-270" },
      
      { id: "total_protein", name: "Total Protein", unit: "g/dl", normalRange: "6.0-8.0" },
      { id: "albumin", name: "Albumin", unit: "g/dl", normalRange: "3.7-5.3" },
      { id: "globulin", name: "Globulin", unit: "g/dl", normalRange: "2.3-3.6" },
      { id: "ag_ratio", name: "A/G Ratio", unit: "", normalRange: "1.0-2.3" },
    ],
  },
  {
    id: "kft",
    name: "KIDNEY FUNCTION TEST (KFT/RFT) (SERUM)",
    type: "blood",
    subcategories: [
      { id: "urea", name: "Blood Urea", unit: "mg/dl", normalRange: "14-40" },
      { id: "bun", name: "BUN", unit: "mg%", normalRange: "5-21" },
      { id: "creatinine", name: "Serum Creatinine", unit: "mg/100 ml", normalRange: "0.8-1.4" },
      { id: "uric_acid", name: "Uric Acid", unit: "mg/dl", normalRange: "2.5-7.7" },
      { id: "sodium", name: "Sodium", unit: "mmol/L", normalRange: "135-155" },
      { id: "potassium", name: "Potassium", unit: "mmol/L", normalRange: "3.5-5.5" },
      { id: "chloride", name: "Chloride", unit: "mEq/L", normalRange: "98-106" },
      { id: "calcium", name: "Calcium", unit: "mmol/L", normalRange: "2.20-2.70" },
      { id: "phosphorus", name: "Phosphorus", unit: "mg/dL", normalRange: "2.5-4.5" },
    ],
  },
  {
    id: "pancreatic_enzymes",
    name: "PANCREATIC ENZYMES",
    type: "blood",
    subcategories: [
      { id: "serum_amylase", name: "Serum Amylase", unit: "IU/L", normalRange: "25-125" },
      { id: "serum_lipase", name: "Serum Lipase", unit: "IU/L", normalRange: "0-60" },
    ],
  },
  {
    id: "thyroid",
    name: "THYROID PROFILE",
    type: "blood",
    subcategories: [
      { id: "t3", name: "T3", unit: "ng/ml", normalRange: "0.60-1.81" },
      { id: "t4", name: "T4", unit: "ng/ml", normalRange: "4.50-10.90" },
      { id: "tsh", name: "TSH", unit: "ng/ml", normalRange: "0.35-5.50" },
      { id: "ft3", name: "Free T3", unit: "pg/mL", normalRange: "2.3-4.2" },
      { id: "ft4", name: "Free T4", unit: "ng/dL", normalRange: "0.8-1.8" },
    ],
  },
  {
    id: "blood_group",
    name: "BLOOD GROUPING & TYPING (WHOLE BLOOD)",
    type: "blood",
    subcategories: [
      { id: "abo", name: "ABO Group", unit: "", normalRange: "A/B/AB/O" },
      { id: "rh", name: "Rh Factor", unit: "", normalRange: "Positive/Negative" },
    ],
  },
  {
    id: "typhoid",
    name: "TYPHOID TEST",
    type: "blood",
    subcategories: [
      { id: "to", name: "S. Typhi O", unit: "", normalRange: "< 1:80" },
      { id: "th", name: "S. Typhi H", unit: "", normalRange: "< 1:80" },
      { id: "ato", name: "S. Paratyphi AO", unit: "", normalRange: "< 1:80" },
      { id: "ath", name: "S. Paratyphi AH", unit: "", normalRange: "< 1:80" },
      { id: "bto", name: "S. Paratyphi BO", unit: "", normalRange: "< 1:80" },
      { id: "bth", name: "S. Paratyphi BH", unit: "", normalRange: "< 1:80" },
    ],
  },
  {
    id: "coagulation",
    name: "COAGULATION PROFILE",
    type: "blood",
    subcategories: [
      { id: "pt", name: "Prothrombin Time (PT)", unit: "sec", normalRange: "10-15" },
      { id: "inr", name: "INR", unit: "", normalRange: "0.8-1.2" },
      { id: "aptt", name: "aPTT", unit: "sec", normalRange: "25-35" },
      { id: "bt", name: "Bleeding Time", unit: "sec", normalRange: "0-2" },
      { id: "ct", name: "Clotting Time", unit: "min", normalRange: "2-4" },
    ],
  },
  {
    id: "serology",
    name: "SEROLOGY / IMMUNOLOGY",
    type: "blood",
    subcategories: [
      { id: "hiv", name: "HIV I & II", unit: "", normalRange: "Non-Reactive" },
      { id: "hbsag", name: "HBsAg (Hepatitis B)", unit: "", normalRange: "Non-Reactive" },
      { id: "hcv", name: "HCV (Hepatitis C)", unit: "", normalRange: "Non-Reactive" },
      { id: "vdrl", name: "VDRL", unit: "", normalRange: "Non-Reactive" },
      { id: "ra_factor", name: "RA Factor", unit: "IU/mL", normalRange: "< 14" },
      { id: "aso", name: "ASO Titre", unit: "IU/mL", normalRange: "< 200" },
      { id: "crp", name: "CRP", unit: "mg/L", normalRange: "0.5-5.5" },
      { id: "dengue_ns1", name: "Dengue NS1 Antigen", unit: "", normalRange: "Negative" },
      { id: "dengue_igg_igm", name: "Dengue IgG/IgM", unit: "", normalRange: "Negative" },
      { id: "typhoid_igm", name: "Typhoid (Ig M)", unit: "", normalRange: "Non-Reactive/Reactive" },
      { id: "typhoid_igg", name: "Typhoid (Ig G)", unit: "", normalRange: "Non-Reactive/Reactive" },
      { id: "malaria", name: "Malaria Antigen (Rapid)", unit: "", normalRange: "Negative" },
      { id: "scrub_typhus_igm", name: "Scrub Typhus IgM", unit: "", normalRange: "Non-Reactive/Reactive" },
      { id: "scrub_typhus_igg", name: "Scrub Typhus IgG", unit: "", normalRange: "Non-Reactive/Reactive" },
    ],
  },
  // URINE TESTS
  {
    id: "urine_physical_exam",
    name: "URINE - PHYSICAL EXAM",
    type: "urine",
    subcategories: [
      { id: "quantity", name: "Quantity", unit: "", normalRange: "-" },
      { id: "colour", name: "Colour", unit: "", normalRange: "-" },
      { id: "consistensy", name: "Consistensy", unit: "", normalRange: "-" },
      { id: "sp_gravity", name: "Sp Gravity", unit: "", normalRange: "-" },
      { id: "sediment", name: "Sediment", unit: "", normalRange: "-" },
    ],
  },
  {
    id: "urine_chemical_exam",
    name: "URINE - CHEMICAL EXAM",
    type: "urine",
    subcategories: [
      { id: "reaction", name: "Reaction", unit: "", normalRange: "-" },
      { id: "sugar", name: "Sugar", unit: "", normalRange: "-" },
      { id: "albumen", name: "Albumen", unit: "", normalRange: "-" },
      { id: "phosphates", name: "Phosphates", unit: "", normalRange: "-" },
      { id: "bile_salt", name: "Bile Salt", unit: "", normalRange: "-" },
      { id: "bile_pigment", name: "Bile Pigment", unit: "", normalRange: "-" },
      { id: "urobilinogen", name: "Urobilinogen", unit: "", normalRange: "-" },
    ],
  },
  {
    id: "urine_microscopic_exam_cells",
    name: "URINE - MICROSCOPIC EXAM CELLS",
    type: "urine",
    subcategories: [
      { id: "erythrocytes", name: "Erythrocytes", unit: "", normalRange: "-" },
      { id: "pus_cells", name: "Pus Cells", unit: "", normalRange: "-" },
      { id: "epith_cells", name: "Epith.Cells", unit: "", normalRange: "-" },
    ],
  },
  {
    id: "urine_casts",
    name: "URINE - CASTS",
    type: "urine",
    subcategories: [
      { id: "celluar", name: "Celluar", unit: "", normalRange: "-" },
      { id: "granular", name: "Granular", unit: "", normalRange: "-" },
      { id: "hyailne", name: "Hyailne", unit: "", normalRange: "-" },
      { id: "others", name: "Others", unit: "", normalRange: "-" },
    ],
  },
  {
    id: "urine_hcg",
    name: "URINE FOR HCG",
    type: "urine",
    subcategories: [
      { id: "urine_hcg_result", name: "Urine HCG", unit: "", normalRange: "NEGATIVE/POSITIVE" },
    ],
  },
  // OTHER TESTS
  {
    id: "stool",
    name: "STOOL EXAMINATION",
    type: "other",
    subcategories: [
      { id: "stool_color", name: "Colour", unit: "", normalRange: "Brown" },
      { id: "stool_consistency", name: "Consistency", unit: "", normalRange: "Formed" },
      { id: "stool_occult", name: "Occult Blood", unit: "", normalRange: "Negative" },
      { id: "stool_ova", name: "Ova / Cyst", unit: "", normalRange: "Not Seen" },
      { id: "stool_rbc", name: "RBC", unit: "", normalRange: "Nil" },
      { id: "stool_pus", name: "Pus Cells", unit: "", normalRange: "Nil" },
    ],
  },
  {
    id: "semen",
    name: "SEMEN ANALYSIS",
    type: "other",
    subcategories: [
      { id: "semen_volume", name: "Volume", unit: "mL", normalRange: "> 1.5" },
      { id: "sperm_count", name: "Sperm Count", unit: "million/mL", normalRange: "> 15" },
      { id: "motility", name: "Motility", unit: "%", normalRange: "> 40" },
      { id: "morphology", name: "Morphology (Normal Forms)", unit: "%", normalRange: "> 4" },
    ],
  },
];

export interface Patient {
  id: string;
  name: string;
  testId?: string;
  age: number;
  ageUnit?: "Years" | "Months" | "Days";
  gender: "Male" | "Female" | "Other";
  phone: string;
  address?: string;
  refBy?: string;
  createdAt: string;
}

export function formatPatientAge(patient?: { age?: number | string; ageUnit?: string } | null): string {
  if (!patient || patient.age === undefined || patient.age === null || patient.age === "") return "-";

  const unit = (patient.ageUnit || "Years").toLowerCase();
  if (unit.startsWith("month")) return `${patient.age}M`;
  if (unit.startsWith("day")) return `${patient.age}D`;
  return `${patient.age}Y`;
}

export interface TestResult {
  subCategoryId: string;
  value: string;
}

export interface TestReport {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  testCategoryId: string;
  testCategoryName: string;
  testType: "blood" | "urine" | "other";
  results: TestResult[];
  createdAt: string;
  reportedAt?: string;
  status: "pending" | "completed";
}
