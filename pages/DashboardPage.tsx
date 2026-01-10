import React, { useEffect, useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import type { DashboardSummary, Visit, Technician, JobCardStatus, TimelineStep } from '../types';
import { api } from '../services/api';
import { ProjectIcon, UsersIcon, BoxIcon, CurrencyRupeeIcon, TrophyIcon, DocumentTextIcon, ChevronRightIcon, ClockIcon, CheckCircleIcon } from '../components/icons';
import Skeleton from '../components/Skeleton';
import ProjectTimelineCard from '../components/ProjectTimelineCard';

import StatsCard from '../components/StatsCard';

const SectionContainer: React.FC<{ title: string; children: React.ReactNode; action?: React.ReactNode }> = ({ title, children, action }) => (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-100 dark:border-white/10 shadow-sm overflow-hidden flex flex-col h-full hover:shadow-md transition-shadow">
        <div className="px-6 py-5 border-b border-slate-50 dark:border-white/5 flex items-center justify-between">
            <h3 className="font-semibold text-slate-800 dark:text-white text-lg">{title}</h3>
            {action}
        </div>
        <div className="p-6 flex-grow flex flex-col justify-center">
            {children}
        </div>
    </div>
);

const PieChart: React.FC<{ data: { label: string; value: number; color: string }[] }> = ({ data }) => {
    const total = data.reduce((acc, item) => acc + item.value, 0);
    if (total === 0) return <div className="text-center text-slate-400 py-10 font-medium">No projects found.</div>;

    let cumulative = 0;
    const segments = data.map(item => {
        const percentage = item.value / total;
        const startAngle = (cumulative / total) * 360;
        cumulative += item.value;
        const endAngle = (cumulative / total) * 360;
        return { ...item, percentage, startAngle, endAngle };
    });

    const getArcPath = (start: number, end: number, r = 40) => {
        const startRad = (start * Math.PI) / 180;
        const endRad = (end * Math.PI) / 180;
        const x1 = 50 + r * Math.cos(startRad);
        const y1 = 50 + r * Math.sin(startRad);
        const x2 = 50 + r * Math.cos(endRad);
        const y2 = 50 + r * Math.sin(endRad);
        const largeArcFlag = end - start > 180 ? 1 : 0;
        return `M 50 50 L ${x1} ${y1} A ${r} ${r} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
    };

    return (
        <div className="flex flex-col md:flex-row items-center justify-around w-full" role="graphics-document" aria-label="Pie chart showing project status distribution">
            <div className="relative w-48 h-48 drop-shadow-xl filter">
                <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                    {segments.map(s => (
                        <path
                            key={s.label}
                            d={getArcPath(s.startAngle, s.endAngle)}
                            fill={s.color}
                            stroke="white"
                            strokeWidth="2"
                            className="transition-all duration-300 hover:opacity-80 cursor-pointer"
                            aria-label={`${s.label}: ${s.value} projects`}
                        >
                            <title>{`${s.label}: ${s.value} projects`}</title>
                        </path>
                    ))}
                    <circle cx="50" cy="50" r="20" fill="white" />
                </svg>
                {/* Center Total */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-lg font-bold text-slate-700">{total}</span>
                </div>
            </div>

            <div className="mt-8 md:mt-0 md:ml-6 space-y-3 w-full md:w-auto">
                {segments.map(s => (
                    <div key={s.label} className="flex items-center justify-between group cursor-default">
                        <div className="flex items-center">
                            <span className="w-3 h-3 rounded-full shadow-sm mr-3 transition-transform group-hover:scale-125" style={{ backgroundColor: s.color }}></span>
                            <span className="text-sm font-medium text-slate-600 capitalize mr-4">{s.label.replace('_', ' ')}</span>
                        </div>
                        <span className="text-sm font-bold text-slate-800">{s.value}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

const BarChart: React.FC<{ data: { label: string, value: number }[] }> = ({ data }) => {
    const maxValue = Math.max(...data.map(d => d.value), 1);
    return (
        <div className="w-full h-64 flex items-end justify-between gap-4 px-2 pt-8" role="graphics-document" aria-label="Bar chart showing monthly project completions">
            {data.map((item, idx) => (
                <div key={item.label} className="flex-1 flex flex-col items-center justify-end group">
                    <div className="relative w-full flex justify-center">
                        {/* Bar */}
                        <div
                            className={`
                                w-full max-w-[40px] rounded-t-lg transition-all duration-500 ease-out group-hover:opacity-90 relative
                                ${idx === 5 ? 'bg-primary-500 shadow-lg shadow-primary-500/30' : 'bg-slate-200 group-hover:bg-primary-300'}
                            `}
                            style={{ height: `${(item.value / maxValue) * 100}%` }}
                            role="graphics-symbol"
                            aria-label={`${item.label}: ${item.value} completed projects`}
                        >
                            {/* Tooltip */}
                            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-slate-800 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10" role="tooltip">
                                {item.value} Projects
                            </div>
                        </div>
                    </div>
                    <span className={`text-[10px] md:text-xs font-semibold mt-3 ${idx === 5 ? 'text-primary-600' : 'text-slate-400'}`}>{item.label}</span>
                </div>
            ))}
        </div>
    );
}

const statusColors: Record<JobCardStatus, string> = {
    scheduled: '#60a5fa', // blue-400
    in_progress: '#f97316', // orange-500
    completed: '#10b981', // green-500 - Updated to emerald/teal shade
    cancelled: '#ef4444' // red-500
};

const DashboardPage: React.FC = () => {
    const [summary, setSummary] = useState<DashboardSummary | null>(null);
    const [visits, setVisits] = useState<Visit[]>([]);
    const [technicians, setTechnicians] = useState<Technician[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Determine simulation delay to show off skeleton loader (remove in production if desired)
                const delay = new Promise(resolve => setTimeout(resolve, 800));

                const [summaryData, visitsData, techniciansData] = await Promise.all([
                    api.getDashboardSummary(),
                    api.getVisits(),
                    api.getTechnicians(),
                    delay
                ]);
                setSummary(summaryData);
                setVisits(visitsData);
                setTechnicians(techniciansData);
            } catch (error) {
                console.error("Failed to fetch dashboard data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const projectStatusData = useMemo(() => {
        const counts = visits.reduce((acc, visit) => {
            acc[visit.status] = (acc[visit.status] || 0) + 1;
            return acc;
        }, {} as Record<JobCardStatus, number>);

        return (Object.keys(counts) as JobCardStatus[]).map(status => ({
            label: status,
            value: counts[status],
            color: statusColors[status] || '#a8a29e'
        }));
    }, [visits]);

    const monthlyCompletionsData = useMemo(() => {
        const monthMap = new Map<string, number>();
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
        sixMonthsAgo.setDate(1);

        for (let i = 0; i < 6; i++) {
            const date = new Date(sixMonthsAgo);
            date.setMonth(date.getMonth() + i);
            const monthKey = date.toLocaleString('default', { month: 'short' });
            monthMap.set(monthKey, 0);
        }

        visits.forEach(visit => {
            const visitDate = new Date(visit.scheduledAt);
            if (visit.status === 'completed' && visitDate >= sixMonthsAgo) {
                const monthKey = visitDate.toLocaleString('default', { month: 'short' });
                monthMap.set(monthKey, (monthMap.get(monthKey) || 0) + 1);
            }
        });

        return Array.from(monthMap, ([label, value]) => ({ label, value }));
    }, [visits]);

    // Tech performance with strict number key typing for Map
    const technicianPerformance = useMemo(() => {
        const performance = new Map<number, number>();
        visits
            .filter(v => v.status === 'completed')
            .flatMap(v => v.technicianIds)
            .forEach(techId => {
                performance.set(techId, (performance.get(techId) || 0) + 1);
            });

        return Array.from(performance.entries())
            .map(([techId, count]) => ({
                id: techId,
                name: technicians.find(t => t.id === techId)?.name || 'Unknown',
                completed: count
            }))
            .sort((a, b) => b.completed - a.completed)
            .slice(0, 5);
    }, [visits, technicians]);


    if (loading) {
        return (
            <div className="space-y-8 animate-pulse">
                <div className="flex justify-between items-center">
                    <div>
                        <Skeleton width={200} height={40} className="mb-2" />
                        <Skeleton width={300} height={20} />
                    </div>
                    <Skeleton width={150} height={50} variant="rectangular" />
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {[1, 2, 3, 4].map(i => (
                        <Skeleton key={i} height={160} variant="rectangular" className="rounded-2xl" />
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                    <div className="lg:col-span-2 h-80 bg-white rounded-2xl p-6 border border-slate-100">
                        <Skeleton width={150} height={24} className="mb-8" />
                        <div className="flex justify-center items-center h-full">
                            <Skeleton variant="circular" width={160} height={160} />
                        </div>
                    </div>
                    <div className="lg:col-span-3 h-80 bg-white rounded-2xl p-6 border border-slate-100">
                        <Skeleton width={200} height={24} className="mb-8" />
                        <div className="flex items-end justify-between h-48 gap-4">
                            {[1, 2, 3, 4, 5, 6].map(i => <Skeleton key={i} width="100%" height={`${Math.random() * 80 + 20}%`} variant="rectangular" />)}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-fade-in-up">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
                <div>
                    <h2 className="text-3xl font-bold text-slate-800 dark:text-white tracking-tight">Overview</h2>
                    <p className="text-slate-500 dark:text-zinc-400 text-sm mt-1">Here's what's happening with your projects today.</p>
                </div>

                <Link to="/projects" className="inline-flex items-center justify-center px-5 py-2 text-sm font-semibold text-white bg-primary-500 border border-transparent rounded-lg shadow-sm hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors">
                    <span className="flex items-center">
                        Create Project <ChevronRightIcon className="ml-2 w-4 h-4" />
                    </span>
                </Link>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <StatsCard title="Total Projects" value={summary?.projects || 0} icon={<ProjectIcon />} gradient="red" />
                <StatsCard title="Pending Invoices" value={summary?.pendingInvoicesCount || 0} icon={<DocumentTextIcon />} gradient="blue" />
                <StatsCard title="Pending Payments" value={`₹${(summary?.pendingPayments || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`} icon={<CurrencyRupeeIcon />} gradient="purple" />
                <StatsCard title="Technicians" value={summary?.technicians || 0} icon={<UsersIcon />} gradient="teal" />
            </div>

            {/* Active Projects Overview */}
            {visits.filter(v => v.status === 'in_progress' || v.status === 'scheduled').length > 0 && (
                <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-100 dark:border-white/10 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-50 dark:border-white/5 flex items-center justify-between bg-gradient-to-r from-primary-50 to-transparent dark:from-primary-900/20">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                                <ClockIcon className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-slate-800 dark:text-white">Active Projects</h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    {visits.filter(v => v.status === 'in_progress' || v.status === 'scheduled').length} projects in progress
                                </p>
                            </div>
                        </div>
                        <Link
                            to="/projects?status=in_progress"
                            className="text-xs font-bold text-primary-600 hover:text-primary-700 dark:text-primary-400 flex items-center gap-1"
                        >
                            View All <ChevronRightIcon className="w-3 h-3" />
                        </Link>
                    </div>

                    <div className="p-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {visits
                                .filter(v => v.status === 'in_progress' || v.status === 'scheduled')
                                .slice(0, 3)
                                .map(project => {
                                    // Get or create timeline
                                    const timeline: TimelineStep[] = project.timelineStatus || [
                                        { label: 'Enquiry', date: project.scheduledAt, status: 'completed' as const },
                                        { label: 'Survey', date: '', status: project.status === 'scheduled' ? 'current' as const : 'completed' as const },
                                        { label: 'Quote', date: '', status: 'pending' as const },
                                        { label: 'Material', date: '', status: 'pending' as const },
                                        { label: 'Install', date: '', status: project.status === 'in_progress' ? 'current' as const : 'pending' as const },
                                        { label: 'Testing', date: '', status: 'pending' as const },
                                        { label: 'Handover', date: '', status: 'pending' as const },
                                        { label: 'Payment', date: '', status: 'pending' as const }
                                    ];

                                    const techNames = project.technicianIds
                                        .map(id => technicians.find(t => t.id === id)?.name)
                                        .filter(Boolean)
                                        .join(', ');

                                    return (
                                        <Link
                                            key={project.id}
                                            to={`/projects/${project.id}`}
                                            className="group block p-4 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-primary-200 dark:hover:border-primary-800 hover:shadow-md transition-all bg-slate-50/50 dark:bg-slate-800/30"
                                        >
                                            <div className="flex items-start justify-between mb-3">
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="font-semibold text-slate-800 dark:text-white truncate group-hover:text-primary-600 transition-colors">
                                                        {project.projectName || `Project #${project.id}`}
                                                    </h4>
                                                    {techNames && (
                                                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                                                            {techNames}
                                                        </p>
                                                    )}
                                                </div>
                                                <span
                                                    className="ml-2 px-2 py-0.5 text-[10px] font-bold rounded uppercase"
                                                    style={{
                                                        backgroundColor: `${statusColors[project.status]}20`,
                                                        color: statusColors[project.status]
                                                    }}
                                                >
                                                    {project.status.replace('_', ' ')}
                                                </span>
                                            </div>

                                            <ProjectTimelineCard timeline={timeline} compact />

                                            <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between text-xs text-slate-500">
                                                <span>{new Date(project.scheduledAt).toLocaleDateString()}</span>
                                                <span className="font-medium text-primary-600 dark:text-primary-400 group-hover:underline">
                                                    View details →
                                                </span>
                                            </div>
                                        </Link>
                                    );
                                })}
                        </div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                <div className="lg:col-span-2">
                    <SectionContainer title="Project Status">
                        <PieChart data={projectStatusData} />
                    </SectionContainer>
                </div>
                <div className="lg:col-span-3">
                    <SectionContainer title="Monthly Completions">
                        <BarChart data={monthlyCompletionsData} />
                    </SectionContainer>
                </div>
            </div>

            {/* Stage Breakdown Section */}
            <div className="grid grid-cols-1 gap-8">
                <SectionContainer title="Active Projects by Stage">
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
                        {['Enquiry', 'Survey', 'Quote', 'Material', 'Install', 'Testing', 'Handover', 'Payment'].map((stage, idx) => {
                            const count = visits.filter(v => {
                                if (v.status !== 'in_progress' && v.status !== 'scheduled') return false;
                                const current = v.timelineStatus?.find(s => s.status === 'current')?.label;
                                // Handle default scheduled state as Enquiry or Survey
                                if (!current && idx === 0 && v.status === 'scheduled') return true;
                                return current === stage;
                            }).length;

                            return (
                                <div key={stage} className={`p-4 rounded-xl border ${count > 0 ? 'bg-white dark:bg-slate-800 border-primary-200 dark:border-primary-900/50 shadow-sm' : 'bg-slate-50 dark:bg-white/5 border-transparent'} flex flex-col items-center justify-center text-center transition-all`}>
                                    <span className={`text-2xl font-bold mb-1 ${count > 0 ? 'text-primary-600 dark:text-primary-400' : 'text-slate-300 dark:text-slate-600'}`}>
                                        {count}
                                    </span>
                                    <span className={`text-xs font-bold uppercase tracking-wider ${count > 0 ? 'text-slate-700 dark:text-slate-300' : 'text-slate-400 dark:text-slate-600'}`}>
                                        {stage}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </SectionContainer>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <SectionContainer title="Recent Activity" action={<Link to="/projects" className="text-xs font-semibold text-primary-500 hover:text-primary-700 uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-primary-500 rounded">View All</Link>}>
                        <div className="overflow-x-auto -mx-6">
                            <table className="min-w-full divide-y divide-slate-100" role="table" aria-label="Recent activity table">
                                <thead className="bg-slate-50/50 dark:bg-white/5">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">Project</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">Date</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-transparent divide-y divide-slate-50 dark:divide-white/5">
                                    {visits.slice(0, 5).map((visit, idx) => (
                                        <tr key={visit.id} className="hover:bg-slate-50/80 dark:hover:bg-white/5 transition-colors duration-150 group code-font-sm">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="h-8 w-8 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400 font-bold text-xs mr-3">
                                                        {visit.projectName ? visit.projectName.charAt(0).toUpperCase() : '#'}
                                                    </div>
                                                    <span className="text-sm font-semibold text-slate-700 dark:text-zinc-200 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                                                        {visit.projectName || `Project #${visit.id}`}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-xs font-medium text-slate-500">{new Date(visit.scheduledAt).toLocaleDateString()}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span
                                                    className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold capitalize shadow-sm"
                                                    style={{
                                                        backgroundColor: `${statusColors[visit.status] || '#94a3b8'}20`,
                                                        color: statusColors[visit.status] || '#64748b'
                                                    }}
                                                >
                                                    <span className="w-1.5 h-1.5 rounded-full mr-2" style={{ backgroundColor: statusColors[visit.status] || '#64748b' }}></span>
                                                    {visit.status.replace('_', ' ')}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                    {visits.length === 0 && (
                                        <tr>
                                            <td colSpan={3} className="px-6 py-8 text-center text-slate-400 text-sm">No recent activity.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </SectionContainer>
                </div>

                <div className="lg:col-span-1">
                    <SectionContainer title="Top Performers">
                        <div className="space-y-4 mt-2">
                            {technicianPerformance.map((tech, index) => (
                                <div key={tech.id} className="flex items-center p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 transition-colors duration-200 border border-transparent hover:border-slate-100 dark:hover:border-white/5">
                                    <div className={`
                                        w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm mr-4 shadow-sm
                                        ${index === 0 ? 'bg-yellow-100 text-yellow-700' :
                                            index === 1 ? 'bg-slate-200 text-slate-600' :
                                                index === 2 ? 'bg-orange-100 text-orange-700' : 'bg-slate-50 text-slate-400'}
                                    `}>
                                        {index + 1}
                                    </div>
                                    <div className="flex-grow">
                                        <p className="font-semibold text-slate-700 dark:text-zinc-200 text-sm">{tech.name}</p>
                                        <p className="text-xs text-slate-400 dark:text-zinc-500 font-medium">{tech.completed} Projects</p>
                                    </div>
                                    {index === 0 && <TrophyIcon className="w-5 h-5 text-yellow-500 animate-pulse" />}
                                </div>
                            ))}
                            {technicianPerformance.length === 0 && <p className="text-center text-slate-400 py-6 text-sm">No completed projects yet.</p>}
                        </div>
                    </SectionContainer>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;