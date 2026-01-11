import React, { useState, useEffect, useRef, useMemo } from 'react';
import { api } from '../services/api';
import { Visit, Technician, Customer } from '../types';
import PipelineBoard from '../components/PipelineBoard';
import { PlusIcon, ProjectIcon } from '../components/icons';
import { Link } from 'react-router-dom';
import Modal from '../components/Modal';
import CustomSelect from '../components/CustomSelect';
import CustomDatePicker from '../components/CustomDatePicker';

const VisitsPipelinePage: React.FC = () => {
    const [visits, setVisits] = useState<Visit[]>([]);
    const [technicians, setTechnicians] = useState<Technician[]>([]);
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(true);

    // Modal & Form State
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [createLoading, setCreateLoading] = useState(false);
    const [customerId, setCustomerId] = useState('');
    const [projectName, setProjectName] = useState('');
    const [date, setDate] = useState('');
    const [assignedTechnicians, setAssignedTechnicians] = useState<string[]>([]);
    const [isTechDropdownOpen, setIsTechDropdownOpen] = useState(false);
    const techDropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetchData();

        // Click outside listener for tech dropdown
        const handleClickOutside = (event: MouseEvent) => {
            if (techDropdownRef.current && !techDropdownRef.current.contains(event.target as Node)) {
                setIsTechDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const fetchData = async () => {
        try {
            const [visitsData, techsData, customersData] = await Promise.all([
                api.getVisits(),
                api.getTechnicians(),
                api.getCustomers()
            ]);
            setVisits(visitsData);
            setTechnicians(techsData);
            setCustomers(customersData);
        } catch (error) {
            console.error("Failed to load pipeline data", error);
        } finally {
            setLoading(false);
        }
    };

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

    const handleCreateProject = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!customerId || assignedTechnicians.length === 0 || !date) {
            alert("Please fill all fields: Customer, Technicians, and Date.");
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
        try {
            await api.addProject(newProject);
            await fetchData(); // Refresh all data
            setIsCreateModalOpen(false);

            // Reset form
            setCustomerId('');
            setProjectName('');
            setDate('');
            setAssignedTechnicians([]);
        } catch (error) {
            console.error("Failed to create project", error);
            alert("Failed to create project.");
        } finally {
            setCreateLoading(false);
        }
    };

    return (
        <div className="h-full flex flex-col overflow-hidden">
            {/* Premium Header */}
            <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white shrink-0 shadow-lg z-10">
                <div className="max-w-7xl mx-auto px-6 py-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                            <h1 className="text-2xl font-bold flex items-center gap-2">
                                <span className="bg-white/20 p-1.5 rounded-lg"><ProjectIcon className="w-5 h-5 text-white" /></span>
                                Visit Pipeline
                            </h1>
                            <p className="text-slate-400 text-sm mt-1">Drag and drop to manage technician visits workflow.</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <Link
                                to="/projects"
                                className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/10 rounded-lg text-sm font-medium transition-colors backdrop-blur-sm"
                            >
                                List View
                            </Link>
                            <button
                                onClick={() => setIsCreateModalOpen(true)}
                                className="px-5 py-2 bg-primary-600 hover:bg-primary-500 text-white rounded-lg font-bold text-sm shadow-lg shadow-primary-900/20 transition-all flex items-center gap-2"
                            >
                                <PlusIcon className="w-4 h-4" />
                                <span>New Visit</span>
                            </button>
                        </div>
                    </div>

                    {/* Stats Bar */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-white/10">
                        <div>
                            <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Scheduled</p>
                            <p className="text-xl font-bold text-blue-400">{visits.filter(v => v.status === 'scheduled').length}</p>
                        </div>
                        <div>
                            <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">In Progress</p>
                            <p className="text-xl font-bold text-amber-400">{visits.filter(v => v.status === 'in_progress').length}</p>
                        </div>
                        <div>
                            <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Completed</p>
                            <p className="text-xl font-bold text-emerald-400">{visits.filter(v => v.status === 'completed').length}</p>
                        </div>
                        <div>
                            <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Total Active</p>
                            <p className="text-xl font-bold text-white">{visits.length}</p>
                        </div>
                    </div>
                </div>
            </div>

            <main className="flex-1 overflow-x-auto overflow-y-hidden px-6 py-8 bg-slate-50 dark:bg-black">
                {loading ? (
                    <div className="flex flex-col items-center justify-center h-full gap-3 text-slate-400">
                        <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-sm font-medium">Loading Pipeline...</p>
                    </div>
                ) : (
                    <div className="max-w-7xl mx-auto h-full">
                        <PipelineBoard
                            visits={visits}
                            technicians={technicians}
                            onVisitUpdate={fetchData} // Refresh data after drop
                        />
                    </div>
                )}
            </main>

            {/* Create Project Modal */}
            <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="Create New Project">
                <form onSubmit={handleCreateProject} className="space-y-6">
                    <div>
                        <CustomSelect
                            label="Customer"
                            options={customers.map(c => ({ value: c.id.toString(), label: c.companyName }))}
                            value={customerId}
                            onChange={setCustomerId}
                            placeholder="Select a customer"
                        />
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
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">Assign Technicians</label>
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
                                <div className="absolute z-30 mt-2 w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl ring-1 ring-black/5 overflow-hidden animate-fade-in-up max-h-60 overflow-y-auto custom-scrollbar">
                                    {technicians.map(tech => (
                                        <div
                                            key={tech.id}
                                            onClick={() => handleToggleTechnician(tech.id.toString())}
                                            className="px-4 py-3 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer flex items-center transition-colors group"
                                        >
                                            <div className={`w-5 h-5 rounded border flex items-center justify-center mr-3 transition-colors ${assignedTechnicians.includes(tech.id.toString()) ? 'bg-primary-500 border-primary-500' : 'border-slate-300 dark:border-slate-600 group-hover:border-primary-400'}`}>
                                                {assignedTechnicians.includes(tech.id.toString()) && <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                                            </div>
                                            <span className="font-medium">{tech.name}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
                        <button type="button" onClick={() => setIsCreateModalOpen(false)} className="px-6 py-2.5 text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors">
                            Cancel
                        </button>
                        <button type="submit" disabled={createLoading} className="px-8 py-2.5 text-sm font-bold text-white bg-primary-600 hover:bg-primary-700 rounded-xl shadow-lg shadow-primary-500/30 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed">
                            {createLoading ? 'Creating...' : 'Create Project'}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default VisitsPipelinePage;
