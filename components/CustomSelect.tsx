import React, { useState, useRef, useEffect } from 'react';

interface Option {
    value: string;
    label: string;
    icon?: React.ReactNode;
}

interface CustomSelectProps {
    options: Option[];
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
    label?: string;
}

const CustomSelect: React.FC<CustomSelectProps> = ({ options, value, onChange, placeholder = 'Select...', className = '', label }) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const selectedOption = options.find(opt => opt.value === value);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (optionValue: string) => {
        onChange(optionValue);
        setIsOpen(false);
    };

    return (
        <div className={`relative ${className}`} ref={containerRef}>
            {label && (
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                    {label}
                </label>
            )}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`
                    relative w-full text-left bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 
                    rounded-xl shadow-sm pl-4 pr-10 py-2.5 cursor-default focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500
                    transition-all duration-200 hover:border-slate-300 dark:hover:border-slate-600
                    ${isOpen ? 'ring-2 ring-primary-500/50 border-primary-500' : ''}
                `}
                aria-haspopup="listbox"
                aria-expanded={isOpen}
            >
                <span className={`block truncate ${!selectedOption ? 'text-slate-400' : 'text-slate-700 dark:text-slate-200'}`}>
                    {selectedOption ? selectedOption.label : placeholder}
                </span>
                <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg
                        className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </span>
            </button>

            {isOpen && (
                <div className="absolute z-20 mt-2 w-full bg-white dark:bg-slate-900 shadow-xl max-h-60 rounded-xl py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm animate-fade-in-up custom-scrollbar border border-slate-100 dark:border-slate-800">
                    <ul tabIndex={-1} role="listbox">
                        {options.map((option) => (
                            <li
                                key={option.value}
                                className={`
                                    cursor-pointer select-none relative py-2.5 pl-4 pr-9 transition-colors duration-150
                                    ${option.value === value
                                        ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20 font-medium'
                                        : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
                                    }
                                `}
                                id={`listbox-option-${option.value}`}
                                role="option"
                                aria-selected={option.value === value}
                                onClick={() => handleSelect(option.value)}
                            >
                                <div className="flex items-center">
                                    {option.icon}
                                    <span className={`block truncate ${option.icon ? 'ml-2' : ''}`}>
                                        {option.label}
                                    </span>
                                </div>

                                {option.value === value && (
                                    <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-primary-600 dark:text-primary-400">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </span>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default CustomSelect;
