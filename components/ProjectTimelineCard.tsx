import React from 'react';
import type { TimelineStep } from '../types';
import { CheckCircleIcon, ClockIcon } from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleSolid } from '@heroicons/react/24/solid';

interface ProjectTimelineCardProps {
    timeline: TimelineStep[];
    compact?: boolean;
    onStepClick?: (stepIndex: number, step: TimelineStep) => void;
    editable?: boolean;
}

const ProjectTimelineCard: React.FC<ProjectTimelineCardProps> = ({
    timeline,
    compact = false,
    onStepClick,
    editable = false
}) => {
    const completedSteps = timeline.filter(s => s.status === 'completed').length;
    const progressPercentage = timeline.length > 0 ? Math.round((completedSteps / timeline.length) * 100) : 0;

    if (compact) {
        // Compact horizontal view for dashboard cards
        return (
            <div className="space-y-3">
                {/* Progress Bar */}
                <div className="flex items-center gap-3">
                    <div className="flex-1 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-primary-500 to-primary-600 rounded-full transition-all duration-500 ease-out"
                            style={{ width: `${progressPercentage}%` }}
                        />
                    </div>
                    <span className="text-xs font-bold text-slate-600 dark:text-slate-400 min-w-[40px] text-right">
                        {progressPercentage}%
                    </span>
                </div>

                {/* Mini Steps */}
                <div className="flex items-center justify-between gap-1">
                    {timeline.map((step, idx) => (
                        <div
                            key={idx}
                            className={`
                                relative group flex-1 h-1.5 rounded-full transition-all
                                ${step.status === 'completed' ? 'bg-green-500' :
                                    step.status === 'current' ? 'bg-primary-500 animate-pulse' :
                                        'bg-slate-200 dark:bg-slate-700'}
                            `}
                            title={`${step.label}: ${step.status}`}
                        >
                            {/* Tooltip on hover */}
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-[10px] font-medium text-white bg-slate-800 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20 pointer-events-none">
                                {step.label}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    // Full timeline view
    return (
        <div className="relative">
            {/* Connection Line */}
            <div className="absolute left-4 top-8 bottom-8 w-0.5 bg-slate-200 dark:bg-slate-700" />

            <div className="space-y-4">
                {timeline.map((step, idx) => {
                    const isCompleted = step.status === 'completed';
                    const isCurrent = step.status === 'current';
                    const isPending = step.status === 'pending';
                    const canClick = editable && isCurrent && onStepClick;

                    return (
                        <div
                            key={idx}
                            onClick={() => canClick && onStepClick(idx, step)}
                            className={`
                                relative flex items-center gap-4 p-3 rounded-xl transition-all
                                ${isCurrent ? 'bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800' : ''}
                                ${canClick ? 'cursor-pointer hover:bg-primary-100 dark:hover:bg-primary-900/30' : ''}
                            `}
                        >
                            {/* Step Indicator */}
                            <div className={`
                                relative z-10 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all
                                ${isCompleted ? 'bg-green-500 text-white' :
                                    isCurrent ? 'bg-primary-500 text-white ring-4 ring-primary-100 dark:ring-primary-900/50' :
                                        'bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500'}
                            `}>
                                {isCompleted ? (
                                    <CheckCircleSolid className="w-5 h-5" />
                                ) : isCurrent ? (
                                    <ClockIcon className="w-5 h-5" />
                                ) : (
                                    <span className="text-xs font-bold">{idx + 1}</span>
                                )}
                            </div>

                            {/* Step Content */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-2">
                                    <h4 className={`
                                        text-sm font-semibold truncate
                                        ${isCompleted ? 'text-green-700 dark:text-green-400' :
                                            isCurrent ? 'text-primary-700 dark:text-primary-400' :
                                                'text-slate-500 dark:text-slate-400'}
                                    `}>
                                        {step.label}
                                    </h4>

                                    {isCompleted && step.date && (
                                        <span className="text-[10px] font-medium text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-2 py-0.5 rounded-full">
                                            {new Date(step.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                        </span>
                                    )}

                                    {isCurrent && (
                                        <span className="text-[10px] font-bold text-primary-600 dark:text-primary-400 bg-primary-100 dark:bg-primary-900/40 px-2 py-0.5 rounded-full uppercase tracking-wide animate-pulse">
                                            In Progress
                                        </span>
                                    )}
                                </div>

                                {canClick && (
                                    <p className="text-xs text-primary-500 mt-1 font-medium">
                                        Tap to mark as complete
                                    </p>
                                )}
                            </div>

                            {/* Complete Button (if editable and current) */}
                            {canClick && (
                                <button
                                    className="flex-shrink-0 px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white text-xs font-bold rounded-lg shadow-lg shadow-green-500/20 transition-all active:scale-95"
                                >
                                    Complete
                                </button>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ProjectTimelineCard;
