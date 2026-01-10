import React from 'react';

interface QuickActionButtonProps {
    icon: React.ReactNode;
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'success' | 'warning' | 'danger' | 'neutral';
    loading?: boolean;
    disabled?: boolean;
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

const QuickActionButton: React.FC<QuickActionButtonProps> = ({
    icon,
    label,
    onClick,
    variant = 'primary',
    loading = false,
    disabled = false,
    size = 'md',
    className = ''
}) => {
    const variantStyles = {
        primary: 'bg-primary-500 hover:bg-primary-600 text-white shadow-lg shadow-primary-500/25',
        success: 'bg-green-500 hover:bg-green-600 text-white shadow-lg shadow-green-500/25',
        warning: 'bg-amber-500 hover:bg-amber-600 text-white shadow-lg shadow-amber-500/25',
        danger: 'bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/25',
        neutral: 'bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700'
    };

    const sizeStyles = {
        sm: 'px-3 py-2 text-xs gap-1.5',
        md: 'px-4 py-2.5 text-sm gap-2',
        lg: 'px-5 py-3 text-base gap-2.5'
    };

    const iconSizes = {
        sm: 'w-3.5 h-3.5',
        md: 'w-4 h-4',
        lg: 'w-5 h-5'
    };

    return (
        <button
            onClick={onClick}
            disabled={disabled || loading}
            className={`
                inline-flex items-center justify-center font-bold rounded-xl
                transition-all duration-200 active:scale-95
                disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100
                ${variantStyles[variant]}
                ${sizeStyles[size]}
                ${className}
            `}
        >
            {loading ? (
                <div className={`${iconSizes[size]} border-2 border-current border-t-transparent rounded-full animate-spin`} />
            ) : (
                <span className={iconSizes[size]}>{icon}</span>
            )}
            <span>{label}</span>
        </button>
    );
};

// Preset Quick Action Buttons
export const StartJobButton: React.FC<{ onClick: () => void; loading?: boolean }> = ({ onClick, loading }) => (
    <QuickActionButton
        icon={<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
        label="Start Job"
        onClick={onClick}
        variant="warning"
        loading={loading}
    />
);

export const CompleteStepButton: React.FC<{ onClick: () => void; loading?: boolean; label?: string }> = ({ onClick, loading, label = "Complete Step" }) => (
    <QuickActionButton
        icon={<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>}
        label={label}
        onClick={onClick}
        variant="success"
        loading={loading}
    />
);

export const ViewDetailsButton: React.FC<{ onClick: () => void }> = ({ onClick }) => (
    <QuickActionButton
        icon={<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>}
        label="View Details"
        onClick={onClick}
        variant="neutral"
    />
);

export const CallCustomerButton: React.FC<{ phoneNumber: string }> = ({ phoneNumber }) => (
    <QuickActionButton
        icon={<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>}
        label="Call"
        onClick={() => window.open(`tel:${phoneNumber}`, '_self')}
        variant="primary"
        size="sm"
    />
);

export const NavigateButton: React.FC<{ address: string }> = ({ address }) => (
    <QuickActionButton
        icon={<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
        label="Navigate"
        onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`, '_blank')}
        variant="neutral"
        size="sm"
    />
);

export default QuickActionButton;
