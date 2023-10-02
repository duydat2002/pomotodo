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
      // storeData('tasks', action.payload);
      // console.log('tasks', state.tasks);
    },

    // Task
    setTask: (state, action: PayloadAction<ITask | null>) => {
      state.task = action.payload;
    },
  },
});

export const {setTasks, setTask} = tasksSlice.actions;

export default tasksSlice.reducer;
