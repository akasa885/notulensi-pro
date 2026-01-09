'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from './Navbar';
import { DashboardView } from './DashboardView';
import { TimelineView } from './TimelineView';
import { CreateView } from './CreateView';
import { DetailView } from './DetailView';
import { downloadSingleNote } from '../utils/downloadJSON';
import { fetchNotes, saveNote, deleteNote as deleteNoteApi, updateNote } from '../utils/notesApi';
import {
    Note,
    FormData,
    ViewType,
    DEFAULT_GROUPS,
    INITIAL_FORM_DATA,
    STORAGE_KEYS
} from '../constants';

interface DashboardAppProps {
    user: {
        id: string;
        name: string;
        email: string;
    };
    onLogout: () => void;
}

export default function DashboardApp({ user, onLogout }: DashboardAppProps) {
    // State
    const [view, setView] = useState<ViewType>('dashboard');
    const [notes, setNotes] = useState<Note[]>([]);
    const [groups, setGroups] = useState<string[]>(DEFAULT_GROUPS);
    const [currentNote, setCurrentNote] = useState<Note | null>(null);
    const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
    const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA);
    const [loading, setLoading] = useState(false);

    // Load notes from API and groups from localStorage
    useEffect(() => {
        const loadData = async () => {
            setLoading(true);

            // Load notes from API
            const notesFromApi = await fetchNotes();
            setNotes(notesFromApi);

            // Load groups from localStorage
            const savedGroups = localStorage.getItem(STORAGE_KEYS.GROUPS);
            if (savedGroups) {
                setGroups(JSON.parse(savedGroups));
            }

            setLoading(false);
        };

        loadData();
    }, []);

    // Save groups to localStorage whenever they change
    useEffect(() => {
        localStorage.setItem(STORAGE_KEYS.GROUPS, JSON.stringify(groups));
    }, [groups]);

    // Handlers
    const handleAddGroup = (newGroup: string) => {
        if (!groups.includes(newGroup)) {
            setGroups([...groups, newGroup]);
        }
    };

    const handleCreateNote = async () => {
        if (!formData.title.trim() || !formData.content.trim()) return;

        const newNote: Note = {
            id: Date.now().toString(),
            title: formData.title,
            group: formData.group,
            content: formData.content,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        const result = await saveNote(newNote);

        if (result.success && result.note) {
            setNotes([result.note, ...notes]);
            setFormData(INITIAL_FORM_DATA);
            setView('dashboard');
        }
    };

    const handleUpdateNote = async () => {
        if (!editingNoteId || !formData.title.trim() || !formData.content.trim()) return;

        const noteToUpdate = notes.find(n => n.id === editingNoteId);
        if (!noteToUpdate) return;

        const updatedNote: Note = {
            ...noteToUpdate,
            title: formData.title,
            group: formData.group,
            content: formData.content,
            updatedAt: new Date().toISOString(),
        };

        const result = await updateNote(updatedNote);

        if (result.success && result.note) {
            setNotes(notes.map(n => n.id === editingNoteId ? result.note! : n));
            setFormData(INITIAL_FORM_DATA);
            setEditingNoteId(null);
            setView('dashboard');
        }
    };

    const handleDeleteNote = async (id: string) => {
        if (!confirm('Are you sure you want to delete this note?')) return;

        const result = await deleteNoteApi(id);

        if (result.success) {
            setNotes(notes.filter(n => n.id !== id));
            if (currentNote?.id === id) {
                setCurrentNote(null);
                setView('dashboard');
            }
        }
    };

    const handleEditNote = (note: Note) => {
        setEditingNoteId(note.id);
        setFormData({
            title: note.title,
            group: note.group,
            content: note.content,
        });
        setView('edit');
    };

    const handleCancelEdit = () => {
        setFormData(INITIAL_FORM_DATA);
        setEditingNoteId(null);
        setView('dashboard');
    };

    const handleViewNote = (note: Note) => {
        setCurrentNote(note);
        setView('detail');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
            <Navbar
                view={view}
                setView={setView}
                user={user}
                onLogout={onLogout}
            />

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 max-w-7xl">
                {loading ? (
                    <div className="flex items-center justify-center h-[calc(100vh-80px)]">
                        <div className="text-xl text-gray-600">Loading...</div>
                    </div>
                ) : (
                    <>
                        {view === 'dashboard' && (
                            <DashboardView
                                notes={notes}
                                onViewNote={handleViewNote}
                                onEditNote={handleEditNote}
                                onDeleteNote={handleDeleteNote}
                                onCreateNew={() => setView('create')}
                            />
                        )}

                        {view === 'list' && (
                            <TimelineView
                                notes={notes}
                                onViewNote={handleViewNote}
                                onEditNote={handleEditNote}
                                onDeleteNote={handleDeleteNote}
                                onCreateNew={() => setView('create')}
                            />
                        )}

                        {view === 'create' && (
                            <CreateView
                                formData={formData}
                                setFormData={setFormData}
                                groups={groups}
                                onAddGroup={handleAddGroup}
                                onSave={handleCreateNote}
                                onCancel={() => setView('dashboard')}
                            />
                        )}

                        {view === 'edit' && (
                            <CreateView
                                formData={formData}
                                setFormData={setFormData}
                                groups={groups}
                                onAddGroup={handleAddGroup}
                                onSave={handleUpdateNote}
                                onCancel={handleCancelEdit}
                                isEditing
                            />
                        )}

                        {view === 'detail' && currentNote && (
                            <DetailView
                                note={currentNote}
                                onBack={() => setView('dashboard')}
                                onEdit={() => handleEditNote(currentNote)}
                                onDelete={() => handleDeleteNote(currentNote.id)}
                                onDownload={() => downloadSingleNote(currentNote)}
                            />
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
