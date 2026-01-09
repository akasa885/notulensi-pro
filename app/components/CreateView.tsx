'use client';

import React from 'react';
import { ArrowLeft, Save } from 'lucide-react';
import { FormData } from '../constants';
import { RichTextEditor } from './RichTextEditor';

interface CreateViewProps {
    formData: FormData;
    groups: string[];
    setFormData: (data: FormData) => void;
    onAddGroup: (newGroup: string) => void;
    onSave: () => void;
    onCancel: () => void;
    isEditing?: boolean;
}

export const CreateView: React.FC<CreateViewProps> = ({
    formData,
    groups,
    setFormData,
    onAddGroup,
    onSave,
    onCancel,
    isEditing = false
}) => {
    return (
        <div className="animate-in slide-in-from-bottom-5 duration-300 max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
                <button onClick={onCancel} className="p-2 hover:bg-slate-100 rounded-full">
                    <ArrowLeft size={24} className="text-slate-600" />
                </button>
                <h2 className="text-2xl font-bold text-slate-800">
                    {isEditing ? 'Edit Notulensi' : 'Buat Notulensi Baru'}
                </h2>
            </div>

            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100 space-y-6">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Judul Rapat/Diskusi</label>
                    <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white text-slate-900 placeholder-slate-400"
                        placeholder="Contoh: Rapat Evaluasi Q1"
                    />
                </div>

                <div>
                    <div className="flex justify-between items-center mb-2">
                        <label className="block text-sm font-medium text-slate-700">Kategori Grup</label>
                        <button
                            onClick={() => {
                                const newGroup = prompt("Masukkan nama grup baru:");
                                if (newGroup && !groups.includes(newGroup)) {
                                    onAddGroup(newGroup);
                                    setFormData({ ...formData, group: newGroup });
                                }
                            }}
                            className="text-xs text-blue-600 font-semibold hover:underline"
                        >
                            + Tambah Grup
                        </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {groups.map(group => (
                            <button
                                key={group}
                                onClick={() => setFormData({ ...formData, group })}
                                className={`px-4 py-2 rounded-full text-sm transition-all border ${formData.group === group
                                    ? 'bg-blue-600 text-white border-blue-600'
                                    : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300'
                                    }`}
                            >
                                {group}
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Isi Notulensi</label>
                    <RichTextEditor
                        value={formData.content}
                        onChange={(val) => setFormData({ ...formData, content: val })}
                        placeholder="Tulis hasil rapat di sini..."
                    />
                    <p className="text-xs text-slate-400 mt-2">
                        *Notulensi otomatis disimpan sebagai file JSON saat tombol Simpan ditekan.
                    </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                    <button
                        onClick={onCancel}
                        className="px-6 py-2.5 rounded-lg text-slate-600 hover:bg-slate-100 font-medium"
                    >
                        Batal
                    </button>
                    <button
                        onClick={onSave}
                        className="px-6 py-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-medium shadow-lg shadow-blue-200 flex items-center gap-2"
                    >
                        <Save size={18} /> {isEditing ? 'Update Notulensi' : 'Simpan Notulensi'}
                    </button>
                </div>
            </div>
        </div>
    );
};
