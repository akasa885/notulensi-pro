import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { getDatabase } from "@/app/lib/mongodb";
import { Note, noteToResponse } from "@/app/models";
import { getCurrentUser } from "@/app/lib/auth";
import { ObjectId } from "mongodb";
import config from "@/app/config";
import { validateJsonRequest } from "@/app/lib/apiMiddleware";

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
export async function GET(request: NextRequest) {
  // Validate JSON request
  const validationError = validateJsonRequest(request);
  if (validationError) return validationError;

  try {
    const user = await getCurrentUser();
    const storageMode = config.storage.mode;

    let allNotes: any[] = [];

    // Fetch from MongoDB
    if (storageMode === "mongodb" || storageMode === "both") {
      if (user) {
        const db = await getDatabase();
        const notesCollection = db.collection<Note>("notes");

        const mongoNotes = await notesCollection
          .find({ userId: new ObjectId(user.userId) })
          .sort({ createdAt: -1 })
          .toArray();

        allNotes = mongoNotes.map((note) => ({
          id: note._id?.toString(),
          userId: note.userId.toString(),
          title: note.title,
          group: note.group,
          content: note.content,
          createdAt: note.createdAt.toISOString(),
          updatedAt: note.updatedAt.toISOString(),
        }));
      }
    }

    // Fetch from JSON files (if mode is json or both)
    if (storageMode === "json" || storageMode === "both") {
      await ensureDataDir();
      const files = await fs.readdir(DATA_DIR);
      const jsonFiles = files.filter((file) => file.endsWith(".json"));

      for (const file of jsonFiles) {
        const filePath = path.join(DATA_DIR, file);
        const content = await fs.readFile(filePath, "utf-8");
        const notes = JSON.parse(content);

        // If user is logged in, filter by user ID (if notes have userId field)
        if (user) {
          const userNotes = notes.filter(
            (note: any) => !note.userId || note.userId === user.userId
          );
          allNotes = allNotes.concat(userNotes);
        } else {
          allNotes = allNotes.concat(notes);
        }
      }
    }

    // Remove duplicates based on ID (in case both storage modes are active)
    const uniqueNotes = Array.from(
      new Map(allNotes.map((note) => [note.id, note])).values()
    );

    return NextResponse.json({ notes: uniqueNotes });
  } catch (error) {
    console.error("Error reading notes:", error);
    return NextResponse.json({ notes: [] });
  }
}

// POST: Save a new note
export async function POST(request: NextRequest) {
  // Validate JSON request
  const validationError = validateJsonRequest(request);
  if (validationError) return validationError;

  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 }
      );
    }

    const noteData = await request.json();
    const storageMode = config.storage.mode;
    let savedNote: any = null;

    // Save to MongoDB
    if (storageMode === "mongodb" || storageMode === "both") {
      const db = await getDatabase();
      const notesCollection = db.collection<Note>("notes");

      const newNote: Note = {
        userId: new ObjectId(user.userId),
        title: noteData.title,
        group: noteData.group,
        content: noteData.content,
        createdAt: new Date(noteData.createdAt || new Date()),
        updatedAt: new Date(),
      };

      const result = await notesCollection.insertOne(newNote);
      newNote._id = result.insertedId;

      savedNote = {
        id: result.insertedId.toString(),
        userId: user.userId,
        title: newNote.title,
        group: newNote.group,
        content: newNote.content,
        createdAt: newNote.createdAt.toISOString(),
        updatedAt: newNote.updatedAt.toISOString(),
      };
    }

    // Save to JSON file
    if (storageMode === "json" || storageMode === "both") {
      await ensureDataDir();

      const note = {
        ...noteData,
        userId: user.userId,
        id: savedNote?.id || noteData.id,
      };

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

      if (!savedNote) {
        savedNote = note;
      }
    }

    return NextResponse.json({ success: true, note: savedNote });
  } catch (error) {
    console.error("Error saving note:", error);
    return NextResponse.json(
      { success: false, error: "Failed to save note" },
      { status: 500 }
    );
  }
}

