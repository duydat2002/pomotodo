import React, {useState, useEffect} from 'react';
import {StyleSheet, View, TouchableOpacity, FlatList} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {IProject} from '@/types';
import SafeView from '@/components/Layout/SafeView';
import Header from '@/components/Layout/Header';
import {useActivedColors, useAppSelector} from '@/hooks';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import ProjectInfoCard from '@/components/Project/ProjectInfoCard';
import TaskItem from '@/components/Task/TaskItem';
import {ProjectsStackScreenProps} from '@/types/navigation';

const Tasks = () => {
  const activedColors = useActivedColors();
  const navigation =
    useNavigation<ProjectsStackScreenProps<'Tasks'>['navigation']>();
  const route = useRoute<ProjectsStackScreenProps<'Tasks'>['route']>();

  const {projects, tasks} = useAppSelector(state => state.projects);

  const [project, setProject] = useState<IProject | null>(null);

  useEffect(() => {
    const projectTemp = projects?.filter(
      item => item.id === route.params?.projectId,
    );
    setProject(!projectTemp ? null : projectTemp[0]);
  }, [route.params?.projectId]);

  const clickCreateTask = () => {
    navigation.navigate('CreateTask', {projectId: project?.id || ''});
  };

  return (
    <SafeView>
      <Header title={project?.name} hasBack>
        {{
          rightChild: (
            <TouchableOpacity activeOpacity={0.7} onPress={() => {}}>
              <MaterialCommunityIcons
                name="sort"
                size={24}
                color={activedColors.text}
              />
            </TouchableOpacity>
          ),
        }}
      </Header>
      <View style={{flex: 1, width: '100%', marginTop: 20}}>
        <View style={[styles.info, {backgroundColor: activedColors.input}]}>
          <ProjectInfoCard
            title="Time Remaining"
            time={project ? project?.totalTime - project?.elapsedTime : 0}
          />
          <ProjectInfoCard
            title="Tasks Remaining"
            number={project ? project?.totalTask - project?.taskComplete : 0}
          />
          <ProjectInfoCard title="Elapsed Time" time={project?.elapsedTime} />
          <ProjectInfoCard
            title="Tasks Completed"
            number={project?.taskComplete}
          />
        </View>
        <FlatList
          style={{marginTop: 20}}
          data={tasks}
          keyExtractor={(item, index) => item.name + index}
          renderItem={({item}) => (
            <TaskItem
              task={item}
              onPress={() => {
                console.log('Task item');
              }}
            />
          )}
        />
      </View>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={clickCreateTask}
        style={[
          styles.createTaskButton,
          {backgroundColor: activedColors.buttonSec},
        ]}>
        <MaterialCommunityIcons name="plus" size={30} color="#fff" />
      </TouchableOpacity>
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
});
