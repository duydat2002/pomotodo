import {storeData} from '@/hooks';
import {IUser} from '@/types';
import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface IState {
  user: IUser | null;
}

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    user: null,
  } as IState,
  reducers: {
    setUser: (state, action: PayloadAction<IUser | null>) => {
      state.user = action.payload;
      storeData('user', action.payload);
      console.log('user', action.payload);
    },
  },
});

export const {setUser} = userSlice.actions;

export default userSlice.reducer;
