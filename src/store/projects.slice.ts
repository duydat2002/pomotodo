import {storeData} from '@/hooks';
import {IProject, ITask, IUser} from '@/types';
import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface IState {
  projects: IProject[] | null;
  project: IProject | null;
  tasks: ITask[] | null;
}

export const projectsSlice = createSlice({
  name: 'projects',
  initialState: {
    projects: null,
    project: null,
    tasks: [
      {
        id: '123',
        projectId: '1',
        name: 'Task 1',
        priority: 'medium',
        isDone: false,
        totalPomodoro: 6,
        pomodoroCount: 1,
        longBreak: 25 * 60 * 60,
        shortBreak: 5 * 60 * 60,
        createdAt: new Date(),
      },
      {
        id: '124',
        projectId: '1',
        name: 'Task 2',
        priority: 'hight',
        isDone: true,
        totalPomodoro: 4,
        pomodoroCount: 1,
        longBreak: 25 * 60 * 60,
        shortBreak: 5 * 60 * 60,
        createdAt: new Date(),
      },
    ],
  } as IState,
  reducers: {
    // Project
    setProjects: (state, action: PayloadAction<IProject[] | null>) => {
      state.projects = action.payload;
      storeData('projects', action.payload);
    },
    addProject: (state, action: PayloadAction<IProject>) => {
      if (!state.projects) state.projects = [action.payload];
      else state.projects!.push(action.payload);
      storeData('projects', state.projects);
    },
    setProject: (state, action: PayloadAction<IProject | null>) => {
      state.project = action.payload;
      storeData('project', action.payload);
    },
    updateProject: (state, action: PayloadAction<{id: string; datas: any}>) => {
      if (state.projects) {
        const {id, datas} = action.payload;

        const updatedProjects = state.projects?.map(project => {
          if (project.id == id) {
            return {
              ...project,
              ...datas,
            };
          } else {
            return project;
          }
        });

        state.projects = updatedProjects;
      }
    },

    // Task
    setTasks: (state, action: PayloadAction<ITask[] | null>) => {
      state.tasks = action.payload;
      storeData('tasks', action.payload);
    },
    updateTask: (state, action: PayloadAction<{id: string; datas: any}>) => {
      if (state.tasks) {
        const {id, datas} = action.payload;

        const updatedTasks: ITask[] = state.tasks?.map(task => {
          if (task.id == id) {
            return {
              ...task,
              ...datas,
            };
          } else {
            return task;
          }
        });

        state.tasks = updatedTasks;
      }
    },
  },
});

export const {
  setProjects,
  addProject,
  setProject,
  updateProject,
  setTasks,
  updateTask,
} = projectsSlice.actions;

export default projectsSlice.reducer;
