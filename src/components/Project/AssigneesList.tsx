import React, {useState, useEffect} from 'react';
import {common} from '@/assets/styles';
import {useActivedColors, useAppSelector} from '@/hooks';
import {StyleSheet, Text, View, Image} from 'react-native';
import {useUser} from '@/hooks/useUser';
import {IUser} from '@/types';

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

  const {getLocalUserById} = useUser();

  const [assignees, setAssignees] = useState<(IUser | null)[]>([]);
  const [residual, setResidual] = useState(0);

  useEffect(() => {
    const getAssigneeUser = async () => {
      const temp = await Promise.all(
        assigneeIds.map(async id => await getLocalUserById(id)),
      );

      if (temp.length > maxDisplayedUsers) {
        setAssignees(temp.slice(0, maxDisplayedUsers));
        setResidual(temp.length - maxDisplayedUsers);
      } else {
        setAssignees(temp);
      }
    };

    getAssigneeUser();
  }, [assigneeIds]);

  if (!user) return null;

  return (
    <View style={{flexDirection: 'row', marginLeft: 5}}>
      {assignees.map((assignee, index) => (
        <Image
          key={index}
          source={
            assignee?.avatar
              ? {
                  uri: assignee.avatar,
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
