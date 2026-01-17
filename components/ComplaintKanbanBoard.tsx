// @ts-ignore
import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Complaint, ComplaintStatus } from '../types';
import { api } from '../services/api';
import { MapPinIcon, ClockIcon, UserIcon } from './icons';

interface ComplaintKanbanBoardProps {
    complaints: Complaint[];
    onComplaintUpdate: () => void;
}

const COLUMNS: { id: ComplaintStatus; title: string; color: string; borderColor: string; headerBg: string }[] = [
    { id: 'New', title: 'New', color: 'text-blue-700 dark:text-blue-400', borderColor: 'border-blue-500', headerBg: 'bg-blue-50 dark:bg-blue-900/20' },
    { id: 'Assigned', title: 'Assigned', color: 'text-primary-700 dark:text-primary-400', borderColor: 'border-primary-500', headerBg: 'bg-primary-50 dark:bg-primary-900/20' },
    { id: 'In Progress', title: 'In Progress', color: 'text-amber-700 dark:text-amber-400', borderColor: 'border-amber-500', headerBg: 'bg-amber-50 dark:bg-amber-900/20' },
    { id: 'Resolved', title: 'Resolved', color: 'text-emerald-700 dark:text-emerald-400', borderColor: 'border-emerald-500', headerBg: 'bg-emerald-50 dark:bg-emerald-900/20' },
];

const ComplaintKanbanBoard: React.FC<ComplaintKanbanBoardProps> = ({ complaints, onComplaintUpdate }) => {
    // Local state for optimistic UI updates
    const [boardData, setBoardData] = useState<{ [key: string]: Complaint[] }>({
        'New': [],
        'Assigned': [],
        'In Progress': [],
        'Resolved': []
        // We filter out Closed/Cancelled for the board or add them if needed
    });

    useEffect(() => {
        // Group complaints by status
        const grouped: { [key: string]: Complaint[] } = {
            'New': [],
            'Assigned': [],
            'In Progress': [],
            'Resolved': []
        };

        complaints.forEach(c => {
            if (grouped[c.status]) {
                grouped[c.status].push(c);
            }
        });

        setBoardData(grouped);
    }, [complaints]);

    const handleDragEnd = async (result: DropResult) => {
        const { source, destination, draggableId } = result;

        if (!destination) return;
        if (source.droppableId === destination.droppableId) return;

        const complaintId = parseInt(draggableId);
        const newStatus = destination.droppableId as ComplaintStatus;
        const oldStatus = source.droppableId as ComplaintStatus;

        // Optimistic Update
        const sourceList = [...boardData[oldStatus]];
        const destList = [...boardData[newStatus]];
        const [movedComplaint] = sourceList.splice(source.index, 1);

        if (!movedComplaint) return;

        const updatedComplaint = { ...movedComplaint, status: newStatus };
        destList.splice(destination.index, 0, updatedComplaint);

        setBoardData({
            ...boardData,
            [oldStatus]: sourceList,
            [newStatus]: destList
        });

        // API Call
        try {
            await api.updateComplaintStatus(complaintId, newStatus, "Status updated via Board");
            onComplaintUpdate();
        } catch (error) {
            console.error("Failed to update complaint status", error);
            onComplaintUpdate(); // Revert on failure
        }
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
                                {boardData[column.id]?.length || 0}
                            </span>
                        </div>

                        <Droppable droppableId={column.id}>
                            {(provided, snapshot) => (
                                <div
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                    className={`flex-1 p-3 overflow-y-auto custom-scrollbar space-y-3 transition-colors ${snapshot.isDraggingOver ? 'bg-slate-100/80 dark:bg-slate-800/20' : ''}`}
                                >
                                    {boardData[column.id]?.map((complaint, index) => (
                                        <Draggable key={complaint.id} draggableId={complaint.id.toString()} index={index}>
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
                                                                {complaint.title}
                                                            </span>
                                                            {complaint.priority === 'Urgent' && <span className="text-[10px] font-bold text-red-500 bg-red-50 px-1.5 rounded border border-red-100 uppercase">Urgent</span>}
                                                        </div>
                                                        <p className="text-[10px] text-slate-400 font-medium mb-3 font-mono">{complaint.complaintId}</p>

                                                        <div className="space-y-2">
                                                            <div className="flex items-start gap-2 text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-700/50 p-2 rounded-lg">
                                                                <MapPinIcon className="w-3.5 h-3.5 shrink-0 mt-0.5 text-slate-400" />
                                                                <span className="line-clamp-2 leading-tight">{complaint.siteAddress}, {complaint.siteCity}</span>
                                                            </div>

                                                            <div className="flex items-center justify-between pt-1">
                                                                <div className="flex items-center gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-300">
                                                                    <ClockIcon className="w-3.5 h-3.5 text-slate-400" />
                                                                    <span>{new Date(complaint.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}</span>
                                                                </div>

                                                                {/* Tech Avatar */}
                                                                {complaint.assignedTechnician ? (
                                                                    <div className="w-6 h-6 rounded-full bg-primary-500 flex items-center justify-center text-[10px] text-white font-bold border border-white dark:border-slate-800 shadow-sm" title={complaint.assignedTechnician.name}>
                                                                        {complaint.assignedTechnician.name[0]}
                                                                    </div>
                                                                ) : (
                                                                    <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] text-slate-400 border border-slate-200" title="Unassigned">?</div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                    {boardData[column.id]?.length === 0 && (
                                        <div className="flex flex-col items-center justify-center py-10 text-slate-400 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                                            <p className="text-xs font-medium">No tickets</p>
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

export default ComplaintKanbanBoard;
