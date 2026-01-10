
// FIX: Create all SVG icon components
import React from 'react';

export const OnTruFullLogo: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 150 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Camera Lens Icon */}
        <circle cx="20" cy="20" r="16" fill="url(#logoGradient)" />
        <circle cx="20" cy="20" r="10" fill="none" stroke="white" strokeWidth="2" />
        <circle cx="20" cy="20" r="5" fill="white" />
        <circle cx="20" cy="20" r="2" fill="url(#logoGradient)" />
        {/* Text */}
        <text x="44" y="27" fontFamily="Inter, system-ui, sans-serif" fontSize="22" fontWeight="800" fill="currentColor">
            OnTru
        </text>
        <defs>
            <linearGradient id="logoGradient" x1="4" y1="4" x2="36" y2="36">
                <stop stopColor="#10B981" />
                <stop offset="1" stopColor="#059669" />
            </linearGradient>
        </defs>
    </svg>
);

export const OnTruLogo: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="20" cy="20" r="18" fill="url(#logoGradientSmall)" />
        <circle cx="20" cy="20" r="11" fill="none" stroke="white" strokeWidth="2" />
        <circle cx="20" cy="20" r="6" fill="white" />
        <circle cx="20" cy="20" r="2.5" fill="url(#logoGradientSmall)" />
        <defs>
            <linearGradient id="logoGradientSmall" x1="2" y1="2" x2="38" y2="38">
                <stop stopColor="#10B981" />
                <stop offset="1" stopColor="#059669" />
            </linearGradient>
        </defs>
    </svg>
);

const IconWrapper: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <g strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">{children}</g>
    </svg>
);

