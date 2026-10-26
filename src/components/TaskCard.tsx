import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  CheckCircle2,
  Trash2,
  ArrowRight,
  Code2,
  Copy,
  Check,
} from 'lucide-react';
import { Task, TaskStatus } from '../types/task.ts';
import { formatDueDate } from '../utils/taskModel.ts';

interface TaskCardProps {
  task: Task;
  onUpdateStatus: (id: string, newStatus: TaskStatus) => void;
  onDelete: (id: string) => void;
  layout?: 'grid' | 'list';
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onUpdateStatus,
  onDelete,
  layout = 'grid',
}) => {
  const [showJson, setShowJson] = useState(false);
  const [copied, setCopied] = useState(false);
  const dueInfo = formatDueDate(task.dueDate);

  const statusConfig = {
    todo: {
      label: 'To Do',
      textStyle: 'text-zinc-600',
      dot: 'bg-zinc-400',
      nextStatus: 'in_progress' as TaskStatus,
      nextLabel: 'Start',
    },
    in_progress: {
      label: 'In Progress',
      textStyle: 'text-amber-700 font-medium',
      dot: 'bg-amber-500',
      nextStatus: 'completed' as TaskStatus,
      nextLabel: 'Complete',
    },
    completed: {
      label: 'Completed',
      textStyle: 'text-emerald-700 font-medium',
      dot: 'bg-emerald-500',
      nextStatus: 'todo' as TaskStatus,
      nextLabel: 'Reopen',
    },
  }[task.status];

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(task, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  if (layout === 'list') {
    return (
      <div className="group bg-white hover:bg-zinc-50/80 border border-zinc-200/90 hover:border-zinc-300 rounded-xl p-3.5 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <button
            onClick={() => onUpdateStatus(task.id, statusConfig.nextStatus)}
            title={`Status: ${statusConfig.label}. Click to ${statusConfig.nextLabel}`}
            className="mt-0.5 text-zinc-400 hover:text-zinc-800 transition-colors shrink-0"
            aria-label={`Toggle task status for ${task.title}`}
          >
            {task.status === 'completed' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-50" />
            ) : task.status === 'in_progress' ? (
              <Clock className="w-5 h-5 text-amber-600" />
            ) : (
              <div className="w-5 h-5 rounded-full border-2 border-zinc-300 hover:border-zinc-600" />
            )}
          </button>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3
                className={`text-sm font-semibold truncate ${
                  task.status === 'completed' ? 'text-zinc-400 line-through' : 'text-zinc-900'
                }`}
              >
                {task.title}
              </h3>
              <span className="text-zinc-300">·</span>
              <span className={`text-xs flex items-center gap-1.5 ${statusConfig.textStyle}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${statusConfig.dot}`} />
                {statusConfig.label}
              </span>
            </div>
            <p className="text-xs text-zinc-500 line-clamp-1 mt-0.5">{task.description}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 self-end sm:self-auto shrink-0">
          <div
            className={`inline-flex items-center gap-1 text-xs font-mono tabular-nums ${
              dueInfo.isOverdue
                ? 'text-rose-600 font-semibold'
                : dueInfo.isToday
                ? 'text-amber-700 font-semibold'
                : 'text-zinc-500'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>{dueInfo.relativeLabel}</span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setShowJson(!showJson)}
              title="Inspect Task Model JSON"
              className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-800 hover:bg-zinc-100 transition-colors"
              aria-label={`View data model for ${task.title}`}
            >
              <Code2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(task.id)}
              title="Delete task"
              className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-600 hover:bg-zinc-100 transition-colors"
              aria-label={`Delete task ${task.title}`}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="group bg-white hover:bg-zinc-50/50 border border-zinc-200/90 hover:border-zinc-300 rounded-xl p-4 transition-all flex flex-col justify-between shadow-xs">
      <div>
        {/* Top bar: Status indicator & actions */}
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-1.5 text-xs">
            <span className={`w-2 h-2 rounded-full ${statusConfig.dot}`} />
            <span className={statusConfig.textStyle}>{statusConfig.label}</span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setShowJson(!showJson)}
              title="Inspect task data model JSON"
              className="px-2 py-1 rounded text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 text-xs flex items-center gap-1 transition-colors"
              aria-label={`Inspect JSON for ${task.title}`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span className="text-[11px]">Model</span>
            </button>
            <button
              onClick={() => onDelete(task.id)}
              title="Delete task"
              className="p-1 rounded text-zinc-400 hover:text-rose-600 hover:bg-zinc-100 text-xs transition-colors"
              aria-label={`Delete ${task.title}`}
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Title */}
        <h3
          className={`text-sm sm:text-base font-semibold tracking-tight mb-2 leading-snug ${
            task.status === 'completed' ? 'text-zinc-400 line-through' : 'text-zinc-900'
          }`}
        >
          {task.title}
        </h3>

        {/* Description */}
        <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed mb-4 line-clamp-3">
          {task.description}
        </p>

        {/* Tags as unboxed clean text */}
        {task.tags && task.tags.length > 0 && (
          <div className="flex flex-wrap items-center gap-1 text-[11px] text-zinc-500 mb-3.5">
            {task.tags.map((tag, idx) => (
              <React.Fragment key={tag}>
                {idx > 0 && <span>·</span>}
                <span>#{tag}</span>
              </React.Fragment>
            ))}
          </div>
        )}
      </div>

      {/* Footer: Due date info & quick status transition */}
      <div className="pt-3 border-t border-zinc-100 flex items-center justify-between gap-2 mt-auto">
        <div
          className={`inline-flex items-center gap-1 text-xs font-mono tabular-nums ${
            dueInfo.isOverdue
              ? 'text-rose-600 font-semibold'
              : dueInfo.isToday
              ? 'text-amber-700 font-semibold'
              : 'text-zinc-500'
          }`}
          title={`Due Date: ${dueInfo.formatted}`}
        >
          <Calendar className="w-3 h-3" />
          <span>{dueInfo.relativeLabel}</span>
        </div>

        {/* Status transition action button */}
        <button
          onClick={() => onUpdateStatus(task.id, statusConfig.nextStatus)}
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-zinc-50 hover:bg-zinc-100 active:bg-zinc-200 text-zinc-800 transition-colors border border-zinc-200"
          aria-label={`Advance status for ${task.title}`}
        >
          <span>{statusConfig.nextLabel}</span>
          <ArrowRight className="w-3 h-3 text-zinc-500" />
        </button>
      </div>

      {/* JSON Model Viewer Drawer / Overlay */}
      {showJson && (
        <div className="mt-3 p-3 bg-zinc-900 rounded-lg text-xs font-mono text-zinc-200 relative animate-in fade-in duration-150 shadow-sm">
          <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-zinc-800 text-[11px] text-zinc-400">
            <span>Task Entity (In-Memory Model)</span>
            <button
              onClick={handleCopyJson}
              className="flex items-center gap-1 text-zinc-400 hover:text-white transition-colors"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
          <pre className="overflow-x-auto text-[11px] max-h-40 scrollbar-thin text-zinc-100">
            {JSON.stringify(task, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};
