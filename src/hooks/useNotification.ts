import {useEffect} from 'react';
import firestore from '@react-native-firebase/firestore';
import {useAppDispatch, useAppSelector} from './useStore';
import {INotification} from '@/types';
import {
  setHasNewNotification,
  setNotifications,
} from '@/store/notifications.slice';
import {getData, storeData} from './useAsyncStorage';
import * as Notifications from 'expo-notifications';

export const useNotification = () => {
  const dispatch = useAppDispatch();
  const {user} = useAppSelector(state => state.user);
  const {colleagues} = useAppSelector(state => state.colleagues);
  const {notifications, hasNewNotification} = useAppSelector(
    state => state.notifications,
  );

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

  const updateNotifications = async (
    senderId: string,
    datas: Partial<INotification>,
  ) => {
    try {
      const {id, ...newDatas} = datas;

      const querySnaps = await firestore()
        .collection('notifications')
        .where('senderId', '==', senderId)
        .get();

      if (!querySnaps.empty) {
        const batch = firestore().batch();

        querySnaps.forEach(doc => {
          batch.update(doc.ref, newDatas);
        });

        await batch.commit();
      }
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

            const localNotifications = (await getData('notifications')) || [];
            if (
              !hasNewNotification &&
              notifications.length > localNotifications.length
            ) {
              dispatch(setHasNewNotification(true));
            }

            await storeData('notifications', notifications);
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

  const scheduleNotification = async (
    identifier?: string,
    content?: Notifications.NotificationContentInput,
    trigger?: Notifications.NotificationTriggerInput,
  ) => {
    await Notifications.scheduleNotificationAsync({
      identifier,
      content: {
        sound: 'daydiongchauoi.wav',
        vibrate: [0, 250, 250, 250],
        priority: 'max',
        ...content,
      },
      trigger: trigger || null,
    });
  };

  const cancelScheduledNotification = async (identifier: string) => {
    await Notifications.cancelScheduledNotificationAsync(identifier);
  };

  return {
    scheduleNotification,
    cancelScheduledNotification,
    createNotification,
    updateNotification,
    updateNotifications,
    getNotificationsFS,
    listenNotifications,
    listenNotification,
  };
};
