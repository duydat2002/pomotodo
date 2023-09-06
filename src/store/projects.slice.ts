import {storeData} from '@/hooks';
import {IProject, IUser} from '@/types';
import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface IState {
  projects: IProject[] | null;
  project: IProject | null;
}

export const projectsSlice = createSlice({
  name: 'projects',
  initialState: {
    projects: null,
    project: null,
  } as IState,
  reducers: {
    setProjects: (state, action: PayloadAction<IProject[] | null>) => {
      state.projects = action.payload;
      storeData('projects', action.payload);
    },
    addProject: (state, action: PayloadAction<IProject>) => {
      if (!state.projects) state.projects = [action.payload];
      else state.projects!.push(action.payload);
      storeData('projects', action.payload);
    },
    setProject: (state, action: PayloadAction<IProject | null>) => {
      state.project = action.payload;
      storeData('project', action.payload);
    },
  },
});

export const {setProjects, setProject, addProject} = projectsSlice.actions;

export default projectsSlice.reducer;
