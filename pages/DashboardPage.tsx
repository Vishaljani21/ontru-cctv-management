import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Complaint, ComplaintStats } from '../types';
import { api } from '../services/api';
import { ClipboardDocumentListIcon, AlertTriangleIcon, CheckCircleIcon, CalendarIcon, ChevronRightIcon } from '../components/icons';
import StatsCard from '../components/StatsCard';

// Premium Section Container
const SectionContainer: React.FC<{ title: string; children: React.ReactNode; action?: React.ReactNode }> = ({ title, children, action }) => (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col h-full transition-all duration-300 hover:shadow-lg hover:border-primary-200 dark:hover:border-primary-800">
        <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/30">
            <h3 className="font-bold text-slate-800 dark:text-white text-base tracking-tight flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary-500"></span>
                {title}
            </h3>
            {action}
        </div>
        <div className="p-6 flex-grow flex flex-col">
            {children}
        </div>
    </div>
);


const DashboardPage: React.FC = () => {
    const [stats, setStats] = useState<ComplaintStats | null>(null);
    const [recentComplaints, setRecentComplaints] = useState<Complaint[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statsData, complaintsData] = await Promise.all([
                    api.getComplaintStats().catch(() => ({ total: 0, open: 0, resolved: 0, todayVisits: 0 })),
                    api.getComplaints({}).catch(() => [])
                ]);
                setStats(statsData);
                setRecentComplaints(complaintsData.slice(0, 5));
            } catch (error) {
                console.error("Failed to fetch dashboard data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const getStatusStyles = (status: string) => {
        switch (status) {
            case 'New': return 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400';
            case 'Assigned': return 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400';
            case 'In Progress': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
            case 'Resolved': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400';
            default: return 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400';
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
                    <p className="text-slate-500 font-medium">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-fade-in pb-10 max-w-7xl mx-auto">
            {/* Premium Hero Header */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 dark:from-black dark:via-slate-900 dark:to-black p-8 md:p-10 shadow-2xl">
                {/* Background decoration */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-violet-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
                <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>

                <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-full mb-4">
                            <span className="w-2 h-2 rounded-full bg-primary-400 animate-pulse"></span>
                            <span className="text-xs font-bold text-primary-300 uppercase tracking-wider">Live Dashboard</span>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-2">Service Dashboard</h2>
                        <p className="text-slate-400 text-base">Manage your complaints, visits, and service operations.</p>
                    </div>

                    <Link
                        to="/complaints"
                        className="inline-flex items-center justify-center px-6 py-3 text-sm font-bold text-white bg-primary-600 hover:bg-primary-500 rounded-xl shadow-lg shadow-primary-500/30 transition-all hover:-translate-y-0.5 hover:shadow-primary-500/40 gap-2"
                    >
                        <span>+ New Complaint</span>
                        <ChevronRightIcon className="w-4 h-4" />
                    </Link>
                </div>
            </div>

            {/* Stats Cards - Overlapping hero */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 -mt-8 relative z-20">
                <StatsCard title="Total Complaints" value={stats?.total || 0} icon={<ClipboardDocumentListIcon />} gradient="teal" />
                <StatsCard title="Open Tickets" value={stats?.open || 0} icon={<AlertTriangleIcon />} gradient="red" />
                <StatsCard title="Resolved" value={stats?.resolved || 0} icon={<CheckCircleIcon />} gradient="teal" />
                <StatsCard title="Today's Visits" value={stats?.todayVisits || 0} icon={<CalendarIcon />} gradient="purple" />
            </div>

            {/* Recent Complaints Table */}
            <SectionContainer
                title="Recent Complaints"
                action={
                    <Link to="/complaints" className="text-xs font-bold text-primary-600 hover:text-primary-500 transition-colors uppercase tracking-wider">
                        View All →
                    </Link>
                }
            >
                {recentComplaints.length > 0 ? (
                    <div className="overflow-x-auto -mx-6 -my-2">
                        <table className="min-w-full">
                            <thead>
                                <tr className="border-b border-slate-100 dark:border-slate-800">
                                    <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">Ticket ID</th>
                                    <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">Customer</th>
                                    <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">Issue</th>
                                    <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                                {recentComplaints.map(c => (
                                    <tr key={c.id} className="hover:bg-primary-50/50 dark:hover:bg-primary-900/10 transition-colors group cursor-pointer">
                                        <td className="px-6 py-4">
                                            <Link to={`/complaints/${c.id}`} className="font-bold text-slate-800 dark:text-white group-hover:text-primary-600 transition-colors">
                                                {c.complaintId}
                                            </Link>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400 font-bold text-xs">
                                                    {(c.customerName || 'C').charAt(0).toUpperCase()}
                                                </div>
                                                <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{c.customerName}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-500 max-w-xs truncate">{c.title}</td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase ${getStatusStyles(c.status)}`}>
                                                {c.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-2xl">📋</span>
                        </div>
                        <p className="text-slate-500 font-medium">No complaints yet</p>
                        <p className="text-slate-400 text-sm mt-1">Create your first complaint to get started</p>
                    </div>
                )}
            </SectionContainer>
        </div>
    );
};

export default DashboardPage;