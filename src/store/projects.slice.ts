import {storeData} from '@/hooks';
import {IProject} from '@/types';
import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface IState {
  projects: IProject[] | null;
  project: IProject | null;

  // Changed
  addedProjects: string[];
  updatedProjects: string[];
  deletedProjects: string[];
}

export const projectsSlice = createSlice({
  name: 'projects',
  initialState: {
    projects: null,
    project: null,

    addedProjects: [],
    updatedProjects: [],
    deletedProjects: [],
  } as IState,
  reducers: {
    // Projects
    setProjects: (state, action: PayloadAction<IProject[] | null>) => {
      state.projects = action.payload;
      // storeData('projects', action.payload);
      // console.log('projects', state.projects);
    },

    // Project
    setProject: (state, action: PayloadAction<IProject | null>) => {
      state.project = action.payload;
    },
  },
});

export const {setProjects, setProject} = projectsSlice.actions;

export default projectsSlice.reducer;
