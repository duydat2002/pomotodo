import {configureStore} from '@reduxjs/toolkit';
import themeSlice from './theme.slice';
import userSlice from './user.slice';

export const store = configureStore({
  reducer: {
    theme: themeSlice,
    user: userSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
