import {useEffect} from 'react';
import firestore from '@react-native-firebase/firestore';
import {useAppDispatch, useAppSelector} from './useStore';
import {INotification} from '@/types';
import {
  setHasNewNotification,
  setNotifications,
} from '@/store/notifications.slice';
import {storeData} from './useAsyncStorage';

export const useNotification = () => {
  const dispatch = useAppDispatch();
  const {user} = useAppSelector(state => state.user);
  const {colleagues} = useAppSelector(state => state.colleagues);
  const {notifications} = useAppSelector(state => state.notifications);

  const createNotification = async (notification: INotification) => {
    try {
      const {id, ...datas} = notification;
      await firestore().collection('notifications').doc(id).set(datas);
    } catch (error) {
      console.log(error);
    }
  };

  const updateNotification = async (
    notificationId: string,
    datas: Partial<INotification>,
  ) => {
    try {
      const {id, ...datasTemp} = datas;
      await firestore()
        .collection('notifications')
        .doc(notificationId)
        .update(datasTemp);
    } catch (error) {
      console.log(error);
    }
  };

  const getNotificationsFS = async (userId: string) => {
    try {
      const querySnapshot = await firestore()
        .collection('notifications')
        .where('receiverId', '==', userId)
        .orderBy('createdAt', 'desc')
        .get();
      if (querySnapshot.empty) {
        return null;
      } else {
        const notifications: INotification[] = [];
        querySnapshot.forEach(doc => {
          notifications.push({
            id: doc.id,
            ...doc.data(),
          } as INotification);
        });
        return notifications;
      }
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  const listenNotifications = (dependency?: any) => {
    useEffect(() => {
      const subscriber = firestore()
        .collection('notifications')
        .where('receiverId', '==', user?.id || 'none')
        .orderBy('createdAt', 'desc')
        .onSnapshot(async querySnapshot => {
          if (querySnapshot) {
            const notifications: INotification[] = [];
            querySnapshot.forEach(doc => {
              notifications.push({
                id: doc.id,
                ...doc.data(),
              } as INotification);
            });
            dispatch(setNotifications(notifications));
            await storeData('notifications', notifications);

            querySnapshot.docChanges().forEach(change => {
              if (change.type === 'added') {
                dispatch(setHasNewNotification(true));
                return;
              }
            });
          }
        });

      return () => subscriber();
    }, [dependency]);
  };

  const listenNotification = (notificationId: string) => {
    useEffect(() => {
      const subscriber = firestore()
        .collection('notifications')
        .doc(notificationId)
        .onSnapshot(async snapshot => {
          if (snapshot) {
            const notification: INotification = {
              id: snapshot.id,
              ...snapshot.data(),
            } as INotification;

            if (notifications) {
              const updatedNotifications: INotification[] = notifications?.map(
                item => {
                  return item.id == notification.id ? notification : item;
                },
              );

              dispatch(setNotifications(updatedNotifications));
              await storeData('notifications', updatedNotifications);
            }
          }
        });

      return () => subscriber();
    }, [notificationId]);
  };

  return {
    createNotification,
    updateNotification,
    getNotificationsFS,
    listenNotifications,
    listenNotification,
  };
};
