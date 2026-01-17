import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Technician, TechnicianTask } from '../types';
import { PlusIcon, CheckCircleIcon, ClockIcon } from '@heroicons/react/24/outline';
import CustomSelect from '../components/CustomSelect';

const TaskManagerPage: React.FC = () => {
    const [technicians, setTechnicians] = useState<Technician[]>([]);
    const [selectedTech, setSelectedTech] = useState<Technician | null>(null);
    const [tasks, setTasks] = useState<TechnicianTask[]>([]);
    const [newTaskDesc, setNewTaskDesc] = useState('');
    const [dueDate, setDueDate] = useState(new Date().toISOString().split('T')[0]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadTechnicians();
    }, []);

    useEffect(() => {
        if (selectedTech) {
            loadTasks(selectedTech.id);
        }
    }, [selectedTech]);

    const loadTechnicians = async () => {
        try {
            const data = await api.getTechnicians();
            setTechnicians(data);
            if (data.length > 0) setSelectedTech(data[0]);
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    const loadTasks = async (techId: number) => {
        try {
            const data = await api.getTechnicianTasks(techId);
            setTasks(data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleAddTask = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedTech || !newTaskDesc) return;

        try {
            await api.createTask({
                technician_id: selectedTech.id,
                description: newTaskDesc,
                due_date: dueDate
            });
            setNewTaskDesc('');
            loadTasks(selectedTech.id);
        } catch (error) {
            console.error(error);
            alert('Failed to add task');
        }
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <header className="mb-8">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                    Task Management
                </h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2">Assign and monitor daily tasks for your team.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Technician Sidebar List */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-4 h-fit">
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 px-2">Technicians</h2>
                    <div className="space-y-2">
                        {technicians.map(tech => (
                            <button
                                key={tech.id}
                                onClick={() => setSelectedTech(tech)}
                                className={`w-full text-left px-4 py-3 rounded-xl transition-all ${selectedTech?.id === tech.id
                                    ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 font-medium shadow-sm ring-1 ring-primary-500/10'
                                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                                    }`}
                            >
                                {tech.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Task Panel */}
                <div className="lg:col-span-3 space-y-6">
                    {/* Add Task Form */}
                    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Assign New Task</h3>
                        <form onSubmit={handleAddTask} className="flex flex-col md:flex-row gap-4 items-end">
                            <div className="flex-1 w-full">
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Description</label>
                                <input
                                    type="text"
                                    value={newTaskDesc}
                                    onChange={e => setNewTaskDesc(e.target.value)}
                                    placeholder="E.g., Check wiring at Godown A..."
                                    className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all"
                                />
                            </div>
                            <div className="w-full md:w-48">
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Due Date</label>
                                <input
                                    type="date"
                                    value={dueDate}
                                    onChange={e => setDueDate(e.target.value)}
                                    className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={!newTaskDesc}
                                className="w-full md:w-auto px-6 py-2 bg-gradient-to-r from-primary-600 to-primary-600 hover:from-primary-700 hover:to-primary-700 text-white rounded-xl font-medium shadow-lg shadow-primary-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <PlusIcon className="w-5 h-5" />
                                <span>Assign</span>
                            </button>
                        </form>
                    </div>

                    {/* Task List */}
                    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                        <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Active Tasks</h3>
                            <span className="text-sm text-slate-500">{tasks.filter(t => t.status === 'pending').length} Pending</span>
                        </div>

                        {tasks.length === 0 ? (
                            <div className="p-8 text-center text-slate-400">
                                No tasks assigned for this technician.
                            </div>
                        ) : (
                            <div className="divide-y divide-slate-100 dark:divide-slate-700">
                                {tasks.map(task => (
                                    <div key={task.id} className="p-4 flex items-center justify-between group hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                                        <div className="flex items-start gap-4">
                                            <div className={`mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center
                                                        ${task.status === 'completed'
                                                    ? 'border-green-500 bg-green-50 text-green-600 dark:bg-green-900/20'
                                                    : 'border-slate-300 dark:border-slate-600'}`}>
                                                {task.status === 'completed' && <CheckCircleIcon className="w-4 h-4" />}
                                            </div>
                                            <div>
                                                <p className={`text-sm font-medium ${task.status === 'completed' ? 'text-slate-400 line-through' : 'text-slate-700 dark:text-slate-200'}`}>
                                                    {task.description}
                                                </p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className={`text-xs px-2 py-0.5 rounded-full flex items-center gap-1
                                                                ${task.status === 'completed'
                                                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                                            : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'}`}>
                                                        {task.status === 'completed' ? 'Completed' : 'Pending'}
                                                    </span>
                                                    <span className="text-xs text-slate-400 flex items-center gap-1">
                                                        <ClockIcon className="w-3 h-3" />
                                                        Due: {new Date(task.due_date).toLocaleDateString()}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TaskManagerPage;
