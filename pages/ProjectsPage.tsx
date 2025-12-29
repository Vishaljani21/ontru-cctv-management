import React, { useState, useEffect, useContext, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Visit, Technician, Customer, JobCardItem } from '../types';
import { api } from '../services/api';
import { AppContext, AppContextType } from '../App';
import ManageItemsModal from '../components/ManageItemsModal';
import { DownloadIcon, KeyIcon, SignatureIcon, ChevronRightIcon, ProjectIcon, UserIcon } from '../components/icons';
import Skeleton from '../components/Skeleton';
import Modal from '../components/Modal';
import CustomSelect from '../components/CustomSelect';
import CustomDatePicker from '../components/CustomDatePicker';
import StatsCard from '../components/StatsCard';

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
    <Modal isOpen={true} onClose={onClose} title="Project Details">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <p className="text-sm text-slate-500 dark:text-slate-400">Manage credentials for <strong>{customer?.companyName || 'Loading...'}</strong></p>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">NVR Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 px-4 py-3 rounded-xl text-slate-800 dark:text-white border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 outline-none transition-all"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">NVR Password</label>
            <div className="flex items-center space-x-2">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="flex-grow w-full bg-slate-50 dark:bg-slate-800 px-4 py-3 rounded-xl text-slate-800 dark:text-white border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 outline-none transition-all"
                required
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="px-3 py-3 text-sm font-bold text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300">
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>
          {visit.signatureDataUrl && (
            <div className="pt-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">Technician Signature</label>
              <div className="p-4 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800/50 flex justify-center">
                <img src={visit.signatureDataUrl} alt="Technician Signature" className="h-24 object-contain dark:invert" />
              </div>
            </div>
          )}
        </div>
        <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <button type="button" onClick={onClose} className="px-5 py-2.5 text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors">Cancel</button>
          <button type="submit" disabled={isSaving} className="px-5 py-2.5 text-sm font-bold text-white bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-400 rounded-xl shadow-lg shadow-primary-500/30 disabled:opacity-70 disabled:cursor-not-allowed transition-all">
            {isSaving ? 'Saving...' : 'Save Credentials'}
          </button>
        </div>
      </form>
    </Modal>
  );
};


