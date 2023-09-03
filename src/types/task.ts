export interface IProject {
  id: string;
  name: string;
  color: string;
  totalTime: number;
  elapsedTime: number;
  totalTask: number;
  taskComplete: number;
  ownerId: string; //Project owner ID
}

export interface ITask {
  id: string;
  projectId: string;
  name: string;
  priority: 'none' | 'lower' | 'medium' | 'hight';
  isDone: boolean;
  totalPomodoro: number;
  pomodoroCount: number;
  longBreak: number;
  shortBreak: number;
  deadline?: any;
  assignees?: string[]; // IDs of those assigned to the task
}
