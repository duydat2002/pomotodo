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

  const getUserByUsername = async (username: string) => {
    try {
      const querySnapshot = await firestore()
        .collection('users')
        .where('username', '==', username)
        .get();

      if (querySnapshot.empty) {
        return null;
      } else {
        const users: IUser[] = [];
        querySnapshot.forEach(doc => {
          users.push({
            id: doc.id,
            ...doc.data(),
          } as IUser);
        });
        return users[0];
      }
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  return {
    getUser,
    getUserByUsername,
  };
};
