import React from 'react';
import {StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';
import {useActivedColors} from '@/hooks';
import {MaterialIcons} from '@expo/vector-icons';
import {IColleague, IUser} from '@/types';

interface IProps {
  user: IUser;
  ownerId: string;
  onDelete: (id: string) => void;
}

const AssigneeUserItem: React.FC<IProps> = ({user, ownerId, onDelete}) => {
  const activedColors = useActivedColors();

  return (
    <View
      style={{
        maxWidth: '45%',
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 8,
        paddingHorizontal: 8,
        paddingVertical: 4,
        backgroundColor: activedColors.backgroundSec,
      }}>
      <Image
        source={
          user.avatar
            ? {
                uri: user.avatar,
              }
            : require('@/assets/images/default-avatar.png')
        }
        style={{width: 25, height: 25, borderRadius: 25}}
      />
      <Text
        style={[
          {
            flexGrow: 1,
            flexShrink: 1,
            marginLeft: 4,
            marginRight: 8,
            color: activedColors.text,
          },
        ]}
        numberOfLines={1}>
        {user.username}
      </Text>
      {/* {ownerId != user.id && (
        <TouchableOpacity activeOpacity={0.7} onPress={() => onDelete(user.id)}>
          <MaterialIcons name="cancel" size={14} color="#e07070" />
        </TouchableOpacity>
      )} */}
      <TouchableOpacity activeOpacity={0.7} onPress={() => onDelete(user.id)}>
        <MaterialIcons name="cancel" size={14} color="#e07070" />
      </TouchableOpacity>
    </View>
  );
};

export default AssigneeUserItem;

const styles = StyleSheet.create({});
