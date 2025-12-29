import React, { useState, useRef, useEffect } from 'react';
import { ChevronRightIcon } from './icons';

interface Option {
    value: string;
    label: string;
    icon?: React.ReactNode;
    color?: string; // e.g., 'bg-red-500' for a dot indicator
}

interface CustomSelectProps {
    options: Option[];
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    icon?: React.ReactNode;
    className?: string;
    label?: string;
}

const CustomSelect: React.FC<CustomSelectProps> = ({
    options,
    value,
    onChange,
    placeholder = "Select...",
    icon,
    className = "",
    label
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const selectedOption = options.find(opt => opt.value === value);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (val: string) => {
        onChange(val);
        setIsOpen(false);
    };

    return (
        <div className={`relative ${className}`} ref={containerRef}>
            {label && <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">{label}</label>}

            <div
                onClick={() => setIsOpen(!isOpen)}
                className={`
                    w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 
                    bg-white dark:bg-slate-800 cursor-pointer flex items-center justify-between
                    shadow-sm hover:border-primary-400 dark:hover:border-primary-600 transition-all
                    focus:ring-2 focus:ring-primary-500
                    ${isOpen ? 'ring-2 ring-primary-500 border-primary-500' : ''}
                `}
            >
                <div className="flex items-center gap-2 truncate">
                    {icon && <span className="text-slate-400">{icon}</span>}
                    {selectedOption ? (
                        <div className="flex items-center gap-2">
                            {selectedOption.color && (
                                <span className={`w-2 h-2 rounded-full ${selectedOption.color}`}></span>
                            )}
                            <span className="text-slate-800 dark:text-white font-medium">{selectedOption.label}</span>
                        </div>
                    ) : (
                        <span className="text-slate-400 dark:text-slate-500">{placeholder}</span>
                    )}
                </div>
                <ChevronRightIcon className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`} />
            </div>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute z-50 mt-2 w-full bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl shadow-xl max-h-60 overflow-y-auto animate-fade-in custom-scrollbar">
                    <div className="p-1">
                        {options.map((option) => (
                            <div
                                key={option.value}
                                onClick={() => handleSelect(option.value)}
                                className={`
                                    flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-colors
                                    ${option.value === value
                                        ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                                        : 'hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200'
                                    }
                                `}
                            >
                                {option.color && (
                                    <span className={`w-2 h-2 rounded-full ${option.color}`}></span>
                                )}
                                {option.icon && <span>{option.icon}</span>}
                                <span className="font-medium text-sm">{option.label}</span>
                                {option.value === value && (
                                    <span className="ml-auto text-primary-600 text-xs font-bold">✓</span>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CustomSelect;
