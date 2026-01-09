import { Note } from "../constants";

/**
 * Fetch all notes from API
 */
export async function fetchNotes(): Promise<Note[]> {
  try {
    const response = await fetch("/api/notes");
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
export async function saveNote(note: Note): Promise<boolean> {
  try {
    const response = await fetch("/api/notes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(note),
    });
    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error("Error saving note:", error);
    return false;
  }
}

/**
 * Delete a note via API
 */
export async function deleteNote(noteId: string): Promise<boolean> {
  try {
    const response = await fetch(`/api/notes?id=${noteId}`, {
      method: "DELETE",
    });
    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error("Error deleting note:", error);
    return false;
  }
}
