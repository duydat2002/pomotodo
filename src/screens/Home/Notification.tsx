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
import {useNavigation} from '@react-navigation/native';
import {HomeStackScreenProps} from '@/types';

const Notification: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigation =
    useNavigation<HomeStackScreenProps<'Notification'>['navigation']>();

  const {user} = useAppSelector(state => state.user);
  const {notifications} = useAppSelector(state => state.notifications);

  const {createNotification, updateNotification} = useNotification();
  const {acceptColleague, rejectColleague} = useColleague();

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
      subType: 'accept',
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
      subType: 'reject',
      isRead: false,
      content: 'has rejected your invitation',
      createdAt: new Date().toISOString(),
    });
    console.log('onReject');
  };

  const onClickNotify = async (notification: INotification) => {
    if (notification.type == 'assign') {
      // Is Project
      if (
        notification.projectId &&
        !notification.taskId &&
        ['add', 'join', 'left'].includes(notification.subType)
      ) {
        navigation.navigate('ProjectsStack', {
          screen: 'CreateProject',
          params: {projectId: notification.projectId},
        });
      }
    }
    await updateNotification(notification.id, {isRead: true});
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
