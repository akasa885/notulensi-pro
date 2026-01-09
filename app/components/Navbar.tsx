import React from 'react';
import { LayoutDashboard, List, Plus } from 'lucide-react';
import { ViewType } from '../constants';

interface NavbarProps {
    currentView: ViewType;
    onViewChange: (view: ViewType) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, onViewChange }) => {
    return (
        <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
            <div className="max-w-6xl mx-auto px-4 md:px-8 h-16 flex justify-between items-center">
                <div
                    className="flex items-center gap-2 cursor-pointer"
                    onClick={() => onViewChange('dashboard')}
                >
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                        N
                    </div>
                    <span className="font-bold text-xl tracking-tight text-slate-800">
                        Notulen<span className="text-blue-600">Pro</span>
                    </span>
                </div>
                <div className="flex gap-1 md:gap-4">
                    <button
                        onClick={() => onViewChange('dashboard')}
                        className={`p-2 rounded-lg transition-colors ${currentView === 'dashboard'
                                ? 'bg-blue-50 text-blue-600'
                                : 'text-slate-500 hover:bg-slate-100'
                            }`}
                        title="Dashboard"
                    >
                        <LayoutDashboard size={20} />
                    </button>
                    <button
                        onClick={() => onViewChange('list')}
                        className={`p-2 rounded-lg transition-colors ${currentView === 'list' || currentView === 'detail'
                                ? 'bg-blue-50 text-blue-600'
                                : 'text-slate-500 hover:bg-slate-100'
                            }`}
                        title="Daftar Notulensi"
                    >
                        <List size={20} />
                    </button>
                    <button
                        onClick={() => onViewChange('create')}
                        className={`p-2 rounded-lg transition-colors ${currentView === 'create'
                                ? 'bg-blue-50 text-blue-600'
                                : 'text-slate-500 hover:bg-slate-100'
                            }`}
                        title="Buat Baru"
                    >
                        <Plus size={20} />
                    </button>
                </div>
            </div>
        </nav>
    );
};
