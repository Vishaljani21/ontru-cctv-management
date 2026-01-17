import React, { useState, useEffect, useContext, useRef } from 'react';
import type { Visit, VisitStatus, JobCardItem, Customer, WorkLogEntry, TimelineStep } from '../../types';
import { api } from '../../services/api';
import { AuthContext } from '../../components/contexts';
import ManageItemsModal from '../../components/ManageItemsModal';
import { DownloadIcon, SearchIcon, FilterIcon, RefreshIcon, LocationMarkerIcon, PhoneIcon, CheckCircleIcon, ClockIcon, CalendarIcon, BoxIcon, ChevronRightIcon } from '../../components/icons';
import SignaturePad, { SignaturePadRef } from '../../components/SignaturePad';

// Status Badge Component
const StatusBadge: React.FC<{ status: VisitStatus }> = ({ status }) => {
    const styles: Record<string, { bg: string, text: string, icon: string, label: string }> = {
        completed: { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-400', icon: '✓', label: 'Completed' },
        in_progress: { bg: 'bg-amber-100 dark:bg-amber-900/30', text: 'text-amber-700 dark:text-amber-400', icon: '◐', label: 'In Progress' },
        scheduled: { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-400', icon: '○', label: 'Scheduled' },
        cancelled: { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-700 dark:text-red-400', icon: '✕', label: 'Cancelled' },
    };
    const style = styles[status] || styles.scheduled;

    return (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${style.bg} ${style.text}`}>
            <span>{style.icon}</span>
            {style.label}
        </span>
    );
};

// Progress Bar Component
const ProgressBar: React.FC<{ status: VisitStatus }> = ({ status }) => {
    const steps = ['Scheduled', 'In Progress', 'Completed'];
    const currentStep = status === 'completed' ? 3 : status === 'in_progress' ? 2 : 1;

    return (
        <div className="flex items-center gap-1 w-full">
            {steps.map((step, index) => (
                <React.Fragment key={step}>
                    <div className={`flex-1 h-1.5 rounded-full transition-all ${index < currentStep ? 'bg-primary-500' : 'bg-slate-200 dark:bg-slate-700'
                        }`} />
                </React.Fragment>
            ))}
        </div>
    );
};

// Complete Project Modal
const CompleteProjectModal: React.FC<{
    visit: Visit;
    onClose: () => void;
    onSave: (visitId: number, nvrUsername: string, nvrPassword: string, signature: string, workLog: Omit<WorkLogEntry, 'date' | 'technicianId'>) => Promise<void>;
}> = ({ visit, onClose, onSave }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [notes, setNotes] = useState('');
    const [cableUsed, setCableUsed] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const signaturePadRef = useRef<SignaturePadRef>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const signature = signaturePadRef.current?.getSignature();
        if (!signature) {
            alert('Please provide a signature to complete the job.');
            return;
        }
        setIsSaving(true);
        try {
            await onSave(visit.id, username, password, signature, { notes, cableUsed: Number(cableUsed) });
            onClose();
        } catch (error) {
            alert("Failed to save credentials and complete project.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-scale-in">
                <div className="px-6 py-5 bg-gradient-to-r from-green-600 to-emerald-600">
                    <h3 className="text-xl font-bold text-white">Complete Project & Sign Off</h3>
                    <p className="text-green-100 text-sm mt-1">Fill in the details to mark this job as complete</p>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">NVR Username</label>
                            <input type="text" value={username} onChange={e => setUsername(e.target.value)} required
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                placeholder="Enter username" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">NVR Password</label>
                            <input type="text" value={password} onChange={e => setPassword(e.target.value)} required
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                placeholder="Enter password" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Work Done Notes</label>
                        <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3} required
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                            placeholder="Describe the work completed..." />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Cable Used (meters)</label>
                        <input type="number" value={cableUsed} onChange={e => setCableUsed(e.target.value)} placeholder="0"
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent" />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Technician Signature</label>
                        <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl overflow-hidden bg-white">
                            <SignaturePad ref={signaturePadRef} />
                        </div>
                        <div className="text-right mt-2">
                            <button type="button" onClick={() => signaturePadRef.current?.clear()} className="text-sm font-bold text-primary-600 hover:text-primary-700">
                                Clear Signature
                            </button>
                        </div>
                    </div>
                    <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                        <button type="button" onClick={onClose} className="px-6 py-3 text-slate-600 dark:text-slate-400 font-bold hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors">
                            Cancel
                        </button>
                        <button type="submit" disabled={isSaving} className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-green-500/25 transition-all flex items-center gap-2 disabled:opacity-50">
                            {isSaving ? <RefreshIcon className="w-5 h-5 animate-spin" /> : <CheckCircleIcon className="w-5 h-5" />}
                            {isSaving ? 'Saving...' : 'Complete Job'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};


// Enhanced Project Card
const ProjectCard: React.FC<{
    visit: Visit;
    customer?: Customer;
    onStatusChange: (visitId: number, newStatus: VisitStatus, updatedVisit?: Visit) => void;
    onCompleteClick: (visit: Visit) => void;
    onManageItemsClick: (visit: Visit) => void;
    onGenerateChalanClick: (visitId: number) => void;
    generatingChalanId: number | null;
}> = ({ visit, customer, onStatusChange, onCompleteClick, onManageItemsClick, onGenerateChalanClick, generatingChalanId }) => {
    const [isUpdating, setIsUpdating] = useState(false);
    const [expanded, setExpanded] = useState(false);

    const handleUpdateStatus = async (newStatus: VisitStatus) => {
        setIsUpdating(true);
        try {
            const updatedVisit = await api.updateVisitStatus(visit.id, newStatus);
            onStatusChange(visit.id, newStatus, updatedVisit);
        } catch (error) {
            console.error("Failed to update status", error);
            alert("Failed to update status.");
        } finally {
            setIsUpdating(false);
        }
    };

    const isOverdue = new Date(visit.scheduledAt) < new Date() && visit.status === 'scheduled';

    return (
        <div className={`bg-white dark:bg-slate-900 rounded-2xl border-2 transition-all duration-300 overflow-hidden group hover:shadow-xl ${isOverdue ? 'border-red-300 dark:border-red-800' :
            visit.status === 'in_progress' ? 'border-amber-300 dark:border-amber-800' :
                visit.status === 'completed' ? 'border-green-300 dark:border-green-800' :
                    'border-slate-200 dark:border-slate-800 hover:border-primary-300 dark:hover:border-primary-700'
            }`}>
            {/* Header with gradient based on status */}
            <div className={`p-5 ${visit.status === 'completed' ? 'bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20' :
                visit.status === 'in_progress' ? 'bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20' :
                    isOverdue ? 'bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20' :
                        'bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800/50 dark:to-slate-900/50'
                }`}>
                <div className="flex justify-between items-start gap-3">
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white truncate">
                                {visit.projectName || customer?.companyName || `Project #${visit.id}`}
                            </h3>
                            {isOverdue && (
                                <span className="px-2 py-0.5 text-[10px] font-bold bg-red-500 text-white rounded-full animate-pulse">
                                    OVERDUE
                                </span>
                            )}
                        </div>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            {customer?.contactPerson || 'Customer'} • {customer?.mobile && (
                                <a href={`tel:${customer.mobile}`} className="text-primary-600 hover:underline">{customer.mobile}</a>
                            )}
                        </p>
                    </div>
                    <StatusBadge status={visit.status} />
                </div>

                {/* Progress Bar */}
                <div className="mt-4">
                    <ProgressBar status={visit.status} />
                </div>
            </div>

            {/* Content */}
            <div className="p-5 space-y-4">
                {/* Info Grid */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3">
                        <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs font-bold uppercase mb-1">
                            <CalendarIcon className="w-3.5 h-3.5" />
                            Scheduled
                        </div>
                        <p className="text-sm font-semibold text-slate-800 dark:text-white">
                            {new Date(visit.scheduledAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </p>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3">
                        <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs font-bold uppercase mb-1">
                            <BoxIcon className="w-3.5 h-3.5" />
                            Items
                        </div>
                        <p className="text-sm font-semibold text-slate-800 dark:text-white">
                            {visit.items.length} products ({visit.items.reduce((acc, i) => acc + i.qty, 0)} units)
                        </p>
                    </div>
                </div>

                {/* Address */}
                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3">
                    <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs font-bold uppercase mb-1">
                                <LocationMarkerIcon className="w-3.5 h-3.5" />
                                Site Address
                            </div>
                            <p className="text-sm text-slate-700 dark:text-slate-300 line-clamp-2">{visit.address}</p>
                        </div>
                        <button
                            onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(visit.address)}`, '_blank')}
                            className="p-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl transition-colors shadow-lg shadow-primary-500/20"
                            title="Get Directions"
                        >
                            <LocationMarkerIcon className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Quick Contact */}
                {customer?.mobile && (
                    <div className="flex gap-2">
                        <a
                            href={`tel:${customer.mobile}`}
                            className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-xl font-bold text-sm hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors"
                        >
                            <PhoneIcon className="w-4 h-4" />
                            Call Customer
                        </a>
                        <a
                            href={`https://wa.me/91${customer.mobile.replace(/\D/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-xl font-bold text-sm hover:bg-emerald-200 dark:hover:bg-emerald-900/50 transition-colors"
                        >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>
                            WhatsApp
                        </a>
                    </div>
                )}

                {/* Expandable Items Section */}
                {visit.items.length > 0 && (
                    <div>
                        <button
                            onClick={() => setExpanded(!expanded)}
                            className="w-full flex items-center justify-between py-2 text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-primary-600 transition-colors"
                        >
                            <span>Allocated Items ({visit.items.length})</span>
                            <ChevronRightIcon className={`w-4 h-4 transition-transform ${expanded ? 'rotate-90' : ''}`} />
                        </button>
                        {expanded && (
                            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3 mt-2 animate-fade-in-up">
                                <ul className="space-y-2">
                                    {visit.items.map((item, index) => (
                                        <li key={index} className="flex justify-between items-center text-sm">
                                            <span className="text-slate-700 dark:text-slate-300 truncate flex-1 mr-2">{item.productName}</span>
                                            <span className="font-bold text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/30 px-2 py-0.5 rounded-lg">
                                                ×{item.qty}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Action Footer */}
            <div className="p-4 bg-slate-50 dark:bg-slate-800/30 border-t border-slate-100 dark:border-slate-800">
                <div className="flex flex-wrap gap-2">
                    {/* Manage Items */}
                    {visit.status !== 'completed' && visit.status !== 'cancelled' && (
                        <button
                            onClick={() => onManageItemsClick(visit)}
                            className="px-4 py-2 text-sm font-bold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                        >
                            Manage Items
                        </button>
                    )}

                    {/* Chalan Button */}
                    {visit.chalan ? (
                        <a href={visit.chalan.pdfPath} target="_blank" rel="noopener noreferrer"
                            className="inline-flex items-center px-4 py-2 text-sm font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl hover:bg-emerald-200 transition-colors">
                            <DownloadIcon className="h-4 w-4 mr-2" />
                            Download Chalan
                        </a>
                    ) : (visit.status === 'in_progress' || visit.status === 'completed') && (
                        <button
                            onClick={() => onGenerateChalanClick(visit.id)}
                            disabled={generatingChalanId === visit.id || visit.items.length === 0}
                            className="px-4 py-2 text-sm font-bold text-white bg-primary-600 rounded-xl hover:bg-primary-700 disabled:opacity-50 transition-colors"
                        >
                            {generatingChalanId === visit.id ? 'Generating...' : 'Get Chalan'}
                        </button>
                    )}

                    <div className="flex-grow" />

                    {/* Status Actions */}
                    {visit.status === 'scheduled' && (
                        <button
                            onClick={() => handleUpdateStatus('in_progress')}
                            disabled={isUpdating}
                            className="px-6 py-2 text-sm font-bold text-white bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl hover:from-amber-600 hover:to-orange-600 shadow-lg shadow-amber-500/25 transition-all disabled:opacity-50"
                        >
                            {isUpdating ? '...' : '▶ Start Job'}
                        </button>
                    )}
                    {visit.status === 'in_progress' && (
                        <button
                            onClick={() => onCompleteClick(visit)}
                            disabled={isUpdating}
                            className="px-6 py-2 text-sm font-bold text-white bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl hover:from-green-700 hover:to-emerald-700 shadow-lg shadow-green-500/25 transition-all disabled:opacity-50"
                        >
                            {isUpdating ? '...' : '✓ Complete Job'}
                        </button>
                    )}
                    {visit.status !== 'completed' && visit.status !== 'cancelled' && (
                        <button
                            onClick={() => handleUpdateStatus('cancelled')}
                            disabled={isUpdating}
                            className="px-4 py-2 text-sm font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
                        >
                            Cancel
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};


const MyVisitsPage: React.FC = () => {
    const [visits, setVisits] = useState<Visit[]>([]);
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(true);
    const [completingVisit, setCompletingVisit] = useState<Visit | null>(null);
    const [managingVisit, setManagingVisit] = useState<Visit | null>(null);
    const [generatingChalanId, setGeneratingChalanId] = useState<number | null>(null);

    // Filters
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<VisitStatus | 'all'>('all');

    const authContext = useContext(AuthContext);

    useEffect(() => {
        const fetchData = async () => {
            if (!authContext?.user) return;
            try {
                const [visitsData, customersData] = await Promise.all([
                    api.getMyVisits(authContext.user.id),
                    api.getCustomers()
                ]);
                setVisits(visitsData.sort((a, b) => new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime()));
                setCustomers(customersData);
            } catch (error) {
                console.error("Failed to fetch data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [authContext?.user]);

    const handleStatusChange = (visitId: number, newStatus: VisitStatus, updatedVisit?: Visit) => {
        setVisits(visits.map(v => v.id === visitId ? (updatedVisit || { ...v, status: newStatus }) : v));
    };

    const handleSaveItems = (visitId: number, items: JobCardItem[]) => {
        setVisits(visits.map(v => v.id === visitId ? { ...v, items } : v));
    };

    const handleSaveAndComplete = async (visitId: number, nvrUsername: string, nvrPassword: string, signature: string, workLog: Omit<WorkLogEntry, 'date' | 'technicianId'>) => {
        const techId = authContext?.user?.id;
        if (!techId) return;
        const updatedVisit = await api.completeVisit(visitId, nvrUsername, nvrPassword, signature, workLog);
        handleStatusChange(visitId, 'completed', updatedVisit);
    };

    const handleGenerateChalan = async (visitId: number) => {
        setGeneratingChalanId(visitId);
        try {
            const newChalan = await api.generateChalan(visitId);
            setVisits(prevVisits => prevVisits.map(v =>
                v.id === visitId
                    ? { ...v, chalan: { id: newChalan.id, chalanNo: newChalan.chalanNo, pdfPath: newChalan.pdfPath } }
                    : v
            ));
        } catch (error) {
            console.error("Failed to generate chalan", error);
            alert('Failed to generate chalan.');
        } finally {
            setGeneratingChalanId(null);
        }
    };

    const getCustomerForVisit = (visit: Visit) => customers.find(c => c.id === visit.customerId);

    const filteredVisits = visits.filter(visit => {
        const customer = getCustomerForVisit(visit);
        const searchMatch =
            (customer?.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) || '') ||
            visit.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
            visit.projectName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            `#${visit.id}`.includes(searchTerm);

        const statusMatch = statusFilter === 'all' || visit.status === statusFilter;

        return searchMatch && statusMatch;
    });

    // Stats
    const stats = {
        total: visits.length,
        scheduled: visits.filter(v => v.status === 'scheduled').length,
        inProgress: visits.filter(v => v.status === 'in_progress').length,
        completed: visits.filter(v => v.status === 'completed').length,
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-slate-500 font-medium">Loading your projects...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fade-in-up pb-10">
            {completingVisit && <CompleteProjectModal visit={completingVisit} onClose={() => setCompletingVisit(null)} onSave={handleSaveAndComplete} />}
            {managingVisit && <ManageItemsModal visit={managingVisit} onClose={() => setManagingVisit(null)} onSave={handleSaveItems} />}

            {/* Page Header */}
            <div className="bg-gradient-to-r from-primary-600 via-primary-700 to-primary-700 rounded-3xl p-6 sm:p-8 text-white shadow-2xl">
                <h1 className="text-3xl font-bold mb-2">My Projects</h1>
                <p className="text-primary-100">Manage and track all your assigned installation projects</p>

                {/* Stats */}
                <div className="grid grid-cols-4 gap-4 mt-6">
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center">
                        <p className="text-3xl font-bold">{stats.total}</p>
                        <p className="text-sm text-primary-200">Total</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center">
                        <p className="text-3xl font-bold text-blue-300">{stats.scheduled}</p>
                        <p className="text-sm text-primary-200">Scheduled</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center">
                        <p className="text-3xl font-bold text-amber-300">{stats.inProgress}</p>
                        <p className="text-sm text-primary-200">In Progress</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center">
                        <p className="text-3xl font-bold text-green-300">{stats.completed}</p>
                        <p className="text-sm text-primary-200">Completed</p>
                    </div>
                </div>
            </div>

            {/* Filters Row */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                {/* Search */}
                <div className="relative w-full sm:w-80">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <SearchIcon className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search projects..."
                        className="block w-full pl-12 pr-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent shadow-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {/* Status Filter Pills */}
                <div className="flex gap-2 bg-white dark:bg-slate-900 p-1.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-x-auto">
                    {(['all', 'scheduled', 'in_progress', 'completed'] as const).map(status => (
                        <button
                            key={status}
                            onClick={() => setStatusFilter(status)}
                            className={`px-4 py-2 rounded-lg text-sm font-bold capitalize whitespace-nowrap transition-all ${statusFilter === status
                                ? 'bg-primary-600 text-white shadow-md'
                                : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-700'
                                }`}
                        >
                            {status === 'all' ? 'All' : status.replace('_', ' ')}
                            <span className={`ml-2 px-1.5 py-0.5 rounded-md text-xs ${statusFilter === status ? 'bg-white/20' : 'bg-slate-100 dark:bg-slate-800'
                                }`}>
                                {status === 'all' ? stats.total :
                                    status === 'scheduled' ? stats.scheduled :
                                        status === 'in_progress' ? stats.inProgress : stats.completed}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Projects Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredVisits.length > 0 ? (
                    filteredVisits.map(visit => (
                        <ProjectCard
                            key={visit.id}
                            visit={visit}
                            customer={getCustomerForVisit(visit)}
                            onStatusChange={handleStatusChange}
                            onCompleteClick={setCompletingVisit}
                            onManageItemsClick={setManagingVisit}
                            onGenerateChalanClick={handleGenerateChalan}
                            generatingChalanId={generatingChalanId}
                        />
                    ))
                ) : (
                    <div className="col-span-full py-20 text-center">
                        <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
                            <FilterIcon className="w-12 h-12 text-slate-300" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-700 dark:text-slate-300 mb-2">No projects found</h3>
                        <p className="text-slate-500 mb-6">Try adjusting your search or filters to find what you're looking for.</p>
                        <button
                            onClick={() => { setSearchTerm(''); setStatusFilter('all'); }}
                            className="px-6 py-3 text-primary-600 font-bold bg-primary-50 hover:bg-primary-100 dark:bg-primary-900/30 dark:hover:bg-primary-900/50 rounded-xl transition-colors"
                        >
                            Clear All Filters
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyVisitsPage;
