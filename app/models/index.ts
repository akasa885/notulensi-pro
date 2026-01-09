import { ObjectId } from "mongodb";

export interface User {
  _id?: ObjectId;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserResponse {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface Note {
  _id?: ObjectId;
  userId: ObjectId;
  title: string;
  group: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface NoteResponse {
  id: string;
  userId: string;
  title: string;
  group: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

// Convert MongoDB document to response format
export function userToResponse(user: User): UserResponse {
  return {
    id: user._id?.toString() || "",
    name: user.name,
    email: user.email,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
  };
}

export function noteToResponse(note: Note): NoteResponse {
  return {
    id: note._id?.toString() || "",
    userId: note.userId.toString(),
    title: note.title,
    group: note.group,
    content: note.content,
    createdAt: note.createdAt.toISOString(),
    updatedAt: note.updatedAt.toISOString(),
  };
}
