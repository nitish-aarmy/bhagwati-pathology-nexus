import Layout from "@/components/Layout";
import {
  CircleHelp,
  ClipboardList,
  FlaskConical,
  FileText,
  Printer,
  ShieldCheck,
  HardDriveDownload,
  RefreshCcw,
} from "lucide-react";

const workflowSteps = [
  {
    title: "Step 1: Feed Patient Details",
    description:
      "Go to New Test. Choose Existing Patient or New Patient. In New Patient mode, fill Name, Test ID (manual), Age, Gender, Mobile, Address, and Referred Doctor.",
    icon: ClipboardList,
  },
  {
    title: "Step 2: Select Test Panels",
    description:
      "Pick one or multiple test categories. Use search to find tests quickly and move to the result entry step.",
    icon: FlaskConical,
  },
  {
    title: "Step 3: Enter Results",
    description:
      "Feed observed values for the selected parameters only. Keep units and ranges as shown. Empty values are automatically excluded from printing.",
    icon: FileText,
  },
  {
    title: "Step 4: Preview, Save, and Print",
    description:
      "Review the full report. Save to patient history, then print. Report layout includes patient details, Test ID, ranges, and signature area.",
    icon: Printer,
  },
];

const bestPractices = [
  "Use uppercase patient name and doctor name for clean, uniform reports.",
  "Feed a manual Test ID for every new patient entry to improve record tracking.",
  "Before printing, verify abnormal flags and reference ranges in preview.",
  "Use the Patients page to maintain records and remove duplicate profiles.",
  "Install new releases using Setup EXE to get latest fixes and print improvements.",
];

export default function Help() {
  return (
    <Layout>
      <div className="space-y-6">
        <section className="neo-convex p-6 lg:p-8">
          <div className="flex items-start gap-3">
            <div className="neo-concave p-3">
              <CircleHelp className="text-primary" size={24} />
            </div>
            <div>
              <h1 className="font-heading text-2xl lg:text-3xl font-bold text-foreground">
                Help & User Guide
              </h1>
              <p className="mt-2 text-sm text-muted-foreground max-w-3xl">
                This section explains the complete workflow of Bhagwati Pathology Nexus, from patient feeding to final print.
                It is designed for daily lab operation, faster report generation, and consistent output quality.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="font-heading text-lg font-semibold text-foreground mb-3">Complete Workflow</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {workflowSteps.map((step) => (
              <article key={step.title} className="neo-flat p-5">
                <div className="flex items-center gap-2 mb-2">
                  <step.icon className="text-primary" size={18} />
                  <h3 className="font-heading text-sm font-semibold text-foreground">{step.title}</h3>
                </div>
                <p className="text-xs leading-5 text-muted-foreground">{step.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="neo-flat p-5">
          <div className="flex items-center gap-2 mb-3">
            <ShieldCheck className="text-success" size={18} />
            <h2 className="font-heading text-lg font-semibold text-foreground">Best Practices</h2>
          </div>
          <ul className="space-y-2 text-xs text-muted-foreground">
            {bestPractices.map((item) => (
              <li key={item} className="neo-concave px-3 py-2 leading-5">{item}</li>
            ))}
          </ul>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <article className="neo-flat p-5">
            <div className="flex items-center gap-2 mb-2">
              <HardDriveDownload className="text-accent" size={18} />
              <h3 className="font-heading text-sm font-semibold text-foreground">Data Safety</h3>
            </div>
            <p className="text-xs leading-5 text-muted-foreground">
              Patient and report data are saved locally on the machine. For safety, keep periodic system backups and do not delete browser/app storage manually.
            </p>
          </article>

          <article className="neo-flat p-5">
            <div className="flex items-center gap-2 mb-2">
              <RefreshCcw className="text-warning" size={18} />
              <h3 className="font-heading text-sm font-semibold text-foreground">How to Update</h3>
            </div>
            <p className="text-xs leading-5 text-muted-foreground">
              Install the latest Setup EXE when a new build is shared. This keeps your app updated with fixes, print alignment improvements, and workflow enhancements.
            </p>
          </article>
        </section>
      </div>
    </Layout>
  );
}
