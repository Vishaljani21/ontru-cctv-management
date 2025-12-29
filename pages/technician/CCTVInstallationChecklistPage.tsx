import React from 'react';
import { CheckCircleIcon } from '../../components/icons';

const ChecklistSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden animate-fade-in-up">
        <h3 className="px-6 py-4 text-lg font-bold text-slate-800 dark:text-white border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
            {title}
        </h3>
        <ul className="p-6 space-y-4">
            {children}
        </ul>
    </div>
);

const ChecklistItem: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <li className="flex items-start group">
        <div className="flex-shrink-0 mt-0.5 mr-4 w-5 h-5 border-2 border-slate-300 dark:border-slate-600 rounded-md flex items-center justify-center group-hover:border-primary-500 transition-colors">
            {/* Visual indicator only, real checklist uses interactive state, this is reference */}
            <div className="w-2.5 h-2.5 rounded-sm bg-transparent group-hover:bg-primary-500/20 transition-colors"></div>
        </div>
        <span className="text-slate-600 dark:text-slate-300 font-medium">{children}</span>
    </li>
);


const CCTVInstallationChecklistPage: React.FC = () => {
    return (
        <div className="space-y-8 animate-fade-in-up pb-10">
            <div>
                <h2 className="text-3xl font-bold text-slate-800 dark:text-white tracking-tight">Installation Checklist</h2>
                <p className="text-slate-500 dark:text-slate-400 mt-1">Ensure all steps are completed before project sign-off.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ChecklistSection title="🔧 Hardware Installation">
                    <ChecklistItem>Camera mounted properly with correct angle</ChecklistItem>
                    <ChecklistItem>NVR installed and powered</ChecklistItem>
                    <ChecklistItem>Hard disk fitted and detected in NVR</ChecklistItem>
                    <ChecklistItem>Cable connections (BNC, LAN, Power) secured</ChecklistItem>
                    <ChecklistItem>Power supply stable and tested</ChecklistItem>
                </ChecklistSection>

                <ChecklistSection title="📶 Connectivity & Configuration">
                    <ChecklistItem>All cameras showing live feed on NVR</ChecklistItem>
                    <ChecklistItem>NVR connected to internet (if remote access needed)</ChecklistItem>
                    <ChecklistItem>Mobile app configured for client (if applicable)</ChecklistItem>
                    <ChecklistItem>Date/time set correctly on NVR</ChecklistItem>
                    <ChecklistItem>Recording settings verified (motion/24x7)</ChecklistItem>
                </ChecklistSection>

                <ChecklistSection title="🔐 Security & Access">
                    <ChecklistItem>Default NVR password changed</ChecklistItem>
                    <ChecklistItem>Admin and user accounts created</ChecklistItem>
                    <ChecklistItem>Backup settings configured (USB/cloud)</ChecklistItem>
                </ChecklistSection>

                <ChecklistSection title="📄 Documentation">
                    <ChecklistItem>Serial numbers of installed items scanned</ChecklistItem>
                    <ChecklistItem>Job card signed by technician</ChecklistItem>
                    <ChecklistItem>Customer chalan generated and approved</ChecklistItem>
                    <ChecklistItem>Photos of installed setup uploaded (optional)</ChecklistItem>
                </ChecklistSection>

                <ChecklistSection title="🗣️ Customer Briefing">
                    <ChecklistItem>Client shown live view and playback</ChecklistItem>
                    <ChecklistItem>Mobile app login shared</ChecklistItem>
                    <ChecklistItem>Warranty and support explained</ChecklistItem>
                </ChecklistSection>
            </div>
        </div>
    );
};

export default CCTVInstallationChecklistPage;