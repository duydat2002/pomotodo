import React, {useState} from 'react';
import {StyleSheet, Text, View, FlatList, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {common} from '@/assets/styles';
import {AntDesign, Ionicons, MaterialCommunityIcons} from '@expo/vector-icons';
import {useActivedColors, useAppDispatch, useAppSelector} from '@/hooks';
import SafeView from '@/components/Layout/SafeView';
import UButton from '@/components/UI/UButton';
import Header from '@/components/Layout/Header';
import ProjectItem from '@/components/Project/ProjectItem';
import {ProjectsStackScreenProps} from '@/types';
import ConfirmModal from '@/components/Modal/ConfirmModal';
import {useProject} from '@/hooks/useProject';
import {setProject} from '@/store/projects.slice';

const Projects = () => {
  const activedColors = useActivedColors();
  const navigation =
    useNavigation<ProjectsStackScreenProps<'Projects'>['navigation']>();
  const dispatch = useAppDispatch();

  const {deleteProject} = useProject();

  const {projects} = useAppSelector(state => state.projects);

  const [projectId, setProjectId] = useState('');
  const [activeDeleteProject, setActiveDeleteProject] = useState(false);

  const handleClickProjectItem = (projectId: string) => {
    if (projects) {
      const index = projects.findIndex(item => item.id == projectId);
      const project = index != -1 ? projects[index] : null;
      dispatch(setProject(project));
    }
    navigation.navigate('Tasks', {projectId});
  };

  const handleConfirmDelete = async () => {
    await deleteProject(projectId);
    setActiveDeleteProject(false);
  };

  return (
    <SafeView>
      <Header title="Your Projects">
        {{
          rightChild: (
            <MaterialCommunityIcons
              name="qrcode-scan"
              size={22}
              color={activedColors.text}
              onPress={() => {
                navigation.navigate('JoinTask');
              }}
            />
          ),
        }}
      </Header>
      <View style={{flex: 1, width: '100%'}}>
        <UButton
          style={[
            styles.searchButton,
            {backgroundColor: activedColors.border},
          ]}>
          <View style={{flexDirection: 'row'}}>
            <Ionicons name="search" size={22} color={activedColors.textSec} />
            <Text
              style={[
                common.text,
                {color: activedColors.textSec, marginLeft: 10},
              ]}>
              Search tasks...
            </Text>
          </View>
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
              project={item}
              onEdit={() => {
                navigation.navigate('CreateProject', {projectId: item.id});
              }}
              onDelete={() => {
                setProjectId(item.id);
                setActiveDeleteProject(true);
              }}
            />
          )}
        />
        <View />
      </View>
      <View style={{position: 'absolute'}}>
        <ConfirmModal
          visible={activeDeleteProject}
          title="Are you sure?"
          desc="Are you sure you want to delete this project?"
          comfirmText="Delete"
          onConfirm={handleConfirmDelete}
          onClose={() => {
            setActiveDeleteProject(false);
          }}
        />
      </View>
    </SafeView>
  );
};

export default Projects;

const styles = StyleSheet.create({
  searchButton: {
    borderRadius: 14,
    marginHorizontal: 16,
    marginVertical: 10,
    width: 'auto',
  },
  addProject: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginVertical: 10,
  },
});
