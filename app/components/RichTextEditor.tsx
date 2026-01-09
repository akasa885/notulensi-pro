'use client';

import React, { useRef, useEffect } from 'react';
import { Bold, Italic, Underline, ListOrdered, List as ListIcon } from 'lucide-react';
import { ToolbarButton } from './ToolbarButton';

interface RichTextEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
    value,
    onChange,
    placeholder = "Tulis di sini..."
}) => {
    const contentEditableRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (contentEditableRef.current && contentEditableRef.current.innerHTML !== value) {
            contentEditableRef.current.innerHTML = value;
        }
    }, []); // Run once on mount

    const handleCommand = (command: string, val: string | null = null) => {
        document.execCommand(command, false, val || undefined);
        if (contentEditableRef.current) {
            onChange(contentEditableRef.current.innerHTML);
        }
    };

    const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
        onChange(e.currentTarget.innerHTML);
    };

    return (
        <div className="border border-slate-300 rounded-lg overflow-hidden bg-white shadow-sm">
            <div className="flex items-center gap-1 p-2 bg-slate-50 border-b border-slate-200">
                <ToolbarButton icon={<Bold size={16} />} onClick={() => handleCommand('bold')} label="Bold" />
                <ToolbarButton icon={<Italic size={16} />} onClick={() => handleCommand('italic')} label="Italic" />
                <ToolbarButton icon={<Underline size={16} />} onClick={() => handleCommand('underline')} label="Underline" />
                <div className="w-px h-4 bg-slate-300 mx-1"></div>
                <ToolbarButton icon={<ListIcon size={16} />} onClick={() => handleCommand('insertUnorderedList')} label="Bullet List" />
                <ToolbarButton icon={<ListOrdered size={16} />} onClick={() => handleCommand('insertOrderedList')} label="Number List" />
            </div>
            <div
                ref={contentEditableRef}
                className="p-4 min-h-[300px] outline-none prose max-w-none text-slate-700"
                contentEditable
                onInput={handleInput}
                suppressContentEditableWarning={true}
                data-placeholder={placeholder}
            />
            <style>{`
        [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: #94a3b8;
          cursor: text;
        }
      `}</style>
        </div>
    );
};
