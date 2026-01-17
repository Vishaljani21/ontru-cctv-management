import React, { useState, useEffect, useContext } from 'react';
// FIX: Import Customer type for use in the details modal.
import type { Visit, Technician, Godown, GodownStock, JobCardItem, Customer } from '../types';
import { api } from '../services/api';
import { AppContext, AppContextType } from '../components/contexts';
import ManageItemsModal from '../components/ManageItemsModal';
import { DownloadIcon, KeyIcon, SignatureIcon } from '../components/icons';
import CustomSelect from '../components/CustomSelect';
import CustomDatePicker from '../components/CustomDatePicker';

const VisitDetailsModal: React.FC<{
  visit: Visit;
  onClose: () => void;
  onSave: (visitId: number, username: string, password: string) => Promise<void>;
}> = ({ visit, onClose, onSave }) => {
  const [username, setUsername] = useState(visit.nvrUsername || '');
  const [password, setPassword] = useState(visit.nvrPassword || '');
  const [showPassword, setShowPassword] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  // FIX: Fetch customer details within the modal to get the customer name.
  const [customer, setCustomer] = useState<Customer | null>(null);

  useEffect(() => {
    api.getCustomerById(visit.customerId).then(setCustomer);
  }, [visit.customerId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onSave(visit.id, username, password);
      onClose();
    } catch (error) {
      console.error("Failed to save credentials", error);
      alert('Failed to save credentials.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-sm p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xl font-semibold text-slate-800">Visit Details</h3>
              {/* FIX: Use fetched customer name, which resolves the 'customerName' property error. */}
              <p className="text-sm text-slate-500">For {customer?.companyName}</p>
            </div>
            <button type="button" onClick={onClose} className="text-2xl font-light text-slate-500 hover:text-slate-800">&times;</button>
          </div>
          <div className="space-y-3 pt-2 max-h-[60vh] overflow-y-auto pr-2">
            <div>
              <label className="block text-xs font-medium text-slate-500">NVR Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mt-1 w-full bg-slate-100 px-3 py-2 rounded-md text-slate-800 border border-slate-300 focus:ring-primary-500 focus:border-primary-500"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500">NVR Password</label>
              <div className="flex items-center space-x-2 mt-1">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="flex-grow w-full bg-slate-100 px-3 py-2 rounded-md text-slate-800 border border-slate-300 focus:ring-primary-500 focus:border-primary-500"
                  required
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-sm text-primary-600 hover:text-primary-800 font-medium">
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>
            {visit.signatureDataUrl && (
              <div className="pt-2">
                <label className="block text-xs font-medium text-slate-500">Technician Signature</label>
                <div className="mt-1 p-2 border border-slate-300 rounded-md bg-slate-50 flex justify-center">
                  <img src={visit.signatureDataUrl} alt="Technician Signature" className="h-28 object-contain" />
                </div>
              </div>
            )}
          </div>
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-200 text-slate-800 rounded-md hover:bg-slate-300">Cancel</button>
            <button type="submit" disabled={isSaving} className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 disabled:bg-primary-300">
              {isSaving ? 'Saving...' : 'Save Credentials'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};


const StatusIndicator: React.FC<{ status: string }> = ({ status }) => {
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


const VisitsPage: React.FC = () => {
  const appContext = useContext(AppContext) as AppContextType;
  const { visits, setVisits } = appContext;
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  // FIX: Added state to store customers to look up names by ID.
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [managingVisit, setManagingVisit] = useState<Visit | null>(null);
  const [managingCredentialsFor, setManagingCredentialsFor] = useState<Visit | null>(null);
  const [generatingChalanId, setGeneratingChalanId] = useState<number | null>(null);

  // Form state
  const [customerName, setCustomerName] = useState('');
  const [address, setAddress] = useState('');
  const [date, setDate] = useState('');
  const [technician, setTechnician] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // FIX: Fetched customers along with other data.
        const [visitsData, techniciansData, customersData] = await Promise.all([
          api.getVisits(),
          api.getTechnicians(),
          api.getCustomers(),
        ]);
        setVisits(visitsData);
        setTechnicians(techniciansData);
        setCustomers(customersData);
      } catch (error) {
        console.error("Failed to fetch visits data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [setVisits]);

  // FIX: Added a helper function to get customer name from the customers list.
  const getCustomerName = (customerId: number) => {
    return customers.find(c => c.id === customerId)?.companyName || 'Unknown Customer';
  };

  const handleCreateVisit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ customerName, address, date, technician });
    // Here you would call an API to create the visit
    alert('Visit created successfully (mock)!');
    setCustomerName('');
    setAddress('');
    setDate('');
    setTechnician('');
  };

  const handleSaveItems = (visitId: number, items: JobCardItem[]) => {
    // FIX: Use functional update for setVisits to avoid stale state.
    setVisits(prevVisits => prevVisits.map(v => v.id === visitId ? { ...v, items } : v));
  };

  const handleSaveCredentials = async (visitId: number, nvrUsername: string, nvrPassword: string) => {
    const updatedVisit = await api.updateVisitCredentials(visitId, nvrUsername, nvrPassword);
    // FIX: Use functional update for setVisits to avoid stale state.
    setVisits(prevVisits => prevVisits.map(v => v.id === visitId ? updatedVisit : v));
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

  if (loading) {
    return <div>Loading visits...</div>;
  }

  return (
    <div className="space-y-8">
      {managingVisit && <ManageItemsModal visit={managingVisit} onClose={() => setManagingVisit(null)} onSave={handleSaveItems} />}
      {managingCredentialsFor && <VisitDetailsModal visit={managingCredentialsFor} onClose={() => setManagingCredentialsFor(null)} onSave={handleSaveCredentials} />}
      <h2 className="text-3xl font-bold text-slate-800">Visits</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="p-6 bg-white border border-slate-200 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Create New Visit</h3>
            <form onSubmit={handleCreateVisit} className="space-y-4">
              <div>
                <label htmlFor="customerName" className="block text-sm font-medium text-slate-700">Customer Name</label>
                <input type="text" id="customerName" value={customerName} onChange={e => setCustomerName(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500" />
              </div>
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-slate-700">Address</label>
                <textarea id="address" value={address} onChange={e => setAddress(e.target.value)} required rows={3} className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500" />
              </div>
              <div className="z-10 relative">
                <CustomDatePicker
                  label="Scheduled Date"
                  selected={date ? new Date(date) : null}
                  onChange={(d) => setDate(d ? d.toISOString().split('T')[0] : '')}
                  placeholder="Select Date"
                />
              </div>
              <div>
                <CustomSelect
                  label="Assign Technician"
                  options={technicians.map(tech => ({ value: tech.id.toString(), label: tech.name }))}
                  value={technician}
                  onChange={setTechnician}
                  placeholder="Select a technician"
                />
              </div>
              <button type="submit" className="w-full px-4 py-2 font-semibold text-white bg-primary-500 rounded-lg hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                Save Visit
              </button>
            </form>
          </div>
        </div>
        <div className="lg:col-span-2">
          <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
            <h3 className="p-6 text-lg font-semibold text-slate-800 border-b border-slate-200">Scheduled Visits</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Customer</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Items</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                    <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                  {visits.length > 0 ? visits.map((visit) => (
                    <tr key={visit.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        {/* FIX: Replaced non-existent `visit.customerName` with a lookup function. */}
                        <div className="text-sm font-medium text-slate-900">{getCustomerName(visit.customerId)}</div>
                        {/* FIX: Use `technicianIds` (array) instead of `technicianId` and map over it to display names. */}
                        <div className="text-sm text-slate-500">{visit.technicianIds.map(tid => technicians.find(t => t.id === tid)?.name).filter(Boolean).join(', ')}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{new Date(visit.scheduledAt).toLocaleDateString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 font-medium">{visit.items.reduce((acc, item) => acc + item.qty, 0)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                        <div className="flex items-center space-x-2">
                          <StatusIndicator status={visit.status} />
                          {/* FIX: Moved title prop from SignatureIcon to a wrapping span to fix TS error. */}
                          {visit.signatureDataUrl && visit.status === 'completed' && (
                            <span title="Signed by Technician">
                              <SignatureIcon className="h-4 w-4 text-slate-500" />
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                        <button onClick={() => setManagingCredentialsFor(visit)} className="inline-flex items-center px-3 py-1 text-xs font-semibold text-slate-700 bg-slate-100 rounded-md hover:bg-slate-200" title="Manage Credentials">
                          <KeyIcon className="h-4 w-4 mr-1" />
                          {visit.nvrUsername ? 'Manage Details' : 'Add Details'}
                        </button>
                        <button onClick={() => setManagingVisit(visit)} className="px-3 py-1 text-xs font-semibold text-primary-700 bg-primary-100 rounded-md hover:bg-primary-200">
                          Manage Items
                        </button>
                        {visit.chalan ? (
                          <a href={visit.chalan.pdfPath} target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-3 py-1 text-xs font-semibold text-green-700 bg-green-100 rounded-md hover:bg-green-200">
                            <DownloadIcon className="h-4 w-4 mr-1" />
                            Download Chalan
                          </a>
                        ) : (
                          <button
                            onClick={() => handleGenerateChalan(visit.id)}
                            disabled={generatingChalanId === visit.id || visit.items.length === 0}
                            className="px-3 py-1 text-xs font-semibold text-white bg-primary-500 rounded-md hover:bg-primary-600 disabled:bg-slate-300 disabled:cursor-not-allowed"
                          >
                            {generatingChalanId === visit.id ? 'Generating...' : 'Generate Chalan'}
                          </button>
                        )}
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={5} className="text-center px-6 py-12 text-slate-500">
                        No visits scheduled yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisitsPage;