import React, {useState} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import {
  Feather,
  Fontisto,
  Ionicons,
  MaterialCommunityIcons,
} from '@expo/vector-icons';
import {useActivedColors, useAppSelector} from '@/hooks';
import {useNavigation, useRoute} from '@react-navigation/native';
import {common} from '@/assets/styles';
import {ProjectsStackScreenProps} from '@/types/navigation';
import {PRIORITY_COLORS} from '@/constants';
import {IPriority, ITask} from '@/types';
import {generatorId} from '@/utils';
import UModal from '@/components/UModal';
import SafeView from '@/components/SafeView';
import Header from '@/components/Header';
import SelectDropdown from 'react-native-select-dropdown';
import UDropdown from '@/components/UDropdown';
import UInput from '@/components/UInput';

interface IPriorityItemProps {
  level?: IPriority;
  onPress: () => void;
}

const PriorityItem: React.FC<IPriorityItemProps> = ({
  level = 'none',
  onPress,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={{
        flexDirection: 'row',
        width: '100%',
        paddingHorizontal: 16,
        paddingVertical: 8,
      }}>
      <Ionicons name="flag" size={24} color={PRIORITY_COLORS[level].default} />
      <Text
        numberOfLines={1}
        style={[
          common.text,
          {
            color: PRIORITY_COLORS[level].default,
            textTransform: 'capitalize',
            marginLeft: 10,
          },
        ]}>
        {level} Priority
      </Text>
    </TouchableOpacity>
  );
};

const CreateTask = () => {
  const activedColors = useActivedColors();
  const navigation =
    useNavigation<ProjectsStackScreenProps<'CreateTask'>['navigation']>();
  const route = useRoute<ProjectsStackScreenProps<'CreateTask'>['route']>();

  const {user} = useAppSelector(state => state.user);

  const prioritys: IPriority[] = ['high', 'medium', 'low', 'none'];

  const [activePriority, setActivePriority] = useState(false);
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

  const clickOutSide = () => {
    setActivePriority(false);
  };

  return (
    <SafeView clickOutSide={clickOutSide}>
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
          <UDropdown active={activePriority} style={{right: 0, zIndex: 1000}}>
            {{
              header: (
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => setActivePriority(!activePriority)}>
                  <Ionicons
                    name="flag"
                    size={24}
                    color={PRIORITY_COLORS[task.priority].default}
                  />
                </TouchableOpacity>
              ),
              dropdown: (
                <View
                  style={[
                    common.shadow,
                    {
                      width: 200,
                      backgroundColor: activedColors.modal,
                      alignItems: 'center',
                      borderRadius: 8,
                    },
                  ]}>
                  {prioritys.map(level => (
                    <PriorityItem
                      key={level}
                      level={level}
                      onPress={() => setPriority(level)}
                    />
                  ))}
                </View>
              ),
            }}
          </UDropdown>
        </View>
        <View style={{}}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => {}}
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
            <Text style={[common.text, {flex: 1, marginLeft: 20}]}>
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
                  = {task.longBreak}m
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </SafeView>
  );
};

export default CreateTask;

const styles = StyleSheet.create({
  item: {
    marginVertical: 20,
    marginHorizontal: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  check: {
    width: 24,
    height: 24,
    borderRadius: 24,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
