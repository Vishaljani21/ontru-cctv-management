import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import type { SupportTicket, TicketCategory, TicketPriority } from '../types';
import Modal from '../components/Modal';
import { PlusIcon, RefreshIcon, ChatbotIcon } from '../components/icons';
import StatsCard from '../components/StatsCard';

const SupportPage: React.FC = () => {
    const [tickets, setTickets] = useState<SupportTicket[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form State
    const [subject, setSubject] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState<TicketCategory>('general');
    const [priority, setPriority] = useState<TicketPriority>('medium');

    useEffect(() => {
        fetchTickets();
    }, []);

    const fetchTickets = async () => {
        setLoading(true);
        try {
            const data = await api.getTickets();
            setTickets(data);
        } catch (error) {
            console.error("Failed to fetch tickets", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await api.createTicket({
                subject,
                description,
                category,
                priority
            });
            await fetchTickets();
            setIsModalOpen(false);
            resetForm();
        } catch (error) {
            console.error("Failed to create ticket", error);
            alert("Failed to create ticket. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const resetForm = () => {
        setSubject('');
        setDescription('');
        setCategory('general');
        setPriority('medium');
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'open': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
            case 'in_progress': return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400';
            case 'resolved': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400';
            case 'closed': return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400';
            default: return 'bg-slate-100 text-slate-700';
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'critical': return 'text-red-600 font-bold';
            case 'high': return 'text-orange-600 font-bold';
            case 'medium': return 'text-yellow-600';
            case 'low': return 'text-slate-500';
            default: return 'text-slate-500';
        }
    };

    return (
        <div className="space-y-8 animate-fade-in-up pb-10">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-slate-800 dark:text-white tracking-tight">Support & Help</h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Raise tickets for issues or request new features.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl shadow-lg shadow-primary-500/20 transition-all hover:-translate-y-0.5"
                >
                    <PlusIcon className="w-5 h-5" />
                    Create Ticket
                </button>
            </div>

            {/* Ticket Guidelines / Info potentially here */}

            {/* Tickets List */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                    <h3 className="font-bold text-lg text-slate-800 dark:text-white">my Tickets</h3>
                    <button onClick={fetchTickets} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors text-slate-500">
                        <RefreshIcon className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                </div>

                {tickets.length > 0 ? (
                    <div className="divide-y divide-slate-100 dark:divide-slate-800">
                        {tickets.map(ticket => (
                            <div key={ticket.id} className="p-6 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                <div className="flex flex-col sm:flex-row justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${getStatusColor(ticket.status)}`}>
                                                {ticket.status.replace('_', ' ')}
                                            </span>
                                            <span className={`text-xs font-bold uppercase tracking-wide ${getPriorityColor(ticket.priority)}`}>
                                                {ticket.priority} Priority
                                            </span>
                                            <span className="text-xs text-slate-400">
                                                #{ticket.id.slice(0, 8)}
                                            </span>
                                        </div>
                                        <h4 className="text-lg font-bold text-slate-800 dark:text-white mb-1">{ticket.subject}</h4>
                                        <p className="text-slate-600 dark:text-slate-300 text-sm line-clamp-2">{ticket.description}</p>
                                        <div className="flex items-center gap-4 mt-3 text-xs text-slate-500 dark:text-slate-400">
                                            <span>Category: <span className="font-medium capitalize text-slate-700 dark:text-slate-200">{ticket.category.replace('_', ' ')}</span></span>
                                            <span>Created: {new Date(ticket.created_at).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                    {ticket.status === 'resolved' && (
                                        <div className="sm:self-center">
                                            <div className="px-4 py-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg text-emerald-700 dark:text-emerald-400 text-sm font-bold border border-emerald-100 dark:border-emerald-800/50">
                                                Resolved
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="p-12 text-center text-slate-500 dark:text-slate-400">
                        <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <ChatbotIcon className="w-8 h-8 text-slate-400" />
                        </div>
                        <p className="font-bold text-lg mb-1">No tickets found</p>
                        <p className="text-sm">You haven't created any support tickets yet.</p>
                    </div>
                )}
            </div>

            {/* Create Ticket Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Create Support Ticket"
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Subject</label>
                        <input
                            type="text"
                            required
                            value={subject}
                            onChange={e => setSubject(e.target.value)}
                            className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:outline-none"
                            placeholder="Brief summary of the issue"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Category</label>
                            <select
                                value={category}
                                onChange={e => setCategory(e.target.value as TicketCategory)}
                                className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:outline-none"
                            >
                                <option value="general">General</option>
                                <option value="issue">Technical Issue</option>
                                <option value="feature_request">Feature Request</option>
                                <option value="billing">Billing & Subscription</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Priority</label>
                            <select
                                value={priority}
                                onChange={e => setPriority(e.target.value as TicketPriority)}
                                className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:outline-none"
                            >
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                                <option value="critical">Critical</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Description</label>
                        <textarea
                            required
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            rows={4}
                            className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:outline-none"
                            placeholder="Detailed description..."
                        />
                    </div>

                    <div className="pt-4 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={() => setIsModalOpen(false)}
                            className="px-4 py-2 text-slate-600 dark:text-slate-400 font-bold hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-lg shadow-lg shadow-primary-500/20 transition-all flex items-center"
                        >
                            {isSubmitting ? <RefreshIcon className="w-5 h-5 animate-spin" /> : 'Submit Ticket'}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default SupportPage;
