import {useEffect} from 'react';
import {IColleague} from '@/types';
import {useAppDispatch, useAppSelector} from './useStore';
import {setColleagues} from '@/store/colleagues.slice';
import firestore from '@react-native-firebase/firestore';
import {storeData} from './useAsyncStorage';

export const useColleague = () => {
  const dispatch = useAppDispatch();
  const {user} = useAppSelector(state => state.user);
  const {colleagues} = useAppSelector(state => state.colleagues);

  const addColleagues = async (newColleagues: IColleague[]) => {
    if (user) {
      const batch = firestore().batch();
      const updatedColleagues = colleagues ? [...colleagues] : [];

      newColleagues.forEach(newColleague => {
        const check = colleagues?.findIndex(
          oldColleague => oldColleague.id == newColleague.id,
        );

        // First time connect team
        if (check == -1 || check == undefined) {
          updatedColleagues.push(newColleague);
          // Add for current user
          batch.set(firestore().collection('colleagues').doc(newColleague.id), {
            userId: newColleague.userId,
            colleagueId: newColleague.colleagueId,
            colleagueUsername: newColleague.colleagueUsername,
            colleagueAvatar: newColleague.colleagueAvatar,
            colleagueEmail: newColleague.colleagueEmail,
            isAccept: false,
          });
          // Add for other user
          batch.set(firestore().collection('colleagues').doc(), {
            userId: newColleague.colleagueId,
            colleagueId: user.id,
            colleagueUsername: user.username,
            colleagueAvatar: user.avatar,
            colleagueEmail: user.email,
            isAccept: false,
          });
        }
      });

      dispatch(setColleagues(updatedColleagues));
      await batch.commit();
    }
  };

  const addColleague = async (colleagues: IColleague) => {
    try {
      if (user) {
        const batch = firestore().batch();

        batch.set(firestore().collection('colleagues').doc(), {
          userId: colleagues.userId,
          colleagueId: colleagues.colleagueId,
          colleagueUsername: colleagues.colleagueUsername,
          colleagueAvatar: colleagues.colleagueAvatar,
          colleagueEmail: colleagues.colleagueEmail,
          isAccept: false,
        });
        // Add for other user
        batch.set(firestore().collection('colleagues').doc(), {
          userId: colleagues.colleagueId,
          colleagueId: user.id,
          colleagueUsername: user.username,
          colleagueAvatar: user.avatar,
          colleagueEmail: user.email,
          isAccept: false,
        });

        await batch.commit();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const acceptColleague = async (userId: string, colleagueId: string) => {
    try {
      const batch = firestore().batch();

      const [querySnapshot1, querySnapshot2] = await Promise.all([
        firestore()
          .collection('colleagues')
          .where('userId', '==', userId)
          .where('colleagueId', '==', colleagueId)
          .get(),
        firestore()
          .collection('colleagues')
          .where('userId', '==', colleagueId)
          .where('colleagueId', '==', userId)
          .get(),
      ]);

      if (!querySnapshot1.empty) {
        querySnapshot1.forEach(doc => {
          batch.update(doc.ref, {isAccept: true});
        });
      }

      if (!querySnapshot2.empty) {
        querySnapshot2.forEach(doc => {
          batch.update(doc.ref, {isAccept: true});
        });
      }

      await batch.commit();
    } catch (error) {
      console.log(error);
    }
  };

  const rejectColleague = async (userId: string, colleagueId: string) => {
    try {
      const batch = firestore().batch();

      const [querySnapshot1, querySnapshot2] = await Promise.all([
        firestore()
          .collection('colleagues')
          .where('userId', '==', userId)
          .where('colleagueId', '==', colleagueId)
          .get(),
        firestore()
          .collection('colleagues')
          .where('userId', '==', colleagueId)
          .where('colleagueId', '==', userId)
          .get(),
      ]);

      if (!querySnapshot1.empty) {
        querySnapshot1.forEach(doc => {
          batch.delete(doc.ref);
        });
      }

      if (!querySnapshot2.empty) {
        querySnapshot2.forEach(doc => {
          batch.delete(doc.ref);
        });
      }

      await batch.commit();
    } catch (error) {
      console.log(error);
    }
  };

  const getColleaguesFS = async (userId: string) => {
    try {
      const querySnapshot = await firestore()
        .collection('colleagues')
        .where('userId', '==', userId)
        .get();
      if (querySnapshot.empty) {
        return null;
      } else {
        const colleagues: IColleague[] = [];
        querySnapshot.forEach(doc => {
          colleagues.push({
            id: doc.id,
            ...doc.data(),
          } as IColleague);
        });
        return colleagues;
      }
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  const listenColleagues = (dependency?: any) => {
    useEffect(() => {
      const subscriber = firestore()
        .collection('colleagues')
        .where('userId', '==', user?.id || '_')
        .onSnapshot(async querySnapshot => {
          if (querySnapshot) {
            const colleagues: IColleague[] = [];
            querySnapshot.forEach(doc => {
              colleagues.push({
                id: doc.id,
                ...doc.data(),
              } as IColleague);
            });
            dispatch(setColleagues(colleagues));
            await storeData('colleagues', colleagues);
          }
        });

      return () => subscriber();
    }, [dependency]);
  };

  return {
    addColleague,
    addColleagues,
    acceptColleague,
    rejectColleague,
    getColleaguesFS,
    listenColleagues,
  };
};
