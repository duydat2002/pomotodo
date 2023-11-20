import 'react-native-get-random-values';
import {customAlphabet} from 'nanoid/non-secure';

export const generatorId = (size: number = 28) => {
  return customAlphabet(
    '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
    size,
  )();
};
