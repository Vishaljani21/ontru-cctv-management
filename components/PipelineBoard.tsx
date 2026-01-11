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
                    <div key={column.id} className={`flex-shrink-0 w-80 flex flex-col h-full rounded-2xl bg-slate-100/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800`}>
                        {/* Column Header */}
                        <div className={`p-4 flex justify-between items-center bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 rounded-t-2xl`}>
                            <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${column.borderColor.replace('border-', 'bg-')}`}></div>
                                <h3 className={`font-bold text-sm text-slate-700 dark:text-slate-200`}>{column.title}</h3>
                            </div>
                            <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                                {boardData[column.id].length}
                            </span>
                        </div>

                        <Droppable droppableId={column.id}>
                            {(provided, snapshot) => (
                                <div
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                    className={`flex-1 p-3 overflow-y-auto custom-scrollbar space-y-3 transition-colors ${snapshot.isDraggingOver ? 'bg-slate-100/80 dark:bg-slate-800/20' : ''}`}
                                >
                                    {boardData[column.id].map((visit, index) => (
                                        <Draggable key={visit.id} draggableId={visit.id.toString()} index={index}>
                                            {(provided, snapshot) => (
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    className={`bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all group relative overflow-hidden ${snapshot.isDragging ? 'rotate-2 scale-105 shadow-xl ring-2 ring-primary-500 z-50' : ''
                                                        }`}
                                                >
                                                    {/* Status Accent Line */}
                                                    <div className={`absolute top-0 left-0 w-1 h-full ${column.headerBg.replace('bg-', 'bg-').replace('/20', '')} opacity-40 group-hover:opacity-100 transition-opacity`}></div>

                                                    <div className="pl-2">
                                                        <div className="flex justify-between items-start mb-1">
                                                            <span className="font-bold text-sm text-slate-800 dark:text-white line-clamp-1 group-hover:text-primary-600 transition-colors">
                                                                {visit.projectName || `Project #${visit.id}`}
                                                            </span>
                                                            {/* Menu Dots (Visual placeholder) */}
                                                            <button className="text-slate-300 hover:text-slate-500"><span className="text-[10px]">●●●</span></button>
                                                        </div>
                                                        <p className="text-[10px] text-slate-400 font-medium mb-3">#{visit.projectCode || visit.id}</p>

                                                        <div className="space-y-2">
                                                            <div className="flex items-start gap-2 text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-700/50 p-2 rounded-lg">
                                                                <LocationMarkerIcon className="w-3.5 h-3.5 shrink-0 mt-0.5 text-slate-400" />
                                                                <span className="line-clamp-2 leading-tight">{visit.address}</span>
                                                            </div>

                                                            <div className="flex items-center justify-between pt-1">
                                                                <div className="flex items-center gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-300">
                                                                    <ClockIcon className="w-3.5 h-3.5 text-slate-400" />
                                                                    <span>{new Date(visit.scheduledAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}</span>
                                                                </div>

                                                                {/* Tech Avatars */}
                                                                {visit.technicianIds && visit.technicianIds.length > 0 && (
                                                                    <div className="flex -space-x-1.5">
                                                                        {visit.technicianIds.slice(0, 3).map((tid, i) => (
                                                                            <div key={i} className="w-5 h-5 rounded-full bg-slate-200 border border-white dark:border-slate-800 flex items-center justify-center text-[8px] font-bold text-slate-600" title={technicians.find(t => t.id === tid)?.name}>
                                                                                {technicians.find(t => t.id === tid)?.name?.charAt(0) || '?'}
                                                                            </div>
                                                                        ))}
                                                                        {visit.technicianIds.length > 3 && (
                                                                            <div className="w-5 h-5 rounded-full bg-slate-100 border border-white text-[8px] flex items-center justify-center text-slate-500">+{visit.technicianIds.length - 3}</div>
                                                                        )}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                    {boardData[column.id].length === 0 && (
                                        <div className="flex flex-col items-center justify-center py-10 text-slate-400 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                                            <p className="text-xs font-medium">No visits</p>
                                        </div>
                                    )}
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
