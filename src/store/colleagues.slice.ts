import {storeData} from '@/hooks';
import {IColleague} from '@/types';
import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface IState {
  colleagues: IColleague[] | null;
}

export const colleaguesSlice = createSlice({
  name: 'colleagues',
  initialState: {
    colleagues: null,
  } as IState,
  reducers: {
    setColleagues: (state, action: PayloadAction<IColleague[] | null>) => {
      state.colleagues = action.payload;
      // storeData('colleagues', action.payload);
      // console.log('colleagues', state.colleagues);
    },
  },
});

export const {setColleagues} = colleaguesSlice.actions;

export default colleaguesSlice.reducer;
