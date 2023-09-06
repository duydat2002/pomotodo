import {IAuth, IUser} from '@/types';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

export const useUser = () => {
  const getUser = async (id: string) => {
    const doc = await firestore().collection('users').doc(id).get();

    if (doc.exists) {
      return {
        id: doc.id,
        ...doc.data(),
      } as IUser;
    } else {
      return null;
    }
  };

  return {
    getUser,
  };
};
