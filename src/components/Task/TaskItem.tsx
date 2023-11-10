import {StyleSheet, Text, View, TouchableOpacity, Image} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useActivedColors, useAppSelector} from '@/hooks';
import {
  Feather,
  FontAwesome,
  Ionicons,
  MaterialCommunityIcons,
} from '@expo/vector-icons';
import {ITask, IUser} from '@/types';
import {PRIORITY_COLORS} from '@/constants';
import {common} from '@/assets/styles';
import {useNavigation} from '@react-navigation/native';
import {AppStackScreenProps} from '@/types';
import {useTask} from '@/hooks/useTask';

interface IProps {
  task: ITask;
  onPress?: () => void;
}

const TaskItem: React.FC<IProps> = ({task, onPress}) => {
  const activedColors = useActivedColors();
  const navigation =
    useNavigation<AppStackScreenProps<'ProjectsStack'>['navigation']>();

  const {user} = useAppSelector(state => state.user);
  const {colleagues} = useAppSelector(state => state.colleagues);

  const {updateTask} = useTask();

  const [assigneeUser, setAssigneeUser] = useState<IUser | null>(null);
  const [taskDone, setTaskDone] = useState(false);

  useEffect(() => {
    setTaskDone(task.isDone);
    if (task.assignee == user?.id) {
      setAssigneeUser(user);
    } else {
      const colleague = colleagues?.find(
        item => task.assignee == item.colleagueId,
      );
      if (colleague) {
        const assigneeTemp = {
          id: colleague.colleagueId,
          username: colleague.colleagueUsername,
          avatar: colleague.colleagueAvatar,
          email: colleague.colleagueEmail,
        };
        setAssigneeUser(assigneeTemp);
      } else {
        setAssigneeUser(null);
      }
    }
  }, [task]);

  const checkTask = async () => {
    setTaskDone(!taskDone);

    const updatedTask: ITask = {
      ...task,
      isDone: !task.isDone,
    };

    await updateTask(task.id, updatedTask);
  };

  const clickPlayTask = () => {
    navigation.navigate('Pomodoro', {task: task});
  };

  return (
    <TouchableOpacity
      style={[styles.item, {backgroundColor: activedColors.backgroundLight}]}
      activeOpacity={0.8}
      onPress={onPress}>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={checkTask}
        style={[
          styles.check,
          {
            borderColor: PRIORITY_COLORS[task.priority].default,
            backgroundColor: PRIORITY_COLORS[task.priority].light,
          },
        ]}>
        {taskDone && (
          <Feather name="check" size={16} color={activedColors.primary} />
        )}
      </TouchableOpacity>
      <View style={{flex: 1, marginLeft: 16}}>
        <Text style={[common.text, {color: activedColors.text}]}>
          {task.name}
        </Text>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <MaterialCommunityIcons
            name="clock-time-four"
            size={14}
            color={activedColors.primary}
          />
          <Text style={[common.small, {color: activedColors.primary}]}>
            {task.pomodoroCount} /
          </Text>
          <MaterialCommunityIcons
            name="clock-time-four"
            size={14}
            color={activedColors.primaryLight}
          />
          <Text style={[common.small, {color: activedColors.primaryLight}]}>
            {task.totalPomodoro}
          </Text>
          {assigneeUser && (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginLeft: 10,
              }}>
              <Image
                source={
                  assigneeUser.avatar
                    ? {
                        uri: assigneeUser.avatar,
                      }
                    : require('@/assets/images/default-avatar.png')
                }
                style={{width: 15, height: 15, borderRadius: 15}}
              />
              <Text
                style={{
                  marginLeft: 4,
                  color: activedColors.textSec,
                }}>
                {assigneeUser.username}
              </Text>
            </View>
          )}
        </View>
      </View>
      <TouchableOpacity
        activeOpacity={0.7}
        style={[styles.play, {backgroundColor: activedColors.primaryLight}]}
        onPress={clickPlayTask}>
        <Ionicons
          name="play"
          size={12}
          color={activedColors.primaryDark}
          style={{paddingLeft: 2}}
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

export default TaskItem;

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    marginHorizontal: 16,
    padding: 8,
    borderRadius: 8,
    marginTop: 4,
  },
  check: {
    width: 24,
    height: 24,
    borderRadius: 24,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  play: {
    width: 20,
    height: 20,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
