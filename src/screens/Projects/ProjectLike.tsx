import {StyleSheet, Text, View, ScrollView} from 'react-native';
import React, {useEffect, useState} from 'react';
import SafeView from '@/components/Layout/SafeView';
import {useActivedColors, useAppSelector} from '@/hooks';
import Header from '@/components/Layout/Header';
import {useTask} from '@/hooks/useTask';
import {IProject, ITask, ProjectsStackScreenProps} from '@/types';
import {useNavigation} from '@react-navigation/native';
import {useProject} from '@/hooks/useProject';
import ProjectItem from '@/components/Project/ProjectItem';

const ProjectLike = () => {
  const activedColors = useActivedColors();
  const navigation =
    useNavigation<ProjectsStackScreenProps<'ProjectLike'>['navigation']>();

  const {getProjectLikes} = useProject();

  const {user} = useAppSelector(state => state.user);
  const {projects} = useAppSelector(state => state.projects);

  const [projectLikes, SetProjectLikes] = useState<IProject[]>([]);

  useEffect(() => {
    const init = async () => {
      if (projects) {
        const likesTemp: IProject[] = [];
        const temp = await getProjectLikes(user!.id);

        temp?.forEach(item => {
          const projectTemp = projects.find(
            project => project.id == item.projectId,
          );

          if (projectTemp) likesTemp.push(projectTemp);
        });

        SetProjectLikes(likesTemp);
      }
    };

    init();
  }, []);

  return (
    <SafeView>
      <Header title="Project Like" />
      <ScrollView
        style={{flex: 1, width: '100%', marginTop: 20, paddingHorizontal: 16}}>
        <Text>My favorite tasks</Text>
        {projectLikes?.map(project => (
          <ProjectItem
            onPress={() => {}}
            project={project}
            onEdit={() => {
              navigation.navigate('CreateProject', {projectId: project.id});
            }}
            onDelete={() => {}}
          />
        ))}
      </ScrollView>
    </SafeView>
  );
};

export default ProjectLike;

const styles = StyleSheet.create({});
