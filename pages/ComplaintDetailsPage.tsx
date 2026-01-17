import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { Complaint, ComplaintHistory, ComplaintNote, ComplaintStatus, Technician } from '../types';
import { ClockIcon, MapPinIcon, UserIcon, PhoneIcon, ChevronRightIcon } from '../components/icons';
import { AuthContext } from '../components/contexts';
import Modal from '../components/Modal';

const ComplaintDetailsPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const authContext = useContext(AuthContext);
    const [complaint, setComplaint] = useState<Complaint | null>(null);
    const [history, setHistory] = useState<ComplaintHistory[]>([]);
    const [notes, setNotes] = useState<ComplaintNote[]>([]);
    const [activeTab, setActiveTab] = useState('overview');
    const [loading, setLoading] = useState(true);
    const [newNote, setNewNote] = useState('');
    const [submittingNote, setSubmittingNote] = useState(false);
    const [statusUpdating, setStatusUpdating] = useState(false);
    const [showActionsMenu, setShowActionsMenu] = useState(false);
    const [showAssignModal, setShowAssignModal] = useState(false);
    const [technicians, setTechnicians] = useState<Technician[]>([]);
    const [selectedTechnicianId, setSelectedTechnicianId] = useState<number | null>(null);
    const [assigningTechnician, setAssigningTechnician] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editForm, setEditForm] = useState({ title: '', description: '', category: '', priority: '' });
    const [savingEdit, setSavingEdit] = useState(false);

    const isTechnician = authContext?.user?.role === 'technician';

    useEffect(() => {
        if (id) {
            loadComplaint(parseInt(id));
        }
    }, [id]);

    const loadComplaint = async (complaintId: number) => {
        try {
            const data = await api.getComplaintById(complaintId);
            setComplaint(data);
            const historyData = await api.getComplaintHistory(complaintId);
            setHistory(historyData);
            const notesData = await api.getComplaintNotes(complaintId);
            setNotes(notesData);
        } catch (error) {
            console.error("Failed to load complaint details", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddNote = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newNote.trim() || !id) return;

        setSubmittingNote(true);
        try {
            await api.addComplaintNote(parseInt(id), newNote.trim());
            setNewNote('');
            const notesData = await api.getComplaintNotes(parseInt(id));
            setNotes(notesData);
        } catch (error) {
            console.error("Failed to add note", error);
        } finally {
            setSubmittingNote(false);
        }
    };

    const handleStatusUpdate = async (newStatus: ComplaintStatus) => {
        if (!id || !complaint) return;
        setStatusUpdating(true);
        try {
            await api.updateComplaintStatus(parseInt(id), newStatus, "Status updated from details page");
            loadComplaint(parseInt(id));
        } catch (error) {
            console.error("Failed to update status", error);
        } finally {
            setStatusUpdating(false);
        }
    };

    const openAssignModal = async () => {
        setShowActionsMenu(false);
        try {
            const techList = await api.getTechnicians();
            setTechnicians(techList);
            setSelectedTechnicianId(complaint?.assignedTechnician?.id || null);
            setShowAssignModal(true);
        } catch (error) {
            console.error("Failed to load technicians", error);
        }
    };

    const handleAssignTechnician = async () => {
        if (!id || !selectedTechnicianId) return;
        setAssigningTechnician(true);
        try {
            // api.assignTechnician already handles status update internally
            await api.assignTechnician(parseInt(id), selectedTechnicianId);
            loadComplaint(parseInt(id));
            setShowAssignModal(false);
        } catch (error: any) {
            console.error("Failed to assign technician", error);
            alert("Failed to assign technician: " + (error?.message || 'Unknown error'));
        } finally {
            setAssigningTechnician(false);
        }
    };

    const handleSaveEdit = async () => {
        if (!id) return;
        setSavingEdit(true);
        try {
            await api.updateComplaint(parseInt(id), {
                title: editForm.title,
                description: editForm.description,
                category: editForm.category as any,
                priority: editForm.priority as any
            });
            loadComplaint(parseInt(id));
            setShowEditModal(false);
        } catch (error: any) {
            console.error("Failed to update complaint", error);
            alert("Failed to update complaint: " + (error?.message || 'Unknown error'));
        } finally {
            setSavingEdit(false);
        }
    };

    const handleRemoveAssignment = async () => {
        if (!id) return;
        if (!confirm('Are you sure you want to remove the technician assignment?')) return;

        try {
            await api.removeAssignment(parseInt(id));
            loadComplaint(parseInt(id));
        } catch (error: any) {
            console.error("Failed to remove assignment", error);
            alert("Failed to remove assignment: " + (error?.message || 'Unknown error'));
        }
    };

    const getStatusStyles = (status: string) => {
        switch (status) {
            case 'New': return 'bg-primary-100 text-primary-700 border-primary-200 dark:bg-primary-900/30 dark:text-primary-400 dark:border-primary-800';
            case 'Assigned': return 'bg-violet-100 text-violet-700 border-violet-200 dark:bg-violet-900/30 dark:text-violet-400 dark:border-violet-800';
            case 'In Progress': return 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800';
            case 'Resolved': return 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800';
            default: return 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700';
        }
    };

    const getPriorityStyles = (priority: string) => {
        switch (priority) {
            case 'Urgent': return 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400';
            case 'High': return 'bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400';
            default: return 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400';
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-[400px]">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
                <p className="text-slate-500 font-medium">Loading ticket details...</p>
            </div>
        </div>
    );

    if (!complaint) return (
        <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">❌</span>
                </div>
                <p className="text-slate-600 font-medium">Complaint not found</p>
            </div>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
            {/* Technician Assignment Modal */}
            {showAssignModal && (
                <Modal isOpen={true} title="Assign Technician" onClose={() => setShowAssignModal(false)}>
                    <div className="space-y-4">
                        <p className="text-sm text-slate-500">Select a technician to assign to this complaint:</p>

                        <div className="space-y-2 max-h-64 overflow-y-auto">
                            {technicians.length > 0 ? technicians.map(tech => (
                                <button
                                    key={tech.id}
                                    onClick={() => setSelectedTechnicianId(tech.id)}
                                    className={`w-full p-4 rounded-xl border-2 transition-all text-left flex items-center gap-4 ${selectedTechnicianId === tech.id
                                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                                        : 'border-slate-200 dark:border-slate-700 hover:border-primary-300'
                                        }`}
                                >
                                    <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center text-primary-600 dark:text-primary-400 font-bold">
                                        {tech.name?.charAt(0).toUpperCase() || 'T'}
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-bold text-slate-800 dark:text-white">{tech.name}</p>
                                        <p className="text-sm text-slate-500">{tech.phone || 'No phone'}</p>
                                    </div>
                                    {selectedTechnicianId === tech.id && (
                                        <span className="text-primary-600 text-lg">✓</span>
                                    )}
                                </button>
                            )) : (
                                <div className="text-center py-8 text-slate-500">
                                    <p>No technicians available</p>
                                </div>
                            )}
                        </div>

                        <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
                            <button
                                onClick={() => setShowAssignModal(false)}
                                className="px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 rounded-xl transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAssignTechnician}
                                disabled={!selectedTechnicianId || assigningTechnician}
                                className="px-5 py-2.5 text-sm font-bold text-white bg-primary-600 hover:bg-primary-500 rounded-xl shadow-lg shadow-primary-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {assigningTechnician ? 'Assigning...' : 'Assign Technician'}
                            </button>
                        </div>
                    </div>
                </Modal>
            )}

            {/* Edit Details Modal */}
            {showEditModal && (
                <Modal isOpen={true} title="Edit Complaint Details" onClose={() => setShowEditModal(false)}>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Title</label>
                            <input
                                type="text"
                                value={editForm.title}
                                onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Category</label>
                                <select
                                    value={editForm.category}
                                    onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500"
                                >
                                    <option value="No Video">No Video</option>
                                    <option value="No Power">No Power</option>
                                    <option value="DVR/NVR Issue">DVR/NVR Issue</option>
                                    <option value="Camera Fault">Camera Fault</option>
                                    <option value="HDD Issue">HDD Issue</option>
                                    <option value="Network Issue">Network Issue</option>
                                    <option value="Mobile App Remote View">Mobile App Remote View</option>
                                    <option value="Cable/Connector">Cable/Connector</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Priority</label>
                                <select
                                    value={editForm.priority}
                                    onChange={(e) => setEditForm({ ...editForm, priority: e.target.value })}
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500"
                                >
                                    <option value="Low">Low</option>
                                    <option value="Normal">Normal</option>
                                    <option value="High">High</option>
                                    <option value="Urgent">Urgent</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Description</label>
                            <textarea
                                value={editForm.description}
                                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                                rows={4}
                                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500"
                            />
                        </div>
                        <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
                            <button
                                onClick={() => setShowEditModal(false)}
                                className="px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 rounded-xl transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSaveEdit}
                                disabled={savingEdit}
                                className="px-5 py-2.5 text-sm font-bold text-white bg-primary-600 hover:bg-primary-500 rounded-xl shadow-lg shadow-primary-500/30 transition-all disabled:opacity-50"
                            >
                                {savingEdit ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </div>
                </Modal>
            )}

            {/* Premium Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm">
                <Link
                    to={isTechnician ? "/tech/my-complaints" : "/complaints"}
                    className="text-slate-500 hover:text-primary-600 transition-colors font-medium flex items-center gap-1"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    {isTechnician ? "My Tickets" : "Complaints"}
                </Link>
                <ChevronRightIcon className="w-4 h-4 text-slate-300" />
                <span className="text-slate-900 dark:text-white font-semibold">{complaint.complaintId}</span>
            </nav>

            {/* Hero Header Card */}
            <div className="relative rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 dark:from-black dark:via-slate-900 dark:to-black p-8 shadow-2xl">
                {/* Background decoration */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-violet-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

                <div className="relative z-10 flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                    <div className="flex-1">
                        {/* Ticket ID Badge */}
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-full mb-4">
                            <span className="w-2 h-2 rounded-full bg-primary-400 animate-pulse"></span>
                            <span className="text-xs font-bold text-primary-300 uppercase tracking-wider">{complaint.complaintId}</span>
                        </div>

                        {/* Title */}
                        <h1 className="text-3xl lg:text-4xl font-bold text-white mb-3 tracking-tight">
                            {complaint.title}
                        </h1>

                        {/* Meta info */}
                        <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400">
                            <span className="flex items-center gap-1.5">
                                <ClockIcon className="w-4 h-4" />
                                Created {new Date(complaint.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </span>
                            <span className="flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span>
                                {complaint.category}
                            </span>
                            <span className="flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span>
                                via {complaint.source}
                            </span>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap items-center gap-3">
                        {/* Status Badge */}
                        <span className={`px-4 py-2 rounded-xl text-sm font-bold border backdrop-blur-sm ${getStatusStyles(complaint.status)}`}>
                            {complaint.status}
                        </span>

                        {/* Priority Badge */}
                        <span className={`px-3 py-2 rounded-xl text-xs font-bold uppercase tracking-wide border ${getPriorityStyles(complaint.priority)}`}>
                            {complaint.priority}
                        </span>

                        {/* Action Buttons */}
                        {isTechnician && complaint.status !== 'Closed' && (
                            <>
                                {complaint.status === 'Assigned' && (
                                    <button
                                        onClick={() => handleStatusUpdate('In Progress')}
                                        disabled={statusUpdating}
                                        className="px-5 py-2.5 bg-primary-600 hover:bg-primary-500 text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-primary-500/30 hover:shadow-primary-500/40 hover:-translate-y-0.5 disabled:opacity-50"
                                    >
                                        ▶ Start Work
                                    </button>
                                )}
                                {complaint.status === 'In Progress' && (
                                    <button
                                        onClick={() => handleStatusUpdate('Resolved')}
                                        disabled={statusUpdating}
                                        className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/40 hover:-translate-y-0.5 disabled:opacity-50"
                                    >
                                        ✓ Mark Resolved
                                    </button>
                                )}
                            </>
                        )}

                        {!isTechnician && complaint.status !== 'Closed' && (
                            <div className="relative z-50">
                                <button
                                    onClick={() => setShowActionsMenu(!showActionsMenu)}
                                    className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white text-sm font-bold rounded-xl transition-all backdrop-blur-sm border border-white/10 flex items-center gap-2"
                                >
                                    <span>Actions</span>
                                    <svg className={`w-4 h-4 transition-transform ${showActionsMenu ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>

                                {/* Dropdown Menu */}
                                {showActionsMenu && (
                                    <>
                                        {/* Backdrop to close menu */}
                                        <div
                                            className="fixed inset-0 z-40"
                                            onClick={() => setShowActionsMenu(false)}
                                        ></div>

                                        {/* Menu */}
                                        <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-100 dark:border-slate-700 z-50 overflow-hidden animate-fade-in">
                                            <div className="py-1">
                                                {/* Status Actions */}
                                                <div className="px-3 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                                                    Change Status
                                                </div>
                                                {complaint.status !== 'Assigned' && (
                                                    <button
                                                        onClick={() => { handleStatusUpdate('Assigned'); setShowActionsMenu(false); }}
                                                        disabled={statusUpdating}
                                                        className="w-full px-4 py-2.5 text-left text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-primary-50 dark:hover:bg-primary-900/20 flex items-center gap-3 transition-colors"
                                                    >
                                                        <span className="w-2 h-2 rounded-full bg-violet-500"></span>
                                                        Assigned
                                                    </button>
                                                )}
                                                {complaint.status !== 'In Progress' && (
                                                    <button
                                                        onClick={() => { handleStatusUpdate('In Progress'); setShowActionsMenu(false); }}
                                                        disabled={statusUpdating}
                                                        className="w-full px-4 py-2.5 text-left text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-primary-50 dark:hover:bg-primary-900/20 flex items-center gap-3 transition-colors"
                                                    >
                                                        <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                                                        In Progress
                                                    </button>
                                                )}
                                                {complaint.status !== 'Resolved' && (
                                                    <button
                                                        onClick={() => { handleStatusUpdate('Resolved'); setShowActionsMenu(false); }}
                                                        disabled={statusUpdating}
                                                        className="w-full px-4 py-2.5 text-left text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-primary-50 dark:hover:bg-primary-900/20 flex items-center gap-3 transition-colors"
                                                    >
                                                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                                                        Resolved
                                                    </button>
                                                )}

                                                <div className="h-px bg-slate-100 dark:bg-slate-700 my-1"></div>

                                                {/* Other Actions */}
                                                <div className="px-3 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                                                    More Actions
                                                </div>
                                                <button
                                                    onClick={openAssignModal}
                                                    className="w-full px-4 py-2.5 text-left text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-primary-50 dark:hover:bg-primary-900/20 flex items-center gap-3 transition-colors"
                                                >
                                                    <span>👤</span>
                                                    Assign Technician
                                                </button>
                                                <button
                                                    onClick={() => { setShowActionsMenu(false); setEditForm({ title: complaint.title, description: complaint.description || '', category: complaint.category, priority: complaint.priority }); setShowEditModal(true); }}
                                                    className="w-full px-4 py-2.5 text-left text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-primary-50 dark:hover:bg-primary-900/20 flex items-center gap-3 transition-colors"
                                                >
                                                    <span>✏️</span>
                                                    Edit Details
                                                </button>
                                                <button
                                                    onClick={() => { handleStatusUpdate('Closed'); setShowActionsMenu(false); }}
                                                    disabled={statusUpdating}
                                                    className="w-full px-4 py-2.5 text-left text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-3 transition-colors"
                                                >
                                                    <span>🚫</span>
                                                    Close Ticket
                                                </button>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Premium Tabs */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl p-1.5 shadow-sm border border-slate-100 dark:border-slate-800 inline-flex gap-1">
                        {[
                            { id: 'overview', label: 'Overview', icon: '📋' },
                            { id: 'technician_updates', label: 'Updates', icon: '💬' },
                            { id: 'timeline', label: 'Timeline', icon: '📅' }
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-5 py-2.5 text-sm font-semibold rounded-xl transition-all flex items-center gap-2 ${activeTab === tab.id
                                    ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/30'
                                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                                    }`}
                            >
                                <span>{tab.icon}</span>
                                <span>{tab.label}</span>
                            </button>
                        ))}
                    </div>

                    {/* Tab Panels */}
                    <div className="min-h-[300px]">
                        {activeTab === 'overview' && (
                            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
                                {/* Issue Description */}
                                <div className="p-6 border-b border-slate-100 dark:border-slate-800">
                                    <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                                        <span className="w-8 h-8 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center text-primary-600 dark:text-primary-400">📝</span>
                                        Issue Description
                                    </h3>
                                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-base">
                                        {complaint.description || 'No description provided.'}
                                    </p>
                                </div>

                                {/* Quick Stats */}
                                <div className="grid grid-cols-3 divide-x divide-slate-100 dark:divide-slate-800">
                                    <div className="p-5 text-center hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                        <span className="text-xs uppercase font-bold text-slate-400 tracking-wider block mb-2">Category</span>
                                        <span className="text-sm font-bold text-slate-800 dark:text-white">{complaint.category}</span>
                                    </div>
                                    <div className="p-5 text-center hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                        <span className="text-xs uppercase font-bold text-slate-400 tracking-wider block mb-2">Priority</span>
                                        <span className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-bold ${getPriorityStyles(complaint.priority)}`}>
                                            {complaint.priority}
                                        </span>
                                    </div>
                                    <div className="p-5 text-center hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                        <span className="text-xs uppercase font-bold text-slate-400 tracking-wider block mb-2">Source</span>
                                        <span className="text-sm font-bold text-slate-800 dark:text-white">{complaint.source}</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'technician_updates' && (
                            <div className="space-y-6">
                                {/* Notes List */}
                                <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 p-6">
                                    <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-6 flex items-center gap-2">
                                        <span className="w-8 h-8 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center text-primary-600 dark:text-primary-400">💬</span>
                                        Work Logs & Notes
                                    </h3>
                                    <div className="space-y-4">
                                        {notes.map(note => (
                                            <div key={note.id} className="flex gap-4 group">
                                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-sm font-bold text-white shadow-lg shadow-primary-500/30 shrink-0">
                                                    {note.role === 'technician' ? '🔧' : '👤'}
                                                </div>
                                                <div className="flex-1 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-700 group-hover:border-primary-200 dark:group-hover:border-primary-800 transition-colors">
                                                    <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">{note.note}</p>
                                                    <div className="flex justify-between items-center mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
                                                        <span className="text-xs text-slate-500 font-medium capitalize">{note.role}</span>
                                                        <span className="text-xs text-slate-400">{new Date(note.createdAt).toLocaleString()}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        {notes.length === 0 && (
                                            <div className="text-center py-12">
                                                <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                                                    <span className="text-2xl">📭</span>
                                                </div>
                                                <p className="text-slate-500 font-medium">No notes added yet</p>
                                                <p className="text-slate-400 text-sm mt-1">Be the first to add an update</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Add Note Form */}
                                <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 p-6">
                                    <h4 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">Add Update</h4>
                                    <form onSubmit={handleAddNote}>
                                        <textarea
                                            value={newNote}
                                            onChange={e => setNewNote(e.target.value)}
                                            placeholder="Share work details, observations, or updates..."
                                            className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl p-4 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:outline-none min-h-[120px] transition-all resize-none"
                                            required
                                        />
                                        <div className="flex justify-end mt-4">
                                            <button
                                                type="submit"
                                                disabled={submittingNote}
                                                className="px-6 py-3 bg-primary-600 hover:bg-primary-500 text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-primary-500/30 hover:shadow-primary-500/40 hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0 flex items-center gap-2"
                                            >
                                                {submittingNote ? (
                                                    <>
                                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                                        Adding...
                                                    </>
                                                ) : (
                                                    <>
                                                        <span>Post Update</span>
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                                        </svg>
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}

                        {activeTab === 'timeline' && (
                            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 p-6">
                                <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-6 flex items-center gap-2">
                                    <span className="w-8 h-8 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center text-primary-600 dark:text-primary-400">📅</span>
                                    Activity Timeline
                                </h3>
                                <div className="space-y-0 relative">
                                    {history.map((h, i) => (
                                        <div key={h.id} className="flex gap-4 group pb-6 last:pb-0">
                                            {/* Timeline connector */}
                                            <div className="flex flex-col items-center">
                                                <div className="w-4 h-4 rounded-full bg-primary-500 ring-4 ring-primary-100 dark:ring-primary-900/50 z-10 group-hover:scale-125 transition-transform"></div>
                                                {i < history.length - 1 && <div className="w-0.5 flex-1 bg-gradient-to-b from-primary-300 to-slate-200 dark:from-primary-700 dark:to-slate-700 mt-2"></div>}
                                            </div>
                                            {/* Content */}
                                            <div className="flex-1 pb-2">
                                                <p className="text-sm font-semibold text-slate-800 dark:text-white">
                                                    {h.oldStatus ? (
                                                        <>Status: <span className="text-slate-400">{h.oldStatus}</span> → <span className="text-primary-600 dark:text-primary-400">{h.newStatus}</span></>
                                                    ) : (
                                                        <>Ticket created as <span className="text-primary-600 dark:text-primary-400">{h.newStatus}</span></>
                                                    )}
                                                </p>
                                                {h.remark && <p className="text-sm text-slate-500 mt-1 italic">"{h.remark}"</p>}
                                                <div className="flex items-center gap-3 mt-2">
                                                    <span className="text-xs text-slate-400 capitalize">{h.role}</span>
                                                    <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                                                    <span className="text-xs text-slate-400">{new Date(h.createdAt).toLocaleString()}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    {history.length === 0 && (
                                        <div className="text-center py-12">
                                            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                                                <span className="text-2xl">📜</span>
                                            </div>
                                            <p className="text-slate-500 font-medium">No history available</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column - Sidebar */}
                <div className="space-y-6">
                    {/* Customer Info Card */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
                        <div className="bg-gradient-to-r from-primary-50 to-primary-100/50 dark:from-primary-900/30 dark:to-primary-900/10 px-6 py-4 border-b border-primary-100 dark:border-primary-800/30">
                            <h4 className="text-sm font-bold text-primary-700 dark:text-primary-400 uppercase tracking-wider flex items-center gap-2">
                                <UserIcon className="w-4 h-4" />
                                Customer
                            </h4>
                        </div>
                        <div className="p-6 space-y-5">
                            {/* Customer Avatar & Name */}
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-xl font-bold text-white shadow-lg shadow-primary-500/30">
                                    {(complaint.customerName || 'C').charAt(0).toUpperCase()}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-lg font-bold text-slate-900 dark:text-white truncate">
                                        {complaint.customerName || 'Customer'}
                                    </p>
                                    <p className="text-sm text-primary-600 dark:text-primary-400 font-medium">ID: #{complaint.customerId}</p>
                                </div>
                            </div>

                            <div className="h-px bg-slate-100 dark:bg-slate-800"></div>

                            {/* Location */}
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-primary-600 dark:text-primary-400 shrink-0">
                                    <MapPinIcon className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1">Location</p>
                                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{complaint.siteAddress || 'No address'}</p>
                                    <p className="text-xs text-slate-500 mt-0.5">{complaint.siteCity || 'No city'}</p>
                                </div>
                            </div>

                            {/* Contact */}
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-primary-600 dark:text-primary-400 shrink-0">
                                    <PhoneIcon className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1">Contact</p>
                                    <p className="text-sm font-bold text-slate-700 dark:text-slate-300">{complaint.contactPersonName || 'N/A'}</p>
                                    <p className="text-sm text-primary-600 dark:text-primary-400 font-mono">{complaint.contactPersonPhone || 'No phone'}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Assignment Card */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800">
                            <h4 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Assignment</h4>
                        </div>
                        <div className="p-6">
                            {complaint.assignedTechnician ? (
                                <>
                                    <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-primary-500/30">
                                            {complaint.assignedTechnician.name[0]}
                                        </div>
                                        <div>
                                            <p className="text-base font-bold text-slate-900 dark:text-white">{complaint.assignedTechnician.name}</p>
                                            <p className="text-xs text-primary-600 dark:text-primary-400 font-medium flex items-center gap-1">
                                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                                Technician
                                            </p>
                                        </div>
                                    </div>
                                    {!isTechnician && (
                                        <div className="flex gap-2 mt-4">
                                            <button
                                                onClick={openAssignModal}
                                                className="flex-1 py-2 text-sm font-bold text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-xl transition-colors border border-primary-200 dark:border-primary-800"
                                            >
                                                Change
                                            </button>
                                            <button
                                                onClick={handleRemoveAssignment}
                                                className="flex-1 py-2 text-sm font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors border border-red-200 dark:border-red-800"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className="text-center py-6">
                                    <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <span className="text-2xl">👤</span>
                                    </div>
                                    <p className="text-sm text-slate-500 mb-4">No technician assigned</p>
                                    {!isTechnician && (
                                        <button
                                            onClick={openAssignModal}
                                            className="w-full py-3 bg-primary-600 hover:bg-primary-500 text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-primary-500/30 hover:shadow-primary-500/40 hover:-translate-y-0.5 flex items-center justify-center gap-2"
                                        >
                                            <span>+</span>
                                            Assign Technician
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ComplaintDetailsPage;
