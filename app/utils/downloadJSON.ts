import { Note } from "../constants";

/**
 * Download single note sebagai file JSON
 * @param note - Note yang akan didownload
 */
export const downloadSingleNote = (note: Note): void => {
  const dateStr = new Date(note.createdAt).toISOString().split("T")[0];
  const titleSlug = note.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .substring(0, 30);
  const finalFileName = `notulensi_${dateStr}_${titleSlug}.json`;
  const jsonStr = JSON.stringify(note, null, 2);
  const blob = new Blob([jsonStr], { type: "application/json" });
  const href = URL.createObjectURL(blob);

  // Trik membuat link download otomatis
  const link = document.createElement("a");
  link.href = href;
  link.download = finalFileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Cleanup
  URL.revokeObjectURL(href);
};

/**
 * Download data sebagai file JSON (generic)
 * @param data - Data yang akan didownload
 * @param fileName - Nama file (opsional, default menggunakan tanggal hari ini)
 */
export const downloadJSON = (data: any, fileName?: string): void => {
  const dateStr = new Date().toISOString().split("T")[0];
  const finalFileName = fileName || `notulensi_${dateStr}.json`;
  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: "application/json" });
  const href = URL.createObjectURL(blob);

  // Trik membuat link download otomatis
  const link = document.createElement("a");
  link.href = href;
  link.download = finalFileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Cleanup
  URL.revokeObjectURL(href);
};
