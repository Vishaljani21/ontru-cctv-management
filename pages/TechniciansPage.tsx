import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import type { Technician } from '../types';
import Skeleton from '../components/Skeleton';
import { UserIcon, PlusIcon, CrossIcon } from '../components/icons';
import Modal from '../components/Modal';
import CustomSelect from '../components/CustomSelect';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

const TechniciansPage: React.FC = () => {
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [submitLoading, setSubmitLoading] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    specialization: ''
  });

  const specializations = [
    { value: 'General Installation', label: 'General Installation' },
    { value: 'Network Specialist', label: 'Network Specialist' },
    { value: 'Maintenance Expert', label: 'Maintenance Expert' },
    { value: 'Access Control', label: 'Access Control' },
    { value: 'Senior Technician', label: 'Senior Technician' }
  ];

  const fetchTechnicians = async () => {
    try {
      const delay = new Promise(resolve => setTimeout(resolve, 800));
      const [data] = await Promise.all([api.getTechnicians(), delay]);
      setTechnicians(data);
    } catch (error) {
      console.error("Failed to fetch technicians", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTechnicians();
  }, []);

  const openCreateModal = () => {
    setModalMode('create');
    setFormData({ name: '', phone: '', specialization: '' });
    setEditingId(null);
    setIsModalOpen(true);
  };

  const openEditModal = (tech: Technician) => {
    setModalMode('edit');
    setFormData({
      name: tech.name,
      phone: tech.phone || '',
      specialization: tech.specialization || ''
    });
    setEditingId(tech.id);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;

    setSubmitLoading(true);
    try {
      if (modalMode === 'create') {
        await api.addTechnician({
          name: formData.name,
          phone: formData.phone,
          specialization: formData.specialization || 'General Installation',
          status: 'active'
        });
      } else if (modalMode === 'edit' && editingId) {
        await api.updateTechnician(editingId, {
          name: formData.name,
          phone: formData.phone,
          specialization: formData.specialization,
        });
      }

      await fetchTechnicians();
      setIsModalOpen(false);
    } catch (error: any) {
      console.error("Failed to save technician", error);
      alert(`Failed to save technician: ${error.message || 'Unknown error'}`);
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this technician?")) return;

    try {
      await api.deleteTechnician(id);
      setTechnicians(prev => prev.filter(t => t.id !== id));
    } catch (error: any) {
      console.error("Failed to delete technician", error);
      alert("Failed to delete technician. They may be assigned to visits.");
    }
  };

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-800 dark:text-white tracking-tight">Technicians</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Manage your field team and view their profiles.</p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center justify-center px-5 py-2 text-sm font-semibold text-white bg-primary-500 border border-transparent rounded-lg shadow-sm hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
        >
          <span className="flex items-center">
            Add Technician <PlusIcon className="ml-2 w-4 h-4" />
          </span>
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
            <thead className="bg-slate-50 dark:bg-slate-800">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Name</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Phone</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Specialization</th>
                <th className="px-6 py-4 text-center text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-slate-900 divide-y divide-slate-200 dark:divide-slate-700">
              {loading ? (
                // Skeleton Rows
                Array.from({ length: 5 }).map((_, idx) => (
                  <tr key={idx}>
                    <td className="px-6 py-4 whitespace-nowrap flex items-center">
                      <Skeleton variant="circular" width={32} height={32} className="mr-3" />
                      <Skeleton width={120} height={16} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap"><Skeleton width={100} height={16} /></td>
                    <td className="px-6 py-4 whitespace-nowrap"><Skeleton width={140} height={16} /></td>
                    <td className="px-6 py-4 whitespace-nowrap text-right"><Skeleton width={60} height={20} className="ml-auto rounded-full" /></td>
                    <td className="px-6 py-4 whitespace-nowrap text-right"><Skeleton width={80} height={20} className="ml-auto" /></td>
                  </tr>
                ))
              ) : (
                technicians.map(tech => (
                  <tr key={tech.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-primary-100 dark:bg-primary-900/40 flex items-center justify-center text-primary-600 dark:text-primary-400 font-bold mr-3">
                          <UserIcon className="w-4 h-4" />
                        </div>
                        <div className="text-sm font-bold text-slate-900 dark:text-white">{tech.name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">{tech.phone}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-300">
                        {tech.specialization}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${tech.status === 'active'
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                        }`}>
                        <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${tech.status === 'active' ? 'bg-green-500' : 'bg-slate-400'
                          }`}></span>
                        {tech.status === 'active' ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-3">
                        <button
                          onClick={() => openEditModal(tech)}
                          className="text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                          title="Edit"
                        >
                          <PencilIcon className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(tech.id)}
                          className="text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                          title="Delete"
                        >
                          <TrashIcon className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {!loading && technicians.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-500 dark:text-slate-400">No technicians found.</p>
            <button
              onClick={openCreateModal}
              className="mt-4 text-primary-600 hover:text-primary-700 font-medium text-sm"
            >
              Add your first technician
            </button>
          </div>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalMode === 'create' ? "Add New Technician" : "Edit Technician"}
        maxWidth="max-w-md"
        allowOverflow={true}
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="techName" className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              Full Name
            </label>
            <input
              type="text"
              id="techName"
              required
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. John Doe"
              className="block w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 outline-none transition-all text-slate-900 dark:text-slate-100 placeholder-slate-400"
            />
          </div>

          <div>
            <label htmlFor="techPhone" className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              Phone Number
            </label>
            <input
              type="tel"
              id="techPhone"
              required
              value={formData.phone}
              onChange={e => setFormData({ ...formData, phone: e.target.value })}
              placeholder="e.g. +91 98765 43210"
              className="block w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 outline-none transition-all text-slate-900 dark:text-slate-100 placeholder-slate-400"
            />
          </div>

          <CustomSelect
            label="Specialization"
            options={specializations}
            value={formData.specialization}
            onChange={value => setFormData({ ...formData, specialization: value })}
            placeholder="Select specialization"
          />

          <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100 dark:border-slate-800 mt-6">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitLoading}
              className="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium shadow-lg shadow-primary-600/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {submitLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : (
                modalMode === 'create' ? 'Add Technician' : 'Save Changes'
              )}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default TechniciansPage;
