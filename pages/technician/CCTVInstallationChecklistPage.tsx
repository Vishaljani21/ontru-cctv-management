import React from 'react';

const ChecklistSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="bg-white border border-slate-200 rounded-lg shadow-sm">
        <h3 className="p-4 text-lg font-semibold text-slate-800 border-b border-slate-200">
            {title}
        </h3>
        <ul className="p-4 space-y-3">
            {children}
        </ul>
    </div>
);

const ChecklistItem: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <li className="flex items-start">
        <span className="flex-shrink-0 mt-1 mr-3 w-4 h-4 border-2 border-slate-400 rounded-sm"></span>
        <span className="text-slate-700">{children}</span>
    </li>
);


const CCTVInstallationChecklistPage: React.FC = () => {
    return (
        <div className="space-y-8">
            <h2 className="text-3xl font-bold text-slate-800">CCTV Installation Final Checklist</h2>
            
            <ChecklistSection title="🔧 Hardware Installation">
                <ChecklistItem>Camera mount properly with correct angle</ChecklistItem>
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
    );
};

export default CCTVInstallationChecklistPage;