import {storeData} from '@/hooks';
import {IProject, ITask, IUser} from '@/types';
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
    },
    addProject: (state, action: PayloadAction<IProject>) => {
      if (!state.projects) state.projects = [action.payload];
      else state.projects!.push(action.payload);
      storeData('projects', state.projects);
    },
    updateProject: (
      state,
      action: PayloadAction<{id: string; datas: Partial<IProject>}>,
    ) => {
      if (state.projects) {
        const {id, datas} = action.payload;

        const updatedProjects: IProject[] = state.projects?.map(project => {
          if (project.id == id) {
            return {
              ...project,
              ...datas,
            } as IProject;
          } else {
            return project;
          }
        });

        state.projects = updatedProjects;

        storeData('projects', state.projects);
      }
    },

    // Project
    setProject: (state, action: PayloadAction<IProject | null>) => {
      state.project = action.payload;
    },
  },
});

export const {setProjects, addProject, updateProject, setProject} =
  projectsSlice.actions;

export default projectsSlice.reducer;
