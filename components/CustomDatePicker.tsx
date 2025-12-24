import React, { forwardRef } from 'react';
import ReactDOM from 'react-dom';
import DatePicker from 'react-datepicker';
// CSS moved to index.tsx for global override control
// We don't import the CSS here if we want to customize it globally in index.css, 
// but importing it creates the base styles which we then override.

interface CustomDatePickerProps {
    selected: Date | null;
    onChange: (date: Date | null) => void;
    placeholder?: string;
    label?: string;
    className?: string;
    minDate?: Date;
    maxDate?: Date;
    dateFormat?: string;
}

// Custom Input Component to match CustomSelect's button style
const CustomInput = forwardRef<HTMLButtonElement, any>(({ value, onClick, placeholder, className }, ref) => (
    <button
        type="button"
        onClick={onClick}
        ref={ref}
        className={`
            relative w-full text-left bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 
            rounded-xl shadow-sm pl-4 pr-10 py-3 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500
            transition-all duration-200 hover:border-slate-300 dark:hover:border-slate-600
            text-slate-700 dark:text-slate-200 min-h-[52px] flex items-center
            ${className}
        `}
    >
        <span className={`block truncate flex-1 ${!value ? 'text-slate-400' : ''}`}>
            {value || placeholder}
        </span>
        <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
        </span>
    </button>
));

const CustomDatePicker: React.FC<CustomDatePickerProps> = ({ selected, onChange, placeholder = "Select Date", label, className = "", minDate, maxDate, dateFormat = "dd/MM/yyyy" }) => {
    return (
        <div className={`relative ${className}`}>
            {label && (
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                    {label}
                </label>
            )}
            <DatePicker
                selected={selected}
                onChange={onChange}
                customInput={<CustomInput placeholder={placeholder} />}
                dateFormat={dateFormat}
                minDate={minDate}
                maxDate={maxDate}
                wrapperClassName="w-full"
                calendarClassName="font-sans border-0 shadow-xl rounded-xl overflow-hidden bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200"
                popperClassName="z-[99999]"
                popperContainer={({ children }) => ReactDOM.createPortal(children, document.body)}
            />
        </div>
    );
};

export default CustomDatePicker;
