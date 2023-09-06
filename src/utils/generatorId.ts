import 'react-native-get-random-values';
import {customAlphabet} from 'nanoid/non-secure';

export const generatorId = () => {
  return customAlphabet(
    '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
    28,
  )();
};
