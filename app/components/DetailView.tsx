import React from 'react';
import { ArrowLeft, Calendar, Clock, Download, Trash2 } from 'lucide-react';
import { Note } from '../constants';
import { formatDate } from '../utils/formatDate';

interface DetailViewProps {
    note: Note | null;
    onBack: () => void;
    onDownload: (note: Note) => void;
    onDelete: (id: string) => void;
}

export const DetailView: React.FC<DetailViewProps> = ({ note, onBack, onDownload, onDelete }) => {
    if (!note) return null;

    return (
        <div className="animate-in zoom-in-95 duration-200 max-w-4xl mx-auto">
            <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                    <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-full">
                        <ArrowLeft size={24} className="text-slate-600" />
                    </button>
                    <div>
                        <span className="text-sm font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded mb-1 inline-block">
                            {note.group}
                        </span>
                        <h2 className="text-2xl font-bold text-slate-800">{note.title}</h2>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => onDownload(note)}
                        className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg flex items-center gap-2 text-sm border border-slate-200"
                        title="Download JSON"
                    >
                        <Download size={18} /> <span className="hidden sm:inline">JSON</span>
                    </button>
                    <button
                        onClick={() => onDelete(note.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg flex items-center gap-2 text-sm border border-red-100"
                        title="Hapus"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex flex-wrap gap-4 text-sm text-slate-500">
                    <div className="flex items-center gap-1">
                        <Calendar size={14} /> Dibuat: {formatDate(note.createdAt)}
                    </div>
                    <div className="flex items-center gap-1">
                        <Clock size={14} /> ID: {note.id.substring(0, 8)}...
                    </div>
                </div>
                <div className="p-8 prose max-w-none text-slate-700">
                    <div dangerouslySetInnerHTML={{ __html: note.content }} />
                </div>
            </div>
        </div>
    );
};
