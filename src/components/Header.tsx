import React from 'react';
import {
  CheckSquare,
  Plus,
  BookOpen,
  Route,
  Activity,
  Search,
} from 'lucide-react';

export type TabType = 'tasks' | 'architecture' | 'api-routes' | 'api-logs';

interface HeaderProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  onOpenAddTask: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  logCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onTabChange,
  onOpenAddTask,
  searchQuery,
  onSearchChange,
  logCount,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-zinc-200 text-zinc-900 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-6">
          {/* Zone 1: Brand Wordmark & Milestone */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-zinc-900 text-white shadow-xs">
              <CheckSquare className="w-4 h-4 stroke-[2.2]" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-bold text-base tracking-tight text-zinc-900">TaskForge</span>
              <span className="text-xs font-medium text-zinc-500 hidden sm:inline">
                Day 1 · Foundation & Interface
              </span>
            </div>
          </div>

          {/* Search bar (active in tasks view) */}
          {activeTab === 'tasks' && (
            <div className="hidden md:flex flex-1 max-w-sm relative items-center">
              <Search className="w-4 h-4 absolute left-3 text-zinc-400 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search tasks..."
                className="w-full pl-9 pr-3 py-1.5 bg-zinc-50 hover:bg-zinc-100/80 focus:bg-white border border-zinc-200 rounded-lg text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all"
                aria-label="Search tasks"
              />
            </div>
          )}

          {/* Zone 3: Primary Action */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onOpenAddTask}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 active:bg-black text-white text-xs sm:text-sm font-medium shadow-xs transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2"
              aria-label="Open Add Task dialog"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Add Task</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav
          className="flex items-center gap-2 overflow-x-auto py-1.5 -mb-px border-t border-zinc-100 scrollbar-none text-xs sm:text-sm font-medium"
          aria-label="Main Navigation"
        >
          <button
            onClick={() => onTabChange('tasks')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${
              activeTab === 'tasks'
                ? 'bg-zinc-100 text-zinc-950 font-semibold'
                : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50'
            }`}
          >
            <CheckSquare className="w-4 h-4 text-zinc-700" />
            <span>Task Board & List</span>
          </button>

          <button
            onClick={() => onTabChange('architecture')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${
              activeTab === 'architecture'
                ? 'bg-zinc-100 text-zinc-950 font-semibold'
                : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50'
            }`}
          >
            <BookOpen className="w-4 h-4 text-zinc-700" />
            <span>CRUD & Architecture Guide</span>
          </button>

          <button
            onClick={() => onTabChange('api-routes')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${
              activeTab === 'api-routes'
                ? 'bg-zinc-100 text-zinc-950 font-semibold'
                : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50'
            }`}
          >
            <Route className="w-4 h-4 text-zinc-700" />
            <span>Planned API Routes</span>
            <span className="text-[11px] font-mono font-medium text-zinc-500">5</span>
          </button>

          <button
            onClick={() => onTabChange('api-logs')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${
              activeTab === 'api-logs'
                ? 'bg-zinc-100 text-zinc-950 font-semibold'
                : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50'
            }`}
          >
            <Activity className="w-4 h-4 text-zinc-700" />
            <span>Network Inspector</span>
            {logCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono font-medium bg-zinc-200 text-zinc-800">
                {logCount}
              </span>
            )}
          </button>
        </nav>
      </div>
    </header>
  );
};
