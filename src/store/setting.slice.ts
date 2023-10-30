import {storeData} from '@/hooks';
import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface IState {
  disableBreaktime: boolean;
  autoStartNextPomodoro: boolean;
  autoStartBreaktime: boolean;
}

export const settingSlice = createSlice({
  name: 'setting',
  initialState: {
    disableBreaktime: false,
    autoStartNextPomodoro: false,
    autoStartBreaktime: false,
  } as IState,
  reducers: {
    setDisableBreaktime: (state, action: PayloadAction<boolean>) => {
      state.disableBreaktime = action.payload;
      storeData('disableBreaktime', action.payload);
    },
    setAutoStartNextPomodoro: (state, action: PayloadAction<boolean>) => {
      state.autoStartNextPomodoro = action.payload;
      storeData('autoStartNextPomodoro', action.payload);
    },
    setAutoStartBreaktime: (state, action: PayloadAction<boolean>) => {
      state.autoStartBreaktime = action.payload;
      storeData('autoStartBreaktime', action.payload);
    },
  },
});

export const {
  setDisableBreaktime,
  setAutoStartBreaktime,
  setAutoStartNextPomodoro,
} = settingSlice.actions;

export default settingSlice.reducer;
