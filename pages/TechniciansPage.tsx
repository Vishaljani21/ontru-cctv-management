// FIX: Create a skeleton component for the TechniciansPage
import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import type { Technician } from '../types';

const TechniciansPage: React.FC = () => {
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTechnicians = async () => {
      try {
        const data = await api.getTechnicians();
        setTechnicians(data);
      } catch (error) {
        console.error("Failed to fetch technicians", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTechnicians();
  }, []);

  if (loading) {
    return <div>Loading technicians...</div>
  }

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-slate-800">Technicians</h2>
      <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Phone</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Specialization</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {technicians.map(tech => (
              <tr key={tech.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{tech.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{tech.phone}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{tech.specialization}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TechniciansPage;
