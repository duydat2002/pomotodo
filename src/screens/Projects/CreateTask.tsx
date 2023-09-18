import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
} from 'react-native';
import {
  AntDesign,
  Feather,
  FontAwesome,
  Fontisto,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from '@expo/vector-icons';
import {useActivedColors, useAppDispatch, useAppSelector} from '@/hooks';
import {useIsFocused, useNavigation, useRoute} from '@react-navigation/native';
import {common} from '@/assets/styles';
import {IColleague, ProjectsStackScreenProps} from '@/types';
import {APP_QR_ID, PRIORITY_COLORS} from '@/constants';
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
import QRModal from '@/components/Modal/QRModal';
import FindColleague from '@/components/Task/FindColleague';
import UButton from '@/components/UI/UButton';
import {useTask} from '@/hooks/useTask';
import {useColleague} from '@/hooks/useColleague';

const CreateTask = () => {
  const activedColors = useActivedColors();
  const isFocused = useIsFocused();
  const navigation =
    useNavigation<ProjectsStackScreenProps<'CreateTask'>['navigation']>();
  const route = useRoute<ProjectsStackScreenProps<'CreateTask'>['route']>();

  const {user} = useAppSelector(state => state.user);
  const {project} = useAppSelector(state => state.projects);
  const {colleagues} = useAppSelector(state => state.colleagues);

  const {createTask, updateTask} = useTask();
  const {addColleagues} = useColleague();

  const [isReady, setIsReady] = useState(false);
  const [QRValue, setQRValue] = useState('');
  const [assignee, setAssignee] = useState('');
  const [assignees, setAssignees] = useState<IColleague[]>([]);
  const [findColleague, setFindColleague] = useState<IColleague[] | null>(null);

  const [activePriority, setActivePriority] = useState(false);
  const [activePomodoroPicker, setActivePomodoroPicker] = useState(false);
  const [activeBreaktimePicker, setActiveBreaktimePicker] = useState(false);
  const [activeCalendarPicker, setActiveCalendarPicker] = useState(false);
  const [activeQRCode, setActiveQRCode] = useState(false);
  const [task, setTask] = useState<ITask>({
    id: generatorId(),
    projectId: route.params.projectId,
    name: '',
    priority: 'none',
    isDone: false,
    totalPomodoro: 1,
    pomodoroCount: 0,
    longBreak: 25 * 60,
    shortBreak: 5 * 60,
    deadline: null,
    assignees: [],
    createdAt: '',
  });
  const [errorName, setErrorName] = useState('');

  useEffect(() => {
    if (route.params.task) {
      const task = route.params.task;
      setTask(task);

      // Get assignees info in list colleagues
      if (task.assignees) {
        const assigneesTemp = colleagues?.filter(colleague =>
          task.assignees.includes(colleague.colleagueId),
        );

        setAssignees(assigneesTemp || []);
      }

      setIsReady(true);
    }
  }, [isFocused]);

  useEffect(() => {
    if (isReady) {
      setQRValue(
        JSON.stringify({
          id: APP_QR_ID, // ID của riêng project
          project: project,
          task: task,
          owner: user,
        }),
      );
    }
  }, [isReady]);

  const handleSaveTask = () => {
    if (task.name.trim() == '') {
      setErrorName('Please enter task name.');
    } else {
      setErrorName('');

      const assigneesIds = assignees.map(item => item.colleagueId);
      const updatedTask = {
        ...task,
        assignees: assigneesIds,
      };
      setTask(updatedTask);

      // Update or create task
      if (route.params.task) {
        updateTask(updatedTask);
      } else {
        createTask(updatedTask);
      }

      // Add colleagues
      addColleagues(assignees);

      navigation.goBack();
    }
  };

  const checkTask = () => {
    setTask({
      ...task,
      isDone: !task.isDone,
    });
  };

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
    if (pomodoros <= task.pomodoroCount) {
      setTask({
        ...task,
        isDone: true,
        pomodoroCount: pomodoros,
        totalPomodoro: pomodoros,
        longBreak: pomodoroLength,
      });
    } else {
      setTask({
        ...task,
        isDone: false,
        totalPomodoro: pomodoros,
        longBreak: pomodoroLength,
      });
    }
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
      deadline: date?.toISOString() || null,
    });
    setActiveCalendarPicker(false);
  };

  const onDeleteAssignee = (id: string) => {
    const assigneesTemp = assignees.filter(assignee => assignee.id != id);

    setAssignees(assigneesTemp);
  };

  const onClickColleague = (colleague: IColleague) => {
    const check = assignees.findIndex(item => item.id == colleague.id);

    if (check == -1) {
      setAssignees([...assignees, colleague]);
    }

    setAssignee('');
    setFindColleague(null);
  };

  useEffect(() => {
    const colleaguesTemp = colleagues?.filter(item => {
      if (assignee.trim() != '') {
        return (
          item.colleagueId == assignee ||
          item.colleagueUsername
            .toLowerCase()
            .includes(assignee.trim().toLowerCase())
        );
      } else {
        return false;
      }
    });

    setFindColleague(
      colleaguesTemp && colleaguesTemp.length > 0 ? colleaguesTemp : null,
    );
  }, [assignee]);

  return (
    <KeyboardAvoidingView style={{flex: 1}} behavior="height" enabled={false}>
      <SafeView clickOutSide={() => setActivePriority(false)}>
        <Header title={route.params.task ? 'Edit Task' : 'Create Task'}>
          {{
            leftChild: (
              <Feather
                name="x"
                size={24}
                color={activedColors.text}
                onPress={() => navigation.goBack()}
              />
            ),
            rightChild: (
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setActiveQRCode(true)}>
                <Ionicons
                  name="qr-code-outline"
                  size={24}
                  color={activedColors.text}
                />
              </TouchableOpacity>
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
                marginTop: 20,
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
          <Text
            style={[
              common.small,
              {marginLeft: 70, color: activedColors.error},
            ]}>
            {errorName}
          </Text>
          <View style={{marginTop: 10, flex: 1}}>
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
                style={[
                  common.text,
                  styles.title,
                  {color: activedColors.text},
                ]}>
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
                style={[
                  common.text,
                  styles.title,
                  {color: activedColors.text},
                ]}>
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
                style={[
                  common.text,
                  styles.title,
                  {color: activedColors.text},
                ]}>
                Deadline
              </Text>
              <Text style={[common.text, {color: activedColors.textSec}]}>
                {task.deadline
                  ? moment(new Date(task.deadline)).format('dddd, D MMMM')
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
                  {assignees.length}
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
                <View style={{flex: 1, width: 'auto', marginLeft: 8}}>
                  <UInput
                    value={assignee}
                    onChangeText={setAssignee}
                    placeholder="Add user..."
                  />
                  {findColleague && (
                    <FindColleague
                      findColleague={findColleague}
                      onClickColleague={onClickColleague}
                    />
                  )}
                </View>
              </View>
              <ScrollView
                style={{
                  height: 150,
                  borderRadius: 8,
                  backgroundColor: activedColors.background,
                }}>
                <View
                  onStartShouldSetResponder={() => true}
                  style={[
                    {
                      flexDirection: 'row',
                      flexWrap: 'wrap',
                      gap: 10,
                      padding: 16,
                    },
                  ]}>
                  {assignees.map(assignee => (
                    <AssigneeUserItem
                      key={assignee.id}
                      assignee={assignee}
                      onDelete={onDeleteAssignee}
                    />
                  ))}
                </View>
              </ScrollView>
            </View>
          </View>
          <UButton
            primary
            style={{
              width: 'auto',
              marginHorizontal: 16,
              marginBottom: 40,
            }}
            onPress={handleSaveTask}>
            <Text style={[common.text, {color: '#fff'}]}>Save</Text>
          </UButton>
        </View>
        <View style={{position: 'absolute'}}>
          <QRModal
            visible={activeQRCode}
            value={QRValue}
            onClickOutside={() => setActiveQRCode(false)}
            onClose={() => setActiveQRCode(false)}
          />
          <PomodoroPicker
            visible={activePomodoroPicker}
            initPomodoro={task.totalPomodoro}
            initPomodoroLength={task.longBreak / 60}
            onClickOutside={() => setActivePomodoroPicker(false)}
            onClose={() => setActivePomodoroPicker(false)}
            onSave={savePomodoro}
          />
          <BreaktimePicker
            visible={activeBreaktimePicker}
            initShortBreak={task.shortBreak / 60}
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
        </View>
      </SafeView>
    </KeyboardAvoidingView>
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
