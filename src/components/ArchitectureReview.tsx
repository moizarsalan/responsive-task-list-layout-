import React, { useState } from 'react';
import {
  Database,
  Server,
  Monitor,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  Copy,
  Check,
} from 'lucide-react';
import { CRUD_OPERATIONS, ARCHITECTURE_LAYERS } from '../data/architectureDocs.ts';

export const ArchitectureReview: React.FC = () => {
  const [selectedCrud, setSelectedCrud] = useState<'C' | 'R' | 'U' | 'D'>('C');
  const [selectedLayer, setSelectedLayer] = useState<'Frontend' | 'Backend' | 'Database'>('Frontend');
  const [schemaFormat, setSchemaFormat] = useState<'visual' | 'typescript' | 'json' | 'sql'>('visual');
  const [copied, setCopied] = useState(false);

  const activeCrud = CRUD_OPERATIONS.find((c) => c.letter === selectedCrud)!;
  const activeLayer = ARCHITECTURE_LAYERS.find((l) => l.layer === selectedLayer)!;

  const typeScriptCode = `// Task Entity Data Model
export type TaskStatus = 'todo' | 'in_progress' | 'completed';

export interface Task {
  id: string;              // Unique identifier (UUID v4)
  title: string;           // Required, 3-120 chars
  description: string;     // Required, 5-1000 chars
  status: TaskStatus;      // Enum: 'todo' | 'in_progress' | 'completed'
  dueDate?: string;        // Optional ISO 8601 string (e.g. "2026-10-30")
  createdAt: string;       // ISO 8601 timestamp
  updatedAt: string;       // ISO 8601 timestamp
  priority?: 'low' | 'medium' | 'high';
  tags?: string[];
}

export type CreateTaskDTO = Omit<Task, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateTaskDTO = Partial<CreateTaskDTO>;`;

  const jsonSchemaCode = `{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "Task",
  "type": "object",
  "required": ["id", "title", "description", "status", "createdAt", "updatedAt"],
  "properties": {
    "id": { "type": "string", "format": "uuid" },
    "title": { "type": "string", "minLength": 3, "maxLength": 120 },
    "description": { "type": "string", "minLength": 5, "maxLength": 1000 },
    "status": {
      "type": "string",
      "enum": ["todo", "in_progress", "completed"],
      "default": "todo"
    },
    "dueDate": { "type": "string", "format": "date-time" },
    "createdAt": { "type": "string", "format": "date-time" },
    "updatedAt": { "type": "string", "format": "date-time" }
  }
}`;

  const sqlDdlCode = `-- Planned PostgreSQL DDL for Day 2 Database Wiring
CREATE TYPE task_status AS ENUM ('todo', 'in_progress', 'completed');

CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(120) NOT NULL,
  description TEXT NOT NULL,
  status task_status NOT NULL DEFAULT 'todo',
  due_date TIMESTAMPTZ NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Fast retrieval indexes
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_due_date ON tasks(due_date);`;

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      {/* SECTION 1: CRUD REVIEW */}
      <section className="bg-white border border-zinc-200 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs text-zinc-500 mb-1">
            <span>Core Curriculum</span>
            <span>·</span>
            <span>Concept 1 of 3</span>
          </div>
          <h2 className="text-xl font-bold text-zinc-900 tracking-tight">
            1. CRUD Operations Review
          </h2>
          <p className="text-sm text-zinc-600 max-w-3xl mt-1 leading-relaxed">
            CRUD defines the four foundational data primitives. Every task management capability maps cleanly to one of these verbs across HTTP interfaces and database queries.
          </p>
        </div>

        {/* 4 CRUD Selector Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {CRUD_OPERATIONS.map((op) => {
            const isSelected = selectedCrud === op.letter;
            return (
              <button
                key={op.letter}
                onClick={() => setSelectedCrud(op.letter)}
                className={`p-4 rounded-xl text-left border transition-all ${
                  isSelected
                    ? 'bg-zinc-900 text-white border-zinc-900 shadow-sm'
                    : 'bg-zinc-50/80 border-zinc-200/80 hover:bg-zinc-100 hover:border-zinc-300 text-zinc-800'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`w-7 h-7 rounded-md flex items-center justify-center font-bold text-xs ${
                      isSelected ? 'bg-zinc-800 text-white' : 'bg-white text-zinc-900 border border-zinc-200'
                    }`}
                  >
                    {op.letter}
                  </span>
                  <span className={`text-xs font-mono font-medium ${isSelected ? 'text-zinc-300' : 'text-zinc-500'}`}>
                    {op.httpMethod}
                  </span>
                </div>
                <div className="text-sm font-semibold">{op.name}</div>
                <div className={`text-xs truncate mt-0.5 ${isSelected ? 'text-zinc-300' : 'text-zinc-500'}`}>
                  {op.verb}
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected CRUD Detail Box */}
        <div className="bg-zinc-50 border border-zinc-200/90 rounded-xl p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-200 pb-3">
            <div className="flex items-center gap-3">
              <span className="text-lg font-bold text-zinc-900">{activeCrud.name}</span>
              <span className="px-2 py-0.5 rounded text-xs font-mono font-semibold bg-white border border-zinc-200 text-zinc-700">
                HTTP {activeCrud.httpMethod}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-zinc-600">
              <span>Expected Status:</span>
              <span className="font-mono text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                {activeCrud.expectedStatus}
              </span>
            </div>
          </div>

          <p className="text-sm text-zinc-700 leading-relaxed">{activeCrud.description}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
            <div className="bg-white rounded-lg p-3.5 border border-zinc-200">
              <div className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-1">
                UI Interaction in App
              </div>
              <p className="text-xs sm:text-sm text-zinc-800">{activeCrud.taskAppExample}</p>
            </div>

            <div className="bg-white rounded-lg p-3.5 border border-zinc-200">
              <div className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-1">
                SQL Query Equivalent (Day 2)
              </div>
              <code className="text-xs font-mono text-zinc-900 block overflow-x-auto">
                {activeCrud.sqlEquivalent}
              </code>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: FRONTEND VS BACKEND VS DATABASE */}
      <section className="bg-white border border-zinc-200 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs text-zinc-500 mb-1">
            <span>System Architecture</span>
            <span>·</span>
            <span>Concept 2 of 3</span>
          </div>
          <h2 className="text-xl font-bold text-zinc-900 tracking-tight">
            2. Frontend vs. Backend vs. Database (3-Tier Model)
          </h2>
          <p className="text-sm text-zinc-600 max-w-3xl mt-1 leading-relaxed">
            Architectural separation of concerns: The frontend provides responsive UX; the backend enforces business logic and authorization; the database guarantees durable storage.
          </p>
        </div>

        {/* 3-Tier Visual Selector */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => setSelectedLayer('Frontend')}
            className={`p-4 rounded-xl border text-left transition-all ${
              selectedLayer === 'Frontend'
                ? 'bg-zinc-900 text-white border-zinc-900 shadow-sm'
                : 'bg-zinc-50/80 border-zinc-200/80 hover:bg-zinc-100 hover:border-zinc-300 text-zinc-800'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${selectedLayer === 'Frontend' ? 'bg-zinc-800 text-white' : 'bg-white text-zinc-800 border border-zinc-200'}`}>
                <Monitor className="w-4 h-4" />
              </div>
              <span className={`text-[11px] font-medium ${selectedLayer === 'Frontend' ? 'text-zinc-300' : 'text-zinc-500'}`}>
                Client Tier
              </span>
            </div>
            <h3 className="text-base font-bold">Frontend</h3>
            <p className={`text-xs mt-1 line-clamp-2 ${selectedLayer === 'Frontend' ? 'text-zinc-300' : 'text-zinc-500'}`}>
              Browser application: UI rendering, form validation, user interaction.
            </p>
          </button>

          <button
            onClick={() => setSelectedLayer('Backend')}
            className={`p-4 rounded-xl border text-left transition-all ${
              selectedLayer === 'Backend'
                ? 'bg-zinc-900 text-white border-zinc-900 shadow-sm'
                : 'bg-zinc-50/80 border-zinc-200/80 hover:bg-zinc-100 hover:border-zinc-300 text-zinc-800'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${selectedLayer === 'Backend' ? 'bg-zinc-800 text-white' : 'bg-white text-zinc-800 border border-zinc-200'}`}>
                <Server className="w-4 h-4" />
              </div>
              <span className={`text-[11px] font-medium ${selectedLayer === 'Backend' ? 'text-zinc-300' : 'text-zinc-500'}`}>
                API & Logic
              </span>
            </div>
            <h3 className="text-base font-bold">Backend</h3>
            <p className={`text-xs mt-1 line-clamp-2 ${selectedLayer === 'Backend' ? 'text-zinc-300' : 'text-zinc-500'}`}>
              Server & REST API: Business logic, authentication, request validation.
            </p>
          </button>

          <button
            onClick={() => setSelectedLayer('Database')}
            className={`p-4 rounded-xl border text-left transition-all ${
              selectedLayer === 'Database'
                ? 'bg-zinc-900 text-white border-zinc-900 shadow-sm'
                : 'bg-zinc-50/80 border-zinc-200/80 hover:bg-zinc-100 hover:border-zinc-300 text-zinc-800'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${selectedLayer === 'Database' ? 'bg-zinc-800 text-white' : 'bg-white text-zinc-800 border border-zinc-200'}`}>
                <Database className="w-4 h-4" />
              </div>
              <span className={`text-[11px] font-medium ${selectedLayer === 'Database' ? 'text-zinc-300' : 'text-zinc-500'}`}>
                Storage
              </span>
            </div>
            <h3 className="text-base font-bold">Database</h3>
            <p className={`text-xs mt-1 line-clamp-2 ${selectedLayer === 'Database' ? 'text-zinc-300' : 'text-zinc-500'}`}>
              Persistent storage: ACID safety, constraints, relational indexing.
            </p>
          </button>
        </div>

        {/* Inspection Details */}
        <div className="bg-zinc-50 border border-zinc-200/90 rounded-xl p-5 grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-3">
            <div>
              <div className="text-base font-bold text-zinc-900">{activeLayer.title}</div>
              <div className="text-xs text-zinc-500">{activeLayer.role}</div>
            </div>

            <div>
              <span className="text-xs font-semibold text-zinc-700 uppercase tracking-wider">
                Core Responsibilities:
              </span>
              <ul className="mt-2 space-y-1.5 text-xs text-zinc-600">
                {activeLayer.responsibilities.map((r, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="space-y-4 bg-white p-4 rounded-lg border border-zinc-200">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-rose-700 uppercase tracking-wider mb-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Security Boundary</span>
              </div>
              <p className="text-xs text-zinc-600 leading-relaxed">{activeLayer.securityBoundary}</p>
            </div>

            <div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-900 uppercase tracking-wider mb-1">
                <Sparkles className="w-3.5 h-3.5 text-zinc-700" />
                <span>What happens when you click "Add Task"?</span>
              </div>
              <p className="text-xs text-zinc-600 leading-relaxed">
                {activeLayer.whatHappensOnAddTask}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: TASK DATA MODEL SPECIFICATION */}
      <section className="bg-white border border-zinc-200 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-xs text-zinc-500 mb-1">
              <span>Data Modeling</span>
              <span>·</span>
              <span>Concept 3 of 3</span>
            </div>
            <h2 className="text-xl font-bold text-zinc-900 tracking-tight">
              3. Task Data Model Specification
            </h2>
            <p className="text-sm text-zinc-600 max-w-2xl mt-1 leading-relaxed">
              Task entity definition with required title, description, status, and optional due date.
            </p>
          </div>

          {/* Schema format toggle */}
          <div className="flex items-center bg-zinc-100 p-0.5 rounded-lg border border-zinc-200 text-xs font-medium self-start sm:self-auto">
            <button
              onClick={() => setSchemaFormat('visual')}
              className={`px-2.5 py-1.5 rounded-md transition-colors ${
                schemaFormat === 'visual' ? 'bg-white text-zinc-900 shadow-xs font-semibold' : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              Visual Schema
            </button>
            <button
              onClick={() => setSchemaFormat('typescript')}
              className={`px-2.5 py-1.5 rounded-md transition-colors ${
                schemaFormat === 'typescript' ? 'bg-white text-zinc-900 shadow-xs font-semibold' : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              TypeScript
            </button>
            <button
              onClick={() => setSchemaFormat('json')}
              className={`px-2.5 py-1.5 rounded-md transition-colors ${
                schemaFormat === 'json' ? 'bg-white text-zinc-900 shadow-xs font-semibold' : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              JSON Schema
            </button>
            <button
              onClick={() => setSchemaFormat('sql')}
              className={`px-2.5 py-1.5 rounded-md transition-colors ${
                schemaFormat === 'sql' ? 'bg-white text-zinc-900 shadow-xs font-semibold' : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              SQL DDL
            </button>
          </div>
        </div>

        {schemaFormat === 'visual' ? (
          <div className="overflow-x-auto border border-zinc-200 rounded-xl">
            <table className="w-full text-left text-xs sm:text-sm border-collapse">
              <thead>
                <tr className="border-b border-zinc-200 text-zinc-500 uppercase text-[11px] font-semibold tracking-wider bg-zinc-50">
                  <th className="py-2.5 px-4">Field Name</th>
                  <th className="py-2.5 px-4">Data Type</th>
                  <th className="py-2.5 px-4">Constraint</th>
                  <th className="py-2.5 px-4">Requirement</th>
                  <th className="py-2.5 px-4">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 text-zinc-700">
                <tr className="hover:bg-zinc-50/50">
                  <td className="py-2.5 px-4 font-mono font-semibold text-zinc-900">id</td>
                  <td className="py-2.5 px-4 font-mono text-zinc-500">string (UUID)</td>
                  <td className="py-2.5 px-4 text-xs font-semibold text-zinc-700">PRIMARY KEY</td>
                  <td className="py-2.5 px-4 text-xs text-zinc-500">Auto-generated</td>
                  <td className="py-2.5 px-4 text-xs text-zinc-600">Unique identifier for each task.</td>
                </tr>
                <tr className="hover:bg-zinc-50/50">
                  <td className="py-2.5 px-4 font-mono font-semibold text-zinc-900">title</td>
                  <td className="py-2.5 px-4 font-mono text-zinc-500">string</td>
                  <td className="py-2.5 px-4 text-xs font-mono text-zinc-700">3 - 120 chars</td>
                  <td className="py-2.5 px-4 text-xs font-semibold text-rose-600">REQUIRED</td>
                  <td className="py-2.5 px-4 text-xs text-zinc-600">Short summary of the task.</td>
                </tr>
                <tr className="hover:bg-zinc-50/50">
                  <td className="py-2.5 px-4 font-mono font-semibold text-zinc-900">description</td>
                  <td className="py-2.5 px-4 font-mono text-zinc-500">text / string</td>
                  <td className="py-2.5 px-4 text-xs font-mono text-zinc-700">5 - 1000 chars</td>
                  <td className="py-2.5 px-4 text-xs font-semibold text-rose-600">REQUIRED</td>
                  <td className="py-2.5 px-4 text-xs text-zinc-600">Detailed instructions or notes.</td>
                </tr>
                <tr className="hover:bg-zinc-50/50">
                  <td className="py-2.5 px-4 font-mono font-semibold text-zinc-900">status</td>
                  <td className="py-2.5 px-4 font-mono text-zinc-500">enum (TaskStatus)</td>
                  <td className="py-2.5 px-4 text-xs font-mono text-zinc-700">todo | in_progress | completed</td>
                  <td className="py-2.5 px-4 text-xs font-semibold text-rose-600">REQUIRED (default: todo)</td>
                  <td className="py-2.5 px-4 text-xs text-zinc-600">Lifecycle state in workflow.</td>
                </tr>
                <tr className="hover:bg-zinc-50/50">
                  <td className="py-2.5 px-4 font-mono font-semibold text-zinc-900">dueDate</td>
                  <td className="py-2.5 px-4 font-mono text-zinc-500">string (ISO 8601)</td>
                  <td className="py-2.5 px-4 text-xs font-mono text-zinc-500">YYYY-MM-DDTHH:mm:ssZ</td>
                  <td className="py-2.5 px-4 text-xs font-medium text-zinc-500">OPTIONAL</td>
                  <td className="py-2.5 px-4 text-xs text-zinc-600">Target deadline for urgency calculations.</td>
                </tr>
                <tr className="hover:bg-zinc-50/50">
                  <td className="py-2.5 px-4 font-mono font-semibold text-zinc-900">createdAt</td>
                  <td className="py-2.5 px-4 font-mono text-zinc-500">timestamp</td>
                  <td className="py-2.5 px-4 text-xs text-zinc-500">CURRENT_TIMESTAMP</td>
                  <td className="py-2.5 px-4 text-xs text-zinc-500">Auto-generated</td>
                  <td className="py-2.5 px-4 text-xs text-zinc-600">Creation audit trail timestamp.</td>
                </tr>
                <tr className="hover:bg-zinc-50/50">
                  <td className="py-2.5 px-4 font-mono font-semibold text-zinc-900">updatedAt</td>
                  <td className="py-2.5 px-4 font-mono text-zinc-500">timestamp</td>
                  <td className="py-2.5 px-4 text-xs text-zinc-500">CURRENT_TIMESTAMP</td>
                  <td className="py-2.5 px-4 text-xs text-zinc-500">Auto-generated</td>
                  <td className="py-2.5 px-4 text-xs text-zinc-600">Last updated audit trail timestamp.</td>
                </tr>
              </tbody>
            </table>
          </div>
        ) : (
          <div className="bg-zinc-900 rounded-xl p-4 text-zinc-100 relative shadow-sm">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-zinc-800 text-xs text-zinc-400">
              <span className="font-mono">
                {schemaFormat === 'typescript'
                  ? 'src/types/task.ts'
                  : schemaFormat === 'json'
                  ? 'schema/task.json'
                  : 'db/schema.sql (PostgreSQL)'}
              </span>
              <button
                onClick={() =>
                  handleCopy(
                    schemaFormat === 'typescript'
                      ? typeScriptCode
                      : schemaFormat === 'json'
                      ? jsonSchemaCode
                      : sqlDdlCode
                  )
                }
                className="flex items-center gap-1 hover:text-white transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <pre className="text-xs font-mono overflow-x-auto p-1 leading-relaxed text-zinc-200">
              {schemaFormat === 'typescript'
                ? typeScriptCode
                : schemaFormat === 'json'
                ? jsonSchemaCode
                : sqlDdlCode}
            </pre>
          </div>
        )}
      </section>
    </div>
  );
};
