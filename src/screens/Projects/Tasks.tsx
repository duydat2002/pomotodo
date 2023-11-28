import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {ITask} from '@/types';
import SafeView from '@/components/Layout/SafeView';
import Header from '@/components/Layout/Header';
import {useActivedColors, useAppDispatch, useAppSelector} from '@/hooks';
import {AntDesign, MaterialCommunityIcons} from '@expo/vector-icons';
import ProjectInfoCard from '@/components/Project/ProjectInfoCard';
import TaskItem from '@/components/Task/TaskItem';
import {ProjectsStackScreenProps} from '@/types';
import {common} from '@/assets/styles';
import moment from 'moment';
import {timeFromNowFormat} from '@/utils';
import SelectRadioModal from '@/components/Modal/SelectRadioModal';
import ConfirmModal from '@/components/Modal/ConfirmModal';
import {useTask} from '@/hooks/useTask';

const Tasks = () => {
  const activedColors = useActivedColors();
  const navigation =
    useNavigation<ProjectsStackScreenProps<'Tasks'>['navigation']>();
  const route = useRoute<ProjectsStackScreenProps<'Tasks'>['route']>();
  const dispatch = useAppDispatch();

  const {deleteTask} = useTask();

  const {user} = useAppSelector(state => state.user);
  const {projects, project} = useAppSelector(state => state.projects);
  const {tasks} = useAppSelector(state => state.tasks);

  const [uncompletedTasks, setUncompletedTasks] = useState<ITask[]>([]);
  const [groupCompletedTasks, setGroupCompletedTasks] = useState<{
    [date: string]: ITask[];
  }>({});
  const [isOwner, setIsOwner] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showCompletedTasks, setShowCompletedTasks] = useState(false);
  const [activeSort, setActiveSort] = useState(false);
  const [sortType, setSortType] = useState('auto');
  const [activeDeleteTask, setActiveDeleteTask] = useState(false);
  const [taskId, setTaskId] = useState('');

  const sortItems = [
    {key: 'auto', value: 'Auto'},
    {key: 'deadline', value: 'Deadline'},
    {key: 'priority', value: 'Priority'},
  ];

  useEffect(() => {
    setIsOwner(project?.ownerId == user?.id);

    if (projects) {
      const projectTasks = tasks?.filter(
        task => task.projectId == route.params?.projectId,
      );
      const completeTasksTemp: ITask[] = [];
      const uncompleteTasksTemp: ITask[] = [];

      projectTasks?.forEach(task => {
        if (task.isDone) completeTasksTemp.push(task);
        else uncompleteTasksTemp.push(task);
      });

      setGroupCompletedTasks(groupCompletedTasksByDate(completeTasksTemp));
      setUncompletedTasks(uncompleteTasksTemp);
    }
    setIsLoading(false);
  }, [project, tasks]);

  useEffect(() => {
    if (uncompletedTasks.length > 0) {
      setUncompletedTasks(sortUncompletedTasks(uncompletedTasks));
      setActiveSort(false);
    }
  }, [sortType]);

  const clickCreateTask = () => {
    navigation.navigate('CreateTask', {projectId: project!.id, taskId: null});
  };

  const handleConfirmDelete = async () => {
    await deleteTask(taskId);
    setActiveDeleteTask(false);
  };

  const sortUncompletedTasks = (uncompletedTasks: ITask[]) => {
    const uncompletedTasksTemp = uncompletedTasks.slice();

    switch (sortType) {
      case 'auto':
        uncompletedTasksTemp.sort(
          (t1, t2) => Date.parse(t1.createdAt) - Date.parse(t2.createdAt),
        );
        break;
      case 'deadline':
        uncompletedTasksTemp.sort((t1, t2) =>
          !t1.deadline
            ? 1
            : !t2.deadline
            ? -1
            : Date.parse(t1.deadline) - Date.parse(t2.deadline),
        );
        break;
      case 'priority':
        const priorityLevel = {high: 3, medium: 2, low: 1, none: 0};
        uncompletedTasksTemp.sort(
          (t1, t2) => priorityLevel[t2.priority] - priorityLevel[t1.priority],
        );
        break;
    }

    return uncompletedTasksTemp;
  };

  const groupCompletedTasksByDate = (completedTasks: ITask[]) => {
    const grouped: {[date: string]: ITask[]} = {};

    completedTasks
      .sort((t1, t2) => Date.parse(t2.completedAt) - Date.parse(t1.completedAt))
      .forEach(task => {
        const dateTemp = timeFromNowFormat(task.completedAt);

        if (!grouped[dateTemp]) grouped[dateTemp] = [];

        grouped[dateTemp].push(task);
      });

    return grouped;
  };

  if (!project) return null;

  return (
    <SafeView hasDismissKeyboard={false}>
      <Header title={project.name} hasBack>
        {{
          rightChild: (
            <View style={{flexDirection: 'row', gap: 10}}>
              <AntDesign
                name="heart"
                size={24}
                color="black"
                onPress={() => navigation.navigate('TaskLike')}
              />
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setActiveSort(true)}>
                <MaterialCommunityIcons
                  name="sort"
                  size={24}
                  color={activedColors.text}
                />
              </TouchableOpacity>
            </View>
          ),
        }}
      </Header>
      {isLoading ? (
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <ActivityIndicator size={30} color={activedColors.textSec} />
        </View>
      ) : (
        <>
          <View style={{flex: 1, width: '100%', marginTop: 20}}>
            <View
              style={[
                styles.info,
                {backgroundColor: activedColors.backgroundLight},
              ]}>
              <ProjectInfoCard
                title="Time Remaining"
                time={project ? project?.remainingTime : 0}
              />
              <ProjectInfoCard
                title="Tasks Remaining"
                number={
                  project ? project?.totalTask - project?.taskComplete : 0
                }
              />
              <ProjectInfoCard
                title="Elapsed Time"
                time={project?.elapsedTime}
              />
              <ProjectInfoCard
                title="Tasks Completed"
                number={project?.taskComplete}
              />
            </View>
            <ScrollView>
              <View style={{paddingBottom: 100}}>
                {uncompletedTasks.map(task => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    onPress={() => {
                      navigation.navigate('CreateTask', {
                        projectId: task.projectId,
                        taskId: task.id,
                      });
                    }}
                    onDelete={() => {
                      setTaskId(task.id);
                      setActiveDeleteTask(true);
                    }}
                  />
                ))}
                {Object.keys(groupCompletedTasks).length > 0 && (
                  <View style={{marginTop: 20}}>
                    <Text
                      style={[
                        common.small,
                        styles.buttonShowMore,
                        {
                          backgroundColor: activedColors.primaryLight,
                        },
                      ]}
                      onPress={() =>
                        setShowCompletedTasks(!showCompletedTasks)
                      }>
                      {showCompletedTasks
                        ? 'Hide completed tasks'
                        : 'Show completed tasks'}
                    </Text>
                    {showCompletedTasks &&
                      Object.keys(groupCompletedTasks).map(date => (
                        <View key={date} style={{marginTop: 20}}>
                          <Text
                            style={[
                              common.text,
                              {marginLeft: 16, color: activedColors.textSec},
                            ]}>
                            {date}
                          </Text>
                          {groupCompletedTasks[date].map(task => (
                            <TaskItem
                              key={task.id}
                              task={task}
                              onPress={() => {
                                navigation.navigate('CreateTask', {
                                  projectId: task.projectId,
                                  taskId: task.id,
                                });
                              }}
                              onDelete={() => {
                                setTaskId(task.id);
                                setActiveDeleteTask(true);
                              }}
                            />
                          ))}
                        </View>
                      ))}
                  </View>
                )}
              </View>
            </ScrollView>
          </View>
          <View style={{position: 'absolute'}}>
            <SelectRadioModal
              visible={activeSort}
              title="Sort by"
              selected={sortType}
              items={sortItems}
              onSelect={selected => setSortType(selected)}
              onClose={() => setActiveSort(false)}
            />
            <ConfirmModal
              visible={activeDeleteTask}
              title="Are you sure?"
              desc="Are you sure you want to delete this task?"
              comfirmText="Delete"
              onConfirm={handleConfirmDelete}
              onClose={() => {
                setActiveDeleteTask(false);
              }}
            />
          </View>
          {isOwner && (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={clickCreateTask}
              style={[
                styles.createTaskButton,
                {backgroundColor: activedColors.buttonSec},
              ]}>
              <MaterialCommunityIcons name="plus" size={30} color="#fff" />
            </TouchableOpacity>
          )}
        </>
      )}
    </SafeView>
  );
};

export default Tasks;

const styles = StyleSheet.create({
  info: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    padding: 8,
    borderRadius: 8,
    marginBottom: 20,
  },
  createTaskButton: {
    position: 'absolute',
    bottom: 30,
    width: 50,
    height: 50,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonShowMore: {
    alignSelf: 'center',
    marginBottom: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 10,
    color: '#fff',
  },
});
