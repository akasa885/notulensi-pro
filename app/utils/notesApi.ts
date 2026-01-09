import { Note } from "../constants";

/**
 * Fetch all notes from API
 */
export async function fetchNotes(): Promise<Note[]> {
  try {
    const response = await fetch("/api/notes", {
      headers: {
        Accept: "application/json",
      },
    });
    const data = await response.json();
    return data.notes || [];
  } catch (error) {
    console.error("Error fetching notes:", error);
    return [];
  }
}

/**
 * Save a new note via API
 */
export async function saveNote(
  note: Note
): Promise<{ success: boolean; note?: Note }> {
  try {
    const response = await fetch("/api/notes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(note),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error saving note:", error);
    return { success: false };
  }
}

/**
 * Delete a note via API
 */
export async function deleteNote(
  noteId: string
): Promise<{ success: boolean }> {
  try {
    const response = await fetch(`/api/notes?id=${noteId}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
      },
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error deleting note:", error);
    return { success: false };
  }
}

/**
 * Update an existing note via API
 */
export async function updateNote(
  note: Note
): Promise<{ success: boolean; note?: Note }> {
  try {
    const response = await fetch("/api/notes", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(note),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error updating note:", error);
    return { success: false };
  }
}
