import React, { useEffect, useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import type { TechnicianDashboardSummary, TechnicianProject, TechnicianAvailability, TimelineStep } from '../../types';
import { api } from '../../services/api';
import { AuthContext } from '../../components/contexts';
import { VisitsIcon, CheckCircleIcon, CurrencyRupeeIcon, ClipboardDocumentListIcon, MapPinIcon, PhoneIcon, ChevronRightIcon, CalendarIcon } from '../../components/icons';
import StatsCard from '../../components/StatsCard';
import CustomSelect from '../../components/CustomSelect';
import ProjectTimelineCard from '../../components/ProjectTimelineCard';
import QuickActionButton, { StartJobButton, CompleteStepButton, NavigateButton, CallCustomerButton } from '../../components/QuickActionButton';

const availabilityOptions = [
    { value: 'available', label: 'Available', color: 'bg-green-500' },
    { value: 'busy', label: 'Busy', color: 'bg-red-500' },
    { value: 'on_leave', label: 'On Leave', color: 'bg-yellow-500' },
    { value: 'offline', label: 'Offline', color: 'bg-slate-500' },
];

// Project Card Component for Dashboard
const ProjectCard: React.FC<{
    project: TechnicianProject;
    onTimelineUpdate: (projectId: number, stepIndex: number) => void;
    updatingProjectId: number | null;
}> = ({ project, onTimelineUpdate, updatingProjectId }) => {
    const [expanded, setExpanded] = useState(false);
    const navigate = useNavigate();

    const statusColors: Record<string, { bg: string; text: string; border: string }> = {
        scheduled: { bg: 'bg-blue-50 dark:bg-blue-900/20', text: 'text-blue-700 dark:text-blue-400', border: 'border-blue-200 dark:border-blue-800' },
        in_progress: { bg: 'bg-orange-50 dark:bg-orange-900/20', text: 'text-orange-700 dark:text-orange-400', border: 'border-orange-200 dark:border-orange-800' },
        completed: { bg: 'bg-green-50 dark:bg-green-900/20', text: 'text-green-700 dark:text-green-400', border: 'border-green-200 dark:border-green-800' },
    };

    const colors = statusColors[project.status] || statusColors.scheduled;

    return (
        <div className={`bg-white dark:bg-slate-900 rounded-2xl border ${project.isOverdue ? 'border-red-300 dark:border-red-800' : 'border-slate-200 dark:border-slate-800'} shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md`}>
            {/* Header */}
            <div className="p-4 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-base font-bold text-slate-900 dark:text-white truncate">
                                {project.projectName || `Project #${project.id}`}
                            </h3>
                            {project.isOverdue && (
                                <span className="px-2 py-0.5 text-[10px] font-bold bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 rounded-full uppercase">
                                    Overdue
                                </span>
                            )}
                        </div>
                        <p className="text-sm text-slate-500 dark:text-slate-400 truncate">
                            {project.customerName}
                        </p>
                    </div>

                    <div className={`px-2.5 py-1 rounded-lg text-xs font-bold capitalize ${colors.bg} ${colors.text} border ${colors.border}`}>
                        {project.status.replace('_', ' ')}
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-3">
                    <ProjectTimelineCard timeline={project.timelineStatus || []} compact />
                </div>

                {/* Current Step Info */}
                <div className="mt-3 flex items-center justify-between text-sm">
                    <span className="text-slate-500 dark:text-slate-400">
                        Current: <span className="font-semibold text-primary-600 dark:text-primary-400">{project.currentStep}</span>
                    </span>
                    <span className="text-xs text-slate-400">
                        {new Date(project.scheduledAt).toLocaleDateString()}
                    </span>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="p-3 bg-slate-50/50 dark:bg-slate-800/50 flex flex-wrap gap-2">
                {project.customerPhone && (
                    <CallCustomerButton phoneNumber={project.customerPhone} />
                )}
                <NavigateButton address={project.address} />

                <div className="flex-grow" />

                {project.status === 'scheduled' && (
                    <StartJobButton
                        onClick={() => onTimelineUpdate(project.id, 0)}
                        loading={updatingProjectId === project.id}
                    />
                )}

                {project.status === 'in_progress' && project.currentStepIndex >= 0 && (
                    <CompleteStepButton
                        onClick={() => onTimelineUpdate(project.id, project.currentStepIndex)}
                        loading={updatingProjectId === project.id}
                        label={`Complete ${project.currentStep}`}
                    />
                )}

                <button
                    onClick={() => setExpanded(!expanded)}
                    className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
                >
                    <ChevronRightIcon className={`w-4 h-4 text-slate-500 transition-transform ${expanded ? 'rotate-90' : ''}`} />
                </button>
            </div>

            {/* Expanded Details */}
            {expanded && (
                <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-800/30 animate-fade-in-up">
                    {/* Address */}
                    <div className="mb-4">
                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Site Address</h4>
                        <p className="text-sm text-slate-700 dark:text-slate-300">{project.address}</p>
                        <p className="text-xs text-slate-500 mt-1">{project.customerCity}</p>
                    </div>

                    {/* Full Timeline */}
                    <div>
                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Project Timeline</h4>
                        <ProjectTimelineCard
                            timeline={project.timelineStatus || []}
                            editable
                            onStepClick={(stepIndex) => onTimelineUpdate(project.id, stepIndex)}
                        />
                    </div>

                    {/* View Full Details Button */}
                    <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                        <Link
                            to={`/tech/my-visits`}
                            className="block w-full text-center py-2 px-4 bg-primary-500 hover:bg-primary-600 text-white text-sm font-bold rounded-lg transition-colors"
                        >
                            View Full Project Details
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
};

const TechnicianDashboardPage: React.FC = () => {
    const [summary, setSummary] = useState<TechnicianDashboardSummary | null>(null);
    const [projects, setProjects] = useState<TechnicianProject[]>([]);
    const [availability, setAvailability] = useState<TechnicianAvailability>('offline');
    const [loading, setLoading] = useState(true);
    const [updatingProjectId, setUpdatingProjectId] = useState<number | null>(null);
    const authContext = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            if (!authContext?.user?.id) return;

            try {
                // Fetch all data in parallel
                const [summaryData, projectsData, currentStatus] = await Promise.all([
                    api.getTechnicianDashboardSummary(),
                    api.getMyProjectsWithTimeline(),
                    api.getTechnicianAvailability()
                ]);

                setSummary(summaryData);
                setProjects(projectsData);
                setAvailability(currentStatus);
            } catch (error) {
                console.error("Failed to fetch technician dashboard data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [authContext?.user?.id]);

    const handleAvailabilityChange = async (newStatus: string) => {
        const status = newStatus as TechnicianAvailability;
        const oldStatus = availability;
        setAvailability(status);
        try {
            await api.updateTechnicianAvailability(status);
        } catch (error) {
            console.error("Failed to update status", error);
            setAvailability(oldStatus);
            alert("Failed to update status");
        }
    };

    const handleTimelineUpdate = async (projectId: number, stepIndex: number) => {
        setUpdatingProjectId(projectId);
        try {
            // Find project to get current timeline
            const project = projects.find(p => p.id === projectId);
            if (!project || !project.timelineStatus) return;

            // Clone and update timeline
            const newTimeline = [...project.timelineStatus];
            if (newTimeline[stepIndex]) {
                newTimeline[stepIndex] = {
                    ...newTimeline[stepIndex],
                    status: 'completed',
                    date: new Date().toISOString()
                };

                // Set next step as current
                if (stepIndex + 1 < newTimeline.length) {
                    newTimeline[stepIndex + 1] = {
                        ...newTimeline[stepIndex + 1],
                        status: 'current'
                    };
                }
            }

            await api.updateProjectTimeline(projectId, newTimeline);

            // Refresh projects
            const updatedProjects = await api.getMyProjectsWithTimeline();
            setProjects(updatedProjects);

            // Refresh summary
            const updatedSummary = await api.getTechnicianDashboardSummary();
            setSummary(updatedSummary);
        } catch (error) {
            console.error("Failed to update timeline", error);
            alert("Failed to update project timeline");
        } finally {
            setUpdatingProjectId(null);
        }
    };

    // Filter active projects (not completed)
    const activeProjects = projects.filter(p => p.status !== 'completed');
    const completedProjects = projects.filter(p => p.status === 'completed');

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fade-in-up pb-10">
            {/* Header */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary-600 via-primary-700 to-primary-700 shadow-2xl ring-1 ring-white/10">
                <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl"></div>
                <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl"></div>

                <div className="relative p-6 sm:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-2 drop-shadow-md">
                            Welcome back, {authContext?.user?.name?.split(' ')[0]}!
                        </h2>
                        <p className="text-primary-100 text-base max-w-2xl font-medium">
                            You have <span className="font-bold text-white bg-white/20 px-2 py-0.5 rounded-lg">{activeProjects.length}</span> active projects
                            {summary && summary.completedToday > 0 && (
                                <> and completed <span className="font-bold text-green-300">{summary.completedToday}</span> today!</>
                            )}
                        </p>
                    </div>

                    {/* Status Toggle */}
                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-2 pl-4 flex items-center gap-3 border border-white/20 shadow-lg min-w-[200px]">
                        <span className="text-white font-bold text-sm tracking-wide">Status:</span>
                        <div className="flex-1">
                            <CustomSelect
                                options={availabilityOptions}
                                value={availability}
                                onChange={handleAvailabilityChange}
                                className="w-full min-w-[140px]"
                                placeholder="Select Status"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <StatsCard
                    title="Active Projects"
                    value={activeProjects.length}
                    icon={<CalendarIcon />}
                    gradient="teal"
                />
                <StatsCard
                    title="Completed Today"
                    value={summary?.completedToday || 0}
                    icon={<CheckCircleIcon />}
                    gradient="blue"
                />
                <StatsCard
                    title="Pending Expenses"
                    value={summary?.pendingPayments || 0}
                    icon={<CurrencyRupeeIcon />}
                    gradient="purple"
                />
            </div>

            {/* Quick Actions Row */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm">
                <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">Quick Actions</h3>
                <div className="flex flex-wrap gap-3">
                    <QuickActionButton
                        icon={<VisitsIcon />}
                        label="My Projects"
                        onClick={() => navigate('/tech/my-visits')}
                        variant="primary"
                    />
                    <QuickActionButton
                        icon={<ClipboardDocumentListIcon />}
                        label="Daily Tasks"
                        onClick={() => navigate('/tech/tasks')}
                        variant="neutral"
                    />
                    <QuickActionButton
                        icon={<CurrencyRupeeIcon />}
                        label="My Expenses"
                        onClick={() => navigate('/tech/expenses')}
                        variant="neutral"
                    />
                    <QuickActionButton
                        icon={<CheckCircleIcon />}
                        label="Installation Checklist"
                        onClick={() => navigate('/tech/checklist')}
                        variant="neutral"
                    />
                </div>
            </div>

            {/* Active Projects Section */}
            {activeProjects.length > 0 ? (
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                            <CalendarIcon className="w-5 h-5 text-primary-500" />
                            Active Projects
                        </h3>
                        <Link
                            to="/tech/my-visits"
                            className="text-xs font-bold text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1"
                        >
                            View All <ChevronRightIcon className="w-3 h-3" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {activeProjects.slice(0, 4).map(project => (
                            <ProjectCard
                                key={project.id}
                                project={project}
                                onTimelineUpdate={handleTimelineUpdate}
                                updatingProjectId={updatingProjectId}
                            />
                        ))}
                    </div>

                    {activeProjects.length > 4 && (
                        <div className="text-center">
                            <Link
                                to="/tech/my-visits"
                                className="inline-flex items-center px-4 py-2 text-sm font-bold text-primary-600 hover:text-primary-700 dark:text-primary-400"
                            >
                                View {activeProjects.length - 4} more projects <ChevronRightIcon className="w-4 h-4 ml-1" />
                            </Link>
                        </div>
                    )}
                </div>
            ) : (
                <div className="bg-white dark:bg-slate-900 rounded-2xl p-12 text-center border border-slate-200 dark:border-slate-800">
                    <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CalendarIcon className="w-10 h-10 text-slate-400" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300 mb-2">No Active Projects</h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">
                        You don't have any active projects assigned. Enjoy your free time!
                    </p>
                </div>
            )}

            {/* Recently Completed Section (if any) */}
            {completedProjects.length > 0 && (
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
                        <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
                            <CheckCircleIcon className="w-5 h-5 text-green-500" />
                            Recently Completed
                        </h3>
                    </div>
                    <div className="divide-y divide-slate-100 dark:divide-slate-800">
                        {completedProjects.slice(0, 3).map(project => (
                            <div key={project.id} className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                <div>
                                    <p className="font-semibold text-slate-700 dark:text-slate-200">
                                        {project.projectName || `Project #${project.id}`}
                                    </p>
                                    <p className="text-sm text-slate-500">{project.customerName}</p>
                                </div>
                                <span className="text-xs text-green-600 dark:text-green-400 font-medium bg-green-50 dark:bg-green-900/30 px-2 py-1 rounded-full">
                                    Completed
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default TechnicianDashboardPage;