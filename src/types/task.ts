export type TaskStatus = 'todo' | 'in_progress' | 'completed';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  dueDate?: string; // ISO 8601 string: YYYY-MM-DD or full timestamp
  createdAt: string;
  updatedAt: string;
  priority?: 'low' | 'medium' | 'high';
  tags?: string[];
}

export type CreateTaskDTO = {
  title: string;
  description: string;
  status: TaskStatus;
  dueDate?: string;
  priority?: 'low' | 'medium' | 'high';
  tags?: string[];
};

export type UpdateTaskDTO = Partial<CreateTaskDTO>;

export interface ApiRouteDefinition {
  id: string;
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  path: string;
  summary: string;
  description: string;
  crudOperation: 'Create' | 'Read' | 'Update' | 'Delete';
  plannedPhase: 'Day 1 (Design)' | 'Day 2 (Backend Wiring)';
  requestHeaders?: Record<string, string>;
  requestParams?: Array<{ name: string; type: string; required: boolean; description: string }>;
  requestBody?: {
    contentType: string;
    schema: string;
    samplePayload: Record<string, unknown>;
  };
  responses: Array<{
    status: number;
    description: string;
    sampleBody: Record<string, unknown> | Array<unknown>;
  }>;
}

export interface ApiLogEntry {
  id: string;
  timestamp: string;
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  endpoint: string;
  statusCode: number;
  requestPayload?: unknown;
  responsePayload: unknown;
  durationMs: number;
}
