import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ToastAndroid,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useActivedColors, useAppSelector} from '@/hooks';
import {
  AntDesign,
  Feather,
  FontAwesome,
  FontAwesome5,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from '@expo/vector-icons';
import {ITask, IUser} from '@/types';
import {PRIORITY_COLORS} from '@/constants';
import {common} from '@/assets/styles';
import {useNavigation} from '@react-navigation/native';
import {AppStackScreenProps} from '@/types';
import {useTask} from '@/hooks/useTask';
import {useUser} from '@/hooks/useUser';
import {timeFromNowFormat} from '@/utils';
import SwipeableItem, {
  useSwipeableItemParams,
} from 'react-native-swipeable-item';

interface IProps {
  task: ITask;
  onPress?: () => void;
  onDelete: () => void;
}

const TaskItem: React.FC<IProps> = ({task, onPress, onDelete}) => {
  const activedColors = useActivedColors();
  const navigation =
    useNavigation<AppStackScreenProps<'ProjectsStack'>['navigation']>();

  const {user} = useAppSelector(state => state.user);
  const {project} = useAppSelector(state => state.projects);

  const {getLocalUserById} = useUser();
  const {updateTask, createTaskLike} = useTask();

  const [assigneeUser, setAssigneeUser] = useState<IUser | null>(null);
  const [compeletedUser, setCompeletedUser] = useState<IUser | null>(null);
  const [taskDone, setTaskDone] = useState(task.isDone);
  const [hasPermistion, setHasPemisstion] = useState(true);

  useEffect(() => {
    setHasPemisstion(
      user?.id == project?.ownerId ||
        !task.assignee ||
        task.assignee == user?.id,
    );

    const getUsers = async () => {
      setAssigneeUser(await getLocalUserById(task.assignee));

      setCompeletedUser(await getLocalUserById(task.completedBy));
    };

    getUsers();
  }, [task]);

  const checkTask = async () => {
    if (hasPermistion) {
      setTaskDone(!taskDone);

      const updatedTask: ITask = {
        ...task,
        isDone: !taskDone,
        completedBy: !taskDone ? user!.id : null,
        completedAt: !taskDone ? new Date().toISOString() : '',
      };

      await updateTask(task.id, updatedTask);
    } else {
      ToastAndroid.show(
        'You do not have permission to perform this function!',
        ToastAndroid.SHORT,
      );
    }
  };

  const clickPlayTask = () => {
    if (hasPermistion) {
      navigation.navigate('Pomodoro', {task: task});
    } else {
      ToastAndroid.show(
        'You do not have permission to perform this function!',
        ToastAndroid.SHORT,
      );
    }
  };

  const clickLikeTask = async () => {
    await createTaskLike({
      userId: user!.id,
      taskId: task.id,
    });
    ToastAndroid.show('Create like task!', ToastAndroid.SHORT);
  };

  return (
    <View>
      <SwipeableItem
        key={task.id}
        item={task}
        renderUnderlayLeft={() => <UnderlayLeft onDelete={onDelete} />}
        snapPointsLeft={[user?.id == project?.ownerId ? 50 : 0]}>
        <TouchableOpacity
          style={[
            styles.item,
            {backgroundColor: activedColors.backgroundLight},
          ]}
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
                    marginHorizontal: 10,
                  }}>
                  <Text style={[common.small, {color: activedColors.textSec}]}>
                    <FontAwesome5
                      name="user-tag"
                      size={12}
                      color={activedColors.primary}
                    />
                    {': '}
                  </Text>
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
                      color: activedColors.primary,
                    }}>
                    {assigneeUser.username}
                  </Text>
                </View>
              )}
              {compeletedUser && (
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginLeft: 10,
                  }}>
                  <Text style={[common.small, {color: activedColors.textSec}]}>
                    <AntDesign
                      name="checkcircle"
                      size={13}
                      color={activedColors.secondary}
                    />
                    {': '}
                  </Text>
                  <Image
                    source={
                      compeletedUser.avatar
                        ? {
                            uri: compeletedUser.avatar,
                          }
                        : require('@/assets/images/default-avatar.png')
                    }
                    style={{width: 15, height: 15, borderRadius: 15}}
                  />
                  <Text
                    style={{
                      marginLeft: 4,
                      color: activedColors.secondary,
                    }}>
                    {compeletedUser.username}
                  </Text>
                </View>
              )}
            </View>
            {task.deadline && (
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <AntDesign
                  name="calendar"
                  size={14}
                  color={activedColors.error}
                />
                <Text
                  style={[
                    common.small,
                    {marginLeft: 1, color: activedColors.error},
                  ]}>
                  {timeFromNowFormat(task.deadline)}
                </Text>
              </View>
            )}
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
      </SwipeableItem>
    </View>
  );
};

interface IUnderlayLeftProps {
  onDelete: () => void;
}
const UnderlayLeft: React.FC<IUnderlayLeftProps> = ({onDelete}) => {
  const activedColors = useActivedColors();
  const {close} = useSwipeableItemParams<IProps>();

  const handleDelete = () => {
    onDelete();
    close();
  };

  return (
    <View style={{alignSelf: 'flex-end'}}>
      <View style={styles.underleftWrapper}>
        <TouchableOpacity style={[styles.button]} onPress={handleDelete}>
          <FontAwesome name="trash-o" size={20} color={activedColors.text} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default TaskItem;

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    // height: 50,
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
  underleftWrapper: {
    width: 50,
    height: '100%',
    flexDirection: 'row',
  },
  button: {
    flex: 1,
    width: 50,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
