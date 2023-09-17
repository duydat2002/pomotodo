import {storeData} from '@/hooks';
import {IColleagues} from '@/types';
import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface IState {
  colleagues: IColleagues[] | null;
}

export const colleaguesSlice = createSlice({
  name: 'colleagues',
  initialState: {
    colleagues: null,
  } as IState,
  reducers: {
    setColleagues: (state, action: PayloadAction<IColleagues[] | null>) => {
      state.colleagues = action.payload;
      storeData('colleagues', action.payload);
    },
  },
});

export const {setColleagues} = colleaguesSlice.actions;

export default colleaguesSlice.reducer;
