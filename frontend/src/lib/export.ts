import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable, { type UserOptions } from "jspdf-autotable";
import html2canvas from "html2canvas";

const BRAND = {
  forest: "#3d5a3d",
  sage: "#7a9e7c",
  charcoal: "#4a4a48",
  softLinen: "#f1f2eb",
  dustGrey: "#d8dad3",
  terracotta: "#c49a6c",
} as const;

export interface KpiRow {
  label: string;
  value: string;
  sub: string;
}

export interface MonthlyVolumeRow {
  month: string;
  disbursed: number;
  repaid: number;
}

export interface RepaymentStatusRow {
  name: string;
  value: number;
}

export interface PortfolioRow {
  range: string;
  count: number;
}

export interface RepaymentTrendRow {
  month: string;
  expected: number;
  actual: number;
}

export interface TopBorrowerRow {
  name: string;
  amount: number;
}

export interface DashboardData {
  kpis: KpiRow[];
  monthlyVolume: MonthlyVolumeRow[];
  repaymentStatus: RepaymentStatusRow[];
  portfolioRanges: PortfolioRow[];
  repaymentTrends: RepaymentTrendRow[];
  topBorrowers: TopBorrowerRow[];
}

function download(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function downloadString(text: string, filename: string, mime: string) {
  download(new Blob([text], { type: mime }), filename);
}

const fmtN = (n: number) => `UGX ${n.toLocaleString()}`;

export function exportCSV(data: DashboardData) {
  const lines: string[] = [];

  lines.push("KPI Summary");
  lines.push("Metric,Value,Detail");
  data.kpis.forEach((k) =>
    lines.push(`"${k.label}","${k.value}","${k.sub}"`),
  );
  lines.push("");

  lines.push("Monthly Loan Volume");
  lines.push("Month,Disbursed (UGX),Repaid (UGX)");
  data.monthlyVolume.forEach((r) =>
    lines.push(`${r.month},${r.disbursed},${r.repaid}`),
  );
  lines.push("");

  lines.push("Repayment Status Breakdown");
  lines.push("Status,Count");
  data.repaymentStatus.forEach((r) => lines.push(`${r.name},${r.value}`));
  lines.push("");

  lines.push("Portfolio by Amount");
  lines.push("Range,Loan Count");
  data.portfolioRanges.forEach((r) => lines.push(`"${r.range}",${r.count}`));
  lines.push("");

  lines.push("Monthly Repayment Trends");
  lines.push("Month,Expected (UGX),Actual (UGX)");
  data.repaymentTrends.forEach((r) =>
    lines.push(`${r.month},${r.expected},${r.actual}`),
  );
  lines.push("");

  lines.push("Top Borrowers");
  lines.push("Name,Loan Amount (UGX)");
  data.topBorrowers.forEach((r) =>
    lines.push(`"${r.name}",${r.amount}`),
  );

  downloadString(lines.join("\n"), "finny-dashboard-report.csv", "text/csv");
}

export function exportXLS(data: DashboardData) {
  const wb = XLSX.utils.book_new();

  const kpiSheet = XLSX.utils.aoa_to_sheet([
    ["Metric", "Value", "Detail"],
    ...data.kpis.map((k) => [k.label, k.value, k.sub]),
  ]);
  XLSX.utils.book_append_sheet(wb, kpiSheet, "KPI Summary");

  const volSheet = XLSX.utils.aoa_to_sheet([
    ["Month", "Disbursed (UGX)", "Repaid (UGX)"],
    ...data.monthlyVolume.map((r) => [r.month, r.disbursed, r.repaid]),
  ]);
  XLSX.utils.book_append_sheet(wb, volSheet, "Monthly Volume");

  const statusSheet = XLSX.utils.aoa_to_sheet([
    ["Status", "Count"],
    ...data.repaymentStatus.map((r) => [r.name, r.value]),
  ]);
  XLSX.utils.book_append_sheet(wb, statusSheet, "Repayment Status");

  const portfolioSheet = XLSX.utils.aoa_to_sheet([
    ["Range", "Loan Count"],
    ...data.portfolioRanges.map((r) => [r.range, r.count]),
  ]);
  XLSX.utils.book_append_sheet(wb, portfolioSheet, "Portfolio");

  const trendsSheet = XLSX.utils.aoa_to_sheet([
    ["Month", "Expected (UGX)", "Actual (UGX)"],
    ...data.repaymentTrends.map((r) => [r.month, r.expected, r.actual]),
  ]);
  XLSX.utils.book_append_sheet(wb, trendsSheet, "Repayment Trends");

  const borrowersSheet = XLSX.utils.aoa_to_sheet([
    ["Name", "Loan Amount (UGX)"],
    ...data.topBorrowers.map((r) => [r.name, r.amount]),
  ]);
  XLSX.utils.book_append_sheet(wb, borrowersSheet, "Top Borrowers");

  XLSX.writeFile(wb, "finny-dashboard-report.xlsx");
}

function hexToRgb(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return [r, g, b];
}

async function embedLogo(doc: jsPDF): Promise<void> {
  const res = await fetch("/logo.svg");
  const svgText = await res.text();
  const canvas = document.createElement("canvas");
  canvas.width = 80;
  canvas.height = 80;
  const ctx = canvas.getContext("2d")!;
  const img = new Image();
  const blob = new Blob([svgText], { type: "image/svg+xml" });
  const url = URL.createObjectURL(blob);
  await new Promise<void>((resolve) => {
    img.onload = () => {
      ctx.drawImage(img, 0, 0, 80, 80);
      URL.revokeObjectURL(url);
      resolve();
    };
    img.src = url;
  });
  const dataUrl = canvas.toDataURL("image/png");
  doc.addImage(dataUrl, "PNG", 20, 12, 16, 16);
}

function drawHeader(doc: jsPDF) {
  const pageW = doc.internal.pageSize.getWidth();

  doc.setFillColor(...hexToRgb(BRAND.forest));
  doc.rect(0, 0, pageW, 42, "F");

  doc.setFillColor(...hexToRgb(BRAND.sage));
  doc.rect(0, 42, pageW, 2, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text("Dashboard Report", 42, 20);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("Finny Lending Platform", 42, 28);

  const dateStr = new Date().toLocaleDateString("en-UG", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  doc.text(`Generated: ${dateStr}`, 42, 35);
}

function drawFooter(doc: jsPDF, pageNum: number, totalPages: number) {
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();

  doc.setFillColor(...hexToRgb(BRAND.sage));
  doc.rect(0, pageH - 18, pageW, 18, "F");

  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...hexToRgb(BRAND.charcoal));
  doc.text("Generated by Finny", 20, pageH - 7);
  doc.text(`Page ${pageNum} of ${totalPages}`, pageW - 20, pageH - 7, {
    align: "right",
  });
}

function addSectionTitle(doc: jsPDF, title: string, y: number): number {
  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...hexToRgb(BRAND.forest));
  doc.text(title, 20, y);
  return y + 4;
}

export async function exportPDF(
  data: DashboardData,
  chartRefs: (HTMLDivElement | null)[],
) {
  const doc = new jsPDF("p", "mm", "a4");
  const pageW = doc.internal.pageSize.getWidth();
  const marginX = 20;
  const contentW = pageW - marginX * 2;

  await embedLogo(doc);
  drawHeader(doc);

  let y = 54;

  y = addSectionTitle(doc, "KPI Summary", y);
  y += 2;

  autoTable(doc, {
    startY: y,
    head: [["Metric", "Value", "Detail"]],
    body: data.kpis.map((k) => [k.label, k.value, k.sub]),
    margin: { left: marginX, right: marginX },
    theme: "grid",
    styles: {
      fontSize: 9,
      cellPadding: 4,
      textColor: hexToRgb(BRAND.charcoal),
      lineColor: hexToRgb(BRAND.dustGrey),
      lineWidth: 0.3,
    },
    headStyles: {
      fillColor: hexToRgb(BRAND.forest),
      textColor: [255, 255, 255],
      fontStyle: "bold",
    },
    alternateRowStyles: {
      fillColor: hexToRgb("#f8f6f0"),
    },
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  y = (doc as any).lastAutoTable.finalY + 10;

  const chartTitles = [
    "Loan Volume Over Time",
    "Repayment Status Breakdown",
    "Portfolio by Amount",
    "Monthly Repayment Trends",
    "Top Borrowers",
  ];

  const tableConfigs: ((d: DashboardData) => UserOptions)[] = [
    (d) => ({
      head: [["Month", "Disbursed (UGX)", "Repaid (UGX)"]],
      body: d.monthlyVolume.map((r) => [
        r.month,
        fmtN(r.disbursed),
        fmtN(r.repaid),
      ]),
    }),
    (d) => ({
      head: [["Status", "Count"]],
      body: d.repaymentStatus.map((r) => [r.name, String(r.value)]),
    }),
    (d) => ({
      head: [["Range", "Loan Count"]],
      body: d.portfolioRanges.map((r) => [r.range, String(r.count)]),
    }),
    (d) => ({
      head: [["Month", "Expected (UGX)", "Actual (UGX)"]],
      body: d.repaymentTrends.map((r) => [
        r.month,
        fmtN(r.expected),
        fmtN(r.actual),
      ]),
    }),
    (d) => ({
      head: [["Name", "Loan Amount (UGX)"]],
      body: d.topBorrowers.map((r) => [r.name, fmtN(r.amount)]),
    }),
  ];

  for (let i = 0; i < chartTitles.length; i++) {
    const chartImageH = 70;

    if (y + chartImageH + 30 > doc.internal.pageSize.getHeight() - 20) {
      doc.addPage();
      y = 20;
    }

    y = addSectionTitle(doc, chartTitles[i], y);
    y += 2;

    const ref = chartRefs[i];
    if (ref) {
      const canvas = await html2canvas(ref, {
        backgroundColor: "#f1f2eb",
        scale: 2,
        useCORS: true,
        logging: false,
      });
      const imgData = canvas.toDataURL("image/png");
      const imgW = contentW;
      const imgH = (canvas.height / canvas.width) * imgW;

      if (y + imgH + 20 > doc.internal.pageSize.getHeight() - 20) {
        doc.addPage();
        y = 20;
      }

      doc.addImage(imgData, "PNG", marginX, y, imgW, imgH);
      y += imgH + 6;
    }

    const tableOpt = tableConfigs[i](data);
    autoTable(doc, {
      startY: y,
      margin: { left: marginX, right: marginX },
      theme: "grid",
      ...tableOpt,
      styles: {
        fontSize: 9,
        cellPadding: 3,
        textColor: hexToRgb(BRAND.charcoal),
        lineColor: hexToRgb(BRAND.dustGrey),
        lineWidth: 0.3,
      },
      headStyles: {
        fillColor: hexToRgb(BRAND.forest),
        textColor: [255, 255, 255],
        fontStyle: "bold",
      },
      alternateRowStyles: {
        fillColor: hexToRgb("#f8f6f0"),
      },
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    y = (doc as any).lastAutoTable.finalY + 12;
  }

  const totalPages = doc.getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);
    drawFooter(doc, p, totalPages);
  }

  doc.save("finny-dashboard-report.pdf");
}
