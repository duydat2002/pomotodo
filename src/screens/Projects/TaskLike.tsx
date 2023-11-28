import {StyleSheet, Text, View, ScrollView} from 'react-native';
import React, {useEffect, useState} from 'react';
import SafeView from '@/components/Layout/SafeView';
import {useActivedColors, useAppSelector} from '@/hooks';
import Header from '@/components/Layout/Header';
import {useTask} from '@/hooks/useTask';
import {ITaskLike} from '@/types/taskLike';
import {ITask, ProjectsStackScreenProps} from '@/types';
import TaskItem from '@/components/Task/TaskItem';
import {useNavigation} from '@react-navigation/native';

const TaskLike = () => {
  const activedColors = useActivedColors();
  const navigation =
    useNavigation<ProjectsStackScreenProps<'TaskLike'>['navigation']>();

  const {getTaskLikes} = useTask();

  const {user} = useAppSelector(state => state.user);
  const {tasks} = useAppSelector(state => state.tasks);

  const [taskLikes, SetTaskLikes] = useState<ITask[]>([]);

  useEffect(() => {
    const init = async () => {
      if (tasks) {
        const likesTemp: ITask[] = [];
        const temp = await getTaskLikes(user!.id);

        console.log('temp', temp);

        temp?.forEach(item => {
          const taskTemp = tasks.find(task => task.id == item.taskId);

          if (taskTemp) likesTemp.push(taskTemp);
        });

        SetTaskLikes(likesTemp);
      }
    };

    init();
  }, []);

  return (
    <SafeView>
      <Header title="Task Like" />
      <ScrollView
        style={{flex: 1, width: '100%', marginTop: 20, paddingHorizontal: 16}}>
        <Text>My favorite tasks</Text>
        {taskLikes?.map(task => (
          <TaskItem
            key={task.id}
            task={task}
            onPress={() => {
              navigation.navigate('CreateTask', {
                projectId: task.projectId,
                taskId: task.id,
              });
            }}
            onDelete={() => {}}
          />
        ))}
      </ScrollView>
    </SafeView>
  );
};

export default TaskLike;

const styles = StyleSheet.create({});
