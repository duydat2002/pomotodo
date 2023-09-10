import React from 'react';
import {StyleSheet, Text, View, FlatList, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {common} from '@/assets/styles';
import {AntDesign, Ionicons} from '@expo/vector-icons';
import {useActivedColors, useAppDispatch, useAppSelector} from '@/hooks';
import SafeView from '@/components/Layout/SafeView';
import UButton from '@/components/UI/UButton';
import Header from '@/components/Layout/Header';
import ProjectItem from '@/components/Project/ProjectItem';
import {ProjectsStackScreenProps} from '@/types';

const Projects = () => {
  const activedColors = useActivedColors();
  const navigation =
    useNavigation<ProjectsStackScreenProps<'Projects'>['navigation']>();
  const dispatch = useAppDispatch();

  const {projects, project} = useAppSelector(state => state.projects);

  const handleClickProjectItem = (projectId: string) => {
    navigation.navigate('Tasks', {projectId});
  };

  return (
    <SafeView>
      <Header title="Your Projects">{{}}</Header>
      <View style={{flex: 1, width: '100%'}}>
        <UButton
          style={[
            styles.searchButton,
            {
              borderColor: activedColors.border,
              backgroundColor: activedColors.border,
            },
          ]}>
          <Ionicons name="search" size={22} color={activedColors.textSec} />
          <Text
            style={[
              common.text,
              {color: activedColors.textSec, marginLeft: 10},
            ]}>
            Search tasks...
          </Text>
        </UButton>
        <TouchableOpacity
          onPress={() => navigation.navigate('CreateProject')}
          style={styles.addProject}>
          <AntDesign name="plus" size={24} color={activedColors.text} />
          <Text
            style={[common.text, {color: activedColors.text, marginLeft: 10}]}>
            Add new project
          </Text>
        </TouchableOpacity>
        <FlatList
          data={projects}
          keyExtractor={(item, index) => item.name + index}
          renderItem={({item}) => (
            <ProjectItem
              onPress={() => handleClickProjectItem(item.id)}
              color={item.color}
              name={item.name}
              totalTime={item.totalTime}
              totalTask={item.totalTask}
            />
          )}
        />
        <View />
      </View>
    </SafeView>
  );
};

export default Projects;

const styles = StyleSheet.create({
  searchButton: {
    borderRadius: 14,
    marginHorizontal: 16,
    marginBottom: 9,
    width: 'auto',
  },
  addProject: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginVertical: 10,
  },
});
