import React from 'react';
import { Task, TaskStatus } from '../types/task.ts';
import { TaskCard } from './TaskCard.tsx';
import { ViewMode } from './TaskFilterBar.tsx';
import { PlusCircle, SearchX, Inbox } from 'lucide-react';

interface TaskListProps {
  tasks: Task[];
  viewMode: ViewMode;
  onUpdateStatus: (id: string, newStatus: TaskStatus) => void;
  onDelete: (id: string) => void;
  onOpenAddTask: () => void;
  searchQuery: string;
  onClearSearch: () => void;
}

export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  viewMode,
  onUpdateStatus,
  onDelete,
  onOpenAddTask,
  searchQuery,
  onClearSearch,
}) => {
  if (tasks.length === 0) {
    return (
      <div className="bg-white border border-zinc-200 rounded-2xl p-8 sm:p-12 text-center max-w-lg mx-auto my-8 shadow-xs">
        {searchQuery ? (
          <>
            <div className="w-10 h-10 rounded-xl bg-zinc-100 flex items-center justify-center mx-auto mb-3 text-zinc-500">
              <SearchX className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-semibold text-zinc-900 mb-1">No matching tasks found</h3>
            <p className="text-xs text-zinc-500 mb-4">
              No tasks matched your search query "{searchQuery}".
            </p>
            <button
              onClick={onClearSearch}
              className="px-3.5 py-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-xs font-medium text-zinc-800 transition-colors"
            >
              Clear Filter
            </button>
          </>
        ) : (
          <>
            <div className="w-10 h-10 rounded-xl bg-zinc-100 flex items-center justify-center mx-auto mb-3 text-zinc-600">
              <Inbox className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-semibold text-zinc-900 mb-1">No tasks in this view</h3>
            <p className="text-xs text-zinc-500 mb-4">
              Get started by creating your first task using the Add Task form.
            </p>
            <button
              onClick={onOpenAddTask}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white text-xs sm:text-sm font-medium transition-colors shadow-xs"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create First Task</span>
            </button>
          </>
        )}
      </div>
    );
  }

  // Kanban view
  if (viewMode === 'kanban') {
    const columns: Array<{ status: TaskStatus; title: string; dot: string }> = [
      { status: 'todo', title: 'To Do', dot: 'bg-zinc-400' },
      { status: 'in_progress', title: 'In Progress', dot: 'bg-amber-500' },
      { status: 'completed', title: 'Completed', dot: 'bg-emerald-500' },
    ];

    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
        {columns.map((col) => {
          const colTasks = tasks.filter((t) => t.status === col.status);
          return (
            <div
              key={col.status}
              className="bg-zinc-100/70 border border-zinc-200/80 rounded-2xl p-4 flex flex-col min-h-[420px]"
            >
              {/* Column header */}
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-zinc-200">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${col.dot}`} />
                  <h3 className="text-sm font-semibold text-zinc-900 tracking-tight">{col.title}</h3>
                </div>
                <span className="font-mono text-xs tabular-nums font-medium text-zinc-500">
                  {colTasks.length}
                </span>
              </div>

              {/* Column task items */}
              <div className="space-y-3 flex-1">
                {colTasks.length === 0 ? (
                  <div className="h-28 flex items-center justify-center border border-dashed border-zinc-300 rounded-xl text-xs text-zinc-400">
                    No tasks in {col.title}
                  </div>
                ) : (
                  colTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onUpdateStatus={onUpdateStatus}
                      onDelete={onDelete}
                      layout="grid"
                    />
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // Compact List view
  if (viewMode === 'list') {
    return (
      <div className="space-y-2">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onUpdateStatus={onUpdateStatus}
            onDelete={onDelete}
            layout="list"
          />
        ))}
      </div>
    );
  }

  // Standard Grid view (Responsive 1, 2, or 3 columns)
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onUpdateStatus={onUpdateStatus}
          onDelete={onDelete}
          layout="grid"
        />
      ))}
    </div>
  );
};
