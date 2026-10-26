import React from 'react';
import { CheckCircle2, Clock, ListTodo, AlertTriangle, RefreshCw } from 'lucide-react';
import { Task } from '../types/task.ts';
import { calculateTaskStats } from '../utils/taskModel.ts';

interface TaskSummaryStatsProps {
  tasks: Task[];
  onResetSamples: () => void;
}

export const TaskSummaryStats: React.FC<TaskSummaryStatsProps> = ({ tasks, onResetSamples }) => {
  const stats = calculateTaskStats(tasks);

  return (
    <div className="space-y-4">
      {/* Top Milestone Banner */}
      <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-base font-semibold text-zinc-900 tracking-tight">
              Day 1 · Foundation, Data Model & Task Interface
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-zinc-600 max-w-3xl leading-relaxed">
            CRUD operations mapped across frontend, backend, and database tiers. Task data model defined with title, description, status, and optional due date. Ready for backend API routes on Day 2.
          </p>
        </div>
        <button
          onClick={onResetSamples}
          title="Reset to Day 1 default sample tasks"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-50 hover:bg-zinc-100 text-xs font-medium text-zinc-700 border border-zinc-200 hover:text-zinc-900 transition-colors whitespace-nowrap self-stretch sm:self-auto justify-center"
        >
          <RefreshCw className="w-3.5 h-3.5 text-zinc-500" />
          <span>Reset Sample Tasks</span>
        </button>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        {/* Total */}
        <div className="bg-white border border-zinc-200/90 rounded-xl p-4 shadow-xs hover:border-zinc-300 transition-colors">
          <div className="flex items-center justify-between text-zinc-500 mb-1">
            <span className="text-xs font-medium uppercase tracking-wider text-zinc-500">All Tasks</span>
            <ListTodo className="w-4 h-4 text-zinc-400" />
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-zinc-900 tracking-tight">{stats.total}</div>
          <div className="text-xs text-zinc-500 mt-1">In local collection</div>
        </div>

        {/* Todo */}
        <div className="bg-white border border-zinc-200/90 rounded-xl p-4 shadow-xs hover:border-zinc-300 transition-colors">
          <div className="flex items-center justify-between text-zinc-500 mb-1">
            <span className="text-xs font-medium uppercase tracking-wider text-zinc-500">To Do</span>
            <span className="w-2 h-2 rounded-full bg-zinc-400" />
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-zinc-900 tracking-tight">{stats.todo}</div>
          <div className="text-xs text-zinc-500 mt-1">Awaiting start</div>
        </div>

        {/* In Progress */}
        <div className="bg-white border border-zinc-200/90 rounded-xl p-4 shadow-xs hover:border-zinc-300 transition-colors">
          <div className="flex items-center justify-between text-zinc-500 mb-1">
            <span className="text-xs font-medium uppercase tracking-wider text-zinc-500">In Progress</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-amber-700 tracking-tight">{stats.inProgress}</div>
          <div className="text-xs text-amber-700/80 mt-1">Actively building</div>
        </div>

        {/* Completed */}
        <div className="bg-white border border-zinc-200/90 rounded-xl p-4 shadow-xs hover:border-zinc-300 transition-colors">
          <div className="flex items-center justify-between text-zinc-500 mb-1">
            <span className="text-xs font-medium uppercase tracking-wider text-zinc-500">Completed</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-emerald-700 tracking-tight">{stats.completed}</div>
          <div className="text-xs text-emerald-700/80 mt-1">{stats.completionRate}% finished</div>
        </div>

        {/* Overdue */}
        <div className="col-span-2 lg:col-span-1 bg-white border border-zinc-200/90 rounded-xl p-4 shadow-xs hover:border-zinc-300 transition-colors">
          <div className="flex items-center justify-between text-zinc-500 mb-1">
            <span className="text-xs font-medium uppercase tracking-wider text-zinc-500">Urgent</span>
            <AlertTriangle className={`w-4 h-4 ${stats.overdue > 0 ? 'text-rose-600' : 'text-zinc-400'}`} />
          </div>
          <div className={`text-2xl font-bold font-mono tabular-nums tracking-tight ${stats.overdue > 0 ? 'text-rose-600' : 'text-zinc-900'}`}>
            {stats.overdue}
          </div>
          <div className="text-xs text-zinc-500 mt-1">
            {stats.overdue > 0 ? 'Action required' : 'On schedule'}
          </div>
        </div>
      </div>
    </div>
  );
};
