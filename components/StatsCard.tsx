import React from 'react';

interface StatsCardProps {
    title: string;
    value: number | string;
    icon: React.ReactNode;
    gradient?: string; // Keep for backward compatibility, but not used for icon colors
    className?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon, className = '' }) => {
    return (
        <div className={`
            relative overflow-hidden rounded-3xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] dark:hover:shadow-none
            bg-white dark:bg-slate-900/50 border border-slate-200/60 dark:border-white/5 shadow-[0_2px_10px_rgba(0,0,0,0.03)] group ${className} backdrop-blur-sm
        `}>
            <div className="flex items-center justify-between relative z-10">
                <div>
                    <p className="text-slate-500 dark:text-slate-400 font-bold text-xs tracking-wider uppercase mb-2">{title}</p>
                    <div className="text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight leading-none">
                        {value}
                    </div>
                </div>

                {/* Consistent emerald/primary colored icon background for professional look */}
                <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 transition-all duration-300 group-hover:scale-110 shadow-sm ring-1 ring-inset ring-emerald-100 dark:ring-emerald-900/30">
                    <div className="w-6 h-6">
                        {icon}
                    </div>
                </div>
            </div>
            {/* Decorative gradient blob */}
            <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-500 blur-2xl bg-gradient-to-br from-emerald-100 dark:from-emerald-900"></div>
        </div>
    );
};

export default StatsCard;

