import React, { useState } from 'react';
import {
  Send,
  Copy,
  Check,
  FileDown,
  Terminal,
  Clock,
} from 'lucide-react';
import { PLANNED_API_ROUTES } from '../data/architectureDocs.ts';
import { ApiRouteDefinition } from '../types/task.ts';
import { taskApi } from '../utils/apiMockService.ts';

export const PlannedApiRoutes: React.FC = () => {
  const [selectedRouteId, setSelectedRouteId] = useState<string>('route-post-tasks');
  const [testResult, setTestResult] = useState<{
    status: number;
    durationMs: number;
    payload: any;
  } | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [copiedCurl, setCopiedCurl] = useState(false);
  const [copiedSpec, setCopiedSpec] = useState(false);

  const selectedRoute = PLANNED_API_ROUTES.find((r) => r.id === selectedRouteId) || PLANNED_API_ROUTES[0];

  const methodColors: Record<string, { bg: string; text: string; border: string }> = {
    GET: { bg: 'bg-sky-50', text: 'text-sky-700', border: 'border-sky-200' },
    POST: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
    PATCH: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
    PUT: { bg: 'bg-zinc-100', text: 'text-zinc-700', border: 'border-zinc-200' },
    DELETE: { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200' },
  };

  const getCurlSnippet = (route: ApiRouteDefinition): string => {
    const origin = window.location.origin;
    if (route.method === 'GET') {
      return `curl -X GET "${origin}${route.path}" \\
  -H "Accept: application/json"`;
    }
    if (route.method === 'POST') {
      return `curl -X POST "${origin}${route.path}" \\
  -H "Content-Type: application/json" \\
  -d '${JSON.stringify(route.requestBody?.samplePayload || {}, null, 2)}'`;
    }
    if (route.method === 'PATCH') {
      return `curl -X PATCH "${origin}/api/tasks/task-1" \\
  -H "Content-Type: application/json" \\
  -d '{"status": "completed"}'`;
    }
    if (route.method === 'DELETE') {
      return `curl -X DELETE "${origin}/api/tasks/task-1"`;
    }
    return `curl -X ${route.method} "${origin}${route.path}"`;
  };

  const handleCopyCurl = () => {
    navigator.clipboard.writeText(getCurlSnippet(selectedRoute));
    setCopiedCurl(true);
    setTimeout(() => setCopiedCurl(false), 1500);
  };

  const handleExportSpec = () => {
    const openApiSpec = {
      openapi: '3.1.0',
      info: {
        title: 'TaskForge API',
        version: '1.0.0',
        description: 'Planned REST API routes for TaskForge Day 1 foundation, implemented in Day 2.',
      },
      paths: {
        '/api/tasks': {
          get: {
            summary: 'List all tasks',
            responses: { '200': { description: 'Success' } },
          },
          post: {
            summary: 'Create a new task',
            responses: { '201': { description: 'Task created' } },
          },
        },
        '/api/tasks/{id}': {
          get: {
            summary: 'Get task by ID',
            parameters: [{ name: 'id', in: 'path', required: true }],
            responses: { '200': { description: 'Found' }, '404': { description: 'Not found' } },
          },
          patch: {
            summary: 'Update task',
            parameters: [{ name: 'id', in: 'path', required: true }],
            responses: { '200': { description: 'Updated' } },
          },
          delete: {
            summary: 'Delete task',
            parameters: [{ name: 'id', in: 'path', required: true }],
            responses: { '200': { description: 'Deleted' } },
          },
        },
      },
    };

    navigator.clipboard.writeText(JSON.stringify(openApiSpec, null, 2));
    setCopiedSpec(true);
    setTimeout(() => setCopiedSpec(false), 1500);
  };

  const handleTestRoute = async () => {
    setIsExecuting(true);
    const start = performance.now();

    try {
      if (selectedRoute.method === 'GET' && selectedRoute.path === '/api/tasks') {
        const tasks = await taskApi.getTasks();
        setTestResult({
          status: 200,
          durationMs: Math.round(performance.now() - start),
          payload: tasks,
        });
      } else if (selectedRoute.method === 'POST') {
        const res = await taskApi.createTask({
          title: 'Simulated API Test Task',
          description: 'Created through the planned route interactive tester.',
          status: 'todo',
          dueDate: '2026-10-31T18:00:00Z',
          tags: ['Simulated', 'Day 1 Route'],
        });
        setTestResult({
          status: res.success ? 201 : 400,
          durationMs: Math.round(performance.now() - start),
          payload: res.data || res.errors,
        });
      } else if (selectedRoute.method === 'PATCH') {
        const rawTasks = taskApi.getRawTasks();
        const targetId = rawTasks[0]?.id || 'task-1';
        const res = await taskApi.updateTask(targetId, { status: 'completed' });
        setTestResult({
          status: res.success ? 200 : 404,
          durationMs: Math.round(performance.now() - start),
          payload: res.data || { error: res.error },
        });
      } else if (selectedRoute.method === 'DELETE') {
        const rawTasks = taskApi.getRawTasks();
        const targetId = rawTasks[rawTasks.length - 1]?.id || 'task-sample';
        const res = await taskApi.deleteTask(targetId);
        setTestResult({
          status: res.success ? 200 : 404,
          durationMs: Math.round(performance.now() - start),
          payload: { success: res.success, deletedId: targetId },
        });
      } else {
        const rawTasks = taskApi.getRawTasks();
        setTestResult({
          status: 200,
          durationMs: Math.round(performance.now() - start),
          payload: rawTasks[0] || {},
        });
      }
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="bg-white border border-zinc-200 rounded-2xl p-6 sm:p-7 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs text-zinc-500 mb-1">
            <span>Day 1 Specification</span>
            <span>·</span>
            <span>REST Blueprint</span>
          </div>
          <h2 className="text-xl font-bold text-zinc-900 tracking-tight">
            Planned API Route Specifications
          </h2>
          <p className="text-sm text-zinc-600 max-w-2xl mt-1 leading-relaxed">
            Documented endpoint contracts defining paths, HTTP methods, request bodies, and expected status codes for Day 2 implementation.
          </p>
        </div>

        <button
          onClick={handleExportSpec}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-zinc-50 hover:bg-zinc-100 text-xs sm:text-sm font-medium text-zinc-800 border border-zinc-200 transition-colors"
        >
          {copiedSpec ? <Check className="w-4 h-4 text-emerald-600" /> : <FileDown className="w-4 h-4 text-zinc-600" />}
          <span>{copiedSpec ? 'OpenAPI Spec Copied' : 'Export OpenAPI 3.1'}</span>
        </button>
      </div>

      {/* Main 2-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Route Selector List */}
        <div className="lg:col-span-5 space-y-2">
          <div className="text-xs font-semibold uppercase tracking-wider text-zinc-500 px-1 mb-1">
            Endpoints ({PLANNED_API_ROUTES.length})
          </div>

          {PLANNED_API_ROUTES.map((route) => {
            const isSelected = selectedRoute.id === route.id;
            const style = methodColors[route.method];

            return (
              <button
                key={route.id}
                onClick={() => {
                  setSelectedRouteId(route.id);
                  setTestResult(null);
                }}
                className={`w-full p-3 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'bg-zinc-900 text-white border-zinc-900 shadow-xs'
                    : 'bg-white border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50/80 text-zinc-800'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-1.5 py-0.2 rounded font-mono text-xs font-bold ${
                        isSelected ? 'bg-zinc-800 text-zinc-200' : `${style.bg} ${style.text}`
                      }`}
                    >
                      {route.method}
                    </span>
                    <span className="font-mono text-xs font-semibold truncate">
                      {route.path}
                    </span>
                  </div>
                  <span className={`text-[10px] font-medium uppercase ${isSelected ? 'text-zinc-400' : 'text-zinc-500'}`}>
                    {route.crudOperation}
                  </span>
                </div>
                <p className={`text-xs line-clamp-1 ${isSelected ? 'text-zinc-400' : 'text-zinc-500'}`}>
                  {route.summary}
                </p>
              </button>
            );
          })}
        </div>

        {/* Right Column: Route Details */}
        <div className="lg:col-span-7 bg-white border border-zinc-200 rounded-2xl p-6 space-y-5 shadow-xs">
          {/* Selected Route Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-100 pb-4">
            <div className="flex items-center gap-2.5">
              <span
                className={`px-2 py-0.5 rounded font-mono text-xs font-bold border ${
                  methodColors[selectedRoute.method].bg
                } ${methodColors[selectedRoute.method].text} ${
                  methodColors[selectedRoute.method].border
                }`}
              >
                {selectedRoute.method}
              </span>
              <div>
                <h3 className="font-mono text-sm sm:text-base font-bold text-zinc-900">
                  {selectedRoute.path}
                </h3>
                <p className="text-xs text-zinc-500">{selectedRoute.summary}</p>
              </div>
            </div>

            <button
              onClick={handleTestRoute}
              disabled={isExecuting}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 active:bg-black text-white text-xs font-medium shadow-xs disabled:opacity-50 transition-colors self-start sm:self-auto"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isExecuting ? 'Sending...' : 'Simulate Request'}</span>
            </button>
          </div>

          <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
            {selectedRoute.description}
          </p>

          {/* Request Parameters */}
          {selectedRoute.requestParams && (
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-2">
                Parameters
              </div>
              <div className="border border-zinc-200 rounded-lg overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-zinc-50 text-zinc-500 font-medium border-b border-zinc-200">
                    <tr>
                      <th className="py-2 px-3">Parameter</th>
                      <th className="py-2 px-3">Type</th>
                      <th className="py-2 px-3">Required</th>
                      <th className="py-2 px-3">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-200 text-zinc-700 font-mono text-[11px]">
                    {selectedRoute.requestParams.map((p) => (
                      <tr key={p.name}>
                        <td className="py-2 px-3 font-semibold text-zinc-900">{p.name}</td>
                        <td className="py-2 px-3 text-zinc-500">{p.type}</td>
                        <td className="py-2 px-3">
                          <span
                            className={`px-1.5 py-0.2 rounded text-[10px] ${
                              p.required ? 'bg-rose-50 text-rose-700 font-semibold' : 'bg-zinc-100 text-zinc-500'
                            }`}
                          >
                            {p.required ? 'YES' : 'OPTIONAL'}
                          </span>
                        </td>
                        <td className="py-2 px-3 text-zinc-600 font-sans">{p.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Expected Request Body */}
          {selectedRoute.requestBody && (
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-1.5">
                Expected Request JSON Body
              </div>
              <div className="bg-zinc-900 rounded-lg p-3 text-xs font-mono text-zinc-200 overflow-x-auto shadow-xs">
                <pre>{JSON.stringify(selectedRoute.requestBody.samplePayload, null, 2)}</pre>
              </div>
            </div>
          )}

          {/* cURL Command Preview */}
          <div>
            <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-1.5">
              <span className="flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-zinc-400" />
                <span>Planned cURL Command</span>
              </span>
              <button
                onClick={handleCopyCurl}
                className="flex items-center gap-1 text-[11px] text-zinc-500 hover:text-zinc-900 transition-colors"
              >
                {copiedCurl ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCurl ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <pre className="bg-zinc-900 p-3 rounded-lg text-[11px] font-mono text-zinc-200 overflow-x-auto shadow-xs">
              {getCurlSnippet(selectedRoute)}
            </pre>
          </div>

          {/* Live Simulated Result */}
          {testResult && (
            <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-200 space-y-2 animate-in fade-in duration-150">
              <div className="flex items-center justify-between text-xs pb-1.5 border-b border-emerald-200/80">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-600" />
                  <span className="font-semibold text-emerald-900">
                    Response: {testResult.status} {testResult.status === 201 ? 'Created' : 'OK'}
                  </span>
                </div>
                <span className="text-zinc-500 text-[11px] flex items-center gap-1 font-mono">
                  <Clock className="w-3 h-3" />
                  <span>{testResult.durationMs}ms</span>
                </span>
              </div>
              <pre className="text-[11px] font-mono text-zinc-800 max-h-48 overflow-y-auto scrollbar-thin">
                {JSON.stringify(testResult.payload, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
