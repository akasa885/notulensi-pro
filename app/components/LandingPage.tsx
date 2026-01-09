'use client';

import React from 'react';
import { FileText, Users, Shield, Cloud, Zap, Database } from 'lucide-react';

interface LandingPageProps {
    onLogin: () => void;
    onRegister: () => void;
}

export default function LandingPage({ onLogin, onRegister }: LandingPageProps) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-50">
            {/* Navbar */}
            <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
                <div className="max-w-6xl mx-auto px-4 md:px-8 h-16 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                            N
                        </div>
                        <span className="font-bold text-xl tracking-tight text-slate-800">
                            Notulen<span className="text-blue-600">Pro</span>
                        </span>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={onLogin}
                            className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                            Login
                        </button>
                        <button
                            onClick={onRegister}
                            className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors"
                        >
                            Get Started
                        </button>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <div className="max-w-6xl mx-auto px-4 md:px-8 py-20">
                <div className="text-center">
                    <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6">
                        Professional Meeting
                        <span className="text-blue-600"> Notes Management</span>
                    </h1>
                    <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
                        Streamline your meeting documentation with NotulensiPro.
                        Organize, collaborate, and never lose important meeting insights again.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                            onClick={onRegister}
                            className="px-8 py-3 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors font-medium text-lg"
                        >
                            Start Free Trial
                        </button>
                        <button
                            onClick={onLogin}
                            className="px-8 py-3 border-2 border-blue-600 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors font-medium text-lg"
                        >
                            Login
                        </button>
                    </div>
                </div>

                {/* Features Grid */}
                <div className="mt-24 grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                            <FileText className="text-blue-600" size={24} />
                        </div>
                        <h3 className="text-xl font-semibold text-slate-900 mb-2">
                            Rich Text Editor
                        </h3>
                        <p className="text-slate-600">
                            Create detailed meeting notes with our powerful rich text editor.
                            Format text, add lists, and structure your notes beautifully.
                        </p>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                            <Users className="text-green-600" size={24} />
                        </div>
                        <h3 className="text-xl font-semibold text-slate-900 mb-2">
                            User Management
                        </h3>
                        <p className="text-slate-600">
                            Each user has their own secure workspace. Keep your notes organized
                            and accessible only to you.
                        </p>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                            <Shield className="text-purple-600" size={24} />
                        </div>
                        <h3 className="text-xl font-semibold text-slate-900 mb-2">
                            Secure & Private
                        </h3>
                        <p className="text-slate-600">
                            Your data is encrypted and secure. We use industry-standard
                            authentication to protect your information.
                        </p>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                        <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
                            <Cloud className="text-yellow-600" size={24} />
                        </div>
                        <h3 className="text-xl font-semibold text-slate-900 mb-2">
                            Hybrid Storage
                        </h3>
                        <p className="text-slate-600">
                            Store your notes in MongoDB for real-time access, with automatic
                            JSON backup for extra safety.
                        </p>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                        <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                            <Zap className="text-red-600" size={24} />
                        </div>
                        <h3 className="text-xl font-semibold text-slate-900 mb-2">
                            Fast & Responsive
                        </h3>
                        <p className="text-slate-600">
                            Built with Next.js for lightning-fast performance.
                            Access your notes instantly from any device.
                        </p>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                        <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                            <Database className="text-indigo-600" size={24} />
                        </div>
                        <h3 className="text-xl font-semibold text-slate-900 mb-2">
                            Full-Stack Solution
                        </h3>
                        <p className="text-slate-600">
                            Complete solution with authentication, database management,
                            and modern API architecture.
                        </p>
                    </div>
                </div>

                {/* CTA Section */}
                <div className="mt-24 bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-12 text-center text-white">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Ready to Transform Your Meeting Notes?
                    </h2>
                    <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                        Join professionals who trust NotulensiPro for their meeting documentation needs.
                    </p>
                    <button
                        onClick={onRegister}
                        className="px-8 py-3 bg-white text-blue-600 hover:bg-blue-50 rounded-lg transition-colors font-medium text-lg"
                    >
                        Get Started Now
                    </button>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-slate-900 text-slate-400 py-8 mt-20">
                <div className="max-w-6xl mx-auto px-4 md:px-8 text-center">
                    <p>&copy; 2026 NotulensiPro. All rights reserved.</p>
                    <p className="mt-2 text-sm">
                        A modern, full-stack meeting notes management system
                    </p>
                </div>
            </footer>
        </div>
    );
}
