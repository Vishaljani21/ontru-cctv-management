import { AuthContext } from '../../App';
import React, { useState, useEffect, useContext } from 'react';
import { api } from '../../services/api';
import { TechnicianTask } from '../../types';
import { CheckCircleIcon, CalendarIcon } from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleSolid } from '@heroicons/react/24/solid';
import StatsCard from '../../components/StatsCard';

// Assume basic header/sidebar layout is handled by a wrapper or copied for Technician view
// Note: Technician Layout usually includes a Header with Back button or Title.

const MyTasksPage: React.FC = () => {
    const authContext = useContext(AuthContext);
    const user = authContext?.user;
    const [tasks, setTasks] = useState<TechnicianTask[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            loadTasks();
        }
    }, [user]);

    const loadTasks = async () => {
        try {
            // Need to get tech ID first. Assuming tech ID = user.id (which is mapped to helper in api.ts)
            // Wait, api.getTechnicianTasks expects techId (number), but user.id is 'string' mapped to number?
            // Actually in api.ts: id: parseInt(data.user.id.slice(-8), 16)
            // But we need the TECHNICIAN TABLE id, not the user id.
            // Technician table: profile_id = user.id.
            // We need a helper to get *my* technician record.

            // Temporary Workaround: Update api.getMyTechnicianProfile or something
            // For now, let's assume we can fetch tasks by profile_id if we update API, or we fetch tech profile first.

            // Let's rely on api.getTechnicianAvailability strategy which queries by profile_id.
            // I'll update the API call in this component to be robust or update API service.
            // For now, I'll update loadTasks to use a new API method or logic:

            // Get tech details
            const techs = await api.getTechnicians(); // This is for DEALER to get their techs.
            // Setup for technician is slightly different.

            // Let's assume for this step we need a `getMyTasks()` method in API that handles the ID resolution.
            // I'll add `getMyTasks` to API later or now. I'll simulate it by adding logic here.

            const techData = await api.getTechnicianAvailability(); // This gets avail status, but we need ID.

            // Actually, best to add api.getMyTasks().
            const myTasks = await api.getMyTasks(); // I'll add this next tool call.
            setTasks(myTasks);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const toggleTask = async (task: TechnicianTask) => {
        try {
            const newStatus = task.status === 'pending' ? 'completed' : 'pending';

            // Optimistic update
            setTasks(prev => prev.map(t => t.id === task.id ? { ...t, status: newStatus } : t));

            await api.updateTaskStatus(task.id, newStatus);
        } catch (error) {
            console.error(error);
            // Revert
            loadTasks();
        }
    };

    const pendingCount = tasks.filter(t => t.status === 'pending').length;

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-20">
            <header className="bg-white dark:bg-slate-800 shadow-sm sticky top-0 z-10">
                <div className="px-6 py-4 flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-bold text-slate-900 dark:text-white">Daily Tasks</h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Keep up with your daily assignments</p>
                    </div>
                    {/* Add Theme Toggle or Profile here if needed */}
                </div>
            </header>

            <div className="p-6 max-w-lg mx-auto space-y-6">

                {/* Summary Card */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl p-4 text-white shadow-lg shadow-indigo-500/20">
                        <p className="text-indigo-100 text-sm font-medium">Pending</p>
                        <p className="text-3xl font-bold mt-1">{pendingCount}</p>
                    </div>
                    <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-200 dark:border-slate-700 shadow-sm">
                        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Completed</p>
                        <p className="text-3xl font-bold mt-1 text-slate-900 dark:text-white">
                            {tasks.filter(t => t.status === 'completed').length}
                        </p>
                    </div>
                </div>

                {/* Task List */}
                <div className="space-y-3">
                    <h2 className="text-md font-semibold text-slate-900 dark:text-white px-1">Today's List</h2>

                    {loading ? (
                        <div className="text-center py-10 text-slate-400">Loading tasks...</div>
                    ) : tasks.length === 0 ? (
                        <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 text-center shadow-sm border border-slate-200 dark:border-slate-700">
                            <CheckCircleIcon className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                            <p className="text-slate-500">All caught up! No tasks assigned.</p>
                        </div>
                    ) : (
                        tasks.map(task => (
                            <div
                                key={task.id}
                                onClick={() => toggleTask(task)}
                                className={`bg-white dark:bg-slate-800 p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-4 active:scale-[0.98]
                                    ${task.status === 'completed'
                                        ? 'border-green-200 dark:border-green-900/30 bg-green-50/50 dark:bg-green-900/10'
                                        : 'border-slate-200 dark:border-slate-700 shadow-sm hover:border-primary-200 dark:hover:border-primary-700'}`}
                            >
                                <div className={`flex-shrink-0 mt-0.5 transition-colors ${task.status === 'completed' ? 'text-green-500' : 'text-slate-300'}`}>
                                    {task.status === 'completed' ? (
                                        <CheckCircleSolid className="w-6 h-6" />
                                    ) : (
                                        <div className="w-6 h-6 rounded-full border-2 border-current" />
                                    )}
                                </div>
                                <div className="flex-1">
                                    <p className={`font-medium text-sm leading-snug ${task.status === 'completed' ? 'text-slate-500 line-through' : 'text-slate-900 dark:text-white'}`}>
                                        {task.description}
                                    </p>
                                    <div className="flex items-center gap-2 mt-2">
                                        <span className={`text-xs px-2 py-0.5 rounded-md flex items-center gap-1 font-medium w-fit
                                            ${task.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'}`}>
                                            <CalendarIcon className="w-3 h-3" />
                                            {new Date(task.due_date).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default MyTasksPage;
