import React from 'react';

const cardColors = {
    red: { bg: 'bg-orange-50 dark:bg-orange-900/10', iconBg: 'bg-orange-100 dark:bg-orange-900/30', icon: 'text-orange-600 dark:text-orange-400', border: 'border-orange-100 dark:border-orange-900/20' },
    teal: { bg: 'bg-teal-50 dark:bg-teal-900/10', iconBg: 'bg-teal-100 dark:bg-teal-900/30', icon: 'text-teal-600 dark:text-teal-400', border: 'border-teal-100 dark:border-teal-900/20' },
    purple: { bg: 'bg-purple-50 dark:bg-purple-900/10', iconBg: 'bg-purple-100 dark:bg-purple-900/30', icon: 'text-purple-600 dark:text-purple-400', border: 'border-purple-100 dark:border-purple-900/20' },
    blue: { bg: 'bg-blue-50 dark:bg-blue-900/10', iconBg: 'bg-blue-100 dark:bg-blue-900/30', icon: 'text-blue-600 dark:text-blue-400', border: 'border-blue-100 dark:border-blue-900/20' },
};

interface StatsCardProps {
    title: string;
    value: number | string;
    icon: React.ReactNode;
    gradient: keyof typeof cardColors;
    className?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon, gradient, className = '' }) => {
    const colors = cardColors[gradient] || cardColors.blue;

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

                <div className={`p-4 rounded-2xl ${colors.iconBg} ${colors.icon} transition-all duration-300 group-hover:scale-110 shadow-sm ring-1 ring-inset ${colors.border}`}>
                    <div className="w-6 h-6">
                        {icon}
                    </div>
                </div>
            </div>
            {/* Decorative gradient blob */}
            <div className={`absolute -bottom-4 -right-4 w-24 h-24 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-500 blur-2xl ${colors.bg.replace('bg-', 'bg-gradient-to-br from-')}`}></div>
        </div>
    );
};

export default StatsCard;