const StatusIndicator: React.FC<{ status: string }> = ({ status }) => {
  const styles: { [key: string]: { bg: string, text: string, label: string, dot: string } } = {
    completed: { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-400', label: 'Completed', dot: 'bg-green-500' },
    in_progress: { bg: 'bg-orange-100 dark:bg-orange-900/30', text: 'text-orange-700 dark:text-orange-400', label: 'Ongoing', dot: 'bg-orange-500' },
    scheduled: { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-400', label: 'Scheduled', dot: 'bg-blue-500' },
    cancelled: { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-700 dark:text-red-400', label: 'Cancelled', dot: 'bg-red-500' },
  };
  const style = styles[status] || { bg: 'bg-slate-100 dark:bg-slate-800', text: 'text-slate-600 dark:text-slate-400', label: status, dot: 'bg-slate-400' };

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold capitalize ${style.bg} ${style.text} border border-transparent`}>
      <span className={`w-1.5 h-1.5 rounded-full mr-2 ${style.dot}`}></span>
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

  // Create Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);

  // Form state
  const [customerId, setCustomerId] = useState('');
  const [projectName, setProjectName] = useState('');
  const [date, setDate] = useState('');
  const [assignedTechnicians, setAssignedTechnicians] = useState<string[]>([]);

  const [isTechDropdownOpen, setIsTechDropdownOpen] = useState(false);
  const techDropdownRef = useRef<HTMLDivElement>(null);

  // Filter state
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [customerFilter, setCustomerFilter] = useState<string>('all');
  const [technicianFilter, setTechnicianFilter] = useState<string>('all');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const delay = new Promise(resolve => setTimeout(resolve, 800));
        const [visitsData, techniciansData, customersData] = await Promise.all([
          api.getVisits(),
          api.getTechnicians(),
          api.getCustomers(),
          delay
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

  // Close technician dropdown logic
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

    setCreateLoading(true);
    // Simulate slight delay for effect
    await new Promise(r => setTimeout(r, 600));

    const createdProject = await api.addProject(newProject);
    setVisits(prev => [createdProject, ...prev]);
    setCreateLoading(false);
    setIsCreateModalOpen(false);

    // Reset form
    setCustomerId('');
    setProjectName('');
    setDate('');
    setAssignedTechnicians([]);
  };

  const handleSaveItems = (visitId: number, items: JobCardItem[]) => {
    setVisits(prevVisits => prevVisits.map(v => v.id === visitId ? { ...v, items } : v));
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


  return (
    <div className="space-y-8 animate-fade-in-up">
      {managingVisit && <ManageItemsModal visit={managingVisit} onClose={() => setManagingVisit(null)} onSave={handleSaveItems} />}
      {managingCredentialsFor && <ProjectDetailsModal visit={managingCredentialsFor} onClose={() => setManagingCredentialsFor(null)} onSave={handleSaveCredentials} />}

      {/* Create Project Modal */}
      <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="Create New Project">
        <form onSubmit={handleCreateProject} className="space-y-6">
          <div>
            <div>
              <CustomSelect
                label="Customer"
                options={customers.map(c => ({ value: c.id.toString(), label: c.companyName }))}
                value={customerId}
                onChange={setCustomerId}
                placeholder="Select a customer"
              />
            </div>
          </div>

          <div>
            <label htmlFor="projectName" className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">Project Name</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <ProjectIcon className="h-5 w-5 text-slate-400" />
              </div>
              <input type="text" id="projectName" value={projectName} onChange={e => setProjectName(e.target.value)} placeholder="e.g., Main Gate CCTV Setup" className="block w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 outline-none transition-all text-slate-900 dark:text-slate-100 placeholder-slate-400" />
            </div>
          </div>

          <div className="z-20 relative">
            <CustomDatePicker
              label="Scheduled Date"
              selected={date ? new Date(date) : null}
              onChange={(d) => {
                if (d) {
                  const year = d.getFullYear();
                  const month = String(d.getMonth() + 1).padStart(2, '0');
                  const day = String(d.getDate()).padStart(2, '0');
                  setDate(`${year}-${month}-${day}`);
                } else {
                  setDate('');
                }
              }}
              placeholder="Select date..."
            />
          </div>

          <div>
            <label htmlFor="technicians" className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">Assign Technicians</label>
            <div className="relative" ref={techDropdownRef}>
              <button
                type="button"
                onClick={() => setIsTechDropdownOpen(prev => !prev)}
                className="block w-full px-4 py-3 text-left bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 outline-none min-h-[52px] transition-all"
              >
                {selectedTechnicianObjects.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {selectedTechnicianObjects.map(tech => (
                      <span key={tech.id} className="inline-flex items-center gap-1 pl-2 pr-1 py-0.5 bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300 text-xs font-bold rounded-lg border border-primary-200 dark:border-primary-800">
                        {tech.name}
                        <span
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleTechnician(tech.id.toString());
                          }}
                          className="p-0.5 hover:bg-primary-200 dark:hover:bg-primary-800 rounded-md cursor-pointer transition-colors"
                        >
                          &times;
                        </span>
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="text-slate-400 text-sm">Select technicians...</span>
                )}
              </button>
              {isTechDropdownOpen && (
                <div className="absolute z-30 mt-2 w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl ring-1 ring-black/5 overflow-hidden animate-fade-in-up">
                  <ul className="max-h-60 overflow-auto py-2 custom-scrollbar">
                    {technicians.map(tech => (
                      <li
                        key={tech.id}
                        onClick={() => handleToggleTechnician(tech.id.toString())}
                        className="px-4 py-3 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer flex items-center transition-colors group"
                      >
                        <div className={`w-5 h-5 rounded border flex items-center justify-center mr-3 transition-colors ${assignedTechnicians.includes(tech.id.toString()) ? 'bg-primary-500 border-primary-500' : 'border-slate-300 dark:border-slate-600 group-hover:border-primary-400'}`}>
                          {assignedTechnicians.includes(tech.id.toString()) && <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                        </div>
                        <span className="font-medium">{tech.name}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button type="button" onClick={() => setIsCreateModalOpen(false)} className="px-6 py-3 text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={createLoading} className="px-8 py-3 text-sm font-bold text-white bg-primary-600 hover:bg-primary-700 rounded-xl shadow-lg shadow-primary-500/30 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed">
              {createLoading ? 'Creating...' : 'Create Project'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Header and Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-800 dark:text-white tracking-tight">Projects</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Manage, schedule, and track all your site visits.</p>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="inline-flex items-center justify-center px-5 py-2 text-sm font-semibold text-white bg-primary-500 border border-transparent rounded-lg shadow-sm hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
        >
          <span className="flex items-center">
            Create Project <ChevronRightIcon className="ml-2 w-4 h-4" />
          </span>
        </button>
      </div>

      {/* Main Content Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm overflow-hidden flex flex-col">
        {/* Card Header: Tabs & Filters */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/50 dark:bg-slate-800/50">
          {/* Status Tabs (Pills) */}
          <div className="flex p-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl self-start md:self-auto shadow-sm">
            {['all', 'scheduled', 'in_progress', 'completed'].map((tab) => (
              <button
                key={tab}
                onClick={() => setStatusFilter(tab)}
                className={`
                  px-4 py-2 text-sm font-bold rounded-lg transition-all duration-200
                  ${statusFilter === tab
                    ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                  }
                `}
              >
                {tab === 'all' ? 'All' :
                  tab === 'in_progress' ? 'Ongoing' :
                    tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* Filters (Compact) */}
          <div className="flex flex-col md:flex-row gap-3">
            <div className="min-w-[180px]">
              <CustomSelect
                options={[
                  { value: 'all', label: 'All Customers' },
                  ...customers.map(c => ({ value: c.id.toString(), label: c.companyName }))
                ]}
                value={customerFilter}
                onChange={setCustomerFilter}
                placeholder="Customer"
                className="w-full"
              />
            </div>
            <div className="min-w-[180px]">
              <CustomSelect
                options={[
                  { value: 'all', label: 'All Technicians' },
                  ...technicians.map(t => ({ value: t.id.toString(), label: t.name }))
                ]}
                value={technicianFilter}
                onChange={setTechnicianFilter}
                placeholder="Technician"
                className="w-full"
              />
            </div>
          </div>
        </div>

        {/* Table Container */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
            <thead className="bg-slate-50 dark:bg-slate-800">
              <tr>
                <th scope="col" className="px-6 py-5 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Project / Customer</th>
                <th scope="col" className="px-6 py-5 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Date</th>
                <th scope="col" className="px-6 py-5 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Technician</th>
                <th scope="col" className="px-6 py-5 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Items</th>
                <th scope="col" className="px-6 py-5 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                <th scope="col" className="relative px-6 py-5"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-slate-900 divide-y divide-slate-200 dark:divide-slate-700">
              {loading ? (
                // Skeleton Rows
                Array.from({ length: 5 }).map((_, idx) => (
                  <tr key={idx}>
                    <td className="px-6 py-5 whitespace-nowrap"><Skeleton width={180} height={20} className="mb-2" /><Skeleton width={120} height={16} /></td>
                    <td className="px-6 py-5 whitespace-nowrap"><Skeleton width={100} height={20} /></td>
                    <td className="px-6 py-5 whitespace-nowrap"><Skeleton width={40} height={20} /></td>
                    <td className="px-6 py-5 whitespace-nowrap"><Skeleton width={80} height={24} className="rounded-full" /></td>
                    <td className="px-6 py-5 whitespace-nowrap text-right"><Skeleton width={100} height={32} className="ml-auto" /></td>
                  </tr>
                ))
              ) : filteredVisits.length > 0 ? (
                filteredVisits.map((visit) => (
                  <tr key={visit.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors duration-150 group">
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400 font-bold mr-3 group-hover:scale-110 transition-transform">
                          {visit.projectName ? visit.projectName.charAt(0).toUpperCase() : '#'}
                        </div>
                        <div>
                          {visit.projectName && (
                            <div
                              onClick={() => navigate(`/projects/${visit.id}`)}
                              className="text-sm font-bold text-slate-800 dark:text-white mb-0.5 cursor-pointer hover:text-primary-600 hover:underline transition-colors"
                            >
                              {visit.projectName}
                            </div>
                          )}
                          <div className={`text-sm ${visit.projectName ? 'text-slate-500 dark:text-slate-400' : 'font-bold text-slate-900 dark:text-white'}`}>{getCustomerName(visit.customerId)}</div>
                        </div>
                      </div>
                      <div className="text-xs text-slate-400 dark:text-slate-500 mt-1 ml-13 pl-13 flex items-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-300 mr-2"></span>
                        {getTechnicianNames(visit.technicianIds)}
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-sm text-slate-600 dark:text-slate-300 font-medium">
                      {new Date(visit.scheduledAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="flex -space-x-2 overflow-hidden">
                        {visit.technicianIds && visit.technicianIds.length > 0 ? (
                          visit.technicianIds.map((techId, index) => {
                            const tech = technicians.find(t => t.id === techId);
                            if (!tech) return null;
                            return (
                              <div key={techId} className="group/tech relative inline-block">
                                <div className="h-8 w-8 rounded-full ring-2 ring-white dark:ring-slate-900 bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-600 dark:text-slate-300 uppercase" title={tech.name}>
                                  {tech.name.substring(0, 2)}
                                </div>
                                {/* Tooltip */}
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs font-medium text-white bg-slate-800 rounded opacity-0 group-hover/tech:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
                                  {tech.name}
                                </div>
                              </div>
                            );
                          })
                        ) : (
                          <span className="text-xs text-slate-400 italic">Unassigned</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300">
                        {visit.items.reduce((acc, item) => acc + item.qty, 0)}
                      </span>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-sm">
                      <div className="flex items-center space-x-2">
                        <StatusIndicator status={visit.status} />
                        {visit.signatureDataUrl && visit.status === 'completed' && (
                          <span title="Signed by Technician" className="text-green-500 dark:text-green-400 bg-green-50 dark:bg-green-900/20 p-1 rounded-full">
                            <SignatureIcon className="h-3 w-3" />
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {isEnterprise && visit.status === 'completed' && (
                          <button onClick={() => navigate('/billing/new', { state: { visit } })} className="px-3 py-1.5 text-xs font-bold text-white bg-green-500 hover:bg-green-600 rounded-lg shadow-sm transition-colors">
                            Invoice
                          </button>
                        )}
                        <button onClick={() => setManagingCredentialsFor(visit)} className="inline-flex items-center px-3 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors border border-transparent dark:border-slate-700" title="Manage Details">
                          <KeyIcon className="h-3.5 w-3.5 mr-1.5 text-slate-400" />
                          Details
                        </button>
                        <button onClick={() => setManagingVisit(visit)} className="px-3 py-1.5 text-xs font-bold text-primary-700 dark:text-primary-300 bg-primary-50 dark:bg-primary-900/40 hover:bg-primary-100 dark:hover:bg-primary-900/60 rounded-lg transition-colors border border-transparent dark:border-primary-800/30">
                          Items
                        </button>
                        {visit.chalan ? (
                          <a href={visit.chalan.pdfPath} target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-3 py-1.5 text-xs font-bold text-green-700 dark:text-green-300 bg-green-50 dark:bg-green-900/40 hover:bg-green-100 dark:hover:bg-green-900/60 rounded-lg transition-colors">
                            <DownloadIcon className="h-3.5 w-3.5 mr-1.5" />
                            Chalan
                          </a>
                        ) : (
                          <button
                            onClick={() => handleGenerateChalan(visit.id)}
                            disabled={generatingChalanId === visit.id || visit.items.length === 0}
                            className="px-3 py-1.5 text-xs font-bold text-white bg-indigo-500 hover:bg-indigo-600 rounded-lg shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            {generatingChalanId === visit.id ? '...' : 'Chalan'}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))) : (
                <tr>
                  <td colSpan={5} className="text-center px-6 py-20 text-slate-500 dark:text-slate-400">
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                        <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.586a1 1 0 0 1 .707.293l5.414 5.414a1 1 0 0 1 .293.707V19a2 2 0 0 1-2 2z" /></svg>
                      </div>
                      <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-1">No projects found</h3>
                      <p className="text-sm">Try adjusting your filters or create a new project.</p>
                    </div>
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

export default ProjectsPage;