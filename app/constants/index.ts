// Types
export interface Note {
  id: string;
  title: string;
  group: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface FormData {
  title: string;
  group: string;
  content: string;
}

export type ViewType = "dashboard" | "list" | "create" | "detail" | "edit";

// Default values
export const DEFAULT_GROUPS = ["Umum", "Teknis", "Manajemen", "Pemasaran"];

export const INITIAL_FORM_DATA: FormData = {
  title: "",
  group: "Umum",
  content: "",
};

// LocalStorage keys
export const STORAGE_KEYS = {
  NOTES: "meetingNotes",
  GROUPS: "meetingGroups",
} as const;
