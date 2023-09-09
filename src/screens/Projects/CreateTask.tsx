import React, {useState} from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import {
  AntDesign,
  Feather,
  FontAwesome,
  Fontisto,
  MaterialCommunityIcons,
  MaterialIcons,
} from '@expo/vector-icons';
import {useActivedColors, useAppSelector} from '@/hooks';
import {useNavigation, useRoute} from '@react-navigation/native';
import {common} from '@/assets/styles';
import {ProjectsStackScreenProps} from '@/types/navigation';
import {PRIORITY_COLORS} from '@/constants';
import {IPriority, ITask} from '@/types';
import {generatorId, secondsToMinutes} from '@/utils';
import SafeView from '@/components/Layout/SafeView';
import Header from '@/components/Layout/Header';
import UInput from '@/components/UI/UInput';
import PriorityDropdown from '@/components/Task/PriorityDropdown';
import AssigneeUserItem from '@/components/Task/AssigneeUserItem';
import PomodoroPicker from '@/components/Modal/PomodoroPicker';
import BreaktimePicker from '@/components/Modal/BreaktimePicker';
import MCalendarPicker from '@/components/Modal/MCalendarPicker';
import moment from 'moment';

const CreateTask = () => {
  const activedColors = useActivedColors();
  const navigation =
    useNavigation<ProjectsStackScreenProps<'CreateTask'>['navigation']>();
  const route = useRoute<ProjectsStackScreenProps<'CreateTask'>['route']>();

  const {user} = useAppSelector(state => state.user);

  const [assignee, setAssignee] = useState('');
  const [activePriority, setActivePriority] = useState(false);
  const [activePomodoroPicker, setActivePomodoroPicker] = useState(false);
  const [activeBreaktimePicker, setActiveBreaktimePicker] = useState(false);
  const [activeCalendarPicker, setActiveCalendarPicker] = useState(false);
  const [task, setTask] = useState<ITask>({
    id: generatorId(),
    projectId: route.params.projectId,
    name: '',
    priority: 'none',
    isDone: false,
    totalPomodoro: 0,
    pomodoroCount: 0,
    longBreak: 0,
    shortBreak: 0,
    deadline: null,
    assignees: [user!.id],
    createdAt: new Date(),
  });

  const checkTask = () => {};

  const setPriority = (level: IPriority) => {
    setTask({
      ...task,
      priority: level,
    });
    setActivePriority(false);
  };

  const setName = (value: string) => {
    setTask({
      ...task,
      name: value,
    });
  };

  const savePomodoro = (pomodoros: number, pomodoroLength: number) => {
    setTask({
      ...task,
      pomodoroCount: pomodoros,
      longBreak: pomodoroLength,
    });
    setActivePomodoroPicker(false);
  };

  const saveBreaktime = (breakLength: number) => {
    setTask({
      ...task,
      shortBreak: breakLength,
    });
    setActiveBreaktimePicker(false);
  };

  const saveDeadline = (date: Date | null) => {
    setTask({
      ...task,
      deadline: date,
    });
    setActiveCalendarPicker(false);
  };

  return (
    <SafeView clickOutSide={() => setActivePriority(false)}>
      <Header title="Create Task">
        {{
          leftChild: (
            <Feather
              name="x"
              size={24}
              color={activedColors.text}
              onPress={() => navigation.goBack()}
            />
          ),
        }}
      </Header>
      <View style={{flex: 1, width: '100%'}}>
        <View
          style={[
            styles.item,
            {
              zIndex: 1,
              paddingVertical: 0,
              marginVertical: 20,
              backgroundColor: activedColors.input,
            },
          ]}>
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
          <UInput
            value={task.name}
            onChangeText={setName}
            placeholder="Task name"
            style={{flex: 1, width: 'auto'}}
          />
          <PriorityDropdown
            activePriority={activePriority}
            setActivePriority={setActivePriority}
            priority={task.priority}
            setPriority={setPriority}
          />
        </View>
        <View style={{marginTop: 10}}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setActivePomodoroPicker(true)}
            style={[
              styles.item,
              {
                flexDirection: 'row',
                backgroundColor: activedColors.input,
              },
            ]}>
            <Fontisto
              name="stopwatch"
              size={20}
              color={activedColors.textSec}
            />
            <Text
              style={[common.text, styles.title, {color: activedColors.text}]}>
              Pomodoro
            </Text>
            <View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginLeft: 'auto',
                }}>
                <MaterialCommunityIcons
                  name="clock-time-four"
                  size={16}
                  color={activedColors.primary}
                />
                <Text style={[common.small, {color: activedColors.primary}]}>
                  {task.pomodoroCount} /
                </Text>
                <MaterialCommunityIcons
                  name="clock-time-four"
                  size={16}
                  color={activedColors.primaryLight}
                />
                <Text
                  style={[common.small, {color: activedColors.primaryLight}]}>
                  {task.totalPomodoro}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginLeft: 'auto',
                }}>
                <MaterialCommunityIcons
                  name="clock-time-four"
                  size={14}
                  color={activedColors.primary}
                />
                <Text style={[common.small, {color: activedColors.textSec}]}>
                  {' '}
                  = {secondsToMinutes(task.longBreak)}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setActiveBreaktimePicker(true)}
            style={[styles.item, {backgroundColor: activedColors.input}]}>
            <MaterialCommunityIcons
              name="party-popper"
              size={20}
              color={activedColors.textSec}
            />
            <Text
              style={[common.text, styles.title, {color: activedColors.text}]}>
              Breaktime
            </Text>
            <Text style={[common.text, {color: activedColors.textSec}]}>
              {secondsToMinutes(task.shortBreak)}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setActiveCalendarPicker(true)}
            style={[styles.item, {backgroundColor: activedColors.input}]}>
            <FontAwesome
              name="calendar"
              size={20}
              color={activedColors.textSec}
            />
            <Text
              style={[common.text, styles.title, {color: activedColors.text}]}>
              Deadline
            </Text>
            <Text style={[common.text, {color: activedColors.textSec}]}>
              {task.deadline
                ? moment(task.deadline).format('dddd, D MMMM')
                : 'Someday'}
            </Text>
          </TouchableOpacity>
          <View
            style={[
              styles.assigneeWrap,
              {backgroundColor: activedColors.input},
            ]}>
            <View
              style={[
                {
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingVertical: 8,
                },
              ]}>
              <MaterialIcons
                name="groups"
                size={20}
                color={activedColors.textSec}
              />
              <Text
                style={[
                  common.text,
                  styles.title,
                  {color: activedColors.text},
                ]}>
                Assignees
              </Text>
              <Text style={[common.text, {color: activedColors.textSec}]}>
                {task.assignees.length}
              </Text>
            </View>
            <View
              style={{
                width: '100%',
                height: 2,
                marginTop: 4,
                backgroundColor: activedColors.background,
              }}
            />
            <View style={[{flexDirection: 'row', alignItems: 'center'}]}>
              <AntDesign
                name="adduser"
                size={20}
                color={activedColors.textSec}
              />
              <UInput
                value={assignee}
                onChangeText={setAssignee}
                placeholder="Add user..."
                style={{flex: 1, width: 'auto', marginLeft: 8}}
              />
              <TouchableOpacity activeOpacity={0.7} onPress={() => {}}>
                <Text style={[common.text, {color: activedColors.primary}]}>
                  Add
                </Text>
              </TouchableOpacity>
            </View>
            <View
              style={[
                {
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  gap: 10,
                  backgroundColor: activedColors.background,
                  padding: 16,
                  borderRadius: 8,
                },
              ]}>
              <AssigneeUserItem id="local" />
              <AssigneeUserItem id="local" username={'User 1'} />
              <AssigneeUserItem id="local" username={'User 2'} />
              <AssigneeUserItem id="local" username={'User blabla'} />
              <AssigneeUserItem id="local" username={'User'} />
            </View>
          </View>
        </View>
      </View>
      <PomodoroPicker
        visible={activePomodoroPicker}
        onClickOutside={() => setActivePomodoroPicker(false)}
        onClose={() => setActivePomodoroPicker(false)}
        onSave={savePomodoro}
      />
      <BreaktimePicker
        visible={activeBreaktimePicker}
        onClickOutside={() => setActiveBreaktimePicker(false)}
        onClose={() => setActiveBreaktimePicker(false)}
        onSave={saveBreaktime}
      />
      <MCalendarPicker
        visible={activeCalendarPicker}
        onClickOutside={() => setActiveCalendarPicker(false)}
        onClose={() => setActiveCalendarPicker(false)}
        onSave={saveDeadline}
      />
    </SafeView>
  );
};

export default CreateTask;

const styles = StyleSheet.create({
  item: {
    marginVertical: 4,
    marginHorizontal: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
  },
  check: {
    width: 24,
    height: 24,
    borderRadius: 24,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    flex: 1,
    marginLeft: 20,
  },
  assigneeWrap: {
    marginVertical: 4,
    marginHorizontal: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
});
