import {IAuth, IUser} from '@/types';
import firestore from '@react-native-firebase/firestore';
import {useAppDispatch, useAppSelector} from './useStore';
import {setUser} from '@/store/user.slice';
import {storeData} from './useAsyncStorage';

export const useUser = () => {
  const dispatch = useAppDispatch();
  const {user} = useAppSelector(state => state.user);

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

  const updateUser = async (userId: string, datas: Partial<IUser>) => {
    try {
      if (user) {
        const {id, ...newDatas} = datas;
        const updatedUser = {...user, ...newDatas};
        dispatch(setUser(updatedUser));
        storeData('user', updatedUser);

        await firestore().collection('users').doc(userId).update(newDatas);
      }
    } catch (error) {
      console.log('cac', error);
    }
  };

  return {
    getUser,
    getUserByUsername,
    updateUser,
  };
};
