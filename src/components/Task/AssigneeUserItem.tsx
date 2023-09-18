import React from 'react';
import {StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';
import {useActivedColors} from '@/hooks';
import {MaterialIcons} from '@expo/vector-icons';
import {IColleague} from '@/types';

interface IProps {
  assignee: IColleague;
  onDelete: (id: string) => void;
}

const AssigneeUserItem: React.FC<IProps> = ({assignee, onDelete}) => {
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
          assignee.colleagueAvatar
            ? {
                uri: assignee.colleagueAvatar,
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
        {assignee.colleagueUsername}
      </Text>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => onDelete(assignee.id)}>
        <MaterialIcons name="cancel" size={14} color="#e07070" />
      </TouchableOpacity>
    </View>
  );
};

export default AssigneeUserItem;

const styles = StyleSheet.create({});