// PUT: Update an existing note
export async function PUT(request: NextRequest) {
  // Validate JSON request
  const validationError = validateJsonRequest(request);
  if (validationError) return validationError;

  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 }
      );
    }

    const updatedNote = await request.json();

    if (!updatedNote.id) {
      return NextResponse.json(
        { success: false, error: "Note ID required" },
        { status: 400 }
      );
    }

    const storageMode = config.storage.mode;
    let finalNote: any = null;

    // Update in MongoDB
    if (storageMode === "mongodb" || storageMode === "both") {
      const db = await getDatabase();
      const notesCollection = db.collection<Note>("notes");

      const result = await notesCollection.findOneAndUpdate(
        {
          _id: new ObjectId(updatedNote.id),
          userId: new ObjectId(user.userId),
        },
        {
          $set: {
            title: updatedNote.title,
            group: updatedNote.group,
            content: updatedNote.content,
            updatedAt: new Date(),
          },
        },
        { returnDocument: "after" }
      );

      if (result) {
        finalNote = {
          id: result._id?.toString(),
          userId: result.userId.toString(),
          title: result.title,
          group: result.group,
          content: result.content,
          createdAt: result.createdAt.toISOString(),
          updatedAt: result.updatedAt.toISOString(),
        };
      }
    }

    // Update in JSON file
    if (storageMode === "json" || storageMode === "both") {
      await ensureDataDir();
      const files = await fs.readdir(DATA_DIR);
      const jsonFiles = files.filter((file) => file.endsWith(".json"));

      let found = false;
      let oldFilePath = "";
      let noteToUpdate: any = null;

      // Find the note in existing files
      for (const file of jsonFiles) {
        const filePath = path.join(DATA_DIR, file);
        const content = await fs.readFile(filePath, "utf-8");
        let notes = JSON.parse(content);

        const noteIndex = notes.findIndex(
          (note: any) =>
            note.id === updatedNote.id &&
            (!note.userId || note.userId === user.userId)
        );

        if (noteIndex !== -1) {
          found = true;
          oldFilePath = filePath;
          noteToUpdate = notes[noteIndex];

          // Remove note from old file
          notes.splice(noteIndex, 1);

          if (notes.length === 0) {
            await fs.unlink(filePath);
          } else {
            await fs.writeFile(filePath, JSON.stringify(notes, null, 2));
          }
          break;
        }
      }

      if (found && noteToUpdate) {
        // Update note with new data
        const updatedNoteData = {
          ...noteToUpdate,
          ...updatedNote,
          userId: user.userId,
          updatedAt: new Date().toISOString(),
        };

        // Save to appropriate file based on createdAt date
        const filename = getFilenameForDate(updatedNoteData.createdAt);
        const newFilePath = path.join(DATA_DIR, filename);

        let notes: any[] = [];

        // Read existing notes for this date if file exists
        try {
          const content = await fs.readFile(newFilePath, "utf-8");
          notes = JSON.parse(content);
        } catch {
          notes = [];
        }

        // Add updated note
        notes.unshift(updatedNoteData);

        // Sort by creation date (newest first)
        notes.sort(
          (a: any, b: any) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        await fs.writeFile(newFilePath, JSON.stringify(notes, null, 2));

        if (!finalNote) {
          finalNote = updatedNoteData;
        }
      }
    }

    if (!finalNote) {
      return NextResponse.json(
        { success: false, error: "Note not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, note: finalNote });
  } catch (error) {
    console.error("Error updating note:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update note" },
      { status: 500 }
    );
  }
}

// DELETE: Remove a note
export async function DELETE(request: NextRequest) {
  // Validate JSON request
  const validationError = validateJsonRequest(request);
  if (validationError) return validationError;

  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const noteId = searchParams.get("id");

    if (!noteId) {
      return NextResponse.json(
        { success: false, error: "Note ID required" },
        { status: 400 }
      );
    }

    const storageMode = config.storage.mode;
    let deleted = false;

    // Delete from MongoDB
    if (storageMode === "mongodb" || storageMode === "both") {
      const db = await getDatabase();
      const notesCollection = db.collection<Note>("notes");

      const result = await notesCollection.deleteOne({
        _id: new ObjectId(noteId),
        userId: new ObjectId(user.userId),
      });

      if (result.deletedCount > 0) {
        deleted = true;
      }
    }

    // Delete from JSON file
    if (storageMode === "json" || storageMode === "both") {
      await ensureDataDir();
      const files = await fs.readdir(DATA_DIR);
      const jsonFiles = files.filter((file) => file.endsWith(".json"));

      for (const file of jsonFiles) {
        const filePath = path.join(DATA_DIR, file);
        const content = await fs.readFile(filePath, "utf-8");
        let notes = JSON.parse(content);

        const originalLength = notes.length;
        notes = notes.filter(
          (note: any) =>
            !(
              note.id === noteId &&
              (!note.userId || note.userId === user.userId)
            )
        );

        if (notes.length < originalLength) {
          deleted = true;

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
    }

    if (deleted) {
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
