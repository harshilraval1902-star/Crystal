  import Papa from "papaparse";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function downloadBlob(blob: Blob, filename: string) {
  const isDownloadSupported = "download" in document.createElement("a");

  // Map file extensions to correct MIME types to ensure proper OS/browser handling on mobile
  const mimeTypes: Record<string, string> = {
    csv: "text/csv;charset=utf-8;",
    xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ods: "application/vnd.oasis.opendocument.spreadsheet",
    pdf: "application/pdf"
  };

  const extension = filename.split(".").pop()?.toLowerCase() || "";
  const targetMimeType = mimeTypes[extension] || blob.type;

  // Ensure blob uses the correct explicit MIME type
  const typedBlob = blob.type === targetMimeType ? blob : new Blob([blob], { type: targetMimeType });
  const url = URL.createObjectURL(typedBlob);

  if (isDownloadSupported) {
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Keep URL alive for 5 seconds to ensure mobile download manager connects before revocation
    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 5000);
  } else {
    // Fallback for browsers that do not support the download attribute (e.g. older iOS Safari / WebViews)
    const newWindow = window.open(url, "_blank");
    if (!newWindow || newWindow.closed) {
      // If popup blocker prevents opening a new tab, navigate the current tab directly
      window.location.href = url;
    }

    // Keep the object URL alive for 20 seconds so the new window/tab has time to load it
    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 20000);
  }
}

export function exportToCSV(data: any[], filename: string) {
  if (!data || data.length === 0) {
    throw new Error("No data to export.");
  }
  const csv = Papa.unparse(data);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  downloadBlob(blob, `${filename}.csv`);
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
  const wb = buildWorkbook(data);
  const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  const blob = new Blob([wbout], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
  downloadBlob(blob, `${filename}.xlsx`);
}

/** Export as OpenDocument Spreadsheet (.ods).
 *  Uses the same workbook-building logic as exportToExcel — only the
 *  file extension differs. XLSX natively writes ODS when the filename
 *  ends with ".ods". */
export function exportToODS(data: any[], filename: string) {
  if (!data || data.length === 0) {
    throw new Error("No data to export.");
  }
  const wb = buildWorkbook(data);
  const wbout = XLSX.write(wb, { bookType: "ods", type: "array" });
  const blob = new Blob([wbout], { type: "application/vnd.oasis.opendocument.spreadsheet" });
  downloadBlob(blob, `${filename}.ods`);
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

  const blob = doc.output("blob");
  downloadBlob(blob, `${filename}.pdf`);
}
