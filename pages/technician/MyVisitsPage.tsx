import React, { useState, useEffect, useContext, useRef } from 'react';
import type { Visit, VisitStatus, JobCardItem, Customer, WorkLogEntry } from '../../types';
import { api } from '../../services/api';
import { AuthContext } from '../../App';
import ManageItemsModal from '../../components/ManageItemsModal';
import { DownloadIcon, SearchIcon, FilterIcon, RefreshIcon, LocationMarkerIcon } from '../../components/icons';
import SignaturePad, { SignaturePadRef } from '../../components/SignaturePad';

const StatusIndicator: React.FC<{ status: VisitStatus }> = ({ status }) => {
    const styles: { [key: string]: { bg: string, text: string, label: string } } = {
        completed: { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-800 dark:text-green-400', label: 'Completed' },
        in_progress: { bg: 'bg-orange-100 dark:bg-orange-900/30', text: 'text-orange-800 dark:text-orange-400', label: 'In Progress' },
        scheduled: { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-800 dark:text-blue-400', label: 'Scheduled' },
        cancelled: { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-800 dark:text-red-400', label: 'Cancelled' },
    };
    const style = styles[status] || { bg: 'bg-slate-100', text: 'text-slate-800', label: status };

    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide ${style.bg} ${style.text}`}>
            {style.label}
        </span>
    );
};

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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-scale-in">
                <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800">
                    <h3 className="text-xl font-bold text-slate-800 dark:text-white">Complete Project & Sign Off</h3>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">NVR Username</label>
                            <input type="text" value={username} onChange={e => setUsername(e.target.value)} required className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">NVR Password</label>
                            <input type="text" value={password} onChange={e => setPassword(e.target.value)} required className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Work Done Notes</label>
                        <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2} required className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="Describe the work completed..." />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Cable Used (meters)</label>
                        <input type="number" value={cableUsed} onChange={e => setCableUsed(e.target.value)} placeholder="0" className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500" />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Technician Signature</label>
                        <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden bg-white">
                            <SignaturePad ref={signaturePadRef} />
                        </div>
                        <div className="text-right mt-1">
                            <button type="button" onClick={() => signaturePadRef.current?.clear()} className="text-xs font-bold text-primary-600 hover:text-primary-700">
                                Clear Signature
                            </button>
                        </div>
                    </div>
                    <div className="flex justify-end gap-3 pt-2">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-slate-600 dark:text-slate-400 font-bold hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">Cancel</button>
                        <button type="submit" disabled={isSaving} className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg shadow-lg shadow-green-500/20 transition-all flex items-center">
                            {isSaving ? <RefreshIcon className="w-5 h-5 animate-spin" /> : 'Complete & Save'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};


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

    return (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between overflow-hidden group">
            <div className="p-5">
                <div className="flex justify-between items-start mb-3">
                    <div>
                        <h3 className="text-lg font-bold text-slate-800 dark:text-white line-clamp-1">{customer?.companyName || `Project #${visit.id}`}</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">{customer?.contactPerson}</p>
                    </div>
                    <StatusIndicator status={visit.status} />
                </div>

                <div className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
                    <div className="flex items-start gap-2">
                        <span className="font-semibold min-w-[60px]">Address:</span>
                        <div className="flex items-start gap-2 flex-1">
                            <span className="line-clamp-2">{visit.address}</span>
                            <button
                                onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(visit.address)}`, '_blank')}
                                className="text-primary-600 hover:text-primary-700 flex-shrink-0"
                                title="Get Directions"
                            >
                                <LocationMarkerIcon className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="font-semibold min-w-[60px]">Date:</span>
                        <span>{new Date(visit.scheduledAt).toLocaleDateString()}</span>
                    </div>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                    <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-2">Allocated Items ({visit.items.reduce((acc, i) => acc + i.qty, 0)})</h4>
                    {visit.items.length > 0 ? (
                        <ul className="space-y-1 max-h-24 overflow-y-auto custom-scrollbar pr-1">
                            {visit.items.map((item, index) => (
                                <li key={index} className="text-sm flex justify-between items-center text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/50 px-2 py-1 rounded">
                                    <span className="line-clamp-1 flex-1 mr-2">{item.productName}</span>
                                    <span className="font-bold whitespace-nowrap">x{item.qty}</span>
                                </li>
                            ))}
                        </ul>
                    ) : <p className="text-sm italic text-slate-400">No items allocated.</p>}
                </div>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/30 border-t border-slate-100 dark:border-slate-800 flex flex-wrap gap-2 justify-end">
                {/* Manage Items - Only if not completed/cancelled */}
                {visit.status !== 'completed' && visit.status !== 'cancelled' && (
                    <button onClick={() => onManageItemsClick(visit)} className="px-3 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                        Manage Items
                    </button>
                )}

                {/* Chalan Logic */}
                {visit.chalan ? (
                    <a href={visit.chalan.pdfPath} target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-3 py-1.5 text-xs font-bold text-emerald-700 bg-emerald-100 rounded-lg hover:bg-emerald-200 transition-colors">
                        <DownloadIcon className="h-3.5 w-3.5 mr-1.5" />
                        Chalan
                    </a>
                ) : (
                    (visit.status === 'in_progress' || visit.status === 'completed') &&
                    <button
                        onClick={() => onGenerateChalanClick(visit.id)}
                        disabled={generatingChalanId === visit.id || visit.items.length === 0}
                        className="px-3 py-1.5 text-xs font-bold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                    >
                        {generatingChalanId === visit.id ? 'Generating...' : 'Get Chalan'}
                    </button>
                )}

                <div className="flex-grow"></div>

                {/* Status Actions */}
                {visit.status === 'scheduled' && (
                    <button onClick={() => handleUpdateStatus('in_progress')} disabled={isUpdating} className="px-4 py-1.5 text-xs font-bold text-white bg-orange-500 rounded-lg hover:bg-orange-600 shadow-lg shadow-orange-500/20 transition-all">
                        {isUpdating ? '...' : 'Start Job'}
                    </button>
                )}
                {visit.status === 'in_progress' && (
                    <button onClick={() => onCompleteClick(visit)} disabled={isUpdating} className="px-4 py-1.5 text-xs font-bold text-white bg-green-600 rounded-lg hover:bg-green-700 shadow-lg shadow-green-500/20 transition-all">
                        {isUpdating ? '...' : 'Complete Job'}
                    </button>
                )}
                {visit.status !== 'completed' && visit.status !== 'cancelled' && (
                    <button onClick={() => handleUpdateStatus('cancelled')} disabled={isUpdating} className="px-3 py-1.5 text-xs font-bold text-slate-600 bg-slate-200 rounded-lg hover:bg-slate-300 transition-colors">
                        Cancel
                    </button>
                )}
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
                    api.getCustomers() // Ideally api should return customer name in visit but let's stick to this
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
            `#${visit.id}`.includes(searchTerm);

        const statusMatch = statusFilter === 'all' || visit.status === statusFilter;

        return searchMatch && statusMatch;
    });

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-fade-in-up pb-10">
            {completingVisit && <CompleteProjectModal visit={completingVisit} onClose={() => setCompletingVisit(null)} onSave={handleSaveAndComplete} />}
            {managingVisit && <ManageItemsModal visit={managingVisit} onClose={() => setManagingVisit(null)} onSave={handleSaveItems} />}

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 className="text-3xl font-bold text-slate-800 dark:text-white">My Projects</h2>
                <div className="flex gap-2 bg-white dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    {(['all', 'scheduled', 'in_progress', 'completed'] as const).map(status => (
                        <button
                            key={status}
                            onClick={() => setStatusFilter(status)}
                            className={`px-4 py-2 rounded-lg text-sm font-bold capitalize transition-all ${statusFilter === status
                                ? 'bg-primary-600 text-white shadow-md'
                                : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-700'
                                }`}
                        >
                            {status.replace('_', ' ')}
                        </button>
                    ))}
                </div>
            </div>

            {/* Search Bar */}
            <div className="relative max-w-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <SearchIcon className="h-5 w-5 text-slate-400" />
                </div>
                <input
                    type="text"
                    placeholder="Search customer, address, or ID..."
                    className="block w-full pl-10 pr-3 py-3 border border-slate-200 dark:border-slate-700 rounded-xl text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 shadow-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                    <div className="col-span-full py-16 text-center">
                        <div className="w-20 h-20 bg-slate-50 dark:bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FilterIcon className="w-10 h-10 text-slate-300" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300">No projects found</h3>
                        <p className="text-slate-500">Try adjusting your search or filters.</p>
                        <button
                            onClick={() => { setSearchTerm(''); setStatusFilter('all'); }}
                            className="mt-4 px-4 py-2 text-primary-600 font-bold hover:bg-primary-50 rounded-lg transition-colors"
                        >
                            Clear Filters
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyVisitsPage;
