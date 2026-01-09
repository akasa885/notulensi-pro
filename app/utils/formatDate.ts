/**
 * Formatter Tanggal Indonesia
 * @param dateString - String tanggal ISO atau Date object
 * @returns string - Tanggal dalam format Indonesia
 */
export const formatDate = (dateString: string | null): string => {
  if (!dateString) return "-";

  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };

  return new Date(dateString).toLocaleDateString("id-ID", options);
};
