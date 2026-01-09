'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { DashboardView } from './components/DashboardView';
import { TimelineView } from './components/TimelineView';
import { CreateView } from './components/CreateView';
import { DetailView } from './components/DetailView';
import { downloadSingleNote } from './utils/downloadJSON';
import { fetchNotes, saveNote, deleteNote as deleteNoteApi, updateNote } from './utils/notesApi';
import {
  Note,
  FormData,
  ViewType,
  DEFAULT_GROUPS,
  INITIAL_FORM_DATA,
  STORAGE_KEYS
} from './constants';

export default function App() {
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

  // --- Actions ---
  const handleSaveNote = async () => {
    if (!formData.title || !formData.content) {
      alert("Judul dan isi notulensi tidak boleh kosong.");
      return;
    }

    setLoading(true);

    if (editingNoteId) {
      // Update existing note
      const noteToUpdate = notes.find(n => n.id === editingNoteId);
      if (noteToUpdate) {
        const updatedNote: Note = {
          ...noteToUpdate,
          title: formData.title,
          group: formData.group,
          content: formData.content,
          updatedAt: new Date().toISOString()
        };

        const success = await updateNote(updatedNote);

        if (success) {
          // Refresh notes from API
          const updatedNotes = await fetchNotes();
          setNotes(updatedNotes);

          // Reset & Redirect
          setFormData(INITIAL_FORM_DATA);
          setEditingNoteId(null);
          setView('list');
        } else {
          alert("Gagal mengupdate notulensi. Silakan coba lagi.");
        }
      }
    } else {
      // Create new note
      const newNote: Note = {
        id: Date.now().toString(),
        title: formData.title,
        group: formData.group,
        content: formData.content,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const success = await saveNote(newNote);

      if (success) {
        // Refresh notes from API
        const updatedNotes = await fetchNotes();
        setNotes(updatedNotes);

        // Reset & Redirect
        setFormData(INITIAL_FORM_DATA);
        setView('list');
      } else {
        alert("Gagal menyimpan notulensi. Silakan coba lagi.");
      }
    }

    setLoading(false);
  };

  const handleDeleteNote = async (id: string) => {
    if (confirm('Hapus notulensi ini?')) {
      setLoading(true);
      const success = await deleteNoteApi(id);

      if (success) {
        // Refresh notes from API
        const updatedNotes = await fetchNotes();
        setNotes(updatedNotes);

        if (view === 'detail') {
          setView('list');
        }
      } else {
        alert("Gagal menghapus notulensi. Silakan coba lagi.");
      }

      setLoading(false);
    }
  };

  const handleAddGroup = () => {
    const newGroup = prompt("Masukkan nama grup baru:");
    if (newGroup && !groups.includes(newGroup)) {
      const updatedGroups = [...groups, newGroup];
      setGroups(updatedGroups);
      localStorage.setItem(STORAGE_KEYS.GROUPS, JSON.stringify(updatedGroups));
    }
  };

  const handleNoteClick = (note: Note) => {
    setCurrentNote(note);
    setView('detail');
  };

  const handleEditNote = (note: Note) => {
    setEditingNoteId(note.id);
    setFormData({
      title: note.title,
      group: note.group,
      content: note.content
    });
    setView('edit');
  };

  const handleViewChange = (newView: ViewType) => {
    setView(newView);
    if (newView !== 'detail') {
      setCurrentNote(null);
    }
    if (newView !== 'edit' && newView !== 'create') {
      setEditingNoteId(null);
      setFormData(INITIAL_FORM_DATA);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
      <Navbar currentView={view} onViewChange={handleViewChange} />

      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-xl">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-slate-700">Memproses...</p>
          </div>
        </div>
      )}

      <main className="max-w-6xl mx-auto px-4 md:px-8 py-8">
        {view === 'dashboard' && (
          <DashboardView
            notes={notes}
            groups={groups}
            onCreateNew={() => setView('create')}
          />
        )}

        {view === 'list' && (
          <TimelineView
            notes={notes}
            onCreateNew={() => setView('create')}
            onNoteClick={handleNoteClick}
          />
        )}

        {view === 'create' && (
          <CreateView
            formData={formData}
            groups={groups}
            onFormChange={setFormData}
            onSave={handleSaveNote}
            onCancel={() => setView('dashboard')}
            onAddGroup={handleAddGroup}
            isEditMode={false}
          />
        )}

        {view === 'edit' && (
          <CreateView
            formData={formData}
            groups={groups}
            onFormChange={setFormData}
            onSave={handleSaveNote}
            onCancel={() => {
              setEditingNoteId(null);
              setFormData(INITIAL_FORM_DATA);
              setView('detail');
            }}
            onAddGroup={handleAddGroup}
            isEditMode={true}
          />
        )}

        {view === 'detail' && (
          <DetailView
            note={currentNote}
            onBack={() => setView('list')}
            onDownload={downloadSingleNote}
            onDelete={handleDeleteNote}
            onEdit={handleEditNote}
          />
        )}
      </main>

      {/* Styles for Tailwind Custom Animations */}
      <style>{`
        @keyframes fade-left {
          from { opacity: 0; transform: translateX(-50px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes fade-right {
          from { opacity: 0; transform: translateX(50px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-fade-left {
          animation: fade-left 0.8s ease-out forwards;
        }
        .animate-fade-right {
          animation: fade-right 0.8s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
