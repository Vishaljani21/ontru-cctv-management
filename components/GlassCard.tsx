import React from 'react';

interface GlassCardProps {
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
    hoverEffect?: boolean;
}

const GlassCard: React.FC<GlassCardProps> = ({ children, className = '', onClick, hoverEffect = true }) => {
    return (
        <div
            onClick={onClick}
            className={`
                bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/60 dark:border-white/5 
                shadow-[0_2px_10px_rgba(0,0,0,0.03)] overflow-hidden relative backdrop-blur-sm
                transition-all duration-300
                ${hoverEffect ? 'hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:-translate-y-1 hover:border-primary-500/20 dark:hover:border-primary-500/30' : ''}
                ${onClick ? 'cursor-pointer' : ''}
                ${className}
            `}
        >
            {/* Subtle Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent dark:from-white/5 pointer-events-none"></div>

            {/* Content */}
            <div className="relative z-10">
                {children}
            </div>
        </div>
    );
};

export default GlassCard;
