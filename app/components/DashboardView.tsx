import React from 'react';
import { Plus, Clock, Folder, FileText, Calendar } from 'lucide-react';
import { Note } from '../constants';
import { formatDate } from '../utils/formatDate';

interface DashboardViewProps {
    notes: Note[];
    groups: string[];
    onCreateNew: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ notes, groups, onCreateNew }) => {
    const stats = {
        total: notes.length,
        groups: groups.length,
        lastCreated: notes.length > 0
            ? notes.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0].createdAt
            : null
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="bg-slate-800 text-white rounded-2xl p-8 shadow-xl relative overflow-hidden">
                <div className="relative z-10">
                    <h1 className="text-3xl font-bold mb-2">Selamat Datang, Notulen!</h1>
                    <p className="text-slate-300">Siap mencatat poin penting hari ini?</p>
                    <button
                        onClick={onCreateNew}
                        className="mt-6 bg-white text-slate-900 px-6 py-3 rounded-lg font-semibold hover:bg-slate-100 transition-colors flex items-center gap-2 shadow-lg"
                    >
                        <Plus size={20} /> Buat Notulensi Baru
                    </button>
                </div>
                <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-slate-700 to-transparent opacity-50"></div>
                <FileText className="absolute -right-6 -bottom-6 text-slate-700 opacity-20" size={200} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-100 text-blue-600 rounded-full">
                            <FileText size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500 font-medium">Total Notulensi</p>
                            <p className="text-2xl font-bold text-slate-800">{stats.total}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-emerald-100 text-emerald-600 rounded-full">
                            <Folder size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500 font-medium">Total Grup</p>
                            <p className="text-2xl font-bold text-slate-800">{stats.groups}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-purple-100 text-purple-600 rounded-full">
                            <Clock size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500 font-medium">Terakhir Dibuat</p>
                            <p className="text-sm font-bold text-slate-800 line-clamp-2">
                                {stats.lastCreated ? formatDate(stats.lastCreated) : 'Belum ada data'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
