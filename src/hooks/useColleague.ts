import {IColleague} from '@/types';
import {useAppDispatch, useAppSelector} from './useStore';
import {setColleagues} from '@/store/colleagues.slice';

export const useColleague = () => {
  const dispatch = useAppDispatch();
  const {colleagues} = useAppSelector(state => state.colleagues);

  const addColleague = (colleague: IColleague) => {
    if (colleagues) {
      const check = colleagues.findIndex(
        item => item.colleagueId == colleague.colleagueId,
      );

      if (check == -1) {
        dispatch(setColleagues([...colleagues, colleague]));
      }
    } else {
      dispatch(setColleagues([colleague]));
    }
  };

  const addColleagues = (newColleagues: IColleague[]) => {
    if (colleagues) {
      const updatedColleagues = [...colleagues];

      newColleagues.forEach(newColleague => {
        const check = colleagues.findIndex(
          oldColleague => oldColleague.id == newColleague.id,
        );

        if (check == -1) {
          updatedColleagues.push(newColleague);
        }
      });

      dispatch(setColleagues(updatedColleagues));
    } else {
      dispatch(setColleagues(newColleagues));
    }
  };

  return {
    addColleague,
    addColleagues,
  };
};
