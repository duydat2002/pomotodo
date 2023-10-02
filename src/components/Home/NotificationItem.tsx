import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  TouchableOpacity,
  Image,
} from 'react-native';
import {useActivedColors} from '@/hooks';
import {INotification} from '@/types/notification';
import {common} from '@/assets/styles';
import moment from 'moment';
import {useNotification} from '@/hooks/useNotification';

interface IProps {
  notification: INotification;
  onAccept?: (notification: INotification) => void;
  onReject?: (notification: INotification) => void;
  onClick: (notification: INotification) => void;
}

const NotificationItem: React.FC<IProps> = ({
  notification,
  onAccept,
  onReject,
  onClick,
}) => {
  const activedColors = useActivedColors();
  const {listenNotification} = useNotification();

  listenNotification(notification.id);

  const handleOnAccept = () => {
    if (onAccept) onAccept(notification);
  };

  const handleOnReject = () => {
    if (onReject) onReject(notification);
  };

  return (
    <TouchableHighlight
      activeOpacity={0.8}
      underlayColor={activedColors.backgroundSec}
      onPress={() => {
        onClick(notification);
      }}>
      <View
        style={{
          paddingHorizontal: 16,
          paddingVertical: 10,
          backgroundColor: notification.isRead
            ? activedColors.backgroundSec
            : 'transparent',
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <Image
            source={
              notification.senderAvatar
                ? {
                    uri: notification.senderAvatar,
                  }
                : require('@/assets/images/default-avatar.png')
            }
            style={{width: 50, height: 50, borderRadius: 50}}
          />
          <View style={{flex: 1, gap: 4, marginHorizontal: 15}}>
            <Text numberOfLines={1}>
              <Text
                style={[
                  common.text,
                  {fontWeight: '700', color: activedColors.text},
                ]}>
                {notification.senderUsername}
              </Text>{' '}
              <Text style={[common.text, {color: activedColors.text}]}>
                {notification.content}
              </Text>{' '}
              <Text
                style={[
                  common.text,
                  {fontWeight: '700', color: activedColors.text},
                ]}>
                {notification.projectName}
              </Text>
            </Text>
            {notification.taskName && (
              <Text
                style={[
                  common.text,
                  {fontWeight: '700', color: activedColors.textSec},
                ]}>
                {notification.taskName}
              </Text>
            )}
            <Text style={[common.small, {color: activedColors.textSec}]}>
              {moment(new Date(notification.createdAt)).fromNow()}
            </Text>
          </View>
        </View>
        {notification.type == 'invite' && notification.isResponded == false && (
          <View style={{flexDirection: 'row', gap: 50, marginLeft: 65}}>
            <TouchableOpacity activeOpacity={0.7} onPress={handleOnAccept}>
              <Text style={[common.text, {color: activedColors.primary}]}>
                Accept
              </Text>
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.7} onPress={handleOnReject}>
              <Text style={[common.text, {color: activedColors.error}]}>
                Reject
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </TouchableHighlight>
  );
};

export default NotificationItem;

const styles = StyleSheet.create({});
