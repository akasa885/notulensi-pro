import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");

// Ensure data directory exists
async function ensureDataDir() {
  try {
    await fs.access(DATA_DIR);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
  }
}

// Get filename based on date
function getFilenameForDate(date: string): string {
  const dateObj = new Date(date);
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, "0");
  const day = String(dateObj.getDate()).padStart(2, "0");
  return `notulensi_${year}-${month}-${day}.json`;
}

// GET: Retrieve all notes
export async function GET() {
  try {
    await ensureDataDir();
    const files = await fs.readdir(DATA_DIR);
    const jsonFiles = files.filter((file) => file.endsWith(".json"));

    let allNotes: any[] = [];

    for (const file of jsonFiles) {
      const filePath = path.join(DATA_DIR, file);
      const content = await fs.readFile(filePath, "utf-8");
      const notes = JSON.parse(content);
      allNotes = allNotes.concat(notes);
    }

    return NextResponse.json({ notes: allNotes });
  } catch (error) {
    console.error("Error reading notes:", error);
    return NextResponse.json({ notes: [] });
  }
}

// POST: Save a new note
export async function POST(request: NextRequest) {
  try {
    await ensureDataDir();
    const note = await request.json();

    const filename = getFilenameForDate(note.createdAt);
    const filePath = path.join(DATA_DIR, filename);

    let notes: any[] = [];

    // Read existing notes for this date if file exists
    try {
      const content = await fs.readFile(filePath, "utf-8");
      notes = JSON.parse(content);
    } catch {
      // File doesn't exist yet, start with empty array
      notes = [];
    }

    // Add new note to the beginning
    notes.unshift(note);

    // Write back to file
    await fs.writeFile(filePath, JSON.stringify(notes, null, 2));

    return NextResponse.json({ success: true, note });
  } catch (error) {
    console.error("Error saving note:", error);
    return NextResponse.json(
      { success: false, error: "Failed to save note" },
      { status: 500 }
    );
  }
}

// DELETE: Remove a note
export async function DELETE(request: NextRequest) {
  try {
    await ensureDataDir();
    const { searchParams } = new URL(request.url);
    const noteId = searchParams.get("id");

    if (!noteId) {
      return NextResponse.json(
        { success: false, error: "Note ID required" },
        { status: 400 }
      );
    }

    const files = await fs.readdir(DATA_DIR);
    const jsonFiles = files.filter((file) => file.endsWith(".json"));

    let found = false;

    for (const file of jsonFiles) {
      const filePath = path.join(DATA_DIR, file);
      const content = await fs.readFile(filePath, "utf-8");
      let notes = JSON.parse(content);

      const originalLength = notes.length;
      notes = notes.filter((note: any) => note.id !== noteId);

      if (notes.length < originalLength) {
        found = true;

        if (notes.length === 0) {
          // Delete file if no notes left
          await fs.unlink(filePath);
        } else {
          // Update file with remaining notes
          await fs.writeFile(filePath, JSON.stringify(notes, null, 2));
        }
        break;
      }
    }

    if (found) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { success: false, error: "Note not found" },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error("Error deleting note:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete note" },
      { status: 500 }
    );
  }
}
