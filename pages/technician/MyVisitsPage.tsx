import React, { useState, useEffect, useContext, useRef } from 'react';
import type { Visit, VisitStatus, JobCardItem, Customer, WorkLogEntry } from '../../types';
import { api } from '../../services/api';
import { AuthContext } from '../../App';
import ManageItemsModal from '../../components/ManageItemsModal';
import { DownloadIcon } from '../../components/icons';
import SignaturePad, { SignaturePadRef } from '../../components/SignaturePad';

const StatusIndicator: React.FC<{ status: VisitStatus }> = ({ status }) => {
    const styles: { [key: string]: { bg: string, text: string, label: string } } = {
        completed: { bg: 'bg-green-100', text: 'text-green-800', label: 'Completed' },
        in_progress: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'In Progress' },
        scheduled: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Scheduled' },
        cancelled: { bg: 'bg-red-100', text: 'text-red-800', label: 'Cancelled' },
    };
    const style = styles[status] || { bg: 'bg-slate-100', text: 'text-slate-800', label: status };

    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${style.bg} ${style.text}`}>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6">
                <h3 className="text-xl font-semibold text-slate-800 mb-4">Complete Project & Sign Off</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="nvrUsername" className="block text-sm font-medium text-slate-700">NVR Username</label>
                            <input type="text" id="nvrUsername" value={username} onChange={e => setUsername(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500" />
                        </div>
                        <div>
                            <label htmlFor="nvrPassword" className="block text-sm font-medium text-slate-700">NVR Password</label>
                            <input type="text" id="nvrPassword" value={password} onChange={e => setPassword(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500" />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="notes" className="block text-sm font-medium text-slate-700">Work Done Notes</label>
                        <textarea id="notes" value={notes} onChange={e => setNotes(e.target.value)} rows={2} required className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500" />
                    </div>
                     <div>
                        <label htmlFor="cableUsed" className="block text-sm font-medium text-slate-700">Cable Used (in meters)</label>
                        <input type="number" id="cableUsed" value={cableUsed} onChange={e => setCableUsed(e.target.value)} placeholder="e.g., 90" className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700">Technician Signature</label>
                        <div className="mt-1">
                            <SignaturePad ref={signaturePadRef} />
                        </div>
                        <div className="text-right mt-1">
                            <button type="button" onClick={() => signaturePadRef.current?.clear()} className="text-sm text-primary-600 hover:text-primary-800">
                                Clear Signature
                            </button>
                        </div>
                    </div>
                    <div className="flex justify-end space-x-3 pt-4 border-t">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-200 text-slate-800 rounded-md hover:bg-slate-300">Cancel</button>
                        <button type="submit" disabled={isSaving} className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:bg-green-300">
                            {isSaving ? 'Saving...' : 'Save & Complete'}
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
        <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-5 space-y-3 flex flex-col justify-between">
            <div>
                <div className="flex justify-between items-start">
                    <h3 className="text-lg font-bold text-slate-800">{customer?.companyName || `Project #${visit.id}`}</h3>
                    <StatusIndicator status={visit.status} />
                </div>
                <p className="text-sm text-slate-500">{visit.address}</p>
                <p className="text-sm text-slate-500 mt-1">Scheduled for: {new Date(visit.scheduledAt).toLocaleDateString()}</p>
            </div>
            <div className="space-y-3">
                 <div className="pt-2">
                    <h4 className="text-sm font-semibold text-slate-600">Items ({visit.items.reduce((acc, i) => acc + i.qty, 0)}):</h4>
                    {visit.items.length > 0 ? (
                        <ul className="list-disc list-inside text-sm text-slate-600 mt-1 max-h-24 overflow-y-auto">
                            {visit.items.map((item, index) => (
                                <li key={index}>{item.productName} (Qty: {item.qty}){item.serial && <span className="text-xs italic"> S/N: {item.serial}</span>}</li>
                            ))}
                        </ul>
                    ) : <p className="text-sm text-slate-500 mt-1">No items allocated.</p>}
                </div>
                <div className="pt-3 border-t border-slate-200 flex items-center justify-end flex-wrap gap-2">
                    {visit.status !== 'completed' && visit.status !== 'cancelled' && (
                        <button onClick={() => onManageItemsClick(visit)} className="px-3 py-1 text-xs font-semibold text-primary-700 bg-primary-100 rounded-md hover:bg-primary-200">
                            Manage Items
                        </button>
                    )}
                    {visit.chalan ? (
                        <a href={visit.chalan.pdfPath} target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-3 py-1 text-xs font-semibold text-green-700 bg-green-100 rounded-md hover:bg-green-200">
                            <DownloadIcon className="h-4 w-4 mr-1"/>
                            Download Chalan
                        </a>
                    ) : (
                        (visit.status === 'in_progress' || visit.status === 'completed') &&
                        <button
                            onClick={() => onGenerateChalanClick(visit.id)}
                            disabled={generatingChalanId === visit.id || visit.items.length === 0}
                            className="px-3 py-1 text-xs font-semibold text-white bg-indigo-500 rounded-md hover:bg-indigo-600 disabled:bg-slate-300 disabled:cursor-not-allowed"
                        >
                            {generatingChalanId === visit.id ? '...' : 'Generate Chalan'}
                        </button>
                    )}
                    
                    <div className="flex-grow"></div>

                    {visit.status === 'scheduled' && (
                        <button onClick={() => handleUpdateStatus('in_progress')} disabled={isUpdating} className="px-3 py-1 text-xs font-semibold text-white bg-yellow-500 rounded-md hover:bg-yellow-600 disabled:bg-yellow-300">
                            {isUpdating ? '...' : 'Start Project'}
                        </button>
                    )}
                    {visit.status === 'in_progress' && (
                         <button onClick={() => onCompleteClick(visit)} disabled={isUpdating} className="px-3 py-1 text-xs font-semibold text-white bg-green-500 rounded-md hover:bg-green-600 disabled:bg-green-300">
                            {isUpdating ? '...' : 'Complete Project'}
                        </button>
                    )}
                     {visit.status !== 'completed' && visit.status !== 'cancelled' && (
                         <button onClick={() => handleUpdateStatus('cancelled')} disabled={isUpdating} className="px-3 py-1 text-xs font-semibold text-slate-700 bg-slate-200 rounded-md hover:bg-slate-300 disabled:bg-slate-100">
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
    const authContext = useContext(AuthContext);

    useEffect(() => {
        const fetchData = async () => {
            if (!authContext?.user) return;
            try {
                const [visitsData, customersData] = await Promise.all([
                    api.getMyVisits(authContext.user.id),
                    api.getCustomers()
                ]);
                setVisits(visitsData.sort((a,b) => new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime()));
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
      setVisits(visits.map(v => v.id === visitId ? {...v, items } : v));
    };

    const handleSaveAndComplete = async (visitId: number, nvrUsername: string, nvrPassword: string, signature: string, workLog: Omit<WorkLogEntry, 'date' | 'technicianId'>) => {
        const techId = authContext?.user?.id;
        if (!techId) return;

        // FIX: The object passed to api.completeVisit had extra properties 'date' and 'technicianId', which caused a type error.
        // The API layer is responsible for adding these properties, so we should only pass the base workLog object.
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

    if (loading) {
        return <div>Loading your assigned projects...</div>;
    }

    const upcomingVisits = visits.filter(v => v.status === 'scheduled' || v.status === 'in_progress');
    const pastVisits = visits.filter(v => v.status === 'completed' || v.status === 'cancelled');


    return (
        <div className="space-y-8">
            {completingVisit && <CompleteProjectModal visit={completingVisit} onClose={() => setCompletingVisit(null)} onSave={handleSaveAndComplete} />}
            {managingVisit && <ManageItemsModal visit={managingVisit} onClose={() => setManagingVisit(null)} onSave={handleSaveItems} />}
            <h2 className="text-3xl font-bold text-slate-800">My Projects</h2>
            
            <div>
                <h3 className="text-xl font-semibold text-slate-700 mb-4">Upcoming Projects</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {upcomingVisits.length > 0 ? (
                        upcomingVisits.map(visit => <ProjectCard key={visit.id} visit={visit} customer={getCustomerForVisit(visit)} onStatusChange={handleStatusChange} onCompleteClick={setCompletingVisit} onManageItemsClick={setManagingVisit} onGenerateChalanClick={handleGenerateChalan} generatingChalanId={generatingChalanId} />)
                    ) : (
                        <div className="md:col-span-3 p-6 text-center bg-white border border-slate-200 rounded-lg">
                            <p className="text-slate-500">No upcoming projects assigned.</p>
                        </div>
                    )}
                </div>
            </div>

            <div>
                <h3 className="text-xl font-semibold text-slate-700 mb-4">Project History</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                     {pastVisits.length > 0 ? (
                        pastVisits.map(visit => <ProjectCard key={visit.id} visit={visit} customer={getCustomerForVisit(visit)} onStatusChange={handleStatusChange} onCompleteClick={setCompletingVisit} onManageItemsClick={setManagingVisit} onGenerateChalanClick={handleGenerateChalan} generatingChalanId={generatingChalanId}/>)
                    ) : (
                        <div className="md:col-span-3 p-6 text-center bg-white border border-slate-200 rounded-lg">
                            <p className="text-slate-500">No past projects found.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MyVisitsPage;
