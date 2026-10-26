import { Task } from '../types/task.ts';

export const INITIAL_SAMPLE_TASKS: Task[] = [
  {
    id: 'task-1',
    title: 'Review CRUD and 3-Tier Architecture',
    description:
      'Map Create, Read, Update, and Delete operations to HTTP verbs (POST, GET, PUT/PATCH, DELETE) and analyze the separation of concerns between client UI, server API, and persistent database.',
    status: 'completed',
    dueDate: '2026-10-26T17:00:00Z',
    createdAt: '2026-10-26T08:30:00Z',
    updatedAt: '2026-10-26T09:15:00Z',
    priority: 'high',
    tags: ['Architecture', 'Core Concept', 'Day 1'],
  },
  {
    id: 'task-2',
    title: 'Draw Task Data Model & TypeScript Interfaces',
    description:
      'Draft the formal schema for tasks including title (required string), description (required text), status (enum: todo | in_progress | completed), and optional dueDate (ISO date), plus auto-generated metadata.',
    status: 'completed',
    dueDate: '2026-10-26T18:00:00Z',
    createdAt: '2026-10-26T09:00:00Z',
    updatedAt: '2026-10-26T09:40:00Z',
    priority: 'high',
    tags: ['Data Model', 'TypeScript', 'Day 1'],
  },
  {
    id: 'task-3',
    title: 'Build Responsive Task-List Layout',
    description:
      'Implement an adaptive task list interface that displays task cards across mobile (390px) and desktop (1440px) viewports with status chips, due date indicators, and quick filters.',
    status: 'in_progress',
    dueDate: '2026-10-27T12:00:00Z',
    createdAt: '2026-10-26T09:30:00Z',
    updatedAt: '2026-10-26T10:00:00Z',
    priority: 'medium',
    tags: ['UI/UX', 'Tailwind', 'Responsive'],
  },
  {
    id: 'task-4',
    title: 'Create Add Task Form UI with Validation',
    description:
      'Design an accessible modal form allowing users to input title, description, status, and optional due date with real-time validation error messaging and optimistic list updates.',
    status: 'in_progress',
    dueDate: '2026-10-27T18:00:00Z',
    createdAt: '2026-10-26T10:15:00Z',
    updatedAt: '2026-10-26T10:45:00Z',
    priority: 'high',
    tags: ['Forms', 'Validation', 'Accessibility'],
  },
  {
    id: 'task-5',
    title: 'Record Planned REST API Route Specifications',
    description:
      'Document all planned backend endpoints (GET /api/tasks, POST /api/tasks, PATCH /api/tasks/:id, DELETE /api/tasks/:id) with contract schemas and status codes in preparation for Day 2 server wiring.',
    status: 'todo',
    dueDate: '2026-10-28T17:00:00Z',
    createdAt: '2026-10-26T11:00:00Z',
    updatedAt: '2026-10-26T11:00:00Z',
    priority: 'medium',
    tags: ['API Design', 'REST', 'Day 2 Prep'],
  },
  {
    id: 'task-6',
    title: 'Prepare Database Migration & Connection Strategy',
    description:
      'Research connection pooling, ORM schema migration scripts, and database indexing strategies for the tasks table ahead of tomorrow backend integration sprint.',
    status: 'todo',
    dueDate: '2026-10-29T12:00:00Z',
    createdAt: '2026-10-26T11:30:00Z',
    updatedAt: '2026-10-26T11:30:00Z',
    priority: 'low',
    tags: ['Database', 'Postgres', 'Day 2'],
  },
];
