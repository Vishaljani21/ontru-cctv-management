import React, { useState, useEffect, useContext, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Visit, Technician, Customer, JobCardItem } from '../types';
import { api } from '../services/api';
import { AppContext, AppContextType } from '../App';
import ManageItemsModal from '../components/ManageItemsModal';
import { DownloadIcon, KeyIcon, SignatureIcon } from '../components/icons';

const ProjectDetailsModal: React.FC<{
  visit: Visit;
  onClose: () => void;
  onSave: (visitId: number, username: string, password: string) => Promise<void>;
}> = ({ visit, onClose, onSave }) => {
    const [username, setUsername] = useState(visit.nvrUsername || '');
    const [password, setPassword] = useState(visit.nvrPassword || '');
    const [showPassword, setShowPassword] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
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
                            <h3 className="text-xl font-semibold text-slate-800">Project Details</h3>
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
                                    className="flex-grow w-full bg-slate-100 px-3 py-2 rounded-md font-mono text-slate-800 border border-slate-300 focus:ring-primary-500 focus:border-primary-500"
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


const ProjectsPage: React.FC = () => {
  const appContext = useContext(AppContext) as AppContextType;
  const { visits, setVisits, isEnterprise } = appContext;
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [managingVisit, setManagingVisit] = useState<Visit | null>(null);
  const [managingCredentialsFor, setManagingCredentialsFor] = useState<Visit | null>(null);
  const [generatingChalanId, setGeneratingChalanId] = useState<number | null>(null);
  const navigate = useNavigate();
  
  // Form state
  const [customerId, setCustomerId] = useState('');
  const [projectName, setProjectName] = useState('');
  const [date, setDate] = useState('');
  const [assignedTechnicians, setAssignedTechnicians] = useState<string[]>([]);

  // State for custom multi-select dropdown
  const [isTechDropdownOpen, setIsTechDropdownOpen] = useState(false);
  const techDropdownRef = useRef<HTMLDivElement>(null);

  // Filter state
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [customerFilter, setCustomerFilter] = useState<string>('all');
  const [technicianFilter, setTechnicianFilter] = useState<string>('all');
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [visitsData, techniciansData, customersData] = await Promise.all([
          api.getVisits(),
          api.getTechnicians(),
          api.getCustomers()
        ]);
        setVisits(visitsData);
        setTechnicians(techniciansData);
        setCustomers(customersData);
      } catch (error) {
        console.error("Failed to fetch page data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [setVisits]);

  // Effect to close technician dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (techDropdownRef.current && !techDropdownRef.current.contains(event.target as Node)) {
        setIsTechDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerId || assignedTechnicians.length === 0 || !date) {
        alert("Please fill all fields.");
        return;
    }
    const customer = customers.find(c => c.id === parseInt(customerId));
    if (!customer) return;

    const newProject: Omit<Visit, 'id'> = {
        projectName: projectName,
        customerId: parseInt(customerId),
        address: customer.address,
        technicianIds: assignedTechnicians.map(id => parseInt(id)),
        scheduledAt: new Date(date).toISOString(),
        status: 'scheduled',
        items: [],
    };
    
    const createdProject = await api.addProject(newProject);
    setVisits(prev => [createdProject, ...prev]);

    // Reset form
    setCustomerId('');
    setProjectName('');
    setDate('');
    setAssignedTechnicians([]);
  };

  const handleSaveItems = (visitId: number, items: JobCardItem[]) => {
    setVisits(prevVisits => prevVisits.map(v => v.id === visitId ? {...v, items } : v));
  };

  const handleSaveCredentials = async (visitId: number, nvrUsername: string, nvrPassword: string) => {
    const updatedVisit = await api.updateVisitCredentials(visitId, nvrUsername, nvrPassword);
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
  
  const getCustomerName = (id: number) => customers.find(c => c.id === id)?.companyName || 'Unknown Customer';
  const getTechnicianNames = (ids: number[]) => ids.map(id => technicians.find(t => t.id === id)?.name).filter(Boolean).join(', ');

  const handleToggleTechnician = (techId: string) => {
      setAssignedTechnicians(prev => 
          prev.includes(techId) 
          ? prev.filter(id => id !== techId)
          : [...prev, techId]
      );
  };

  const selectedTechnicianObjects = useMemo(() => 
    technicians.filter(t => assignedTechnicians.includes(t.id.toString())),
    [assignedTechnicians, technicians]
  );

  const filteredVisits = useMemo(() => {
    return visits.filter(visit => {
      const statusMatch = statusFilter === 'all' || visit.status === statusFilter;
      const customerMatch = customerFilter === 'all' || visit.customerId === parseInt(customerFilter);
      const technicianMatch = technicianFilter === 'all' || visit.technicianIds.includes(parseInt(technicianFilter));
      return statusMatch && customerMatch && technicianMatch;
    });
  }, [visits, statusFilter, customerFilter, technicianFilter]);

  if (loading) {
    return <div>Loading projects...</div>;
  }

  return (
    <div className="space-y-8">
      {managingVisit && <ManageItemsModal visit={managingVisit} onClose={() => setManagingVisit(null)} onSave={handleSaveItems} />}
      {managingCredentialsFor && <ProjectDetailsModal visit={managingCredentialsFor} onClose={() => setManagingCredentialsFor(null)} onSave={handleSaveCredentials} />}
      <h2 className="text-3xl font-bold text-slate-800">Projects</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="p-6 bg-white border border-slate-200 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
                Create New Project
                <kbd className="ml-2 bg-slate-200 border border-slate-300 border-b-2 rounded px-1.5 py-0.5 text-xs font-mono text-slate-600">F2</kbd>
            </h3>
            <form onSubmit={handleCreateProject} className="space-y-4">
              <div>
                <label htmlFor="customer" className="block text-sm font-medium text-slate-700">Customer</label>
                <select id="customer-select-input" value={customerId} onChange={e => setCustomerId(e.target.value)} required className={`mt-1 block w-full px-3 py-2 border border-slate-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 ${!customerId ? 'text-slate-500' : 'text-slate-900'}`}>
                  <option value="" disabled>Select a customer</option>
                  {customers.map(c => <option key={c.id} value={c.id}>{c.companyName}</option>)}
                </select>
              </div>

              <div>
                <label htmlFor="projectName" className="block text-sm font-medium text-slate-700">Project Name</label>
                <input type="text" id="projectName" value={projectName} onChange={e => setProjectName(e.target.value)} placeholder="e.g., Main Gate CCTV Setup" className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500" />
              </div>
              
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-slate-700">Date</label>
                <input type="date" id="date" value={date} onChange={e => setDate(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500" />
              </div>
              <div>
                <label htmlFor="technicians" className="block text-sm font-medium text-slate-700">Assign Technicians</label>
                <div className="relative" ref={techDropdownRef}>
                  <button
                    type="button"
                    onClick={() => setIsTechDropdownOpen(prev => !prev)}
                    className="mt-1 block w-full px-3 py-2 text-left bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 min-h-[42px]"
                  >
                    {selectedTechnicianObjects.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5">
                        {selectedTechnicianObjects.map(tech => (
                          <span key={tech.id} className="flex items-center gap-1.5 px-2 py-0.5 bg-primary-100 text-primary-800 text-sm font-medium rounded-md">
                            {tech.name}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleToggleTechnician(tech.id.toString());
                              }}
                              className="text-primary-600 hover:text-primary-800 font-bold"
                            >
                              &times;
                            </button>
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-slate-500">Select technicians...</span>
                    )}
                  </button>
                  {isTechDropdownOpen && (
                    <div className="absolute z-10 mt-1 w-full bg-white border border-slate-300 rounded-md shadow-lg">
                      <ul className="max-h-60 overflow-auto py-1">
                        {technicians.map(tech => (
                          <li
                            key={tech.id}
                            onClick={() => handleToggleTechnician(tech.id.toString())}
                            className="px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 cursor-pointer flex items-center"
                          >
                            <input
                              type="checkbox"
                              readOnly
                              checked={assignedTechnicians.includes(tech.id.toString())}
                              className="h-4 w-4 mr-3 text-primary-600 border-slate-300 rounded focus:ring-primary-500"
                            />
                            {tech.name}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
              <button type="submit" className="w-full px-4 py-2 font-semibold text-white bg-primary-500 rounded-lg hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                Save Project
              </button>
            </form>
          </div>
        </div>
        <div className="lg:col-span-2">
           <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
             <h3 className="p-6 text-lg font-semibold text-slate-800 border-b border-slate-200">Scheduled Projects</h3>
             
             <div className="p-4 bg-slate-50 border-b border-slate-200 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label htmlFor="status-filter" className="block text-sm font-medium text-slate-700">Filter by Status</label>
                    <select id="status-filter" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-slate-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md">
                        <option value="all">All Statuses</option>
                        <option value="scheduled">Scheduled</option>
                        <option value="in_progress">In Progress</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="customer-filter" className="block text-sm font-medium text-slate-700">Filter by Customer</label>
                    <select id="customer-filter" value={customerFilter} onChange={(e) => setCustomerFilter(e.target.value)} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-slate-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md">
                        <option value="all">All Customers</option>
                        {customers.map(c => <option key={c.id} value={c.id}>{c.companyName}</option>)}
                    </select>
                </div>
                <div>
                    <label htmlFor="technician-filter" className="block text-sm font-medium text-slate-700">Filter by Technician</label>
                    <select id="technician-filter" value={technicianFilter} onChange={(e) => setTechnicianFilter(e.target.value)} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-slate-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md">
                        <option value="all">All Technicians</option>
                        {technicians.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                    </select>
                </div>
            </div>

             <div className="overflow-x-auto">
               <table className="min-w-full divide-y divide-slate-200">
                 <thead className="bg-slate-50">
                   <tr>
                     <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Project / Customer</th>
                     <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
                     <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Items</th>
                     <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                     <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                   </tr>
                 </thead>
                 <tbody className="bg-white divide-y divide-slate-200">
                   {filteredVisits.length > 0 ? filteredVisits.map((visit) => (
                     <tr key={visit.id} className="hover:bg-slate-50">
                       <td className="px-6 py-4 whitespace-nowrap">
                         {visit.projectName && <div className="text-sm font-semibold text-slate-800">{visit.projectName}</div>}
                         <div className={`text-sm ${visit.projectName ? 'text-slate-500' : 'font-medium text-slate-900'}`}>{getCustomerName(visit.customerId)}</div>
                         <div className="text-sm text-slate-500">{getTechnicianNames(visit.technicianIds)}</div>
                       </td>
                       <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{new Date(visit.scheduledAt).toLocaleDateString()}</td>
                       <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 font-medium">{visit.items.reduce((acc, item) => acc + item.qty, 0)}</td>
                       <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                         <div className="flex items-center space-x-2">
                           <StatusIndicator status={visit.status} />
                           {visit.signatureDataUrl && visit.status === 'completed' && (
                               <span title="Signed by Technician">
                                <SignatureIcon className="h-4 w-4 text-slate-500" />
                               </span>
                           )}
                         </div>
                       </td>
                       <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2 flex items-center justify-end">
                          {isEnterprise && visit.status === 'completed' && (
                            <button onClick={() => navigate('/billing/new', { state: { visit }})} className="px-3 py-1 text-xs font-semibold text-white bg-green-500 rounded-md hover:bg-green-600">
                                Generate Invoice
                            </button>
                          )}
                          <button onClick={() => setManagingCredentialsFor(visit)} className="inline-flex items-center px-3 py-1 text-xs font-semibold text-slate-700 bg-slate-100 rounded-md hover:bg-slate-200" title="Manage Details">
                              <KeyIcon className="h-4 w-4 mr-1"/>
                              {visit.nvrUsername ? 'Details' : 'Add Details'}
                          </button>
                          <button onClick={() => setManagingVisit(visit)} className="px-3 py-1 text-xs font-semibold text-primary-700 bg-primary-100 rounded-md hover:bg-primary-200">
                              Manage Items
                          </button>
                          {visit.chalan ? (
                              <a href={visit.chalan.pdfPath} target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-3 py-1 text-xs font-semibold text-green-700 bg-green-100 rounded-md hover:bg-green-200">
                                  <DownloadIcon className="h-4 w-4 mr-1"/>
                                  Chalan
                              </a>
                          ) : (
                              <button
                                  onClick={() => handleGenerateChalan(visit.id)}
                                  disabled={generatingChalanId === visit.id || visit.items.length === 0}
                                  className="px-3 py-1 text-xs font-semibold text-white bg-indigo-500 rounded-md hover:bg-indigo-600 disabled:bg-slate-300 disabled:cursor-not-allowed"
                              >
                                  {generatingChalanId === visit.id ? '...' : 'Gen. Chalan'}
                              </button>
                          )}
                       </td>
                     </tr>
                   )) : (
                    <tr>
                      <td colSpan={5} className="text-center px-6 py-12 text-slate-500">
                        No projects found for the selected filters.
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

export default ProjectsPage;