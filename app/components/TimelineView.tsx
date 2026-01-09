import React from 'react';
import { Plus } from 'lucide-react';
import { Note } from '../constants';
import { TimelineItem } from './TimelineItem';

interface TimelineViewProps {
    notes: Note[];
    onViewNote: (note: Note) => void;
    onEditNote: (note: Note) => void;
    onDeleteNote: (id: string) => void;
    onCreateNew: () => void;
}

export const TimelineView: React.FC<TimelineViewProps> = ({ notes, onViewNote, onEditNote, onDeleteNote, onCreateNew }) => {
    const sortedNotes = [...notes].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    // Group notes by month and year
    const groupedNotes = sortedNotes.reduce((acc, note) => {
        const date = new Date(note.createdAt);
        const monthYear = `${date.toLocaleString('id-ID', { month: 'long' })} ${date.getFullYear()}`;
        if (!acc[monthYear]) {
            acc[monthYear] = [];
        }
        acc[monthYear].push(note);
        return acc;
    }, {} as Record<string, Note[]>);

    return (
        <div className="py-4">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-slate-800">Timeline Notulensi</h2>
                <div className="flex gap-2">
                    <button
                        onClick={onCreateNew}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 flex items-center gap-2"
                    >
                        <Plus size={16} /> Baru
                    </button>
                </div>
            </div>

            {sortedNotes.length === 0 ? (
                <div className="text-center py-20 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                    <p className="text-slate-500">Belum ada notulensi yang dibuat.</p>
                </div>
            ) : (
                <div className="relative py-10">
                    {/* Timeline line - left on mobile, center on desktop */}
                    <div className="absolute left-7 md:left-1/2 top-0 bottom-0 w-0.5 bg-slate-200 md:-ml-px"></div>

                    {Object.entries(groupedNotes).map(([monthYear, notesInMonth], groupIndex) => {
                        let noteIndex = 0;
                        for (let i = 0; i < groupIndex; i++) {
                            noteIndex += Object.values(groupedNotes)[i].length;
                        }

                        return (
                            <div key={monthYear} className="mb-12">
                                {/* Month/Year separator */}
                                <div className="relative flex items-center mb-8 w-full pl-12 md:pl-0 md:justify-center">
                                    <div className="bg-white px-6 py-2 rounded-full border-2 border-slate-200 shadow-sm z-10">
                                        <span className="text-sm font-semibold text-slate-700">{monthYear}</span>
                                    </div>
                                </div>

                                {/* Timeline items */}
                                {notesInMonth.map((note, index) => (
                                    <TimelineItem
                                        key={note.id}
                                        note={note}
                                        index={noteIndex + index}
                                        onClick={() => onViewNote(note)}
                                    />
                                ))}
                            </div>
                        );
                    })}

                    <div className="text-center mt-10">
                        <p className="text-slate-400 text-sm">Semua notulensi telah dimuat</p>
                    </div>
                </div>
            )}
        </div>
    );
};
