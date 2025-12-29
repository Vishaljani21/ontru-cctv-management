// @ts-ignore
import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Visit, VisitStatus, Technician } from '../types';
import { api } from '../services/api';
import { LocationMarkerIcon, CheckCircleIcon, ClockIcon, UsersIcon } from './icons';

interface PipelineBoardProps {
    visits: Visit[];
    technicians: Technician[];
    onVisitUpdate: () => void;
}

const COLUMNS: { id: VisitStatus; title: string; color: string; borderColor: string; headerBg: string }[] = [
    { id: 'scheduled', title: 'Scheduled', color: 'text-blue-700 dark:text-blue-400', borderColor: 'border-blue-500', headerBg: 'bg-blue-50 dark:bg-blue-900/20' },
    { id: 'in_progress', title: 'In Progress', color: 'text-amber-700 dark:text-amber-400', borderColor: 'border-amber-500', headerBg: 'bg-amber-50 dark:bg-amber-900/20' },
    { id: 'completed', title: 'Completed', color: 'text-emerald-700 dark:text-emerald-400', borderColor: 'border-emerald-500', headerBg: 'bg-emerald-50 dark:bg-emerald-900/20' },
    { id: 'cancelled', title: 'Cancelled', color: 'text-red-700 dark:text-red-400', borderColor: 'border-red-500', headerBg: 'bg-red-50 dark:bg-red-900/20' },
];

const PipelineBoard: React.FC<PipelineBoardProps> = ({ visits, technicians, onVisitUpdate }) => {
    // Local state for optimistic UI updates
    const [boardData, setBoardData] = useState<{ [key in VisitStatus]: Visit[] }>({
        scheduled: [],
        in_progress: [],
        completed: [],
        cancelled: []
    });

    useEffect(() => {
        // Group visits by status
        const grouped = {
            scheduled: visits.filter(v => v.status === 'scheduled'),
            in_progress: visits.filter(v => v.status === 'in_progress'),
            completed: visits.filter(v => v.status === 'completed'),
            cancelled: visits.filter(v => v.status === 'cancelled')
        };
        setBoardData(grouped);
    }, [visits]);

    const handleDragEnd = async (result: DropResult) => {
        const { source, destination, draggableId } = result;

        if (!destination) return;
        if (source.droppableId === destination.droppableId) return; // No reordering inside column for now (optional)

        const visitId = parseInt(draggableId);
        const newStatus = destination.droppableId as VisitStatus;
        const oldStatus = source.droppableId as VisitStatus;

        // Optimistic Update
        const sourceList = [...boardData[oldStatus]];
        const destList = [...boardData[newStatus]];
        const [movedVisit] = sourceList.splice(source.index, 1);

        if (!movedVisit) return;

        const updatedVisit = { ...movedVisit, status: newStatus };
        destList.splice(destination.index, 0, updatedVisit);

        setBoardData({
            ...boardData,
            [oldStatus]: sourceList,
            [newStatus]: destList
        });

        // API Call
        try {
            await api.updateVisitStatus(visitId, newStatus);
            onVisitUpdate(); // Refresh fully to ensure consistency
        } catch (error) {
            console.error("Failed to update visit status", error);
            onVisitUpdate(); // Revert on failure
        }
    };

    const getTechNames = (ids: number[]) => {
        return ids.map(id => technicians.find(t => t.id === id)?.name).filter(Boolean).join(', ');
    };

    return (
        <div className="flex h-full overflow-x-auto pb-4 gap-6">
            <DragDropContext onDragEnd={handleDragEnd}>
                {COLUMNS.map(column => (
                    <div key={column.id} className={`flex-shrink-0 w-80 flex flex-col h-full rounded-2xl bg-slate-50/50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden`}>
                        <div className={`p-4 border-t-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center ${column.borderColor} ${column.headerBg}`}>
                            <h3 className={`font-bold ${column.color}`}>{column.title}</h3>
                            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-white dark:bg-slate-800 shadow-sm text-slate-600 dark:text-slate-300">
                                {boardData[column.id].length}
                            </span>
                        </div>

                        <Droppable droppableId={column.id}>
                            {(provided, snapshot) => (
                                <div
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                    className={`flex-1 p-3 overflow-y-auto custom-scrollbar transition-colors ${snapshot.isDraggingOver ? 'bg-slate-50 dark:bg-slate-700/50' : ''
                                        }`}
                                >
                                    {boardData[column.id].map((visit, index) => (
                                        <Draggable key={visit.id} draggableId={visit.id.toString()} index={index}>
                                            {(provided, snapshot) => (
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    className={`mb-3 bg-white dark:bg-slate-700 p-4 rounded-xl border border-slate-200 dark:border-slate-600 shadow-sm hover:shadow-md transition-all group ${snapshot.isDragging ? 'rotate-2 scale-105 shadow-xl ring-2 ring-primary-500 z-50' : ''
                                                        }`}
                                                >
                                                    <div className="flex justify-between items-start mb-2">
                                                        <span className="font-bold text-slate-800 dark:text-white line-clamp-1">
                                                            {visit.projectName || `Project #${visit.id}`}
                                                        </span>
                                                        <span className="text-xs text-slate-400 font-mono">#{visit.id}</span>
                                                    </div>

                                                    <div className="space-y-2">
                                                        <div className="flex items-start gap-2 text-xs text-slate-500 dark:text-slate-400">
                                                            <LocationMarkerIcon className="w-4 h-4 shrink-0 mt-0.5" />
                                                            <span className="line-clamp-2">{visit.address}</span>
                                                        </div>

                                                        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                                                            <ClockIcon className="w-4 h-4 shrink-0" />
                                                            <span>{new Date(visit.scheduledAt).toLocaleDateString()}</span>
                                                        </div>

                                                        {visit.technicianIds && visit.technicianIds.length > 0 && (
                                                            <div className="pt-2 border-t border-slate-100 dark:border-slate-600 flex items-center gap-2">
                                                                <UsersIcon className="w-3 h-3 text-slate-400" />
                                                                <span className="text-xs font-medium text-slate-600 dark:text-slate-300 truncate">
                                                                    {getTechNames(visit.technicianIds)}
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </div>
                ))}
            </DragDropContext>
        </div>
    );
};

export default PipelineBoard;
