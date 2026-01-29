import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Complaint } from '../types';
import PageHeader from '../components/PageHeader';
import { PlusIcon, FunnelIcon, MagnifyingGlassIcon } from '../components/icons';
import { Link } from 'react-router-dom';
import ComplaintFormModal from '../components/ComplaintFormModal';

const ComplaintsPage: React.FC = () => {
    const [complaints, setComplaints] = useState<Complaint[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState<string>('');
    const [searchQuery, setSearchQuery] = useState('');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    useEffect(() => {
        loadComplaints();
    }, [filterStatus]);

    const loadComplaints = async () => {
        setLoading(true);
        try {
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
            case 'New': return 'bg-blue-100 text-blue-700 border-blue-300 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-700';
            case 'Assigned': return 'bg-violet-100 text-violet-700 border-violet-300 dark:bg-violet-900/30 dark:text-violet-400 dark:border-violet-700';
            case 'In Progress': return 'bg-amber-100 text-amber-700 border-amber-300 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-700';
            case 'Resolved': return 'bg-emerald-100 text-emerald-700 border-emerald-300 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-700';
            case 'Closed': return 'bg-slate-200 text-slate-700 border-slate-400 dark:bg-slate-700 dark:text-slate-300 dark:border-slate-600';
            case 'Cancelled': return 'bg-red-100 text-red-600 border-red-300 dark:bg-red-900/30 dark:text-red-400 dark:border-red-700';
            default: return 'bg-slate-100 text-slate-600 border-slate-300';
        }
    };

    // Card border color based on status
    const getCardBorderColor = (status: string) => {
        switch (status) {
            case 'New': return 'border-l-blue-500';
            case 'Assigned': return 'border-l-violet-500';
            case 'In Progress': return 'border-l-amber-500';
            case 'Resolved': return 'border-l-emerald-500';
            case 'Closed': return 'border-l-slate-500';
            case 'Cancelled': return 'border-l-red-500';
            default: return 'border-l-slate-400';
        }
    };

    // Card background tint based on status
    const getCardBackground = (status: string) => {
        switch (status) {
            case 'Resolved': return 'bg-gradient-to-r from-emerald-50 to-white dark:from-emerald-900/10 dark:to-slate-900';
            case 'In Progress': return 'bg-gradient-to-r from-amber-50 to-white dark:from-amber-900/10 dark:to-slate-900';
            case 'New': return 'bg-gradient-to-r from-blue-50 to-white dark:from-blue-900/10 dark:to-slate-900';
            case 'Assigned': return 'bg-gradient-to-r from-violet-50 to-white dark:from-violet-900/10 dark:to-slate-900';
            default: return 'bg-white dark:bg-slate-900';
        }
    };

    const getPriorityIcon = (priority: string) => {
        switch (priority) {
            case 'Urgent': return <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />;
            case 'High': return <span className="w-2 h-2 rounded-full bg-orange-500" />;
            case 'Normal': return <span className="w-2 h-2 rounded-full bg-primary-500" />;
            default: return <span className="w-2 h-2 rounded-full bg-slate-400" />;
        }
    };

    return (
        <div className="space-y-6">
            <PageHeader
                title="Service Complaints"
                description="Manage customer tickets, assignments, and resolution status."
                action={
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="flex items-center justify-center px-5 py-2.5 text-sm font-bold text-white bg-primary-600 hover:bg-primary-500 rounded-xl shadow-lg shadow-primary-500/30 transition-all hover:-translate-y-0.5 gap-2">
                        <PlusIcon className="w-4 h-4" />
                        <span>New Complaint</span>
                    </button>
                }
            >
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 text-center border border-white/5">
                        <p className="text-3xl font-bold text-white">{complaints.length}</p>
                        <p className="text-xs text-primary-200 font-bold uppercase tracking-widest mt-1">Total</p>
                    </div>
                    <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 text-center border border-white/5">
                        <p className="text-3xl font-bold text-amber-400">{complaints.filter(c => c.status === 'New' || c.status === 'Assigned').length}</p>
                        <p className="text-xs text-amber-200 font-bold uppercase tracking-widest mt-1">Open</p>
                    </div>
                    <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 text-center border border-white/5">
                        <p className="text-3xl font-bold text-emerald-400">{complaints.filter(c => c.status === 'Resolved').length}</p>
                        <p className="text-xs text-emerald-200 font-bold uppercase tracking-widest mt-1">Resolved</p>
                    </div>
                    <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 text-center border border-white/5">
                        <p className="text-3xl font-bold text-red-400">{complaints.filter(c => c.priority === 'Urgent').length}</p>
                        <p className="text-xs text-red-200 font-bold uppercase tracking-widest mt-1">Urgent</p>
                    </div>
                </div>
            </PageHeader>

            {/* Filter Bar */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-white/5 flex flex-col md:flex-row gap-4 justify-between items-center">
                <div className="relative w-full md:w-96">
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search complaints, customers..."
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-black rounded-xl border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex gap-2 w-full md:w-auto overflow-x-auto">
                    {['', 'New', 'Assigned', 'In Progress', 'Resolved'].map((status) => (
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
                <div className="text-center py-20 text-slate-400 font-medium">Loading complaints...</div>
            ) : filteredComplaints.length === 0 ? (
                <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-200">
                    <p className="text-slate-500 font-bold">No complaints found matching your filters.</p>
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
                                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-[11px] font-bold text-slate-600 dark:text-slate-300">
                                            {getPriorityIcon(complaint.priority)}
                                            {complaint.priority}
                                        </div>
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-800 dark:text-white group-hover:text-primary-600 transition-colors mb-2 leading-snug">
                                        {complaint.title}
                                    </h3>
                                    <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">{complaint.description}</p>

                                    <div className="mt-4 flex flex-wrap items-center gap-4 text-xs font-medium text-slate-500">
                                        <span className="flex items-center gap-1">
                                            <span className="w-5 h-5 rounded-md bg-primary-50 text-primary-600 flex items-center justify-center font-bold">C</span>
                                            {complaint.customerName}
                                        </span>
                                        {complaint.siteCity && (
                                            <span className="flex items-center gap-1">
                                                <span>📍</span> {complaint.siteCity}
                                            </span>
                                        )}
                                        <span className="flex items-center gap-1">
                                            <span>📅</span> {new Date(complaint.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex md:flex-col items-center md:items-end justify-between md:justify-center gap-2 min-w-[140px] border-t md:border-t-0 md:border-l border-slate-100 dark:border-slate-800 pt-4 md:pt-0 md:pl-6">
                                    <div className="text-right">
                                        <span className="block text-[10px] uppercase font-bold text-slate-400">Category</span>
                                        <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{complaint.category}</span>
                                    </div>
                                    <div className="text-right mt-2">
                                        <span className="block text-[10px] uppercase font-bold text-slate-400">Assigned To</span>
                                        {complaint.assignedTechnician ? (
                                            <span className="text-sm font-bold text-primary-600 flex items-center gap-1 justify-end">
                                                👤 {complaint.assignedTechnician.name}
                                            </span>
                                        ) : (
                                            <span className="text-sm font-bold text-slate-400 italic">Unassigned</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}

            <ComplaintFormModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSuccess={loadComplaints}
            />
        </div>
    );
};

export default ComplaintsPage;
