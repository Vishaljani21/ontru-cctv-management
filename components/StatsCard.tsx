import React from 'react';

const cardColors = {
    red: { bg: 'bg-orange-50 dark:bg-orange-900/10', iconBg: 'bg-orange-100 dark:bg-orange-900/30', icon: 'text-orange-600 dark:text-orange-400' },
    teal: { bg: 'bg-teal-50 dark:bg-teal-900/10', iconBg: 'bg-teal-100 dark:bg-teal-900/30', icon: 'text-teal-600 dark:text-teal-400' },
    purple: { bg: 'bg-purple-50 dark:bg-purple-900/10', iconBg: 'bg-purple-100 dark:bg-purple-900/30', icon: 'text-purple-600 dark:text-purple-400' },
    blue: { bg: 'bg-blue-50 dark:bg-blue-900/10', iconBg: 'bg-blue-100 dark:bg-blue-900/30', icon: 'text-blue-600 dark:text-blue-400' },
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
            relative overflow-hidden rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg
            bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm group ${className}
        `}>
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-slate-500 dark:text-slate-400 font-semibold text-xs tracking-wider uppercase mb-1">{title}</p>
                    <div className="text-3xl font-bold text-slate-800 dark:text-white tracking-tight">
                        {value}
                    </div>
                </div>

                <div className={`p-3 rounded-xl ${colors.iconBg} ${colors.icon} transition-transform group-hover:scale-110 duration-300`}>
                    <div className="w-6 h-6">
                        {icon}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StatsCard;
