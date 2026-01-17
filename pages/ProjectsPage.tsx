
import React, { useState, useEffect, useContext, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Visit, Technician, Customer, JobCardItem } from '../types';
import { api } from '../services/api';
import { AppContext, AppContextType } from '../components/contexts';
import ManageItemsModal from '../components/ManageItemsModal';
import { DownloadIcon, KeyIcon, SignatureIcon, ChevronRightIcon, ProjectIcon, UserIcon } from '../components/icons';
import Skeleton from '../components/Skeleton';
import Modal from '../components/Modal';
import CustomSelect from '../components/CustomSelect';
import CustomDatePicker from '../components/CustomDatePicker';
import StatsCard from '../components/StatsCard';
import PageHeader from '../components/PageHeader';

// ... (Keep generic modal components if they are internal, or move them? I will presume they are fine inline for now but better to keep the file concise. I will preserve the Modals but update the Main Component Render)

const ProjectDetailsModal: React.FC<{
  visit: Visit;
  onClose: () => void;
  onSave: (visitId: number, username: string, password: string) => Promise<void>;
}> = ({ visit, onClose, onSave }) => {
  // ... (Keep existing logic mostly, but styling update)
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
    <Modal isOpen={true} onClose={onClose} title="Project Credentials">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <p className="text-sm text-slate-500">Manage credentials for <strong className="text-slate-900 dark:text-white">{customer?.companyName || 'Loading...'}</strong></p>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">NVR Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900 px-4 py-3 rounded-xl text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-primary-500/50"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">NVR Password</label>
            <div className="flex items-center space-x-2">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="flex-grow w-full bg-slate-50 dark:bg-slate-900 px-4 py-3 rounded-xl text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-primary-500/50"
                required
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="px-3 py-3 text-sm font-bold text-primary-600 hover:text-primary-700">
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>
        </div>
        <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <button type="button" onClick={onClose} className="px-5 py-2.5 text-sm font-bold text-slate-500 hover:bg-slate-100 rounded-xl transition-colors">Cancel</button>
          <button type="submit" disabled={isSaving} className="px-5 py-2.5 text-sm font-bold text-white bg-primary-600 hover:bg-primary-700 rounded-xl shadow-lg shadow-primary-500/30 transition-all">
            {isSaving ? 'Saving...' : 'Save Credentials'}
          </button>
        </div>
      </form>
    </Modal>
  );
};


