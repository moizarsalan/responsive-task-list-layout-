import { ApiRouteDefinition } from '../types/task.ts';

export interface CrudOperationDoc {
  letter: 'C' | 'R' | 'U' | 'D';
  name: string;
  verb: string;
  httpMethod: string;
  sqlEquivalent: string;
  description: string;
  taskAppExample: string;
  expectedStatus: string;
  idempotent: boolean;
}

export const CRUD_OPERATIONS: CrudOperationDoc[] = [
  {
    letter: 'C',
    name: 'Create',
    verb: 'Create a new resource',
    httpMethod: 'POST',
    sqlEquivalent: 'INSERT INTO tasks ...',
    description: 'Generates a new record in storage with a unique ID and returns the newly instantiated entity.',
    taskAppExample: 'Submitting the "Add Task" form with title, description, status, and optional due date.',
    expectedStatus: '201 Created',
    idempotent: false,
  },
  {
    letter: 'R',
    name: 'Read',
    verb: 'Retrieve existing resource(s)',
    httpMethod: 'GET',
    sqlEquivalent: 'SELECT * FROM tasks WHERE ...',
    description: 'Queries data from persistent storage without mutating server state. Can return collections or single entities.',
    taskAppExample: 'Loading the responsive task list, filtering by "In Progress", or searching by keyword.',
    expectedStatus: '200 OK',
    idempotent: true,
  },
  {
    letter: 'U',
    name: 'Update',
    verb: 'Modify an existing resource',
    httpMethod: 'PUT / PATCH',
    sqlEquivalent: 'UPDATE tasks SET status = ? WHERE id = ?',
    description: 'Modifies attributes of an existing record identified by its unique identifier. PUT replaces the full document; PATCH applies partial field deltas.',
    taskAppExample: 'Toggling a task status from "todo" to "completed", or editing the description.',
    expectedStatus: '200 OK (or 204 No Content)',
    idempotent: true,
  },
  {
    letter: 'D',
    name: 'Delete',
    verb: 'Remove a resource',
    httpMethod: 'DELETE',
    sqlEquivalent: 'DELETE FROM tasks WHERE id = ?',
    description: 'Permanently removes or soft-deletes a record from storage matching the specified identifier.',
    taskAppExample: 'Clicking the trash button on a task card to purge it from the system.',
    expectedStatus: '204 No Content (or 200 OK)',
    idempotent: true,
  },
];

export interface LayerComparison {
  layer: 'Frontend' | 'Backend' | 'Database';
  title: string;
  role: string;
  technologies: string[];
  responsibilities: string[];
  securityBoundary: string;
  whatHappensOnAddTask: string;
}

export const ARCHITECTURE_LAYERS: LayerComparison[] = [
  {
    layer: 'Frontend',
    title: 'Client Application (Browser)',
    role: 'User Interface & Interaction Layer',
    technologies: ['React 19', 'TypeScript', 'Tailwind CSS', 'Vite'],
    responsibilities: [
      'Render responsive task cards, boards, and statistics',
      'Capture and validate user inputs in the Add Task form',
      'Provide immediate optimistic feedback and loading indicators',
      'Manage local view filters (search, status tabs, sort order)',
    ],
    securityBoundary: 'Runs entirely on the user’s machine. Cannot be trusted with private keys or database passwords.',
    whatHappensOnAddTask: 'Validates input strings, displays the modal, dispatches a POST /api/tasks request to the server, and optimistically appends the task to the screen.',
  },
  {
    layer: 'Backend',
    title: 'Application Server & REST API',
    role: 'Business Logic & Security Boundary',
    technologies: ['Node.js', 'Express.js', 'TypeScript', 'Validation Middlewares'],
    responsibilities: [
      'Expose secure REST endpoints (/api/tasks)',
      'Enforce server-side data validation and sanitize inputs',
      'Authenticate users and enforce authorization policies',
      'Orchestrate database queries and format JSON responses',
    ],
    securityBoundary: 'Protected server environment. Holds database connection credentials and business rules.',
    whatHappensOnAddTask: 'Receives the JSON body, verifies title/description length and status enum, assigns a UUID and timestamps, and triggers an INSERT query on the DB.',
  },
  {
    layer: 'Database',
    title: 'Persistent Storage',
    role: 'Durability & ACID Data Store',
    technologies: ['PostgreSQL / SQLite / Cloud SQL', 'Relational Schemas', 'Indexes'],
    responsibilities: [
      'Store records reliably on non-volatile disk',
      'Enforce table constraints (NOT NULL, UNIQUE, ENUM, FOREIGN KEYS)',
      'Maintain B-Tree indexes on status and dueDate for fast retrieval',
      'Guarantee ACID transaction safety across concurrent edits',
    ],
    securityBoundary: 'Locked within private subnet. Only accessible by authorized backend servers.',
    whatHappensOnAddTask: 'Executes INSERT INTO tasks (...), writes to the Write-Ahead Log (WAL), verifies column constraints, and persists the record permanently.',
  },
];

