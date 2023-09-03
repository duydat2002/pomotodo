import {colors} from '@/theme';
import {useAppSelector} from './useStore';

export const useActivedColors = () => {
  const theme = useAppSelector(state => state.theme.theme);
  return colors[theme.mode];
};
