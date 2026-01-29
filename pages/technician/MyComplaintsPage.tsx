import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Complaint } from '../../types';
import PageHeader from '../../components/PageHeader';
import { MagnifyingGlassIcon } from '../../components/icons';
import { Link } from 'react-router-dom';

const MyComplaintsPage: React.FC = () => {
    const [complaints, setComplaints] = useState<Complaint[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState<string>('');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        loadComplaints();
    }, [filterStatus]);

    const loadComplaints = async () => {
        setLoading(true);
        try {
            // RLS ensures technicians only see their assigned complaints
            const data = await api.getComplaints(filterStatus ? { status: filterStatus } : undefined);
            setComplaints(data);
        } catch (error) {
            console.error("Failed to load complaints", error);
        } finally {
            setLoading(false);
        }
    };

    const filteredComplaints = complaints.filter(c =>
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.complaintId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.customerName?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Assigned': return 'bg-violet-100 text-violet-700 border-violet-300 dark:bg-violet-900/30 dark:text-violet-400 dark:border-violet-700';
            case 'In Progress': return 'bg-amber-100 text-amber-700 border-amber-300 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-700';
            case 'Resolved': return 'bg-emerald-100 text-emerald-700 border-emerald-300 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-700';
            default: return 'bg-slate-100 text-slate-600 border-slate-300';
        }
    };

    // Card border color based on status
    const getCardBorderColor = (status: string) => {
        switch (status) {
            case 'Assigned': return 'border-l-violet-500';
            case 'In Progress': return 'border-l-amber-500';
            case 'Resolved': return 'border-l-emerald-500';
            default: return 'border-l-slate-400';
        }
    };

    // Card background tint based on status
    const getCardBackground = (status: string) => {
        switch (status) {
            case 'Resolved': return 'bg-gradient-to-r from-emerald-50 to-white dark:from-emerald-900/10 dark:to-slate-900';
            case 'In Progress': return 'bg-gradient-to-r from-amber-50 to-white dark:from-amber-900/10 dark:to-slate-900';
            case 'Assigned': return 'bg-gradient-to-r from-violet-50 to-white dark:from-violet-900/10 dark:to-slate-900';
            default: return 'bg-white dark:bg-slate-900';
        }
    };

    return (
        <div className="space-y-6">
            <PageHeader
                title="My Tickets"
                description="View and manage your assigned service tickets."
            />

            {/* Filter Bar */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-white/5 flex flex-col md:flex-row gap-4 justify-between items-center">
                <div className="relative w-full md:w-96">
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search tickets..."
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-black rounded-xl border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex gap-2 w-full md:w-auto overflow-x-auto">
                    {['', 'Assigned', 'In Progress', 'Resolved'].map((status) => (
                        <button
                            key={status}
                            onClick={() => setFilterStatus(status)}
                            className={`px-4 py-2 text-xs font-bold rounded-lg whitespace-nowrap transition-colors ${filterStatus === status
                                ? 'bg-primary-600 text-white'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                                }`}
                        >
                            {status || 'All'}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content List */}
            {loading ? (
                <div className="text-center py-20 text-slate-400 font-medium">Loading tickets...</div>
            ) : filteredComplaints.length === 0 ? (
                <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-200">
                    <p className="text-slate-500 font-bold">No tickets found.</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {filteredComplaints.map(complaint => (
                        <Link
                            to={`/complaints/${complaint.id}`}
                            key={complaint.id}
                            className={`group block rounded-2xl p-5 border-l-4 border border-slate-100 dark:border-slate-800 hover:border-primary-500 hover:shadow-lg hover:shadow-primary-500/10 transition-all duration-300 ${getCardBorderColor(complaint.status)} ${getCardBackground(complaint.status)}`}
                        >
                            <div className="flex flex-col md:flex-row justify-between gap-4">
                                <div className="flex-1">
                                    <div className="flex flex-wrap items-center gap-3 mb-2">
                                        <span className="text-xs font-bold text-slate-500 dark:text-slate-400 font-mono tracking-wider bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">{complaint.complaintId}</span>
                                        <span className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase border ${getStatusColor(complaint.status)}`}>
                                            {complaint.status}
                                        </span>
                                        {complaint.priority === 'Urgent' && (
                                            <span className="px-2.5 py-1 rounded-full bg-red-100 text-red-600 text-[11px] font-bold uppercase border border-red-300 animate-pulse">🔥 Urgent</span>
                                        )}
                                        {complaint.priority === 'High' && (
                                            <span className="px-2.5 py-1 rounded-full bg-orange-100 text-orange-600 text-[11px] font-bold uppercase border border-orange-300">High</span>
                                        )}
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-800 dark:text-white group-hover:text-primary-600 transition-colors mb-2 leading-snug">
                                        {complaint.title}
                                    </h3>
                                    <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">{complaint.siteAddress}, {complaint.siteCity}</p>

                                    <div className="mt-4 flex flex-wrap items-center gap-4 text-xs font-medium text-slate-500">
                                        <span className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-lg">
                                            <span className="w-5 h-5 rounded-md bg-primary-100 text-primary-600 flex items-center justify-center font-bold text-xs">👤</span>
                                            {complaint.customerName}
                                        </span>
                                        <span className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-lg">
                                            <span>📅</span> {new Date(complaint.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyComplaintsPage;
