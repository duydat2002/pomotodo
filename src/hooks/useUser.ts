import {IAuth, IUser} from '@/types';
import firestore from '@react-native-firebase/firestore';
import {useAppDispatch, useAppSelector} from './useStore';
import {setUser} from '@/store/user.slice';
import {storeData} from './useAsyncStorage';

export const useUser = () => {
  const dispatch = useAppDispatch();
  const {user} = useAppSelector(state => state.user);
  const {colleagues} = useAppSelector(state => state.colleagues);

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
      console.log(error);
    }
  };

  const getLocalUserById = async (id: string | null) => {
    if (!id) return null;

    if (user?.id == id) return user;

    const colleague = colleagues?.find(item => id == item.colleagueId);
    if (colleague) {
      return {
        id: colleague.colleagueId,
        username: colleague.colleagueUsername,
        avatar: colleague.colleagueAvatar,
        email: colleague.colleagueEmail,
      } as IUser;
    } else {
      return await getUser(id);
    }
  };

  return {
    getUser,
    getUserByUsername,
    updateUser,
    getLocalUserById,
  };
};
