import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { Visit, Customer, User, TimelineStep } from '../types';

// --- STUBBED ICONS (To prevent import crashes) ---
const GenericIcon = (props: any) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);
const CalendarIcon = GenericIcon;
const MapPinIcon = GenericIcon;
const ArrowLeftIcon = GenericIcon;

const ProjectDetailsPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [project, setProject] = useState<Visit | null>(null);
    const [customer, setCustomer] = useState<Customer | null>(null);
    // const [technicians, setTechnicians] = useState<User[]>([]); // Commented out for Phase 1
    const [loading, setLoading] = useState(true);

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
            } catch (error) {
                console.error("Failed to load project", error);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [id]);

    if (loading) return <div className="p-10 text-center animate-pulse">Loading Project UI...</div>;

    if (!project) return (
        <div className="p-10 text-center">
            <h3>Project Not Found</h3>
            <button onClick={() => navigate('/projects')}>Back</button>
        </div>
    );

    // Header Logic
    const progressPercentage = 0; // Placeholder
    const currentStageLabel = "Loading..."; // Placeholder

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-black pb-20">
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
                                <p className="text-xs text-slate-400 uppercase font-bold mb-1">Status</p>
                                <p className="text-lg font-bold text-primary-400">Restoration Mode</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="p-10 bg-white rounded-xl shadow text-center border border-slate-200">
                    <h2 className="text-xl font-bold text-green-600 mb-2">✅ Header Restored</h2>
                    <p>If you see the shiny dark header above, we are making progress.</p>
                    <p className="text-slate-500 mt-2">Next Step: Restore Sidebar & Timeline</p>
                </div>
            </div>
        </div>
    );
};

export default ProjectDetailsPage;
