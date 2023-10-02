import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, View, FlatList} from 'react-native';
import SafeView from '@/components/Layout/SafeView';
import Header from '@/components/Layout/Header';
import NotificationItem from '@/components/Home/NotificationItem';
import {INotification} from '@/types/notification';
import {useAppDispatch, useAppSelector} from '@/hooks';
import {useNotification} from '@/hooks/useNotification';
import {useColleague} from '@/hooks/useColleague';
import {generatorId} from '@/utils';
import {setHasNewNotification} from '@/store/notifications.slice';

const Notification: React.FC = () => {
  const {createNotification, updateNotification} = useNotification();
  const {acceptColleague, rejectColleague} = useColleague();
  const dispatch = useAppDispatch();

  const {user} = useAppSelector(state => state.user);
  const {notifications} = useAppSelector(state => state.notifications);

  useEffect(() => {
    dispatch(setHasNewNotification(false));
  }, []);

  const onAccept = async (notification: INotification) => {
    await acceptColleague(notification.senderId, notification.receiverId);
    await updateNotification(notification.id, {
      isRead: true,
      isResponded: true,
    });
    await createNotification({
      id: generatorId(),
      senderId: user!.id,
      senderUsername: user!.username,
      senderAvatar: user!.avatar,
      receiverId: notification.senderId,
      type: 'invite',
      isRead: false,
      content: 'has accepted your invitation',
      createdAt: new Date().toISOString(),
    });
    console.log('onAccept');
  };

  const onReject = async (notification: INotification) => {
    await rejectColleague(notification.senderId, notification.receiverId);
    await updateNotification(notification.id, {
      isRead: true,
      isResponded: true,
    });
    await createNotification({
      id: generatorId(),
      senderId: user!.id,
      senderUsername: user!.username,
      senderAvatar: user!.avatar,
      receiverId: notification.senderId,
      type: 'invite',
      isRead: false,
      content: 'has rejected your invitation',
      createdAt: new Date().toISOString(),
    });
    console.log('onReject');
  };

  const onClickNotify = async (notification: INotification) => {
    await updateNotification(notification.id, {isRead: true});
    console.log('onClickNotify', notification);
  };

  return (
    <SafeView>
      <Header hasBack title="Notifications"></Header>
      <View style={{flex: 1, width: '100%'}}>
        <FlatList
          data={notifications}
          renderItem={notification => (
            <NotificationItem
              notification={notification.item}
              onAccept={onAccept}
              onReject={onReject}
              onClick={onClickNotify}
            />
          )}
        />
      </View>
    </SafeView>
  );
};

export default Notification;

const styles = StyleSheet.create({});
