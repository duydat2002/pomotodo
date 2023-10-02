import {storeData} from '@/hooks';
import {INotification} from '@/types';
import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface IState {
  notifications: INotification[] | null;
  hasNewNotification: boolean;
}

export const notificationsSlice = createSlice({
  name: 'notifications',
  initialState: {
    notifications: null,
    hasNewNotification: false,
  } as IState,
  reducers: {
    setNotifications: (
      state,
      action: PayloadAction<INotification[] | null>,
    ) => {
      state.notifications = action.payload;
    },
    setHasNewNotification: (state, action: PayloadAction<boolean>) => {
      state.hasNewNotification = action.payload;
      storeData('setHasNewNotification', action.payload);
    },
  },
});

export const {setNotifications, setHasNewNotification} =
  notificationsSlice.actions;

export default notificationsSlice.reducer;
