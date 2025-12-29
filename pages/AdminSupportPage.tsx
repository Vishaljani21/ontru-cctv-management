import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import type { SupportTicket, TicketStatus } from '../types';
import {
    SearchIcon,
    FilterIcon,
    RefreshIcon,
    ChatbotIcon,
    CheckCircleIcon,
    AlertTriangleIcon,
    UserIcon
} from '../components/icons';
import CustomSelect from '../components/CustomSelect';
import StatsCard from '../components/StatsCard';

const AdminSupportPage: React.FC = () => {
    const [tickets, setTickets] = useState<SupportTicket[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');

    // Updating state
    const [updatingId, setUpdatingId] = useState<string | null>(null);

    useEffect(() => {
        fetchTickets();
    }, []);

    const fetchTickets = async () => {
        setLoading(true);
        try {
            const data = await api.getAllTickets();
            setTickets(data);
        } catch (error) {
            console.error("Failed to fetch tickets", error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (id: string, newStatus: TicketStatus) => {
        setUpdatingId(id);
        try {
            await api.updateTicket(id, { status: newStatus });
            // Update local state to reflect change immediately or refetch
            setTickets(prev => prev.map(t => t.id === id ? { ...t, status: newStatus } : t));
        } catch (error) {
            console.error("Failed to update ticket", error);
            alert("Failed to update status");
        } finally {
            setUpdatingId(null);
        }
    };

    // Derived Stats
    const totalTickets = tickets.length;
    const openTickets = tickets.filter(t => t.status === 'open').length;
    const resolvedTickets = tickets.filter(t => t.status === 'resolved' || t.status === 'closed').length;
    const highPriority = tickets.filter(t => t.priority === 'high' || t.priority === 'critical').length;

    const filteredTickets = tickets.filter(ticket => {
        const matchesSearch =
            ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (ticket.user_email && ticket.user_email.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (ticket.company_name && ticket.company_name.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesFilter = statusFilter === 'all' || ticket.status === statusFilter;

        return matchesSearch && matchesFilter;
    });

    const statusOptions = [
        { value: 'all', label: 'All Status' },
        { value: 'open', label: 'Open' },
        { value: 'in_progress', label: 'In Progress' },
        { value: 'resolved', label: 'Resolved' },
        { value: 'closed', label: 'Closed' }
    ];

    const getStatusBadgeColor = (status: string) => {
        switch (status) {
            case 'open': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'in_progress': return 'bg-orange-100 text-orange-700 border-orange-200';
            case 'resolved': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
            case 'closed': return 'bg-slate-100 text-slate-700 border-slate-200';
            default: return 'bg-slate-100 text-slate-700';
        }
    };

    return (
        <div className="space-y-8 animate-fade-in-up pb-10">
            <div>
                <h2 className="text-3xl font-bold text-slate-800 dark:text-white tracking-tight">Support Management</h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Manage and resolve user support tickets.</p>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatsCard
                    title="Total Tickets"
                    value={totalTickets}
                    icon={<ChatbotIcon />}
                    gradient="blue"
                />
                <StatsCard
                    title="Open Issues"
                    value={openTickets}
                    icon={<AlertTriangleIcon />}
                    gradient="red"
                />
                <StatsCard
                    title="Resolved"
                    value={resolvedTickets}
                    icon={<CheckCircleIcon />}
                    gradient="teal"
                />
                <StatsCard
                    title="High Priority"
                    value={highPriority}
                    icon={<AlertTriangleIcon />}
                    gradient="red"
                />
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden flex flex-col h-[600px]">
                {/* Toolbar */}
                <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
                    <div className="flex items-center gap-2">
                        <h3 className="font-bold text-slate-800 dark:text-white">All Tickets</h3>
                        <span className="px-2 py-0.5 rounded-md bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-bold">
                            {filteredTickets.length}
                        </span>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto items-center">
                        <div className="w-full sm:w-48 z-20">
                            <CustomSelect
                                options={statusOptions}
                                value={statusFilter}
                                onChange={setStatusFilter}
                                placeholder="Filter Status"
                            />
                        </div>

                        <div className="relative w-full sm:w-64">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <SearchIcon className="h-4 w-4 text-slate-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search subject or user..."
                                className="block w-full pl-9 pr-3 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50 hover:border-slate-300 dark:hover:border-slate-600 transition-colors"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                <div className="overflow-auto flex-1">
                    <table className="min-w-full divide-y divide-slate-100 dark:divide-slate-800 relative">
                        <thead className="bg-slate-50 dark:bg-slate-800/50 sticky top-0 z-10 backdrop-blur-sm">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Ticket</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">User / Company</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Priority</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Created</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-slate-900 divide-y divide-slate-100 dark:divide-slate-800">
                            {filteredTickets.length > 0 ? (
                                filteredTickets.map((ticket) => (
                                    <tr key={ticket.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col max-w-md">
                                                <span className="font-bold text-slate-800 dark:text-white mb-1">{ticket.subject}</span>
                                                <span className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">{ticket.description}</span>
                                                <span className="text-[10px] uppercase font-bold text-slate-400 mt-1 tracking-wide">{ticket.category}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 mr-3">
                                                    <UserIcon className="w-4 h-4" />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-sm text-slate-800 dark:text-white">{ticket.company_name || 'Unknown'}</p>
                                                    <p className="text-xs text-slate-500 dark:text-slate-400">{ticket.user_email || 'No email'}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`text-xs font-bold uppercase tracking-wide 
                                                ${ticket.priority === 'critical' ? 'text-red-600' :
                                                    ticket.priority === 'high' ? 'text-orange-600' :
                                                        ticket.priority === 'medium' ? 'text-yellow-600' : 'text-slate-500'}`}>
                                                {ticket.priority}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                            {new Date(ticket.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <select
                                                value={ticket.status}
                                                onChange={(e) => handleStatusUpdate(ticket.id, e.target.value as TicketStatus)}
                                                disabled={updatingId === ticket.id}
                                                className={`text-xs font-bold uppercase tracking-wide px-2 py-1 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary-500 cursor-pointer transition-colors ${getStatusBadgeColor(ticket.status)} ${updatingId === ticket.id ? 'opacity-50' : ''}`}
                                            >
                                                <option value="open">Open</option>
                                                <option value="in_progress">In Progress</option>
                                                <option value="resolved">Resolved</option>
                                                <option value="closed">Closed</option>
                                            </select>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="px-6 py-24 text-center">
                                        <p className="text-slate-500 dark:text-slate-400">No tickets found.</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminSupportPage;
