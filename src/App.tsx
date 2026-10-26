import React, { useState, useEffect } from 'react';
import { Header, TabType } from './components/Header.tsx';
import { TaskSummaryStats } from './components/TaskSummaryStats.tsx';
import { TaskFilterBar, ViewMode } from './components/TaskFilterBar.tsx';
import { TaskList } from './components/TaskList.tsx';
import { AddTaskModal } from './components/AddTaskModal.tsx';
import { ArchitectureReview } from './components/ArchitectureReview.tsx';
import { PlannedApiRoutes } from './components/PlannedApiRoutes.tsx';
import { NetworkInspector } from './components/NetworkInspector.tsx';
import { Task, TaskStatus, CreateTaskDTO, ApiLogEntry } from './types/task.ts';
import { filterAndSortTasks } from './utils/taskModel.ts';
import { taskApi } from './utils/apiMockService.ts';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('tasks');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [logs, setLogs] = useState<ApiLogEntry[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<TaskStatus | 'all'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'dueDate' | 'title'>('newest');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [toast, setToast] = useState<{ id: string; message: string; type: 'success' | 'info' | 'error' } | null>(null);

  useEffect(() => {
    const sync = () => {
      setTasks(taskApi.getRawTasks());
      setLogs(taskApi.getLogs());
    };

    sync();
    const unsubscribe = taskApi.subscribe(sync);
    return () => unsubscribe();
  }, []);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = Math.random().toString();
    setToast({ id, message, type });
    setTimeout(() => {
      setToast((cur) => (cur?.id === id ? null : cur));
    }, 3500);
  };

  const handleCreateTask = async (dto: CreateTaskDTO) => {
    const res = await taskApi.createTask(dto);
    if (res.success && res.data) {
      showToast(`Created task "${res.data.title}" via POST /api/tasks`, 'success');
      return { success: true };
    }
    return { success: false, errors: res.errors };
  };

  const handleUpdateStatus = async (id: string, newStatus: TaskStatus) => {
    const res = await taskApi.updateTask(id, { status: newStatus });
    if (res.success && res.data) {
      showToast(`Updated status to "${newStatus.replace('_', ' ')}" via PATCH /api/tasks/${id}`, 'info');
    }
  };

  const handleDeleteTask = async (id: string) => {
    const res = await taskApi.deleteTask(id);
    if (res.success) {
      showToast('Task deleted via DELETE /api/tasks', 'info');
    }
  };

  const handleResetSamples = () => {
    taskApi.resetToSamples();
    showToast('Reset tasks to Day 1 default sample set', 'info');
  };

  const filteredTasks = filterAndSortTasks(tasks, searchQuery, statusFilter, sortBy);

  const counts = {
    all: tasks.length,
    todo: tasks.filter((t) => t.status === 'todo').length,
    inProgress: tasks.filter((t) => t.status === 'in_progress').length,
    completed: tasks.filter((t) => t.status === 'completed').length,
  };

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 flex flex-col font-sans antialiased selection:bg-zinc-900 selection:text-white">
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onOpenAddTask={() => setIsAddModalOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        logCount={logs.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'tasks' && (
          <div className="space-y-6">
            {/* Day 1 Milestone Summary & KPIs */}
            <TaskSummaryStats tasks={tasks} onResetSamples={handleResetSamples} />

            {/* Filter, Search & Layout Controls */}
            <TaskFilterBar
              statusFilter={statusFilter}
              onStatusFilterChange={setStatusFilter}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              sortBy={sortBy}
              onSortByChange={setSortBy}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              counts={counts}
            />

            {/* Responsive Task List / Board */}
            <TaskList
              tasks={filteredTasks}
              viewMode={viewMode}
              onUpdateStatus={handleUpdateStatus}
              onDelete={handleDeleteTask}
              onOpenAddTask={() => setIsAddModalOpen(true)}
              searchQuery={searchQuery}
              onClearSearch={() => setSearchQuery('')}
            />
          </div>
        )}

        {activeTab === 'architecture' && <ArchitectureReview />}

        {activeTab === 'api-routes' && <PlannedApiRoutes />}

        {activeTab === 'api-logs' && (
          <NetworkInspector logs={logs} onClearLogs={() => taskApi.clearLogs()} />
        )}
      </main>

      {/* Add Task Modal Dialog */}
      <AddTaskModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleCreateTask}
      />

      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed bottom-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-lg text-xs sm:text-sm font-medium border animate-in slide-in-from-bottom-3 duration-150 ${
            toast.type === 'success'
              ? 'bg-zinc-900 text-white border-zinc-800'
              : toast.type === 'error'
              ? 'bg-rose-900 text-white border-rose-800'
              : 'bg-zinc-900 text-white border-zinc-800'
          }`}
          role="status"
          aria-live="polite"
        >
          {toast.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : toast.type === 'error' ? (
            <AlertCircle className="w-4 h-4 text-rose-300 shrink-0" />
          ) : (
            <Info className="w-4 h-4 text-zinc-300 shrink-0" />
          )}
          <span>{toast.message}</span>
          <button
            onClick={() => setToast(null)}
            className="ml-2 text-zinc-400 hover:text-white p-0.5"
            aria-label="Dismiss toast"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
