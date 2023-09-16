import {storeData} from '@/hooks';
import {IAssignee} from '@/types';
import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface IState {
  assignees: IAssignee[] | null;
}

export const assigneesSlice = createSlice({
  name: 'assignees',
  initialState: {
    assignees: null,
  } as IState,
  reducers: {
    setAssignees: (state, action: PayloadAction<IAssignee[] | null>) => {
      state.assignees = action.payload;
      storeData('assignees', action.payload);
    },
    addAssignees: (state, action: PayloadAction<IAssignee[]>) => {
      if (state.assignees)
        state.assignees = [...state.assignees, ...action.payload];
      else state.assignees = [...action.payload];

      storeData('assignees', state.assignees);
    },
  },
});

export const {setAssignees, addAssignees} = assigneesSlice.actions;

export default assigneesSlice.reducer;