export const PLANNED_API_ROUTES: ApiRouteDefinition[] = [
  {
    id: 'route-get-tasks',
    method: 'GET',
    path: '/api/tasks',
    summary: 'List all tasks',
    description: 'Retrieves a list of tasks. Supports optional query filters for status and text search.',
    crudOperation: 'Read',
    plannedPhase: 'Day 1 (Design)',
    requestParams: [
      { name: 'status', type: 'string', required: false, description: 'Filter by "todo", "in_progress", or "completed"' },
      { name: 'q', type: 'string', required: false, description: 'Search keywords matching title or description' },
      { name: 'sort', type: 'string', required: false, description: 'Sort by "newest", "oldest", or "dueDate"' },
    ],
    responses: [
      {
        status: 200,
        description: 'Array of task objects successfully retrieved',
        sampleBody: [
          {
            id: 'task-1',
            title: 'Review CRUD and 3-Tier Architecture',
            description: 'Map Create, Read, Update, Delete to HTTP verbs...',
            status: 'completed',
            dueDate: '2026-10-26T17:00:00Z',
            createdAt: '2026-10-26T08:30:00Z',
            updatedAt: '2026-10-26T09:15:00Z',
          },
        ],
      },
    ],
  },
  {
    id: 'route-post-tasks',
    method: 'POST',
    path: '/api/tasks',
    summary: 'Create a new task',
    description: 'Validates task payload and persists a new task in storage. Generates id, createdAt, and updatedAt automatically.',
    crudOperation: 'Create',
    plannedPhase: 'Day 1 (Design)',
    requestHeaders: {
      'Content-Type': 'application/json',
    },
    requestBody: {
      contentType: 'application/json',
      schema: '{ title: string (required), description: string (required), status: "todo"|"in_progress"|"completed", dueDate?: string }',
      samplePayload: {
        title: 'Complete Day 1 Foundation Sprint',
        description: 'Verify all CRUD concepts, responsive task list, and Add Task UI.',
        status: 'in_progress',
        dueDate: '2026-10-27T18:00:00Z',
        priority: 'high',
      },
    },
    responses: [
      {
        status: 201,
        description: 'Task created successfully with server-assigned id and timestamps',
        sampleBody: {
          id: 'task-new-uuid-1234',
          title: 'Complete Day 1 Foundation Sprint',
          description: 'Verify all CRUD concepts, responsive task list, and Add Task UI.',
          status: 'in_progress',
          dueDate: '2026-10-27T18:00:00Z',
          createdAt: '2026-10-26T12:00:00Z',
          updatedAt: '2026-10-26T12:00:00Z',
        },
      },
      {
        status: 400,
        description: 'Validation failure: missing required title or description',
        sampleBody: {
          error: 'Validation failed',
          details: {
            title: 'Title must be at least 3 characters long',
          },
        },
      },
    ],
  },
  {
    id: 'route-get-task-id',
    method: 'GET',
    path: '/api/tasks/:id',
    summary: 'Get single task by ID',
    description: 'Retrieves full details for a single task given its unique identifier.',
    crudOperation: 'Read',
    plannedPhase: 'Day 1 (Design)',
    requestParams: [
      { name: 'id', type: 'string', required: true, description: 'Unique task identifier' },
    ],
    responses: [
      {
        status: 200,
        description: 'Task details found and returned',
        sampleBody: {
          id: 'task-1',
          title: 'Review CRUD and 3-Tier Architecture',
          description: 'Map Create, Read, Update, Delete to HTTP verbs...',
          status: 'completed',
          dueDate: '2026-10-26T17:00:00Z',
          createdAt: '2026-10-26T08:30:00Z',
          updatedAt: '2026-10-26T09:15:00Z',
        },
      },
      {
        status: 404,
        description: 'Task with given ID not found',
        sampleBody: {
          error: 'Task not found',
        },
      },
    ],
  },
  {
    id: 'route-patch-task-id',
    method: 'PATCH',
    path: '/api/tasks/:id',
    summary: 'Update task fields or status',
    description: 'Applies partial updates to a task (e.g. status transition from todo to in_progress or completed). Automatically updates updatedAt.',
    crudOperation: 'Update',
    plannedPhase: 'Day 1 (Design)',
    requestHeaders: {
      'Content-Type': 'application/json',
    },
    requestParams: [
      { name: 'id', type: 'string', required: true, description: 'Unique task identifier' },
    ],
    requestBody: {
      contentType: 'application/json',
      schema: '{ status?: "todo"|"in_progress"|"completed", title?: string, description?: string, dueDate?: string }',
      samplePayload: {
        status: 'completed',
      },
    },
    responses: [
      {
        status: 200,
        description: 'Task updated successfully',
        sampleBody: {
          id: 'task-3',
          title: 'Build Responsive Task-List Layout',
          status: 'completed',
          updatedAt: '2026-10-26T12:05:00Z',
        },
      },
      {
        status: 404,
        description: 'Task not found',
        sampleBody: { error: 'Task not found' },
      },
    ],
  },
  {
    id: 'route-delete-task-id',
    method: 'DELETE',
    path: '/api/tasks/:id',
    summary: 'Delete a task',
    description: 'Permanently removes the specified task from persistent storage.',
    crudOperation: 'Delete',
    plannedPhase: 'Day 1 (Design)',
    requestParams: [
      { name: 'id', type: 'string', required: true, description: 'Unique task identifier' },
    ],
    responses: [
      {
        status: 200,
        description: 'Task successfully removed',
        sampleBody: {
          success: true,
          message: 'Task deleted successfully',
          id: 'task-3',
        },
      },
      {
        status: 404,
        description: 'Task not found',
        sampleBody: { error: 'Task not found' },
      },
    ],
  },
];
