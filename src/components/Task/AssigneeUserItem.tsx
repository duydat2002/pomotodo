import React from 'react';
import {StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';
import {useActivedColors} from '@/hooks';
import {MaterialIcons} from '@expo/vector-icons';

interface IProps {
  id: string;
  avatar?: string;
  username?: string;
  onDelete?: () => {};
}

const AssigneeUserItem: React.FC<IProps> = ({
  id,
  avatar,
  username = 'You',
  onDelete,
}) => {
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
        source={require('@/assets/images/default-avatar.png')}
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
        {username}
      </Text>
      <TouchableOpacity activeOpacity={0.7} onPress={onDelete}>
        <MaterialIcons name="cancel" size={14} color="#e07070" />
      </TouchableOpacity>
    </View>
  );
};

export default AssigneeUserItem;

const styles = StyleSheet.create({});
