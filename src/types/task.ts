export type IPriority = 'none' | 'low' | 'medium' | 'high';

export interface ITask {
  id: string;
  projectId: string;
  name: string;
  priority: IPriority;
  isDone: boolean;
  totalPomodoro: number;
  pomodoroCount: number;
  longBreak: number;
  shortBreak: number;
  deadline: string | null;
  assignees: string[];
  createdAt: string;
}
