import {storeData} from '@/hooks';
import {ITask} from '@/types';
import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface IState {
  tasks: ITask[] | null;
  task: ITask | null;
}

export const tasksSlice = createSlice({
  name: 'tasks',
  initialState: {
    tasks: null,
    task: null,
  } as IState,
  reducers: {
    // Tasks
    setTasks: (state, action: PayloadAction<ITask[] | null>) => {
      state.tasks = action.payload;
      storeData('tasks', action.payload);
    },
    addTask: (state, action: PayloadAction<ITask>) => {
      if (state.tasks) state.tasks = [...state.tasks, action.payload];
      else state.tasks = [action.payload];

      storeData('tasks', state.tasks);
    },
    updateTask: (
      state,
      action: PayloadAction<{id: string; datas: Partial<ITask>}>,
    ) => {
      if (state.tasks) {
        const {id, datas} = action.payload;

        const updatedTasks: ITask[] = state.tasks.map(task => {
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

        storeData('tasks', state.tasks);
      }
    },

    // Task
    setTask: (state, action: PayloadAction<ITask | null>) => {
      state.task = action.payload;
    },
  },
});

export const {setTasks, addTask, updateTask, setTask} = tasksSlice.actions;

export default tasksSlice.reducer;
