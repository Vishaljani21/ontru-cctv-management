import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { Visit, Customer, User, TimelineStep } from '../types';
import {
    CalendarIcon, MapPinIcon, UserGroupIcon, CubeIcon,
    ArrowLeftIcon, CheckBadgeIcon, ClockIcon,
    DocumentTextIcon, PhotoIcon, PaperClipIcon,
    PencilSquareIcon, CheckCircleIcon
} from '@heroicons/react/24/outline';

const ProjectDetailsPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [project, setProject] = useState<Visit | null>(null);
    const [customer, setCustomer] = useState<Customer | null>(null);
    const [technicians, setTechnicians] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) fetchProjectDetails();
    }, [id]);

    const fetchProjectDetails = async () => {
        try {
            const data = await api.getVisitById(Number(id));
            setProject(data);

            if (data.customerId) {
                const cust = await api.getCustomerById(data.customerId);
                setCustomer(cust);
            }

            const allTechs = await api.getTechnicians().catch(() => []);
            if (data.technicianIds && data.technicianIds.length > 0) {
                const projectTechs = allTechs.filter(t => data.technicianIds.includes(t.id));
                setTechnicians(projectTechs);
            }
        } catch (error) {
            console.error("Failed to load project", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-black">
            <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    if (!project) return (
        <div className="p-10 text-center">
            <h3 className="text-xl font-bold text-slate-800 dark:text-white">Project Not Found</h3>
            <button onClick={() => navigate('/projects')} className="mt-4 text-primary-600 hover:underline">Return to Projects</button>
        </div>
    );

    // Timeline Configuration
    const defaultTimeline: TimelineStep[] = [
        { label: 'Enquiry Received', date: project.scheduledAt, status: 'completed' },
        { label: 'Site Survey', date: '', status: 'current' },
        { label: 'Quotation', date: '', status: 'pending' },
        { label: 'Material', date: '', status: 'pending' },
        { label: 'Installation', date: '', status: 'pending' },
        { label: 'Testing', date: '', status: 'pending' },
        { label: 'Handover', date: '', status: 'pending' },
        { label: 'Payment', date: '', status: 'pending' }
    ];

    const timeline = project.timelineStatus && project.timelineStatus.length > 0
        ? project.timelineStatus
        : defaultTimeline;

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-black pb-20 animate-fade-in">
            {/* Top Navigation Bar */}
            <div className="sticky top-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-6 py-4">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/projects')}
                            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors"
                        >
                            <ArrowLeftIcon className="w-5 h-5" />
                        </button>
                        <div>
                            <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                {project.projectName || 'Project Details'}
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700">
                                    {project.projectCode || 'N/A'}
                                </span>
                            </h1>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                {customer?.companyName} • {project.siteType || 'Site'}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm">
                            <PencilSquareIcon className="w-4 h-4" /> Edit Details
                        </button>
                        <div className="h-8 w-[1px] bg-slate-200 dark:bg-slate-700 mx-1 hidden sm:block"></div>
                        <div className="flex flex-col items-end">
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-slate-500 uppercase">Progress</span>
                                <span className="text-sm font-bold text-slate-900 dark:text-white">65%</span>
                            </div>
                            <div className="w-32 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full mt-1 overflow-hidden">
                                <div className="h-full bg-primary-500 rounded-full" style={{ width: '65%' }}></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto p-6 space-y-6">

                {/* 1. Timeline Section (Prominent) */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <ClockIcon className="w-5 h-5 text-primary-500" /> Timeline
                        </h3>
                        <span className="text-xs font-medium text-slate-500">
                            Est. Completion: <span className="text-slate-900 dark:text-white font-bold">14 Jan 2025</span>
                        </span>
                    </div>

                    {/* Responsive Steps */}
                    <div className="relative">
                        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-100 dark:bg-slate-800 -translate-y-1/2 hidden md:block" />
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 md:gap-2 overflow-x-auto pb-4 md:pb-0 scrollbar-hide">
                            {timeline.map((step, idx) => (
                                <div key={idx} className="relative z-10 flex md:flex-col items-center gap-4 md:gap-3 min-w-[120px]">
                                    {/* Icon Circle */}
                                    <div className={`w-8 h-8 flex-shrink-0 rounded-full flex items-center justify-center border-[3px] transition-all bg-white dark:bg-slate-900 ${step.status === 'completed' ? 'border-green-500 text-green-500' :
                                            step.status === 'current' ? 'border-primary-500 text-primary-500 ring-2 ring-primary-100 dark:ring-primary-900/30' :
                                                'border-slate-200 dark:border-slate-700 text-slate-300'
                                        }`}>
                                        {step.status === 'completed' ? <CheckCircleIcon className="w-5 h-5" /> :
                                            <div className={`w-2 h-2 rounded-full ${step.status === 'current' ? 'bg-primary-500' : 'bg-slate-300 dark:bg-slate-700'}`} />}
                                    </div>

                                    {/* Text Info */}
                                    <div className="text-left md:text-center">
                                        <p className={`text-xs font-bold leading-tight ${step.status === 'current' ? 'text-primary-600 dark:text-primary-400' :
                                                step.status === 'completed' ? 'text-green-600 dark:text-green-400' :
                                                    'text-slate-500 dark:text-slate-500'
                                            }`}>{step.label}</p>
                                        <p className="text-[10px] font-medium text-slate-400 mt-0.5">
                                            {step.date ? new Date(step.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : 'Pending'}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* 2. Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Left Col: Customer & Site Info */}
                    <div className="space-y-6">
                        <div className="bg-white dark:bg-slate-900 rounded-2xl p-0 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                            <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex items-center gap-2">
                                <div className="p-1.5 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg text-indigo-600 dark:text-indigo-400">
                                    <UserGroupIcon className="w-4 h-4" />
                                </div>
                                <h3 className="font-bold text-sm text-slate-900 dark:text-white">Customer Profile</h3>
                            </div>
                            <div className="p-5 space-y-4">
                                <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 font-bold text-lg">
                                        {customer?.companyName?.charAt(0) || 'C'}
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-900 dark:text-white">{customer?.companyName}</p>
                                        <p className="text-sm text-slate-500">{customer?.contactPerson}</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4 pt-2">
                                    <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase">Mobile</p>
                                        <p className="font-semibold text-sm text-slate-800 dark:text-slate-200 mt-0.5">{customer?.mobile}</p>
                                    </div>
                                    <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase">City</p>
                                        <p className="font-semibold text-sm text-slate-800 dark:text-slate-200 mt-0.5">{customer?.city}</p>
                                    </div>
                                </div>
                                <div className="pt-2">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Site Address</p>
                                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                                        {project.address}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-slate-900 rounded-2xl p-0 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                            <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex items-center gap-2">
                                <div className="p-1.5 bg-purple-100 dark:bg-purple-900/30 rounded-lg text-purple-600 dark:text-purple-400">
                                    <UserGroupIcon className="w-4 h-4" />
                                </div>
                                <h3 className="font-bold text-sm text-slate-900 dark:text-white">Technicians</h3>
                            </div>
                            <div className="p-2">
                                {technicians.map(tech => (
                                    <div key={tech.id} className="flex items-center justify-between p-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-lg transition-colors group cursor-pointer">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold text-xs ring-2 ring-white dark:ring-slate-900 group-hover:ring-purple-200 transition-all">
                                                {tech.name.substring(0, 2).toUpperCase()}
                                            </div>
                                            <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{tech.name}</span>
                                        </div>
                                        <span className="text-[10px] font-bold px-2 py-0.5 bg-green-100 text-green-700 rounded-full">Active</span>
                                    </div>
                                ))}
                                {technicians.length === 0 && (
                                    <div className="p-4 text-center text-slate-400 text-sm italic">
                                        No technicians assigned
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Col: Details Tabs/Tables */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* Attachments & Notes */}
                        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                                        <DocumentTextIcon className="w-4 h-4 text-slate-500" /> Notes
                                    </h4>
                                    <textarea
                                        className="w-full h-32 text-sm p-3 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500/50 outline-none resize-none bg-slate-50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300"
                                        placeholder="Add project notes..."
                                        defaultValue={project.notes || ''}
                                    />
                                </div>
                                <div>
                                    <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                                        <PaperClipIcon className="w-4 h-4 text-slate-500" /> Attachments
                                    </h4>
                                    <div className="grid grid-cols-1 gap-2">
                                        <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-primary-200 transition-colors cursor-pointer group">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-white dark:bg-slate-700 rounded-lg text-slate-500 shadow-sm group-hover:text-primary-500 transition-colors">
                                                    <PhotoIcon className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold text-slate-800 dark:text-white">Site_Survey_Photos.zip</p>
                                                    <p className="text-xs text-slate-500">12 MB • Added today</p>
                                                </div>
                                            </div>
                                            <span className="text-xs font-bold text-primary-600 bg-primary-50 px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">Download</span>
                                        </div>
                                        <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-red-200 transition-colors cursor-pointer group">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-white dark:bg-slate-700 rounded-lg text-slate-500 shadow-sm group-hover:text-red-500 transition-colors">
                                                    <DocumentTextIcon className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold text-slate-800 dark:text-white">Final_Quotation_v2.pdf</p>
                                                    <p className="text-xs text-slate-500">2.4 MB • 2 days ago</p>
                                                </div>
                                            </div>
                                            <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">View PDF</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Inventory / Materials Table */}
                        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/30">
                                <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                                    <CubeIcon className="w-4 h-4 text-teal-500" /> Material & Cable Usage
                                </h3>
                                <button className="text-xs font-bold text-primary-600 hover:text-primary-700 bg-primary-50 px-3 py-1.5 rounded-lg border border-primary-100">
                                    Manage Items
                                </button>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-slate-50 dark:bg-slate-800/50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Item</th>
                                            <th className="px-6 py-3 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">Planned</th>
                                            <th className="px-6 py-3 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">Used</th>
                                            <th className="px-6 py-3 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                        {project.materialUsage?.map((item, idx) => (
                                            <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                                <td className="px-6 py-4">
                                                    <p className="text-sm font-semibold text-slate-800 dark:text-white">{item.productName}</p>
                                                    <p className="text-xs text-slate-500">{item.category}</p>
                                                </td>
                                                <td className="px-6 py-4 text-center text-sm font-medium text-slate-600 dark:text-slate-400">
                                                    {item.qtyPlanned}
                                                </td>
                                                <td className="px-6 py-4 text-center text-sm font-bold text-slate-800 dark:text-white">
                                                    {item.qtyUsed}
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-bold ${item.balance === 0 ? 'bg-green-50 text-green-700 border border-green-100' :
                                                            item.balance < 0 ? 'bg-red-50 text-red-700 border border-red-100' :
                                                                'bg-amber-50 text-amber-700 border border-amber-100'
                                                        }`}>
                                                        {item.balance === 0 ? 'Balanced' : item.balance > 0 ? `${item.balance} Left` : `${Math.abs(item.balance)} Over`}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                        {(!project.materialUsage || project.materialUsage.length === 0) && (
                                            <tr>
                                                <td colSpan={4} className="px-6 py-8 text-center text-slate-400 text-sm">
                                                    No materials recorded yet.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectDetailsPage;
