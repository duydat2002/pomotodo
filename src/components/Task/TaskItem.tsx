import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React from 'react';
import {useActivedColors} from '@/hooks';
import {
  Feather,
  FontAwesome,
  Ionicons,
  MaterialCommunityIcons,
} from '@expo/vector-icons';
import {ITask} from '@/types';
import {PRIORITY_COLORS} from '@/constants';
import {common} from '@/assets/styles';
import {useNavigation} from '@react-navigation/native';
import {AppStackScreenProps} from '@/types/navigation';

interface IProps {
  task: ITask;
  onPress?: () => void;
}

const TaskItem: React.FC<IProps> = ({task, onPress}) => {
  const activedColors = useActivedColors();
  const navigation =
    useNavigation<AppStackScreenProps<'ProjectsStack'>['navigation']>();

  const checkTask = () => {
    task.isDone = !task.isDone;
  };

  const clickPlayTask = () => {
    navigation.navigate('Pomodoro', {taskId: task.id});
  };

  return (
    <TouchableOpacity
      style={[styles.item, {backgroundColor: activedColors.input}]}
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
        {task.isDone && <Feather name="check" size={16} color="#fff" />}
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
