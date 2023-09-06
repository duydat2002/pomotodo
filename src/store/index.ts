import {configureStore} from '@reduxjs/toolkit';
import themeSlice from './theme.slice';
import userSlice from './user.slice';
import projectsSlice from './projects.slice';

export const store = configureStore({
  reducer: {
    theme: themeSlice,
    user: userSlice,
    projects: projectsSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
