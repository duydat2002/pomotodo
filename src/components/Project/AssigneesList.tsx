import React, {useState, useEffect} from 'react';
import {common} from '@/assets/styles';
import {useActivedColors, useAppSelector} from '@/hooks';
import {StyleSheet, Text, View, Image} from 'react-native';

interface IProps {
  assigneeIds: string[];
  maxDisplayedUsers?: number;
}

const AssigneesList: React.FC<IProps> = ({
  assigneeIds,
  maxDisplayedUsers = 4,
}) => {
  const activedColors = useActivedColors();

  const {user} = useAppSelector(state => state.user);
  const {colleagues} = useAppSelector(state => state.colleagues);

  const [avatars, setAvatars] = useState<string[]>([]);
  const [residual, setResidual] = useState(0);

  useEffect(() => {
    const temp =
      colleagues
        ?.filter(item => assigneeIds.includes(item.colleagueId))
        ?.map(item => item.colleagueAvatar || '') || [];

    temp.unshift(user?.avatar || '');

    if (temp.length > maxDisplayedUsers) {
      setAvatars(temp.slice(0, maxDisplayedUsers));
      setResidual(temp.length - maxDisplayedUsers);
    } else {
      setAvatars(temp);
    }
  }, [assigneeIds]);

  if (!user) return null;

  return (
    <View style={{flexDirection: 'row', marginLeft: 5}}>
      {avatars.map((avatar, index) => (
        <Image
          key={index}
          source={
            avatar
              ? {
                  uri: avatar,
                }
              : require('@/assets/images/default-avatar.png')
          }
          style={styles.imageBox}
        />
      ))}
      {residual > 0 && (
        <View
          style={[
            styles.imageBox,
            styles.residualBox,
            {backgroundColor: activedColors.primaryLight},
          ]}>
          <Text style={[common.small, {color: '#fff'}]}>+{residual}</Text>
        </View>
      )}
    </View>
  );
};

export default AssigneesList;

const styles = StyleSheet.create({
  imageBox: {
    width: 22,
    height: 22,
    borderRadius: 22,
    marginLeft: -5,
    borderColor: '#fff',
    borderWidth: 1,
  },
  residualBox: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
