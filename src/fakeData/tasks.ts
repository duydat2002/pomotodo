import {IPriority} from '@/types';

export const TASKS = [
  {
    id: 'task1',
    projectId: 'project1',
    name: 'Task 1',
    priority: 'none' as IPriority,
    isDone: false,
    totalPomodoro: 4,
    pomodoroCount: 1,
    longBreak: 5 * 60,
    shortBreak: 60,
    deadline: null,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'task2',
    projectId: 'project1',
    name: 'Task 2',
    priority: 'low' as IPriority,
    isDone: false,
    totalPomodoro: 6,
    pomodoroCount: 2,
    longBreak: 5 * 60,
    shortBreak: 60,
    deadline: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  },
];