const StatusIndicator: React.FC<{ status: string }> = ({ status }) => {
  const styles: { [key: string]: { bg: string, text: string, label: string, dot: string } } = {
    completed: { bg: 'bg-emerald-500/10', text: 'text-emerald-600', label: 'Completed', dot: 'bg-emerald-500' },
    in_progress: { bg: 'bg-amber-500/10', text: 'text-amber-600', label: 'In Progress', dot: 'bg-amber-500' },
    scheduled: { bg: 'bg-primary-500/10', text: 'text-primary-600', label: 'Scheduled', dot: 'bg-primary-500' },
    cancelled: { bg: 'bg-rose-500/10', text: 'text-rose-600', label: 'Cancelled', dot: 'bg-rose-500' },
  };
  const style = styles[status] || { bg: 'bg-slate-100', text: 'text-slate-600', label: status, dot: 'bg-slate-400' };

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${style.bg} ${style.text} border border-transparent`}>
      <span className={`w-1.5 h-1.5 rounded-full mr-2 ${style.dot} animate-pulse`}></span>
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
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
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
    <div className="space-y-8 animate-fade-in-up pb-10">
      {managingVisit && <ManageItemsModal visit={managingVisit} onClose={() => setManagingVisit(null)} onSave={handleSaveItems} />}
      {managingCredentialsFor && <ProjectDetailsModal visit={managingCredentialsFor} onClose={() => setManagingCredentialsFor(null)} onSave={handleSaveCredentials} />}

      {/* Create Project Modal */}
      <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="Create New Project">
        <form onSubmit={handleCreateProject} className="space-y-6">
          {/* ... (Keep form content same but improved input classes if needed - assuming generic styling for brevity here as focus is on listing page) */}
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
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Project Name</label>
            <input type="text" value={projectName} onChange={e => setProjectName(e.target.value)} className="block w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500/50 outline-none" placeholder="e.g. CCTV Installation..." />
          </div>
          <CustomDatePicker label="Date" selected={date ? new Date(date) : null} onChange={(d) => d ? setDate(d.toISOString().split('T')[0]) : setDate('')} />
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Assign Technicians</label>
            <div className="relative" ref={techDropdownRef}>
              <button type="button" onClick={() => setIsTechDropdownOpen(!isTechDropdownOpen)} className="block w-full px-4 py-3 text-left bg-slate-50 border border-slate-200 rounded-xl">
                {selectedTechnicianObjects.length > 0 ? selectedTechnicianObjects.map(t => t.name).join(', ') : 'Select...'}
              </button>
              {isTechDropdownOpen && (
                <div className="absolute z-10 mt-1 w-full bg-white border border-slate-200 rounded-xl shadow-xl max-h-60 overflow-auto">
                  {technicians.map(t => (
                    <div key={t.id} onClick={() => handleToggleTechnician(t.id.toString())} className={`px-4 py-2 cursor-pointer hover:bg-slate-50 ${assignedTechnicians.includes(t.id.toString()) ? 'bg-primary-50 text-primary-600 font-bold' : ''}`}>
                      {t.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={() => setIsCreateModalOpen(false)} className="px-6 py-3 font-bold text-slate-500">Cancel</button>
            <button type="submit" className="px-6 py-3 font-bold text-white bg-primary-600 rounded-xl shadow-lg shadow-primary-500/30">Create</button>
          </div>
        </form>
      </Modal>

      {/* Standard Page Header */}
      <PageHeader
        title="Projects"
        description="Manage site installations, track progress, and assign technicians efficiently."
        action={
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex items-center justify-center px-6 py-3 text-sm font-bold text-white bg-primary-600 hover:bg-primary-500 rounded-xl shadow-lg shadow-primary-500/30 transition-all hover:-translate-y-0.5"
          >
            <span className="mr-2">+</span> Create Project
          </button>
        }
      >
        {/* Embedded Stats in Header */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 text-center border border-white/5">
            <p className="text-3xl font-bold text-white">{visits.length}</p>
            <p className="text-xs text-primary-200 font-bold uppercase tracking-widest mt-1">Total</p>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 text-center border border-white/5">
            <p className="text-3xl font-bold text-blue-300">{visits.filter(v => v.status === 'scheduled').length}</p>
            <p className="text-xs text-blue-200 font-bold uppercase tracking-widest mt-1">Scheduled</p>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 text-center border border-white/5">
            <p className="text-3xl font-bold text-amber-300">{visits.filter(v => v.status === 'in_progress').length}</p>
            <p className="text-xs text-amber-200 font-bold uppercase tracking-widest mt-1">In Progress</p>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 text-center border border-white/5">
            <p className="text-3xl font-bold text-emerald-300">{visits.filter(v => v.status === 'completed').length}</p>
            <p className="text-xs text-emerald-200 font-bold uppercase tracking-widest mt-1">Completed</p>
          </div>
        </div>
      </PageHeader>

      {/* Main Content Card (Glassmorphism) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-[0_2px_20px_rgba(0,0,0,0.02)] overflow-hidden flex flex-col min-h-[600px]">
        {/* Toolbar */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-sm">
          {/* Status Tabs */}
          <div className="flex p-1 bg-white dark:bg-black border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-x-auto">
            {['all', 'scheduled', 'in_progress', 'completed'].map((tab) => (
              <button
                key={tab}
                onClick={() => setStatusFilter(tab)}
                className={`
                  whitespace-nowrap px-6 py-2.5 text-sm font-bold rounded-lg transition-all duration-200
                  ${statusFilter === tab
                    ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                  }
                `}
              >
                {tab === 'all' ? 'All Projects' :
                  tab === 'in_progress' ? 'Ongoing' :
                    tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          <div className="flex gap-3">
            {/* View Toggles */}
            <div className="flex bg-white dark:bg-black border border-slate-200 dark:border-slate-800 rounded-xl p-1 shadow-sm">
              <button onClick={() => setViewMode('cards')} className={`p-2 rounded-lg ${viewMode === 'cards' ? 'bg-primary-50 text-primary-600' : 'text-slate-400'}`}>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
              </button>
              <button onClick={() => setViewMode('table')} className={`p-2 rounded-lg ${viewMode === 'table' ? 'bg-primary-50 text-primary-600' : 'text-slate-400'}`}>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 md:p-8 bg-slate-50/30 dark:bg-black/20 flex-1">
          {viewMode === 'cards' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {loading ? Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-64 bg-white rounded-3xl animate-pulse"></div>) :
                filteredVisits.map(visit => {
                  // Simplify Card Logic for brevity - reusing styles
                  const customer = customers.find(c => c.id === visit.customerId);
                  return (
                    <div key={visit.id} onClick={() => navigate(`/projects/${visit.id}`)} className="group bg-white dark:bg-black rounded-3xl border border-slate-200 dark:border-slate-800 p-6 hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:border-primary-500/30 transition-all cursor-pointer relative overflow-hidden">
                      <div className="flex justify-between items-start mb-4">
                        <div className="font-bold text-lg text-slate-800 dark:text-white truncate pr-4">{visit.projectName}</div>
                        <StatusIndicator status={visit.status} />
                      </div>
                      <div className="text-sm text-slate-500 mb-6 flex items-center gap-2">
                        <span className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-xs text-slate-600">{customer?.companyName.charAt(0)}</span>
                        {customer?.companyName}
                      </div>
                      <div className="border-t border-slate-100 dark:border-slate-800 pt-4 flex justify-between items-center">
                        <span className="text-xs font-bold text-slate-400">{new Date(visit.scheduledAt).toLocaleDateString()}</span>
                        <span className="text-xs font-bold text-primary-600 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">View Details <ChevronRightIcon className="w-3 h-3" /></span>
                      </div>
                    </div>
                  );
                })}
            </div>
          ) : (
            <div className="bg-white dark:bg-black rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
              <table className="w-full">
                <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">Project</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">Customer</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">Status</th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredVisits.map(visit => (
                    <tr key={visit.id} onClick={() => navigate(`/projects/${visit.id}`)} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer">
                      <td className="px-6 py-4 font-bold text-slate-800 dark:text-white">{visit.projectName}</td>
                      <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">{getCustomerName(visit.customerId)}</td>
                      <td className="px-6 py-4">
                        <StatusIndicator status={visit.status} />
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-xs font-bold text-primary-600">View</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectsPage;