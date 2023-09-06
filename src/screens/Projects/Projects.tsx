import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View, FlatList, TouchableOpacity} from 'react-native';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {common} from '@/assets/styles';
import {AntDesign, Ionicons} from '@expo/vector-icons';
import {
  useActivedColors,
  useAppDispatch,
  useAppSelector,
  useProject,
} from '@/hooks';
import {IProject} from '@/types';
import auth from '@react-native-firebase/auth';
import SafeView from '@/components/SafeView';
import UButton from '@/components/UButton';
import Header from '@/components/Header';
import ProjectItem from '@/components/ProjectItem';
import {ProjectsStackNavigationProps} from '@/navigations/ProjectNavigator';

const Projects = () => {
  const activedColors = useActivedColors();
  const navigation = useNavigation<ProjectsStackNavigationProps>();
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
          style={{
            borderColor: activedColors.border,
            backgroundColor: activedColors.border,
            borderRadius: 14,
            marginHorizontal: 16,
            marginBottom: 9,
            width: 'auto',
          }}>
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
          onPress={() => navigation.navigate('CreateProject' as never)}
          style={{
            flexDirection: 'row',
            marginHorizontal: 16,
            marginVertical: 10,
          }}>
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

const styles = StyleSheet.create({});
