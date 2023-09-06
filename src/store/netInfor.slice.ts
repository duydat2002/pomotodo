import {storeData} from '@/hooks';
import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import NetInfo, {NetInfoState} from '@react-native-community/netinfo';

interface IState {
  netInfo: NetInfoState | null;
}

export const projectsSlice = createSlice({
  name: 'netInfo',
  initialState: {
    netInfo: null,
  } as IState,
  reducers: {
    setNetInfo: (state, action: PayloadAction<NetInfoState>) => {
      state.netInfo = action.payload;
      storeData('netInfo', action.payload);
    },
  },
});

export const {setNetInfo} = projectsSlice.actions;

export default projectsSlice.reducer;
