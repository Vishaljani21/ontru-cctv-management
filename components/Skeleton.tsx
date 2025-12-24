import React from 'react';

interface SkeletonProps {
    className?: string;
    variant?: 'text' | 'circular' | 'rectangular';
    width?: string | number;
    height?: string | number;
}

const Skeleton: React.FC<SkeletonProps> = ({
    className = "",
    variant = "text",
    width,
    height
}) => {
    const baseClasses = "animate-pulse bg-slate-200 rounded";
    const variantClasses = {
        text: "h-4 w-full",
        circular: "rounded-full",
        rectangular: "rounded-md",
    };

    const style = {
        width: width,
        height: height,
    };

    return (
        <div
            className={`${baseClasses} ${variantClasses[variant]} ${className}`}
            style={style}
            role="status"
            aria-label="Loading..."
        >
            <span className="sr-only">Loading...</span>
        </div>
    );
};

export default Skeleton;
