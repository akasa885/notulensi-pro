import React from 'react';

interface ToolbarButtonProps {
    icon: React.ReactNode;
    onClick: () => void;
    label: string;
}

export const ToolbarButton: React.FC<ToolbarButtonProps> = ({ icon, onClick, label }) => (
    <button
        type="button"
        onClick={(e) => {
            e.preventDefault();
            onClick();
        }}
        className="p-1.5 rounded hover:bg-slate-200 text-slate-600 transition-colors"
        title={label}
    >
        {icon}
    </button>
);
