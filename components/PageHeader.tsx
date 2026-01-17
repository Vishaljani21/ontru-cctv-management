import React from 'react';

interface PageHeaderProps {
    title: string;
    description?: string;
    action?: React.ReactNode;
    children?: React.ReactNode;
    className?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, description, action, children, className = '' }) => {
    return (
        <div className={`bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-800 via-slate-900 to-slate-950 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden isolate ${className}`}>
            {/* Decorative Patterns */}
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl"></div>

            <div className="relative z-10">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2 text-white drop-shadow-sm">{title}</h1>
                        {description && <p className="text-slate-300 text-lg max-w-2xl leading-relaxed">{description}</p>}
                    </div>
                    {action && (
                        <div className="shrink-0">
                            {action}
                        </div>
                    )}
                </div>

                {children && (
                    <div className="mt-8 pt-6 border-t border-white/10 animate-fade-in-up">
                        {children}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PageHeader;
