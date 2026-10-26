import { Task, TaskStatus, CreateTaskDTO } from '../types/task.ts';

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

/**
 * Validates a task payload before creation or update.
 * Checks:
 * - title: required, trimmed length between 3 and 120 characters
 * - description: required, trimmed length between 5 and 1000 characters
 * - status: must be one of 'todo', 'in_progress', 'completed'
 * - dueDate: optional, if present must be a valid parseable date string
 */
export function validateTaskInput(input: Partial<CreateTaskDTO>): ValidationResult {
  const errors: Record<string, string> = {};

  if (!input.title || input.title.trim().length === 0) {
    errors.title = 'Title is required';
  } else if (input.title.trim().length < 3) {
    errors.title = 'Title must be at least 3 characters long';
  } else if (input.title.trim().length > 120) {
    errors.title = 'Title cannot exceed 120 characters';
  }

  if (!input.description || input.description.trim().length === 0) {
    errors.description = 'Description is required';
  } else if (input.description.trim().length < 5) {
    errors.description = 'Description must be at least 5 characters long';
  } else if (input.description.trim().length > 1000) {
    errors.description = 'Description cannot exceed 1000 characters';
  }

  const validStatuses: TaskStatus[] = ['todo', 'in_progress', 'completed'];
  if (!input.status || !validStatuses.includes(input.status)) {
    errors.status = 'Status must be todo, in_progress, or completed';
  }

  if (input.dueDate && input.dueDate.trim().length > 0) {
    const timestamp = Date.parse(input.dueDate);
    if (isNaN(timestamp)) {
      errors.dueDate = 'Due date must be a valid date format';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Formats a due date and computes relative urgency indicators.
 */
export function formatDueDate(
  dueDate?: string,
  referenceDate: Date = new Date('2026-10-26T09:19:50-07:00')
): {
  formatted: string;
  isOverdue: boolean;
  isToday: boolean;
  isSoon: boolean; // within 3 days
  relativeLabel: string;
} {
  if (!dueDate || dueDate.trim() === '') {
    return {
      formatted: 'No due date',
      isOverdue: false,
      isToday: false,
      isSoon: false,
      relativeLabel: 'Optional',
    };
  }

  const target = new Date(dueDate);
  if (isNaN(target.getTime())) {
    return {
      formatted: 'Invalid date',
      isOverdue: false,
      isToday: false,
      isSoon: false,
      relativeLabel: 'Invalid',
    };
  }

  // Calculate day difference ignoring time
  const targetMidnight = new Date(target.getFullYear(), target.getMonth(), target.getDate());
  const refMidnight = new Date(referenceDate.getFullYear(), referenceDate.getMonth(), referenceDate.getDate());
  const diffDays = Math.round((targetMidnight.getTime() - refMidnight.getTime()) / (1000 * 60 * 60 * 24));

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const formatted = `${monthNames[target.getMonth()]} ${target.getDate()}, ${target.getFullYear()}`;

  let relativeLabel = '';
  let isOverdue = false;
  let isToday = false;
  let isSoon = false;

  if (diffDays < 0) {
    isOverdue = true;
    relativeLabel = `${Math.abs(diffDays)}d overdue`;
  } else if (diffDays === 0) {
    isToday = true;
    relativeLabel = 'Due today';
  } else if (diffDays === 1) {
    isSoon = true;
    relativeLabel = 'Due tomorrow';
  } else if (diffDays <= 3) {
    isSoon = true;
    relativeLabel = `Due in ${diffDays}d`;
  } else {
    relativeLabel = `In ${diffDays}d`;
  }

  return {
    formatted,
    isOverdue,
    isToday,
    isSoon,
    relativeLabel,
  };
}

/**
 * Filters and sorts tasks based on status and search query.
 */
export function filterAndSortTasks(
  tasks: Task[],
  searchQuery: string = '',
  statusFilter: TaskStatus | 'all' = 'all',
  sortBy: 'newest' | 'oldest' | 'dueDate' | 'title' = 'newest'
): Task[] {
  const query = searchQuery.trim().toLowerCase();

  const filtered = tasks.filter((task) => {
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    const matchesQuery =
      query === '' ||
      task.title.toLowerCase().includes(query) ||
      task.description.toLowerCase().includes(query) ||
      (task.tags && task.tags.some((t) => t.toLowerCase().includes(query)));
    return matchesStatus && matchesQuery;
  });

  return filtered.sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'oldest':
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case 'title':
        return a.title.localeCompare(b.title);
      case 'dueDate': {
        if (!a.dueDate && !b.dueDate) return 0;
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      }
      default:
        return 0;
    }
  });
}

/**
 * Calculates task metrics for dashboard cards.
 */
export function calculateTaskStats(
  tasks: Task[],
  referenceDate: Date = new Date('2026-10-26T09:19:50-07:00')
) {
  let todo = 0;
  let inProgress = 0;
  let completed = 0;
  let overdue = 0;

  for (const task of tasks) {
    if (task.status === 'todo') todo++;
    else if (task.status === 'in_progress') inProgress++;
    else if (task.status === 'completed') completed++;

    if (task.status !== 'completed' && task.dueDate) {
      const d = formatDueDate(task.dueDate, referenceDate);
      if (d.isOverdue) overdue++;
    }
  }

  const total = tasks.length;
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  return {
    total,
    todo,
    inProgress,
    completed,
    overdue,
    completionRate,
  };
}
