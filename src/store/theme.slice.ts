import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {Appearance} from 'react-native';
import {ITheme, IMode} from '@/types';
import {storeData} from '@/hooks';

interface IState {
  theme: ITheme;
}

export const themeSlice = createSlice({
  name: 'theme',
  initialState: {
    theme: {
      system: true,
      mode: 'light',
    },
  } as IState,
  reducers: {
    changeTheme: (state, action: PayloadAction<ITheme>) => {
      if (action.payload.system) {
        const modeSystem = Appearance.getColorScheme();
        console.log(modeSystem);
        state.theme = {system: true, mode: modeSystem || 'light'};
      } else {
        state.theme = {system: false, mode: action.payload.mode};
      }
      storeData('theme', state.theme);
    },
  },
});

export const {changeTheme} = themeSlice.actions;

export default themeSlice.reducer;
