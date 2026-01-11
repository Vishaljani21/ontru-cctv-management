import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { Visit, Customer, User, TimelineStep } from '../types';
import {
    CalendarIcon, MapPinIcon, ArrowLeftIcon, PhoneIcon,
    CheckIcon, CubeIcon, PhotoIcon, PencilSquareIcon, CheckCircleIcon
} from '../components/ProjectIcons';

const ProjectDetailsPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [project, setProject] = useState<Visit | null>(null);
    const [customer, setCustomer] = useState<Customer | null>(null);
    const [technicians, setTechnicians] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'overview' | 'materials' | 'files'>('overview');
    const [updatingStage, setUpdatingStage] = useState(false);

    useEffect(() => {
        const load = async () => {
            try {
                if (!id) return;
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
        load();
    }, [id]);

    if (loading) return (
        <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-black">
            <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin shadow-lg shadow-indigo-500/30"></div>
        </div>
    );

    if (!project) return (
        <div className="p-10 text-center">
            <h3 className="text-xl font-bold text-slate-700">Project Not Found</h3>
            <button onClick={() => navigate('/projects')} className="mt-4 text-indigo-600 hover:text-indigo-700 font-medium">Back to Projects</button>
        </div>
    );

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

    const advanceStage = async (index: number) => {
        if (!project || updatingStage) return;
        const currentIdx = timeline.findIndex(s => s.status === 'current');
        if (currentIdx !== -1 && index !== currentIdx) return;

        setUpdatingStage(true);
        try {
            const newTimeline = [...timeline];
            if (newTimeline[index]) {
                newTimeline[index] = { ...newTimeline[index], status: 'completed', date: new Date().toISOString() };
            }
            if (newTimeline[index + 1]) {
                newTimeline[index + 1] = { ...newTimeline[index + 1], status: 'current' };
            }
            await api.updateProjectTimeline(project.id, newTimeline);
            setProject(prev => prev ? { ...prev, timelineStatus: newTimeline } : null);
        } catch (error) {
            console.error("Failed to advance stage", error);
        } finally {
            setUpdatingStage(false);
        }
    };

    const completedSteps = timeline.filter(s => s.status === 'completed').length;
    const progressPercentage = timeline.length > 0 ? Math.round((completedSteps / timeline.length) * 100) : 0;
    const currentStage = timeline.find(s => s.status === 'current') || { label: 'Completed', date: new Date().toISOString() };

    return (
        <div className="min-h-screen bg-[#F8FAFC] dark:bg-black pb-24 font-sans selection:bg-indigo-100 selection:text-indigo-900">
            {/* Premium Header with Radial Gradient */}
            <div className="bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-800 via-slate-900 to-slate-950 text-white relative isolate overflow-hidden">
                {/* Decorative Grid Pattern */}
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-950/80"></div>

                <div className="relative max-w-7xl mx-auto px-6 py-10 md:py-14">
                    {/* Navigation */}
                    <div className="flex items-center gap-3 mb-8 text-slate-400 text-sm">
                        <button onClick={() => navigate('/projects')} className="hover:text-white transition-colors flex items-center gap-2 group">
                            <ArrowLeftIcon className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                            <span className="font-medium tracking-wide">Back to Projects</span>
                        </button>
                    </div>

                    <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-8">
                        <div className="space-y-4">
                            <div className="flex items-center gap-4">
                                <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white drop-shadow-sm">{project.projectName || 'Project Details'}</h1>
                                <span className="px-4 py-1.5 rounded-full bg-emerald-500/10 backdrop-blur-md text-emerald-400 text-xs font-bold uppercase tracking-widest border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.15)] animate-pulse-slow">
                                    {project.status?.replace('_', ' ') || 'Pending'}
                                </span>
                            </div>
                            <div className="flex flex-wrap items-center gap-6 text-slate-300 text-sm font-medium">
                                <span className="text-white/60">{project.projectCode || 'No Code'}</span>
                                <span className="w-1 h-1 rounded-full bg-slate-600"></span>
                                <div className="flex items-center gap-2 text-indigo-300">
                                    <MapPinIcon className="w-4 h-4" />
                                    <span>{project.siteType || 'Site'} • {customer?.city || 'Location'}</span>
                                </div>
                                <span className="w-1 h-1 rounded-full bg-slate-600"></span>
                                <div className="flex items-center gap-2 text-slate-300">
                                    <CalendarIcon className="w-4 h-4 text-slate-500" />
                                    <span>Scheduled: {new Date(project.scheduledAt).toLocaleDateString([], { day: 'numeric', month: 'short' })}</span>
                                </div>
                            </div>
                        </div>

                        {/* Floating Stats Card */}
                        <div className="flex bg-white/5 backdrop-blur-xl rounded-2xl p-5 border border-white/10 shadow-2xl shadow-black/20 md:min-w-[300px]">
                            <div className="flex-1 pr-6 border-r border-white/10">
                                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-1">Current Stage</p>
                                <p className="text-xl font-bold text-white flex items-center gap-2">
                                    {currentStage.label}
                                    {updatingStage && <div className="w-3 h-3 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />}
                                </p>
                            </div>
                            <div className="flex-1 pl-6">
                                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-1">Completion</p>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-3xl font-bold text-emerald-400">{progressPercentage}%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-8 -mt-12 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* Left Column (3 cols) */}
                    <div className="lg:col-span-4 space-y-6">
                        {/* Customer Card */}
                        <div className="bg-white dark:bg-slate-900 rounded-3xl p-1 shadow-[0_2px_20px_rgba(0,0,0,0.02)] border border-slate-100 dark:border-slate-800">
                            <div className="p-6">
                                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Customer Profile</h3>
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-indigo-500/25">
                                        {customer?.companyName?.charAt(0) || 'C'}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-lg text-slate-900 dark:text-white leading-tight">{customer?.companyName}</h4>
                                        <p className="text-sm text-slate-500 font-medium mt-1">{customer?.contactPerson}</p>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="group flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700/50 transition-all hover:bg-white hover:shadow-md hover:border-slate-200">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg"><PhoneIcon className="w-4 h-4" /></div>
                                            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{customer?.mobile}</span>
                                        </div>
                                    </div>
                                    <div className="group flex items-start gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700/50 transition-all hover:bg-white hover:shadow-md hover:border-slate-200">
                                        <div className="p-2 bg-pink-50 text-pink-500 rounded-lg shrink-0"><MapPinIcon className="w-4 h-4" /></div>
                                        <span className="text-sm text-slate-600 dark:text-slate-400 leading-snug pt-1">{project.address}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Team Card */}
                        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-[0_2px_20px_rgba(0,0,0,0.02)] border border-slate-100 dark:border-slate-800">
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Technicians</h3>
                            <div className="space-y-4">
                                {technicians.map(tech => (
                                    <div key={tech.id} className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-600 border-2 border-white shadow-sm">
                                                {tech.name.substring(0, 2).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-700 dark:text-slate-200">{tech.name}</p>
                                                <p className="text-xs text-green-600 font-medium">● Active</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {technicians.length === 0 && <p className="text-sm text-slate-400 italic text-center py-4">No technicians assigned</p>}
                            </div>
                        </div>
                    </div>

                    {/* Right Column (8 cols) */}
                    <div className="lg:col-span-8 space-y-8">

                        {/* Timeline Card */}
                        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100 dark:border-slate-800">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                                    <span className="w-1.5 h-6 bg-indigo-500 rounded-full"></span>
                                    Project Stage
                                </h3>
                                {updatingStage && <span className="text-xs font-bold text-indigo-500 animate-pulse">UPDATING...</span>}
                            </div>

                            <div className="relative pt-2 pb-6 overflow-x-auto">
                                {/* Connector Line */}
                                <div className="absolute top-[26px] left-0 w-full h-1 bg-slate-100 dark:bg-slate-800 rounded-full hidden md:block"></div>

                                <div className="flex flex-col md:flex-row justify-between items-start md:items-start min-w-[700px] md:min-w-0">
                                    {timeline.map((step, idx) => {
                                        const isCurrent = step.status === 'current';
                                        const isCompleted = step.status === 'completed';
                                        const isClickable = isCurrent && !updatingStage;

                                        return (
                                            <div
                                                key={idx}
                                                onClick={() => isClickable && advanceStage(idx)}
                                                className={`relative z-10 flex md:flex-col items-center gap-4 md:gap-4 flex-1 group ${isClickable ? 'cursor-pointer' : ''}`}
                                            >
                                                {/* Node Circle */}
                                                <div className={`w-14 h-14 rounded-full flex items-center justify-center border-[4px] transition-all duration-500 shadow-lg
                                                    ${isCompleted
                                                        ? 'bg-emerald-500 border-emerald-50 text-white shadow-emerald-500/30'
                                                        : isCurrent
                                                            ? 'bg-white dark:bg-slate-900 border-indigo-500 text-indigo-500 shadow-indigo-500/20 scale-110 ring-4 ring-indigo-50 dark:ring-indigo-900/20'
                                                            : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-700 text-slate-300'
                                                    }
                                                    ${isClickable ? 'group-hover:scale-110 group-hover:border-emerald-300' : ''}
                                                `}>
                                                    {isCompleted ? <CheckIcon className="w-6 h-6 stroke-[3px]" /> :
                                                        isCurrent ? (updatingStage ? <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" /> : <div className="w-3 h-3 bg-indigo-500 rounded-full animate-ping" />) :
                                                            <div className="w-2 h-2 rounded-full bg-slate-200 dark:bg-slate-700" />}
                                                </div>

                                                {/* Labels */}
                                                <div className="md:text-center w-24">
                                                    <p className={`text-[11px] font-bold uppercase tracking-wider transition-colors mb-0.5 ${isCurrent ? 'text-indigo-600 dark:text-indigo-400' : isCompleted ? 'text-emerald-600' : 'text-slate-400'}`}>
                                                        Step {idx + 1}
                                                    </p>
                                                    <p className={`text-xs font-bold leading-tight ${isCurrent ? 'text-slate-900 dark:text-white scale-105' : 'text-slate-500'}`}>
                                                        {step.label}
                                                    </p>
                                                    {step.date && <p className="text-[10px] text-slate-400 mt-1">{new Date(step.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</p>}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Content Tabs */}
                        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100 dark:border-slate-800 overflow-hidden min-h-[500px]">
                            <div className="flex border-b border-slate-100 dark:border-slate-800 px-6 pt-2">
                                {['Overview', 'Materials', 'Files'].map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab.toLowerCase() as any)}
                                        className={`px-6 py-5 text-sm font-bold border-b-[3px] transition-all duration-300 ${activeTab === tab.toLowerCase() ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>

                            <div className="p-8">
                                {activeTab === 'overview' && (
                                    <div className="space-y-8 animate-fade-in-up">
                                        <div className="flex items-center justify-between">
                                            <h4 className="font-bold text-slate-900 dark:text-white text-lg">Project Notes</h4>
                                            <button className="flex items-center gap-2 text-xs font-bold px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors">
                                                <PencilSquareIcon className="w-4 h-4" /> Edit
                                            </button>
                                        </div>
                                        <div className="p-6 bg-slate-50 dark:bg-slate-800/30 rounded-2xl border border-slate-100 dark:border-slate-800 text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                                            {project.notes || "No notes added for this project yet."}
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'materials' && (
                                    <div className="animate-fade-in-up">
                                        <div className="flex justify-between items-center mb-6">
                                            <h4 className="font-bold text-slate-900 dark:text-white text-lg">Material Monitor</h4>
                                            <span className="text-xs font-bold px-3 py-1 bg-slate-100 rounded-full text-slate-500">Auto-tracked from Quotation</span>
                                        </div>
                                        {(!project.materialUsage || project.materialUsage.length === 0) ? (
                                            <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed border-slate-100 rounded-2xl">
                                                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                                                    <CubeIcon className="w-8 h-8 text-slate-300" />
                                                </div>
                                                <p className="text-sm font-bold text-slate-500">No materials tracked</p>
                                            </div>
                                        ) : (
                                            <div className="overflow-hidden rounded-xl border border-slate-200">
                                                <table className="w-full text-sm text-left">
                                                    <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                                                        <tr>
                                                            <th className="px-6 py-4">Item Name</th>
                                                            <th className="px-6 py-4 text-center">Used Qty</th>
                                                            <th className="px-6 py-4 text-right">Stock Status</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-slate-100 bg-white">
                                                        {project.materialUsage.map((m, i) => (
                                                            <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                                                                <td className="px-6 py-4 font-bold text-slate-700">{m.productName}</td>
                                                                <td className="px-6 py-4 text-center font-medium text-slate-600">{m.qtyUsed}</td>
                                                                <td className="px-6 py-4 text-right">
                                                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold ${m.balance < 0 ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-green-50 text-green-600 border border-green-100'}`}>
                                                                        {m.balance < 0 ? <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span> : <CheckCircleIcon className="w-3 h-3" />}
                                                                        {m.balance < 0 ? 'Over Limit' : 'Stock OK'}
                                                                    </span>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {activeTab === 'files' && (
                                    <div className="animate-fade-in-up">
                                        <h4 className="font-bold text-slate-900 dark:text-white text-lg mb-6">Project Attachments</h4>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                            <div className="aspect-[4/3] bg-slate-50 rounded-2xl border border-slate-200 flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-indigo-300 hover:shadow-lg transition-all group">
                                                <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-indigo-500 group-hover:scale-110 transition-transform">
                                                    <PhotoIcon className="w-6 h-6" />
                                                </div>
                                                <span className="text-xs font-bold text-slate-400 group-hover:text-indigo-600">Site_Plan.jpg</span>
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
