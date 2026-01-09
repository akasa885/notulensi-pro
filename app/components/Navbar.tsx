import React from 'react';
import { LayoutDashboard, List, Plus, LogOut, User } from 'lucide-react';
import { ViewType } from '../constants';

interface NavbarProps {
    view: ViewType;
    setView: (view: ViewType) => void;
    user?: any;
    onLogout?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ view, setView, user, onLogout }) => {
    return (
        <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
            <div className="max-w-6xl mx-auto px-4 md:px-8 h-16 flex justify-between items-center">
                <div
                    className="flex items-center gap-2 cursor-pointer"
                    onClick={() => setView('dashboard')}
                >
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                        N
                    </div>
                    <span className="font-bold text-xl tracking-tight text-slate-800">
                        Notulen<span className="text-blue-600">Pro</span>
                    </span>
                </div>
                <div className="flex items-center gap-1 md:gap-4">
                    {user && (
                        <>
                            <button
                                onClick={() => setView('dashboard')}
                                className={`p-2 rounded-lg transition-colors ${view === 'dashboard'
                                    ? 'bg-blue-50 text-blue-600'
                                    : 'text-slate-500 hover:bg-slate-100'
                                    }`}
                                title="Dashboard"
                            >
                                <LayoutDashboard size={20} />
                            </button>
                            <button
                                onClick={() => setView('list')}
                                className={`p-2 rounded-lg transition-colors ${view === 'list' || view === 'detail'
                                    ? 'bg-blue-50 text-blue-600'
                                    : 'text-slate-500 hover:bg-slate-100'
                                    }`}
                                title="Daftar Notulensi"
                            >
                                <List size={20} />
                            </button>
                            <button
                                onClick={() => setView('create')}
                                className={`p-2 rounded-lg transition-colors ${view === 'create'
                                    ? 'bg-blue-50 text-blue-600'
                                    : 'text-slate-500 hover:bg-slate-100'
                                    }`}
                                title="Buat Baru"
                            >
                                <Plus size={20} />
                            </button>
                            <div className="h-6 w-px bg-gray-300 mx-2"></div>
                            <div className="flex items-center gap-2 text-sm text-gray-700">
                                <User size={16} />
                                <span className="hidden md:inline">{user.name}</span>
                            </div>
                            <button
                                onClick={onLogout}
                                className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                                title="Logout"
                            >
                                <LogOut size={20} />
                            </button>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};
