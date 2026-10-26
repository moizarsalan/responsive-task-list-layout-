import { Task, CreateTaskDTO, UpdateTaskDTO, ApiLogEntry } from '../types/task.ts';
import { validateTaskInput } from './taskModel.ts';
import { INITIAL_SAMPLE_TASKS } from '../data/sampleTasks.ts';

const STORAGE_KEY = 'taskforge_day1_tasks';
const LOGS_STORAGE_KEY = 'taskforge_day1_logs';

class TaskMockApiService {
  private tasks: Task[] = [];
  private logs: ApiLogEntry[] = [];
  private listeners: Array<() => void> = [];

  constructor() {
    this.loadState();
  }

  private loadState() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        this.tasks = JSON.parse(stored);
      } else {
        this.tasks = [...INITIAL_SAMPLE_TASKS];
        this.saveTasks();
      }

      const storedLogs = localStorage.getItem(LOGS_STORAGE_KEY);
      if (storedLogs) {
        this.logs = JSON.parse(storedLogs);
      }
    } catch {
      this.tasks = [...INITIAL_SAMPLE_TASKS];
      this.logs = [];
    }
  }

  private saveTasks() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.tasks));
    } catch {
      // ignore
    }
  }

  private saveLogs() {
    try {
      localStorage.setItem(LOGS_STORAGE_KEY, JSON.stringify(this.logs.slice(0, 50)));
    } catch {
      // ignore
    }
  }

  private addLog(log: Omit<ApiLogEntry, 'id' | 'timestamp'>) {
    const entry: ApiLogEntry = {
      ...log,
      id: 'log-' + Math.random().toString(36).substring(2, 9),
      timestamp: new Date().toISOString(),
    };
    this.logs = [entry, ...this.logs.slice(0, 49)];
    this.saveLogs();
    this.notify();
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notify() {
    for (const listener of this.listeners) {
      listener();
    }
  }

  // GET /api/tasks
  public async getTasks(filters?: { status?: string; q?: string }): Promise<Task[]> {
    const startTime = performance.now();
    await new Promise((resolve) => setTimeout(resolve, 80));

    let result = [...this.tasks];
    if (filters?.status && filters.status !== 'all') {
      result = result.filter((t) => t.status === filters.status);
    }
    if (filters?.q) {
      const q = filters.q.toLowerCase();
      result = result.filter((t) => t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q));
    }

    this.addLog({
      method: 'GET',
      endpoint: `/api/tasks${filters ? '?' + new URLSearchParams(filters as Record<string, string>).toString() : ''}`,
      statusCode: 200,
      responsePayload: result,
      durationMs: Math.round(performance.now() - startTime),
    });

    return result;
  }

  // POST /api/tasks
  public async createTask(dto: CreateTaskDTO): Promise<{ success: boolean; data?: Task; error?: string; errors?: Record<string, string> }> {
    const startTime = performance.now();
    await new Promise((resolve) => setTimeout(resolve, 120));

    const validation = validateTaskInput(dto);
    if (!validation.isValid) {
      this.addLog({
        method: 'POST',
        endpoint: '/api/tasks',
        statusCode: 400,
        requestPayload: dto,
        responsePayload: { error: 'Validation failed', details: validation.errors },
        durationMs: Math.round(performance.now() - startTime),
      });

      return {
        success: false,
        error: 'Validation failed',
        errors: validation.errors,
      };
    }

    const newTask: Task = {
      id: 'task-' + Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 6),
      title: dto.title.trim(),
      description: dto.description.trim(),
      status: dto.status,
      dueDate: dto.dueDate ? dto.dueDate.trim() : undefined,
      priority: dto.priority || 'medium',
      tags: dto.tags && dto.tags.length > 0 ? dto.tags : ['Day 1'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.tasks = [newTask, ...this.tasks];
    this.saveTasks();

    this.addLog({
      method: 'POST',
      endpoint: '/api/tasks',
      statusCode: 201,
      requestPayload: dto,
      responsePayload: newTask,
      durationMs: Math.round(performance.now() - startTime),
    });

    this.notify();
    return { success: true, data: newTask };
  }

  // PATCH /api/tasks/:id
  public async updateTask(id: string, updates: UpdateTaskDTO): Promise<{ success: boolean; data?: Task; error?: string }> {
    const startTime = performance.now();
    await new Promise((resolve) => setTimeout(resolve, 90));

    const index = this.tasks.findIndex((t) => t.id === id);
    if (index === -1) {
      this.addLog({
        method: 'PATCH',
        endpoint: `/api/tasks/${id}`,
        statusCode: 404,
        requestPayload: updates,
        responsePayload: { error: 'Task not found' },
        durationMs: Math.round(performance.now() - startTime),
      });
      return { success: false, error: 'Task not found' };
    }

    const current = this.tasks[index];
    const updated: Task = {
      ...current,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    this.tasks[index] = updated;
    this.saveTasks();

    this.addLog({
      method: 'PATCH',
      endpoint: `/api/tasks/${id}`,
      statusCode: 200,
      requestPayload: updates,
      responsePayload: updated,
      durationMs: Math.round(performance.now() - startTime),
    });

    this.notify();
    return { success: true, data: updated };
  }

  // DELETE /api/tasks/:id
  public async deleteTask(id: string): Promise<{ success: boolean; error?: string }> {
    const startTime = performance.now();
    await new Promise((resolve) => setTimeout(resolve, 100));

    const exists = this.tasks.some((t) => t.id === id);
    if (!exists) {
      this.addLog({
        method: 'DELETE',
        endpoint: `/api/tasks/${id}`,
        statusCode: 404,
        responsePayload: { error: 'Task not found' },
        durationMs: Math.round(performance.now() - startTime),
      });
      return { success: false, error: 'Task not found' };
    }

    this.tasks = this.tasks.filter((t) => t.id !== id);
    this.saveTasks();

    this.addLog({
      method: 'DELETE',
      endpoint: `/api/tasks/${id}`,
      statusCode: 200,
      responsePayload: { success: true, id },
      durationMs: Math.round(performance.now() - startTime),
    });

    this.notify();
    return { success: true };
  }

  // Reset to initial sample tasks
  public resetToSamples(): void {
    this.tasks = [...INITIAL_SAMPLE_TASKS];
    this.saveTasks();
    this.notify();
  }

  public getRawTasks(): Task[] {
    return [...this.tasks];
  }

  public getLogs(): ApiLogEntry[] {
    return [...this.logs];
  }

  public clearLogs(): void {
    this.logs = [];
    this.saveLogs();
    this.notify();
  }
}

export const taskApi = new TaskMockApiService();
