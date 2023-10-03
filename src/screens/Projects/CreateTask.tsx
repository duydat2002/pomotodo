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
import {IColleague, IUser, ProjectsStackScreenProps} from '@/types';
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
import {useNotification} from '@/hooks/useNotification';

const CreateTask = () => {
  const activedColors = useActivedColors();
  const isFocused = useIsFocused();
  const navigation =
    useNavigation<ProjectsStackScreenProps<'CreateTask'>['navigation']>();
  const route = useRoute<ProjectsStackScreenProps<'CreateTask'>['route']>();

  const {user} = useAppSelector(state => state.user);
  const {project} = useAppSelector(state => state.projects);
  const {tasks} = useAppSelector(state => state.tasks);
  const {colleagues} = useAppSelector(state => state.colleagues);

  const {createTask, updateTask} = useTask();
  const {createNotification} = useNotification();
  const {addColleagues} = useColleague();

  const [isReady, setIsReady] = useState(false);
  const [QRValue, setQRValue] = useState('');
  const [assignee, setAssignee] = useState('');
  const [oldAssigneeIds, setOldAssigneeIds] = useState(['']);
  const [assigneeIds, setAssigneeIds] = useState<string[] | null>(null);
  const [assignees, setAssignees] = useState<IUser[]>([]);
  const [findColleague, setFindColleague] = useState<IUser[] | null>(null);
  const [projectColleagues, setProjectColleagues] = useState<IUser[]>([user!]);

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
    assignees: null,
    createdAt: '',
  });
  const [errorName, setErrorName] = useState('');
  const [validTask, setValidTask] = useState(true);

  useEffect(() => {
    let projectColleaguesTemp: IUser[] = [];

    if (colleagues) {
      projectColleaguesTemp = colleagues
        .filter(item => project!.team.includes(item.colleagueId))
        .map(item => ({
          id: item.colleagueId,
          username: item.colleagueUsername,
          avatar: item.colleagueAvatar,
          email: item.colleagueEmail,
        }));
      projectColleaguesTemp.unshift(user!);

      setProjectColleagues(projectColleaguesTemp);
    }

    if (route.params.taskId) {
      const tasksFilter = tasks?.filter(item => item.id == route.params.taskId);

      if (!tasksFilter || tasksFilter.length == 0) {
        setValidTask(false);
      } else if (
        tasksFilter[0].assignees != null &&
        !tasksFilter[0].assignees.includes(user!.id)
      ) {
        setValidTask(false);
      } else {
        setTask(tasksFilter[0]);
        setOldAssigneeIds(tasksFilter[0].assignees || []);

        const assigneesTemp: IUser[] = projectColleaguesTemp.filter(
          item => tasksFilter[0].assignees?.includes(item.id),
        );

        setAssignees(assigneesTemp);
        setIsReady(true);
      }
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

  useEffect(() => {
    const colleaguesTemp: IUser[] | undefined = projectColleagues?.filter(
      item => {
        if (assignee.trim() != '') {
          return item.username
            .toLowerCase()
            .includes(assignee.trim().toLowerCase());
        } else {
          return false;
        }
      },
    );

    setFindColleague(
      colleaguesTemp && colleaguesTemp.length > 0 ? colleaguesTemp : null,
    );
  }, [assignee]);

  useEffect(() => {
    const assigneeIdsTemp = assignees.map(item => item.id);
    setAssigneeIds(assigneeIdsTemp.length == 0 ? null : assigneeIdsTemp);
  }, [assignees]);

  const handleSaveTask = async () => {
    if (task.name.trim() == '') {
      setErrorName('Please enter task name.');
    } else {
      setErrorName('');

      const updatedTask = {
        ...task,
        assignees: assigneeIds,
      };
      setTask(updatedTask);

      // Update or create task
      if (route.params.taskId) {
        console.log('cac', updatedTask);
        updateTask(route.params.taskId, updatedTask);
      } else {
        createTask(updatedTask);
      }

      // Check add/ remove
      const promise: any[] = [];
      // Add
      assigneeIds?.forEach(item => {
        if (item != user?.id && !oldAssigneeIds.includes(item)) {
          promise.push(
            createNotification({
              id: generatorId(),
              senderId: user!.id,
              senderUsername: user!.username,
              senderAvatar: user!.avatar,
              receiverId: item,
              type: 'assign',
              subType: 'add',
              isRead: false,
              content: 'added you to',
              projectId: project?.id,
              projectName: project?.name,
              taskId: task.id,
              taskName: task.name,
              createdAt: new Date().toISOString(),
            }),
          );
        }
      });

      // Delete
      oldAssigneeIds.forEach(item => {
        if (item != user?.id && !assigneeIds?.includes(item)) {
          promise.push(
            createNotification({
              id: generatorId(),
              senderId: user!.id,
              senderUsername: user!.username,
              senderAvatar: user!.avatar,
              receiverId: item,
              type: 'assign',
              subType: 'remove',
              isRead: false,
              content: 'removed you from',
              projectId: project?.id,
              projectName: project?.name,
              taskId: task.id,
              taskName: task.name,
              createdAt: new Date().toISOString(),
            }),
          );
        }
      });

      await Promise.all(promise);

      navigation.navigate('Tasks', {projectId: route.params.projectId});
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

  const onClickColleague = (colleague: IUser) => {
    const check = assignees.findIndex(item => item.id == colleague.id);

    if (check == -1) {
      setAssignees([...assignees, colleague]);
    }

    setAssignee('');
    setFindColleague(null);
  };

  if (!validTask) {
    return (
      <SafeView>
        <Header title={route.params.taskId ? 'Edit Task' : 'Create Task'}>
          {{
            leftChild: (
              <Feather
                name="x"
                size={24}
                color={activedColors.text}
                onPress={() =>
                  navigation.navigate('Tasks', {
                    projectId: route.params.projectId,
                  })
                }
              />
            ),
          }}
        </Header>
        <View style={[common.container]}>
          <Text style={[common.text, {color: activedColors.text}]}>
            Task not found The task doesn't seem to exist or you don't have
            permission to access it.
          </Text>
        </View>
      </SafeView>
    );
  }

  return (
    <KeyboardAvoidingView style={{flex: 1}} behavior="height" enabled={false}>
      <SafeView clickOutSide={() => setActivePriority(false)}>
        <Header title={route.params.taskId ? 'Edit Task' : 'Create Task'}>
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
              <View style={styles.assigneeHeader}>
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
                  style={styles.assigneeList}>
                  {assignees.map(assignee => (
                    <AssigneeUserItem
                      key={assignee.id}
                      user={assignee}
                      ownerId={'none'}
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
              marginBottom: 10,
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
  assigneeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  assigneeList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    padding: 16,
  },
});
