import {storeData} from '@/hooks';
import {IProject} from '@/types';
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
    // Projects
    setProjects: (state, action: PayloadAction<IProject[] | null>) => {
      state.projects = action.payload;
      storeData('projects', action.payload);
      console.log('projects', state.projects);
    },

    // Project
    setProject: (state, action: PayloadAction<IProject | null>) => {
      state.project = action.payload;
    },
  },
});

export const {setProjects, setProject} = projectsSlice.actions;

export default projectsSlice.reducer;
