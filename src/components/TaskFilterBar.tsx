import React from 'react';
import { LayoutGrid, List, Columns, Search, ArrowUpDown, X } from 'lucide-react';
import { TaskStatus } from '../types/task.ts';

export type ViewMode = 'grid' | 'list' | 'kanban';

interface TaskFilterBarProps {
  statusFilter: TaskStatus | 'all';
  onStatusFilterChange: (status: TaskStatus | 'all') => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  sortBy: 'newest' | 'oldest' | 'dueDate' | 'title';
  onSortByChange: (sort: 'newest' | 'oldest' | 'dueDate' | 'title') => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  counts: { all: number; todo: number; inProgress: number; completed: number };
}

export const TaskFilterBar: React.FC<TaskFilterBarProps> = ({
  statusFilter,
  onStatusFilterChange,
  searchQuery,
  onSearchChange,
  sortBy,
  onSortByChange,
  viewMode,
  onViewModeChange,
  counts,
}) => {
  return (
    <div className="bg-white border border-zinc-200 rounded-xl p-3.5 shadow-xs space-y-3">
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Status Filter Segmented Control */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0 scrollbar-none bg-zinc-100/80 p-1 rounded-lg border border-zinc-200/60">
          <button
            onClick={() => onStatusFilterChange('all')}
            className={`px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              statusFilter === 'all'
                ? 'bg-white text-zinc-900 shadow-xs font-semibold'
                : 'text-zinc-600 hover:text-zinc-900'
            }`}
          >
            <span>All Tasks</span>
            <span className="font-mono text-xs tabular-nums text-zinc-500">{counts.all}</span>
          </button>

          <button
            onClick={() => onStatusFilterChange('todo')}
            className={`px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              statusFilter === 'todo'
                ? 'bg-white text-zinc-900 shadow-xs font-semibold'
                : 'text-zinc-600 hover:text-zinc-900'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-zinc-400" />
            <span>To Do</span>
            <span className="font-mono text-xs tabular-nums text-zinc-500">{counts.todo}</span>
          </button>

          <button
            onClick={() => onStatusFilterChange('in_progress')}
            className={`px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              statusFilter === 'in_progress'
                ? 'bg-white text-zinc-900 shadow-xs font-semibold'
                : 'text-zinc-600 hover:text-zinc-900'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span>In Progress</span>
            <span className="font-mono text-xs tabular-nums text-zinc-500">{counts.inProgress}</span>
          </button>

          <button
            onClick={() => onStatusFilterChange('completed')}
            className={`px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              statusFilter === 'completed'
                ? 'bg-white text-zinc-900 shadow-xs font-semibold'
                : 'text-zinc-600 hover:text-zinc-900'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Completed</span>
            <span className="font-mono text-xs tabular-nums text-zinc-500">{counts.completed}</span>
          </button>
        </div>

        {/* View Layout Controls & Sort */}
        <div className="flex items-center gap-2 self-end md:self-auto w-full md:w-auto justify-between md:justify-end">
          {/* Sort dropdown */}
          <div className="flex items-center gap-1.5 bg-zinc-50 border border-zinc-200 rounded-lg px-2.5 py-1.5 text-xs text-zinc-700">
            <ArrowUpDown className="w-3.5 h-3.5 text-zinc-400" />
            <select
              value={sortBy}
              onChange={(e) => onSortByChange(e.target.value as any)}
              className="bg-transparent text-zinc-800 text-xs focus:outline-none cursor-pointer pr-1"
              aria-label="Sort tasks by"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="dueDate">Due Date</option>
              <option value="title">Title (A-Z)</option>
            </select>
          </div>

          {/* View Mode Buttons */}
          <div className="flex items-center bg-zinc-100/90 border border-zinc-200/80 p-0.5 rounded-lg">
            <button
              onClick={() => onViewModeChange('grid')}
              title="Grid View"
              className={`p-1.5 rounded-md transition-colors ${
                viewMode === 'grid' ? 'bg-white text-zinc-900 shadow-xs' : 'text-zinc-500 hover:text-zinc-900'
              }`}
              aria-label="Grid view"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => onViewModeChange('list')}
              title="List View"
              className={`p-1.5 rounded-md transition-colors ${
                viewMode === 'list' ? 'bg-white text-zinc-900 shadow-xs' : 'text-zinc-500 hover:text-zinc-900'
              }`}
              aria-label="List view"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => onViewModeChange('kanban')}
              title="Kanban Board View"
              className={`p-1.5 rounded-md transition-colors ${
                viewMode === 'kanban' ? 'bg-white text-zinc-900 shadow-xs' : 'text-zinc-500 hover:text-zinc-900'
              }`}
              aria-label="Kanban view"
            >
              <Columns className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Search input */}
      <div className="md:hidden relative flex items-center pt-1">
        <Search className="w-4 h-4 absolute left-3 text-zinc-400 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Filter tasks by keyword or tags..."
          className="w-full pl-9 pr-8 py-2 bg-zinc-50 border border-zinc-200 rounded-lg text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900"
          aria-label="Filter tasks on mobile"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-2.5 text-zinc-400 hover:text-zinc-700 p-1"
            aria-label="Clear search"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};
