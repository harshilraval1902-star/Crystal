  import Papa from "papaparse";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export function exportToCSV(data: any[], filename: string) {
  if (!data || data.length === 0) {
    throw new Error("No data to export.");
  }
  const csv = Papa.unparse(data);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `${filename}.csv`);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/** Shared helper — builds an XLSX workbook from an array of plain objects. */
function buildWorkbook(data: any[]): XLSX.WorkBook {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
  return workbook;
}

export function exportToExcel(data: any[], filename: string) {
  if (!data || data.length === 0) {
    throw new Error("No data to export.");
  }
  XLSX.writeFile(buildWorkbook(data), `${filename}.xlsx`);
}

/** Export as OpenDocument Spreadsheet (.ods).
 *  Uses the same workbook-building logic as exportToExcel — only the
 *  file extension differs. XLSX natively writes ODS when the filename
 *  ends with ".ods". */
export function exportToODS(data: any[], filename: string) {
  if (!data || data.length === 0) {
    throw new Error("No data to export.");
  }
  XLSX.writeFile(buildWorkbook(data), `${filename}.ods`);
}

export function exportToPDF(data: any[], filename: string, columns: { header: string; dataKey: string }[]) {
  if (!data || data.length === 0) {
    throw new Error("No data to export.");
  }
  const doc = new jsPDF();

  // Use the standalone autoTable function (correct ESM/Vite usage)
  autoTable(doc, {
    head: [columns.map((c) => c.header)],
    body: data.map((row) => columns.map((c) => row[c.dataKey] ?? "")),
    theme: "grid",
    styles: { fontSize: 8 },
    headStyles: { fillColor: [37, 99, 235] },
  });

  doc.save(`${filename}.pdf`);
}
