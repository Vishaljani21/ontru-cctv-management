import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { Visit, Customer, User, TimelineStep } from '../types';
import {
    CalendarIcon, MapPinIcon, UserGroupIcon, CubeIcon,
    ArrowLeftIcon, CheckBadgeIcon, ClockIcon,
    DocumentTextIcon, PhotoIcon, PaperClipIcon,
    PencilSquareIcon, CheckCircleIcon, PhoneIcon, CheckIcon
} from '@heroicons/react/24/outline';

const ProjectDetailsPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [project, setProject] = useState<Visit | null>(null);
    const [customer, setCustomer] = useState<Customer | null>(null);
    const [technicians, setTechnicians] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [updatingStage, setUpdatingStage] = useState(false);

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

    const [activeTab, setActiveTab] = useState<'overview' | 'materials' | 'files'>('overview');

    const advanceStage = async (index: number) => {
        if (!project || updatingStage) return;

        // Only allow advancing the current stage
        const currentIdx = timeline.findIndex(s => s.status === 'current');
        if (currentIdx !== -1 && index !== currentIdx) return;

        setUpdatingStage(true);
        try {
            // Create deep copy of timeline to modify
            const newTimeline = [...timeline];

            // Mark current as completed
            if (newTimeline[index]) {
                newTimeline[index] = { ...newTimeline[index], status: 'completed', date: new Date().toISOString() };
            }

            // Mark next as current (if exists)
            if (newTimeline[index + 1]) {
                newTimeline[index + 1] = { ...newTimeline[index + 1], status: 'current' };
            }

            // Call API
            await api.updateProjectTimeline(project.id, newTimeline);
            await fetchProjectDetails(); // Refresh
        } catch (error) {
            console.error("Failed to advance stage", error);
            alert("Failed to update stage. Please try again.");
        } finally {
            setUpdatingStage(false);
        }
    };

    // Calculate actual progress from timeline
    const completedSteps = timeline.filter(s => s.status === 'completed').length;
    const progressPercentage = timeline.length > 0 ? Math.round((completedSteps / timeline.length) * 100) : 0;
    const currentStage = timeline.find(s => s.status === 'current') || { label: 'Completed', date: new Date().toISOString() };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-black pb-20 animate-fade-in">
            {/* 1. Premium Header (Gradient) */}
            <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-white/5 opacity-50"></div>
                <div className="relative max-w-7xl mx-auto px-6 py-8">
                    {/* Breadcrumb / Back */}
                    <div className="flex items-center gap-4 mb-6 text-slate-400">
                        <button onClick={() => navigate('/projects')} className="hover:text-white transition-colors flex items-center gap-2">
                            <ArrowLeftIcon className="w-4 h-4" /> Back to Projects
                        </button>
                        <span>/</span>
                        <span className="text-white font-medium">{project.projectCode || 'Details'}</span>
                    </div>

                    <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <h1 className="text-3xl font-bold">{project.projectName || 'Project Details'}</h1>
                                <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-xs font-bold uppercase tracking-wider border border-white/10">
                                    {project.status?.replace('_', ' ') || 'Pending'}
                                </span>
                            </div>
                            <p className="text-slate-300 flex items-center gap-2">
                                <MapPinIcon className="w-4 h-4" /> {project.siteType || 'Site'} • {customer?.city || 'Location'}
                            </p>
                        </div>

                        {/* Header Stats */}
                        <div className="flex items-center gap-8 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                            <div>
                                <p className="text-xs text-slate-400 uppercase font-bold mb-1">Current Stage</p>
                                <p className="text-lg font-bold text-primary-400 flex items-center gap-2">
                                    {currentStage.label}
                                    {updatingStage && <div className="w-3 h-3 border-2 border-primary-400 border-t-transparent rounded-full animate-spin" />}
                                </p>
                            </div>
                            <div className="h-8 w-px bg-white/20"></div>
                            <div>
                                <p className="text-xs text-slate-400 uppercase font-bold mb-1">Progress</p>
                                <div className="flex items-end gap-2">
                                    <span className="text-2xl font-bold leading-none">{progressPercentage}%</span>
                                    <span className="text-xs text-slate-400 mb-1">completed</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-8 -mt-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Left Column: Context (Sidebar) */}
                    <div className="space-y-6">
                        {/* Customer Card */}
                        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800">
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Customer</h3>
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-500/20">
                                    {customer?.companyName?.charAt(0) || 'C'}
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900 dark:text-white">{customer?.companyName}</h4>
                                    <p className="text-sm text-slate-500">{customer?.contactPerson}</p>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                                    <PhoneIcon className="w-4 h-4 text-slate-400" />
                                    <span>{customer?.mobile}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                                    <MapPinIcon className="w-4 h-4 text-slate-400" />
                                    <span className="truncate">{project.address}</span>
                                </div>
                            </div>
                        </div>

                        {/* Team Card */}
                        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800">
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Team</h3>
                            <div className="space-y-3">
                                {technicians.map(tech => (
                                    <div key={tech.id} className="flex items-center justify-between group">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-600 dark:text-slate-400">
                                                {tech.name.substring(0, 2).toUpperCase()}
                                            </div>
                                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{tech.name}</span>
                                        </div>
                                        <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                    </div>
                                ))}
                                {technicians.length === 0 && <p className="text-sm text-slate-400 italic">No technicians assigned</p>}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Main Workflow */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* Premium Timeline */}
                        <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="font-bold text-lg text-slate-900 dark:text-white">Project Timeline</h3>
                                <span className="text-xs font-medium px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-500">
                                    Est. Completion: <strong className="text-slate-900 dark:text-white">14 Jan</strong>
                                </span>
                            </div>

                            {/* Timeline Nodes */}
                            <div className="relative">
                                {/* Connecting Line */}
                                <div className="absolute top-4 left-0 w-full h-0.5 bg-slate-100 dark:bg-slate-800 hidden md:block" />

                                <div className="flex flex-col md:flex-row justify-between items-start md:items-start gap-8 md:gap-0 overflow-x-auto pb-4 scrollbar-hide">
                                    {timeline.map((step, idx) => {
                                        const isCurrent = step.status === 'current';
                                        const isCompleted = step.status === 'completed';
                                        const isClickable = isCurrent && !updatingStage;

                                        return (
                                            <div
                                                key={idx}
                                                onClick={() => isClickable && advanceStage(idx)}
                                                className={`relative z-10 flex md:flex-col items-center gap-4 md:gap-3 min-w-[100px] group ${isClickable ? 'cursor-pointer' : ''}`}
                                            >
                                                {/* Visual Node */}
                                                <div className={`w-9 h-9 rounded-full flex items-center justify-center border-[3px] transition-all duration-300 shadow-sm
                                                    ${isCompleted
                                                        ? 'bg-green-500 border-green-500 text-white shadow-green-500/20'
                                                        : isCurrent
                                                            ? 'bg-white dark:bg-slate-900 border-primary-500 text-primary-500 ring-4 ring-primary-100 dark:ring-primary-900/30 scale-110'
                                                            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-300'
                                                    }
                                                    ${isClickable ? 'group-hover:scale-125 group-hover:border-green-400 group-hover:text-green-400' : ''}
                                                `}>
                                                    {isCompleted ? <CheckIcon className="w-5 h-5" /> :
                                                        isCurrent && updatingStage ? <div className="w-4 h-4 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" /> :
                                                            <div className={`w-2 h-2 rounded-full ${isCurrent ? 'bg-primary-500' : 'bg-slate-300 dark:bg-slate-700'}`} />}
                                                </div>

                                                {/* Text Info */}
                                                <div className="md:text-center">
                                                    <p className={`text-xs font-bold transition-colors ${isCurrent ? 'text-primary-600 dark:text-primary-400 scale-105' :
                                                        isCompleted ? 'text-green-600 dark:text-green-500' : 'text-slate-400'
                                                        }`}>
                                                        {step.label}
                                                    </p>

                                                    {isClickable && <p className="hidden md:block text-[10px] text-green-500 font-bold mt-1 animate-bounce">Click to Done</p>}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Tabs Container */}
                        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 overflow-hidden min-h-[400px]">
                            {/* Tab Headers */}
                            <div className="flex border-b border-slate-100 dark:border-slate-800">
                                <button
                                    onClick={() => setActiveTab('overview')}
                                    className={`flex-1 py-4 text-sm font-bold border-b-2 transition-colors ${activeTab === 'overview' ? 'border-primary-500 text-primary-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                                >
                                    Overview
                                </button>
                                <button
                                    onClick={() => setActiveTab('materials')}
                                    className={`flex-1 py-4 text-sm font-bold border-b-2 transition-colors ${activeTab === 'materials' ? 'border-primary-500 text-primary-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                                >
                                    Materials
                                </button>
                                <button
                                    onClick={() => setActiveTab('files')}
                                    className={`flex-1 py-4 text-sm font-bold border-b-2 transition-colors ${activeTab === 'files' ? 'border-primary-500 text-primary-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                                >
                                    Files
                                </button>
                            </div>

                            {/* Tab Content */}
                            <div className="p-6">
                                {activeTab === 'overview' && (
                                    <div className="space-y-6 animate-fade-in">
                                        <div className="flex items-center justify-between">
                                            <h4 className="font-bold text-slate-900 dark:text-white">Project Notes</h4>
                                            <button className="text-xs font-bold text-primary-600 hover:underline">Edit Notes</button>
                                        </div>
                                        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800 text-sm text-slate-600 dark:text-slate-300 leading-relaxed min-h-[120px]">
                                            {project.notes || "No notes added for this project yet. Click edit to add important details about access, gate codes, or specific customer requests."}
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'materials' && (
                                    <div className="animate-fade-in">
                                        <div className="flex justify-between items-center mb-4">
                                            <h4 className="font-bold text-slate-900 dark:text-white">Material Usage</h4>
                                            <button className="text-xs font-bold px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg hover:bg-slate-200 transition-colors">Manage Stock</button>
                                        </div>
                                        {(!project.materialUsage || project.materialUsage.length === 0) ? (
                                            <div className="text-center py-10">
                                                <div className="w-12 h-12 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-3">
                                                    <CubeIcon className="w-6 h-6 text-slate-300" />
                                                </div>
                                                <p className="text-sm text-slate-400">No materials tracked yet.</p>
                                            </div>
                                        ) : (
                                            // Existing Table Logic Here
                                            <table className="w-full text-sm text-left">
                                                <thead className="text-xs text-slate-400 uppercase bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                                                    <tr>
                                                        <th className="px-4 py-3 rounded-l-lg">Item</th>
                                                        <th className="px-4 py-3 text-center">Used</th>
                                                        <th className="px-4 py-3 rounded-r-lg text-right">Status</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                                    {project.materialUsage.map((m, i) => (
                                                        <tr key={i}>
                                                            <td className="px-4 py-3 font-medium text-slate-700 dark:text-slate-200">{m.productName}</td>
                                                            <td className="px-4 py-3 text-center text-slate-600">{m.qtyUsed}</td>
                                                            <td className="px-4 py-3 text-right">
                                                                <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${m.balance < 0 ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                                                                    {m.balance < 0 ? 'Over Limit' : 'OK'}
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        )}
                                    </div>
                                )}

                                {activeTab === 'files' && (
                                    <div className="grid grid-cols-2 gap-4 animate-fade-in">
                                        {/* Placeholder Files */}
                                        <div className="p-4 border border-slate-200 dark:border-slate-800 rounded-xl flex items-center gap-3 cursor-pointer hover:border-primary-300 transition-colors">
                                            <div className="p-2 bg-blue-50 text-blue-500 rounded-lg"><PhotoIcon className="w-5 h-5" /></div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-700 dark:text-slate-200">Site_Survey.jpg</p>
                                                <p className="text-xs text-slate-400">2.4 MB</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectDetailsPage;
