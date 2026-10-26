import test from 'node:test';
import assert from 'node:assert/strict';
import {
  validateTaskInput,
  formatDueDate,
  filterAndSortTasks,
  calculateTaskStats,
} from './taskModel.ts';
import { Task } from '../types/task.ts';

test('validateTaskInput catches empty or missing required fields', () => {
  const result = validateTaskInput({
    title: '',
    description: '',
    status: 'todo',
  });

  assert.equal(result.isValid, false);
  assert.ok(result.errors.title);
  assert.ok(result.errors.description);
});

test('validateTaskInput enforces title length constraints', () => {
  const tooShort = validateTaskInput({
    title: 'ab',
    description: 'Valid description here',
    status: 'todo',
  });
  assert.equal(tooShort.isValid, false);
  assert.match(tooShort.errors.title, /at least 3 characters/);

  const valid = validateTaskInput({
    title: 'Valid Title Here',
    description: 'Valid description here',
    status: 'todo',
    dueDate: '2026-10-30',
  });
  assert.equal(valid.isValid, true);
  assert.equal(Object.keys(valid.errors).length, 0);
});

test('validateTaskInput allows optional due date and rejects invalid date strings', () => {
  const withoutDueDate = validateTaskInput({
    title: 'No due date item',
    description: 'This is completely optional',
    status: 'in_progress',
  });
  assert.equal(withoutDueDate.isValid, true);

  const withInvalidDate = validateTaskInput({
    title: 'Invalid date item',
    description: 'This has a gibberish date',
    status: 'in_progress',
    dueDate: 'not-a-real-date',
  });
  assert.equal(withInvalidDate.isValid, false);
  assert.ok(withInvalidDate.errors.dueDate);
});

test('formatDueDate correctly computes relative status', () => {
  const ref = new Date('2026-10-26T12:00:00Z');

  const empty = formatDueDate(undefined, ref);
  assert.equal(empty.formatted, 'No due date');
  assert.equal(empty.isOverdue, false);

  const past = formatDueDate('2026-10-24T12:00:00Z', ref);
  assert.equal(past.isOverdue, true);
  assert.match(past.relativeLabel, /overdue/);

  const today = formatDueDate('2026-10-26T12:00:00Z', ref);
  assert.equal(today.isToday, true);
  assert.equal(today.relativeLabel, 'Due today');

  const tomorrow = formatDueDate('2026-10-27T12:00:00Z', ref);
  assert.equal(tomorrow.isSoon, true);
  assert.equal(tomorrow.relativeLabel, 'Due tomorrow');
});

test('filterAndSortTasks correctly filters by status and text query', () => {
  const sample: Task[] = [
    {
      id: '1',
      title: 'Review CRUD and architecture',
      description: 'Understand Create Read Update Delete',
      status: 'completed',
      createdAt: '2026-10-26T08:00:00Z',
      updatedAt: '2026-10-26T08:00:00Z',
      tags: ['architecture', 'day1'],
    },
    {
      id: '2',
      title: 'Build task list layout',
      description: 'Create responsive UI',
      status: 'in_progress',
      createdAt: '2026-10-26T09:00:00Z',
      updatedAt: '2026-10-26T09:00:00Z',
      tags: ['ui', 'frontend'],
    },
    {
      id: '3',
      title: 'Design API route specifications',
      description: 'Document endpoints for day 2 backend',
      status: 'todo',
      createdAt: '2026-10-26T10:00:00Z',
      updatedAt: '2026-10-26T10:00:00Z',
      tags: ['backend', 'api'],
    },
  ];

  const onlyTodo = filterAndSortTasks(sample, '', 'todo');
  assert.equal(onlyTodo.length, 1);
  assert.equal(onlyTodo[0].id, '3');

  const searchCRUD = filterAndSortTasks(sample, 'crud', 'all');
  assert.equal(searchCRUD.length, 1);
  assert.equal(searchCRUD[0].id, '1');

  const searchTag = filterAndSortTasks(sample, 'frontend', 'all');
  assert.equal(searchTag.length, 1);
  assert.equal(searchTag[0].id, '2');
});

test('calculateTaskStats aggregates totals and status counts', () => {
  const sample: Task[] = [
    {
      id: '1',
      title: 'A',
      description: 'Task A',
      status: 'todo',
      createdAt: '2026-10-26T08:00:00Z',
      updatedAt: '2026-10-26T08:00:00Z',
      dueDate: '2026-10-20', // overdue
    },
    {
      id: '2',
      title: 'B',
      description: 'Task B',
      status: 'in_progress',
      createdAt: '2026-10-26T08:00:00Z',
      updatedAt: '2026-10-26T08:00:00Z',
    },
    {
      id: '3',
      title: 'C',
      description: 'Task C',
      status: 'completed',
      createdAt: '2026-10-26T08:00:00Z',
      updatedAt: '2026-10-26T08:00:00Z',
    },
  ];

  const stats = calculateTaskStats(sample, new Date('2026-10-26T12:00:00Z'));
  assert.equal(stats.total, 3);
  assert.equal(stats.todo, 1);
  assert.equal(stats.inProgress, 1);
  assert.equal(stats.completed, 1);
  assert.equal(stats.overdue, 1);
  assert.equal(stats.completionRate, 33);
});
