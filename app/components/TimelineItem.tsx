'use client';

import React, { useRef } from 'react';
import { Calendar } from 'lucide-react';
import { Note } from '../constants';
import { formatDate } from '../utils/formatDate';
import { useOnScreen } from '../hooks/useOnScreen';

interface TimelineItemProps {
    note: Note;
    index: number;
    onClick: () => void;
}

export const TimelineItem: React.FC<TimelineItemProps> = ({ note, index, onClick }) => {
    const ref = useRef<HTMLDivElement>(null);
    const isVisible = useOnScreen(ref);
    const isLeft = index % 2 === 0;

    return (
        <div
            ref={ref}
            className={`relative flex items-center mb-8 ${isVisible
                ? `${isLeft ? 'animate-fade-right md:justify-start' : 'animate-fade-left md:justify-end'}`
                : 'opacity-0'
                } transition-opacity duration-700 ease-out`}
        >
            {/* Left side - Show card if isLeft on desktop, otherwise empty space */}
            <div className="hidden md:block md:w-5/12 md:pr-8">
                {isLeft && (
                    <div
                        onClick={onClick}
                        className={`bg-white p-6 rounded-xl shadow-md border-r-4 border-blue-500 cursor-pointer hover:shadow-xl transition-all hover:-translate-y-1 duration-300`}
                    >
                        <span className="inline-block px-2 py-1 text-xs rounded mb-2 font-medium bg-blue-50 text-blue-600">
                            {note.group}
                        </span>
                        <h3 className="font-bold text-lg text-slate-800 mb-1">{note.title}</h3>
                        <p className="text-xs text-slate-400 flex items-center gap-1">
                            <Calendar size={12} /> {formatDate(note.createdAt)}
                        </p>
                    </div>
                )}
            </div>

            {/* Center/Left dot */}
            <div className="absolute left-4 md:left-1/2 md:-ml-3 z-10 flex items-center justify-center">
                <div className={`w-6 h-6 rounded-full border-4 border-white shadow-lg bg-blue-500 md:${isLeft ? 'bg-blue-500' : 'bg-purple-500'}`}></div>
            </div>

            {/* Right side - Always show card on mobile, show if !isLeft on desktop */}
            <div className="w-full pl-12 md:w-5/12 md:pl-8">
                <div
                    onClick={onClick}
                    className={`bg-white p-6 rounded-xl shadow-md border-l-4 cursor-pointer hover:shadow-xl transition-all hover:-translate-y-1 duration-300 ${isLeft ? 'border-blue-500 md:hidden' : 'border-purple-500'
                        }`}
                >
                    <span className={`inline-block px-2 py-1 text-xs rounded mb-2 font-medium ${isLeft ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'
                        }`}>
                        {note.group}
                    </span>
                    <h3 className="font-bold text-lg text-slate-800 mb-1">{note.title}</h3>
                    <p className="text-xs text-slate-400 flex items-center gap-1">
                        <Calendar size={12} /> {formatDate(note.createdAt)}
                    </p>
                </div>
            </div>
        </div>
    );
};
