import {
  getLocalTasks,
  addLocalTask,
  updateLocalTask,
  deleteLocalTask,
  getArchivedTasks,
  restoreArchivedTask,
  deleteArchivedTask,
  getTaskLists,
  createTaskList,
  renameTaskList,
  deleteTaskList,
} from '../local';
import { LocalTask } from '../../../shared/types/task';

// In-memory stand-in for electron-store. The real module persists get/set;
// a bare automock returns undefined and makes every list lookup throw.
const mockMemory: Record<string, unknown> = {};

jest.mock('electron-store', () => {
  return jest.fn().mockImplementation(() => ({
    get: (key: string) => mockMemory[key],
    set: (key: string, value: unknown) => {
      mockMemory[key] = value;
    },
    delete: (key: string) => {
      delete mockMemory[key];
    },
    clear: () => {
      Object.keys(mockMemory).forEach((key) => delete mockMemory[key]);
    },
  }));
});

function sampleTask(title = 'Test Task') {
  return {
    title,
    description: 'Test Description',
    start: new Date().toISOString(),
    end: new Date(Date.now() + 3600000).toISOString(),
    repeat: 'daily' as const,
  };
}

describe('Local Task Management', () => {
  beforeEach(() => {
    Object.keys(mockMemory).forEach((key) => delete mockMemory[key]);
    jest.clearAllMocks();
  });

  describe('Task Lists', () => {
    it('should create a new task list', () => {
      const listName = 'Test List';
      const result = createTaskList(listName);
      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('name', listName);
    });

    it('should get all task lists', () => {
      const lists = getTaskLists();
      expect(Array.isArray(lists)).toBe(true);
    });

    it('should rename a task list', () => {
      const created = createTaskList('Test List');
      renameTaskList(created.id, 'New List Name');
      expect(getTaskLists()).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ id: created.id, name: 'New List Name' }),
        ])
      );
    });

    it('should delete a task list', () => {
      const created = createTaskList('Test List');
      deleteTaskList(created.id);
      expect(getTaskLists().some((list) => list.id === created.id)).toBe(false);
    });
  });

  describe('Tasks', () => {
    it('should add a new task', () => {
      const task = sampleTask();
      const result = addLocalTask(task);
      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('title', task.title);
    });

    it('should get all tasks', () => {
      const tasks = getLocalTasks();
      expect(Array.isArray(tasks)).toBe(true);
    });

    it('should update a task', () => {
      const created = addLocalTask(sampleTask());
      const updated: LocalTask = {
        ...created,
        title: 'Updated Task',
        description: 'Updated Description',
      };
      updateLocalTask(updated);
      expect(getLocalTasks().find((task) => task.id === created.id)?.title).toBe('Updated Task');
    });

    it('should delete a task', () => {
      const created = addLocalTask(sampleTask());
      deleteLocalTask(created.id);
      expect(getLocalTasks().some((task) => task.id === created.id)).toBe(false);
    });
  });

  describe('Archived Tasks', () => {
    it('should get archived tasks', () => {
      const created = addLocalTask(sampleTask());
      updateLocalTask({ ...created, archived: true });
      const archivedTasks = getArchivedTasks();
      expect(Array.isArray(archivedTasks)).toBe(true);
      expect(archivedTasks.some((task) => task.id === created.id)).toBe(true);
    });

    it('should restore an archived task', () => {
      const created = addLocalTask(sampleTask());
      updateLocalTask({ ...created, archived: true });
      restoreArchivedTask(created.id);
      expect(getArchivedTasks().some((task) => task.id === created.id)).toBe(false);
      expect(getLocalTasks().some((task) => task.id === created.id)).toBe(true);
    });

    it('should delete an archived task', () => {
      const created = addLocalTask(sampleTask());
      updateLocalTask({ ...created, archived: true });
      deleteArchivedTask(created.id);
      expect(getArchivedTasks().some((task) => task.id === created.id)).toBe(false);
      expect(getLocalTasks().some((task) => task.id === created.id)).toBe(false);
    });
  });
});
