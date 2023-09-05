import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View, FlatList, TouchableOpacity} from 'react-native';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {common} from '@/assets/styles';
import {AntDesign, Ionicons} from '@expo/vector-icons';
import {useActivedColors, useProject} from '@/hooks';
import SafeView from '@/components/SafeView';
import UButton from '@/components/UButton';
import Header from '@/components/Header';
import ProjectItem from '@/components/ProjectItem';
import {IProject} from '@/types';
import {auth} from '@/configs/firebase';

const Projects = () => {
  const activedColors = useActivedColors();
  const navigation = useNavigation();

  const [projects, setProjects] = useState<IProject[] | null>(null);

  const getProjectsAsync = async () => {
    const {getProjects} = useProject();

    const projectsTemp = await getProjects(auth.currentUser!.uid);
    setProjects(projectsTemp);
  };

  useFocusEffect(() => {
    getProjectsAsync();
  });

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
            Search task...
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
