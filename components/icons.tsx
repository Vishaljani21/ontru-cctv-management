
// FIX: Create all SVG icon components
import React from 'react';

export const OnTruFullLogo: React.FC = () => (
    <svg width="120" height="40" viewBox="0 0 120 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <text x="10" y="28" fontFamily="Arial, sans-serif" fontSize="24" fontWeight="bold" fill="#0EA5E9">
            OnTru
        </text>
    </svg>
);

export const OnTruLogo: React.FC = () => (
     <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="40" height="40" rx="8" fill="#0EA5E9"/>
        <text x="20" y="28" fontFamily="Arial, sans-serif" fontSize="20" fontWeight="bold" fill="white" textAnchor="middle">
            O
        </text>
    </svg>
);

const IconWrapper: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <g strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">{children}</g>
    </svg>
);

export const ProjectIcon: React.FC<{ className?: string }> = ({ className }) => <IconWrapper className={className}><path d="M4 7v10c0 1.105.895 2 2 2h12c1.105 0 2-.895 2-2V7M9 21v-2a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M9 3v2a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2V3"></path></IconWrapper>;
export const UsersIcon: React.FC<{ className?: string }> = ({ className }) => <IconWrapper className={className}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2m8-10a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm8 10a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"></path></IconWrapper>;
export const BoxIcon: React.FC<{ className?: string }> = ({ className }) => <IconWrapper className={className}><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16zM3.27 6.96 12 12.01l8.73-5.05M12 22.08V12"></path></IconWrapper>;
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
export const GodownIcon: React.FC<{ className?: string }> = ({ className }) => <IconWrapper className={className}><path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z"></path><line x1="16" y1="8" x2="2" y2="22"></line><line x1="17.5" y1="15.5" x2="9" y2="7"></line></IconWrapper>;
export const ProductIcon: React.FC<{ className?: string }> = ({ className }) => <IconWrapper className={className}><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4zM3 6h18m-9 6a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"></path></IconWrapper>;
export const CustomersIcon: React.FC<{ className?: string }> = ({ className }) => <IconWrapper className={className}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2m8-10a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm8 10a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"></path></IconWrapper>;
export const TechniciansIcon: React.FC<{ className?: string }> = ({ className }) => <IconWrapper className={className}><path d="M16 17l-4-4-4 4m8-6l-4-4-4 4m-2 7h12a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2z"></path></IconWrapper>;
export const PaymentsIcon: React.FC<{ className?: string }> = ({ className }) => <IconWrapper className={className}><path d="M15 8.04H9.5a3.5 3.5 0 1 0 0 7h8m-8 0H9.5A3.5 3.5 0 1 1 6 11.54M8 4h8m-8 16h8"></path></IconWrapper>;
export const SiteHealthIcon: React.FC<{ className?: string }> = ({ className }) => <IconWrapper className={className}><path d="M22 12h-4l-3 9L9 3l-3 9H2"></path></IconWrapper>;
export const AMCIcon: React.FC<{ className?: string }> = ({ className }) => <IconWrapper className={className}><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7z"></path></IconWrapper>;
export const WarrantyIcon: React.FC<{ className?: string }> = ({ className }) => <IconWrapper className={className}><path d="M9 12.75L11.25 15L15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"></path></IconWrapper>;
export const SettingsIcon: React.FC<{ className?: string }> = ({ className }) => <IconWrapper className={className}><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></IconWrapper>;
export const BillingIcon: React.FC<{ className?: string }> = ({ className }) => <IconWrapper className={className}><path d="M17 9V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h2m8-6h8m0 0-4-4m4 4-4 4m-8-12v4"></path></IconWrapper>;
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