export const ProjectIcon: React.FC<{ className?: string }> = ({ className }) => <IconWrapper className={className}><path d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75"></path></IconWrapper>;
export const UsersIcon: React.FC<{ className?: string }> = ({ className }) => <IconWrapper className={className}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2m8-10a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm8 10a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"></path></IconWrapper>;
export const BoxIcon: React.FC<{ className?: string }> = ({ className }) => <IconWrapper className={className}><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16zM3.27 6.96 12 12.01l8.73-5.05M12 22.08V12"></path></IconWrapper>;
export const PlusIcon: React.FC<{ className?: string }> = ({ className }) => <IconWrapper className={className}><path d="M12 5v14M5 12h14"></path></IconWrapper>;
export const CurrencyRupeeIcon: React.FC<{ className?: string }> = ({ className }) => <IconWrapper className={className}><path d="M15 8.04H9.5a3.5 3.5 0 1 0 0 7h8m-8 0H9.5A3.5 3.5 0 1 1 6 11.54M8 4h8m-8 16h8"></path></IconWrapper>;
export const TrophyIcon: React.FC<{ className?: string }> = ({ className }) => <IconWrapper className={className}><path d="M12 8V4m0 4c4 0 6 2 6 6v2H6v-2c0-4 2-6 6-6zM6 18h12"></path></IconWrapper>;
export const DocumentTextIcon: React.FC<{ className?: string }> = ({ className }) => <IconWrapper className={className}><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.586a1 1 0 0 1 .707.293l5.414 5.414a1 1 0 0 1 .293.707V19a2 2 0 0 1-2 2z"></path></IconWrapper>;
export const DownloadIcon: React.FC<{ className?: string }> = ({ className }) => <IconWrapper className={className}><path d="M4 16v1a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3v-1m-4-4-4 4m0 0-4-4m4 4V4"></path></IconWrapper>;
export const KeyIcon: React.FC<{ className?: string }> = ({ className }) => <IconWrapper className={className}><path d="m21 2-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0L19 4"></path></IconWrapper>;
export const SignatureIcon: React.FC<{ className?: string }> = ({ className }) => <IconWrapper className={className}><path d="M16 4.99a2 2 0 0 1 2 2v2M16 19.01a2 2 0 0 1-2-2v-2m-8-4a2 2 0 0 1-2-2v-2M8 4.99a2 2 0 0 1-2 2v2"></path><path d="M12 12a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"></path></IconWrapper>;
export const AlertTriangleIcon: React.FC<{ className?: string }> = ({ className }) => <IconWrapper className={className}><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4m0 4h.01"></path></IconWrapper>;
export const CloseIcon: React.FC<{ className?: string }> = ({ className }) => <IconWrapper className={className}><path d="M6 18 18 6M6 6l12 12"></path></IconWrapper>;
export const CameraIcon: React.FC<{ className?: string }> = ({ className }) => <IconWrapper className={className}><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></IconWrapper>;
export const ChatbotIcon: React.FC<{ className?: string }> = ({ className }) => <IconWrapper className={className}><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></IconWrapper>;
export const SendIcon: React.FC<{ className?: string }> = ({ className }) => <IconWrapper className={className}><path d="m22 2-7 20-4-9-9-4Z"></path><path d="m22 2-11 11"></path></IconWrapper>;
export const SparklesIcon: React.FC<{ className?: string }> = ({ className }) => <IconWrapper className={className}><path d="M12 3v2M16 4l-1 1M18 9h2M16 14l1 1M12 15v2M8 14l-1 1M6 9H4M8 4l1 1"></path></IconWrapper>;
export const WhatsAppIcon: React.FC<{ className?: string }> = ({ className }) => <IconWrapper className={className}><path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38c1.45.79 3.08 1.21 4.79 1.21 5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2zM9.01 7.64c.24-.12.55-.18.78-.18.23 0 .46.06.67.18.21.12.39.29.53.49.14.2.21.43.21.67 0 .24-.07.47-.21.67-.14.2-.32.37-.53.49-.21.12-.44.18-.67.18s-.46-.06-.67-.18c-.21-.12-.39-.29-.53-.49-.14-.2-.21-.43-.21-.67 0-.24.07-.47.21-.67.14-.2.32-.37.53-.49z"></path></IconWrapper>;
export const ClipboardCopyIcon: React.FC<{ className?: string }> = ({ className }) => <IconWrapper className={className}><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></IconWrapper>;
export const VisitsIcon: React.FC<{ className?: string }> = ({ className }) => <IconWrapper className={className}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></IconWrapper>;
export const CheckCircleIcon: React.FC<{ className?: string }> = ({ className }) => <IconWrapper className={className}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></IconWrapper>;
export const DashboardIcon: React.FC<{ className?: string }> = ({ className }) => <IconWrapper className={className}><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></IconWrapper>;
export const InventoryIcon: React.FC<{ className?: string }> = ({ className }) => <IconWrapper className={className}><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></IconWrapper>;
export const GodownIcon: React.FC<{ className?: string }> = ({ className }) => <IconWrapper className={className}><path d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z"></path></IconWrapper>;
export const ProductIcon: React.FC<{ className?: string }> = ({ className }) => <IconWrapper className={className}><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4zM3 6h18m-9 6a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"></path></IconWrapper>;
export const CustomersIcon: React.FC<{ className?: string }> = ({ className }) => <IconWrapper className={className}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2m8-10a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm8 10a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"></path></IconWrapper>;
export const TechniciansIcon: React.FC<{ className?: string }> = ({ className }) => <IconWrapper className={className}><path d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 0 0 4.486-6.336l-3.276 3.277a3.004 3.004 0 0 1-2.25-2.25l3.276-3.276a4.5 4.5 0 0 0-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437 1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008Z"></path></IconWrapper>;
export const PaymentsIcon: React.FC<{ className?: string }> = ({ className }) => <IconWrapper className={className}><path d="M15 8.04H9.5a3.5 3.5 0 1 0 0 7h8m-8 0H9.5A3.5 3.5 0 1 1 6 11.54M8 4h8m-8 16h8"></path></IconWrapper>;
export const SiteHealthIcon: React.FC<{ className?: string }> = ({ className }) => <IconWrapper className={className}><path d="M22 12h-4l-3 9L9 3l-3 9H2"></path></IconWrapper>;
export const AMCIcon: React.FC<{ className?: string }> = ({ className }) => <IconWrapper className={className}><path d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"></path></IconWrapper>;
export const WarrantyIcon: React.FC<{ className?: string }> = ({ className }) => <IconWrapper className={className}><path d="M9 12.75L11.25 15L15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"></path></IconWrapper>;
export const SettingsIcon: React.FC<{ className?: string }> = ({ className }) => <IconWrapper className={className}><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></IconWrapper>;
export const BillingIcon: React.FC<{ className?: string }> = ({ className }) => <IconWrapper className={className}><path d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"></path></IconWrapper>;
export const PayrollIcon: React.FC<{ className?: string }> = ({ className }) => <IconWrapper className={className}><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></IconWrapper>;
export const AttendanceIcon: React.FC<{ className?: string }> = ({ className }) => <IconWrapper className={className}><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></IconWrapper>;
export const ChecklistIcon: React.FC<{ className?: string }> = ({ className }) => <IconWrapper className={className}><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2m-4-3v6m-3-3h6"></path></IconWrapper>;
export const MyPaymentsIcon: React.FC<{ className?: string }> = ({ className }) => <IconWrapper className={className}><path d="M15 8.04H9.5a3.5 3.5 0 1 0 0 7h8m-8 0H9.5A3.5 3.5 0 1 1 6 11.54M8 4h8m-8 16h8"></path></IconWrapper>;
export const MyVisitsIcon: React.FC<{ className?: string }> = ({ className }) => <IconWrapper className={className}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></IconWrapper>;
export const LogoutIcon: React.FC<{ className?: string }> = ({ className }) => <IconWrapper className={className}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4m7 14 4-4-4-4m4 4H9"></path></IconWrapper>;
export const ReportIcon: React.FC<{ className?: string }> = ({ className }) => <IconWrapper className={className}><path d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.586a1 1 0 0 1 .707.293l5.414 5.414a1 1 0 0 1 .293.707V19a2 2 0 0 1-2 2z"></path></IconWrapper>;
export const CrownIcon: React.FC<{ className?: string }> = ({ className }) => <IconWrapper className={className}><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></IconWrapper>;
export const CheckIcon: React.FC<{ className?: string }> = ({ className }) => <IconWrapper className={className}><path d="M5 13l4 4L19 7"></path></IconWrapper>;
export const CrossIcon: React.FC<{ className?: string }> = ({ className }) => <IconWrapper className={className}><path d="M6 18L18 6M6 6l12 12"></path></IconWrapper>;
export const EyeIcon: React.FC<{ className?: string }> = ({ className }) => <IconWrapper className={className}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></IconWrapper>;
export const EyeSlashIcon: React.FC<{ className?: string }> = ({ className }) => <IconWrapper className={className}><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></IconWrapper>;
export const EnvelopeIcon: React.FC<{ className?: string }> = ({ className }) => <IconWrapper className={className}><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></IconWrapper>;
export const PhoneIcon: React.FC<{ className?: string }> = ({ className }) => <IconWrapper className={className}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></IconWrapper>;
export const UserIcon: React.FC<{ className?: string }> = ({ className }) => <IconWrapper className={className}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></IconWrapper>;
export const ChevronRightIcon: React.FC<{ className?: string }> = ({ className }) => <IconWrapper className={className}><polyline points="9 18 15 12 9 6"></polyline></IconWrapper>;
export const SunIcon: React.FC<{ className?: string }> = ({ className }) => <IconWrapper className={className}><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></IconWrapper>;
export const MoonIcon: React.FC<{ className?: string }> = ({ className }) => <IconWrapper className={className}><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></IconWrapper>;
export const MenuIcon: React.FC<{ className?: string }> = ({ className }) => <IconWrapper className={className}><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></IconWrapper>;
export const TrendingUpIcon: React.FC<{ className?: string }> = ({ className }) => <IconWrapper className={className}><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></IconWrapper>;
export const SearchIcon: React.FC<{ className?: string }> = ({ className }) => <IconWrapper className={className}><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></IconWrapper>;
export const FilterIcon: React.FC<{ className?: string }> = ({ className }) => <IconWrapper className={className}><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></IconWrapper>;
export const TrashIcon: React.FC<{ className?: string }> = ({ className }) => <IconWrapper className={className}><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></IconWrapper>;
export const RefreshIcon: React.FC<{ className?: string }> = ({ className }) => <IconWrapper className={className}><path d="M23 4v6h-6"></path><path d="M1 20v-6h6"></path><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></IconWrapper>;
export const LocationMarkerIcon: React.FC<{ className?: string }> = ({ className }) => <IconWrapper className={className}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></IconWrapper>;
export const ClipboardDocumentCheckIcon: React.FC<{ className?: string }> = ({ className }) => <IconWrapper className={className}><path d="M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.086v12.75c0 1.07.814 1.993 1.901 2.162 2.613.403 5.372.403 7.986 0 1.087-.169 1.901-1.093 1.901-2.162V6.086c0-1.113-.845-2.075-2.001-2.166-.375-.03-.761-.057-1.147-.08M12 12.75h4.25m-4.25 3.5h4.25"></path></IconWrapper>;
export const ClockIcon: React.FC<{ className?: string }> = ({ className }) => <IconWrapper className={className}><path d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"></path></IconWrapper>;
export const CalendarIcon: React.FC<{ className?: string }> = ({ className }) => <IconWrapper className={className}><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></IconWrapper>;
export const SupplierIcon: React.FC<{ className?: string }> = ({ className }) => <IconWrapper className={className}><path d="M10 17h4V5H2v12h3m5 0h4"></path><path d="M22 17h-2.12a4 4 0 0 0-7.76 0H10v-6h4l2-4h6v6a4 4 0 0 0 0 8z"></path><circle cx="17" cy="17" r="2"></circle><circle cx="7" cy="17" r="2"></circle></IconWrapper>;
export const ClipboardDocumentListIcon: React.FC<{ className?: string }> = ({ className }) => <IconWrapper className={className}><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2m-6 9h6m-6 4h6m-2-8h.01"></path></IconWrapper>;
export const MapPinIcon: React.FC<{ className?: string }> = ({ className }) => <IconWrapper className={className}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></IconWrapper>;
