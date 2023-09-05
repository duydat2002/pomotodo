import {IUser} from '@/types';
import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface IState {
  user: IUser | null;
}

export const projectsSlice = createSlice({
  name: 'projects',
  initialState: {
    user: null,
  } as IState,
  reducers: {
    setUser: (state, action: PayloadAction<IUser | null>) => {
      state.user = action.payload;
    },
  },
});

export const {setUser} = projectsSlice.actions;

export default projectsSlice.reducer;
