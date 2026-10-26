import React, { useState, useEffect } from 'react';
import { X, Calendar, AlertCircle, Plus } from 'lucide-react';
import { CreateTaskDTO, TaskStatus } from '../types/task.ts';
import { validateTaskInput } from '../utils/taskModel.ts';

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (dto: CreateTaskDTO) => Promise<{ success: boolean; errors?: Record<string, string> }>;
}

export const AddTaskModal: React.FC<AddTaskModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TaskStatus>('todo');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>(['Day 1']);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleAddTag = () => {
    const trimmed = tagInput.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleQuickDate = (daysFromToday: number) => {
    const d = new Date('2026-10-26T09:19:50-07:00');
    d.setDate(d.getDate() + daysFromToday);
    const iso = d.toISOString().split('T')[0];
    setDueDate(iso);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload: CreateTaskDTO = {
      title,
      description,
      status,
      dueDate: dueDate ? `${dueDate}T18:00:00Z` : undefined,
      priority,
      tags,
    };

    const validation = validateTaskInput(payload);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      const res = await onSubmit(payload);
      if (res.success) {
        setTitle('');
        setDescription('');
        setStatus('todo');
        setDueDate('');
        setTags(['Day 1']);
        onClose();
      } else if (res.errors) {
        setErrors(res.errors);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/40 backdrop-blur-xs animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-task-modal-title"
    >
      <div
        className="w-full max-w-xl bg-white border border-zinc-200 rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 bg-zinc-50/50">
          <div>
            <div className="flex items-baseline gap-2">
              <h2 id="add-task-modal-title" className="text-base font-semibold text-zinc-900 tracking-tight">
                New Task
              </h2>
              <span className="text-xs font-mono text-zinc-500">POST /api/tasks</span>
            </div>
            <p className="text-xs text-zinc-500 mt-0.5">
              Populates the Day 1 task data model and creates an in-memory task entry.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
          {/* Title Field */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="task-title" className="text-xs font-medium text-zinc-700">
                Title <span className="text-rose-600">*</span>
              </label>
              <span className="text-[11px] font-mono text-zinc-400">{title.length}/120</span>
            </div>
            <input
              id="task-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Set up database schema migration"
              maxLength={120}
              className={`w-full px-3.5 py-2 bg-white border rounded-lg text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none transition-colors ${
                errors.title
                  ? 'border-rose-500 focus:ring-1 focus:ring-rose-500'
                  : 'border-zinc-300 focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900'
              }`}
            />
            {errors.title && (
              <p className="flex items-center gap-1 text-xs text-rose-600 mt-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errors.title}</span>
              </p>
            )}
          </div>

          {/* Description Field */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="task-description" className="text-xs font-medium text-zinc-700">
                Description <span className="text-rose-600">*</span>
              </label>
              <span className="text-[11px] font-mono text-zinc-400">{description.length}/1000</span>
            </div>
            <textarea
              id="task-description"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Outline the steps or acceptance criteria for this task..."
              maxLength={1000}
              className={`w-full px-3.5 py-2 bg-white border rounded-lg text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none transition-colors resize-none ${
                errors.description
                  ? 'border-rose-500 focus:ring-1 focus:ring-rose-500'
                  : 'border-zinc-300 focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900'
              }`}
            />
            {errors.description && (
              <p className="flex items-center gap-1 text-xs text-rose-600 mt-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errors.description}</span>
              </p>
            )}
          </div>

          {/* Status & Priority Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="task-status" className="block text-xs font-medium text-zinc-700 mb-1.5">
                Initial Status <span className="text-rose-600">*</span>
              </label>
              <select
                id="task-status"
                value={status}
                onChange={(e) => setStatus(e.target.value as TaskStatus)}
                className="w-full px-3.5 py-2 bg-white border border-zinc-300 rounded-lg text-sm text-zinc-900 focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 cursor-pointer"
              >
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div>
              <label htmlFor="task-priority" className="block text-xs font-medium text-zinc-700 mb-1.5">
                Priority Level
              </label>
              <select
                id="task-priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="w-full px-3.5 py-2 bg-white border border-zinc-300 rounded-lg text-sm text-zinc-900 focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 cursor-pointer"
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
              </select>
            </div>
          </div>

          {/* Optional Due Date */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="task-due-date" className="text-xs font-medium text-zinc-700">
                Optional Due Date
              </label>
              <span className="text-[11px] text-zinc-400 font-mono">ISO-8601</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <input
                  id="task-due-date"
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-3.5 py-2 bg-white border border-zinc-300 rounded-lg text-sm text-zinc-900 focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900"
                />
              </div>
              {dueDate && (
                <button
                  type="button"
                  onClick={() => setDueDate('')}
                  className="px-2.5 py-2 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-xs text-zinc-600 transition-colors"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Quick date presets */}
            <div className="flex items-center gap-1.5 mt-2">
              <span className="text-[11px] text-zinc-400">Presets:</span>
              <button
                type="button"
                onClick={() => handleQuickDate(0)}
                className="px-2 py-0.5 rounded text-[11px] font-medium bg-zinc-100 hover:bg-zinc-200 text-zinc-700 transition-colors"
              >
                Today
              </button>
              <button
                type="button"
                onClick={() => handleQuickDate(1)}
                className="px-2 py-0.5 rounded text-[11px] font-medium bg-zinc-100 hover:bg-zinc-200 text-zinc-700 transition-colors"
              >
                Tomorrow
              </button>
              <button
                type="button"
                onClick={() => handleQuickDate(3)}
                className="px-2 py-0.5 rounded text-[11px] font-medium bg-zinc-100 hover:bg-zinc-200 text-zinc-700 transition-colors"
              >
                +3 Days
              </button>
              <button
                type="button"
                onClick={() => handleQuickDate(7)}
                className="px-2 py-0.5 rounded text-[11px] font-medium bg-zinc-100 hover:bg-zinc-200 text-zinc-700 transition-colors"
              >
                Next Week
              </button>
            </div>
            {errors.dueDate && (
              <p className="flex items-center gap-1 text-xs text-rose-600 mt-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{errors.dueDate}</span>
              </p>
            )}
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs font-medium text-zinc-700 mb-1.5">
              Tags
            </label>
            <div className="flex items-center gap-2 mb-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                placeholder="Add tag and press Enter"
                className="flex-1 px-3.5 py-1.5 bg-white border border-zinc-300 rounded-lg text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="px-3 py-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-xs font-medium text-zinc-800 border border-zinc-200 transition-colors"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs text-zinc-700 bg-zinc-100 border border-zinc-200"
                >
                  <span>#{tag}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="hover:text-rose-600 transition-colors ml-0.5"
                    aria-label={`Remove tag ${tag}`}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-zinc-200 bg-zinc-50/70 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 active:bg-black text-white text-xs sm:text-sm font-medium shadow-xs transition-colors disabled:opacity-50"
          >
            {isSubmitting ? (
              <span>Saving...</span>
            ) : (
              <>
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span>Create Task</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
