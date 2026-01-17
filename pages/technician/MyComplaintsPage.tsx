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
            case 'Assigned': return 'bg-primary-100 text-primary-700 border-primary-200';
            case 'In Progress': return 'bg-amber-100 text-amber-700 border-amber-200';
            case 'Resolved': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
            default: return 'bg-slate-100 text-slate-600';
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
                            to={`/complaints/${complaint.id}`} // Reusing the detail page
                            key={complaint.id}
                            className="group block bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-100 dark:border-slate-800 hover:border-primary-500 hover:shadow-lg transition-all duration-300"
                        >
                            <div className="flex flex-col md:flex-row justify-between gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="text-xs font-bold text-slate-400 font-mono tracking-wider">{complaint.complaintId}</span>
                                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${getStatusColor(complaint.status)}`}>
                                            {complaint.status}
                                        </span>
                                        {complaint.priority === 'Urgent' && (
                                            <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-600 text-[10px] font-bold uppercase border border-red-200">Urgent</span>
                                        )}
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-800 dark:text-white group-hover:text-primary-600 transition-colors mb-1">
                                        {complaint.title}
                                    </h3>
                                    <p className="text-sm text-slate-500 line-clamp-1">{complaint.siteAddress}, {complaint.siteCity}</p>

                                    <div className="mt-4 flex flex-wrap items-center gap-4 text-xs font-medium text-slate-500">
                                        <span className="flex items-center gap-1">
                                            <span className="w-5 h-5 rounded-md bg-primary-50 text-primary-600 flex items-center justify-center font-bold">C</span>
                                            {complaint.customerName}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <span>📅</span> {new Date(complaint.createdAt).toLocaleDateString()}
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
