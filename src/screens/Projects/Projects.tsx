import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, View, FlatList, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {common} from '@/assets/styles';
import {AntDesign, Ionicons, MaterialCommunityIcons} from '@expo/vector-icons';
import {useActivedColors, useAppDispatch, useAppSelector} from '@/hooks';
import SafeView from '@/components/Layout/SafeView';
import UButton from '@/components/UI/UButton';
import Header from '@/components/Layout/Header';
import ProjectItem from '@/components/Project/ProjectItem';
import {IProject, ProjectsStackScreenProps} from '@/types';
import ConfirmModal from '@/components/Modal/ConfirmModal';
import {useProject} from '@/hooks/useProject';
import {setProject} from '@/store/projects.slice';
import SelectRadioModal from '@/components/Modal/SelectRadioModal';
import UInput from '@/components/UI/UInput';

const Projects = () => {
  const activedColors = useActivedColors();
  const navigation =
    useNavigation<ProjectsStackScreenProps<'Projects'>['navigation']>();
  const dispatch = useAppDispatch();

  const {deleteProject} = useProject();

  const {projects} = useAppSelector(state => state.projects);

  const [projectsShow, setProjectsShow] = useState(projects);
  const [projectId, setProjectId] = useState('');
  const [searchInput, setSearchInput] = useState('');

  const [activeDeleteProject, setActiveDeleteProject] = useState(false);
  const [activeSort, setActiveSort] = useState(false);
  const [sortType, setSortType] = useState('name-asc');

  const sortItems = [
    {key: 'name-asc', value: 'Alphabetically ASC'},
    {key: 'name-desc', value: 'Alphabetically DESC'},
    {key: 'time-asc', value: 'Latest'},
    {key: 'time-desc', value: 'Oldest'},
  ];

  useEffect(() => {
    let projectsTemp = projects?.slice() || null;

    projectsTemp =
      projectsTemp?.filter(item =>
        item.name.toLocaleLowerCase().includes(searchInput.toLocaleLowerCase()),
      ) || null;

    switch (sortType) {
      case 'time-asc':
        projectsTemp?.sort(
          (p1, p2) => Date.parse(p1.createdAt) - Date.parse(p2.createdAt),
        );
        break;
      case 'time-desc':
        projectsTemp?.sort(
          (p1, p2) => Date.parse(p2.createdAt) - Date.parse(p1.createdAt),
        );
        break;
      case 'name-asc':
        projectsTemp?.sort((p1, p2) => p1.name.localeCompare(p2.name));
        break;
      case 'name-desc':
        projectsTemp?.sort((p1, p2) => p2.name.localeCompare(p1.name));
        break;
    }

    setProjectsShow(projectsTemp);
    setActiveSort(false);
  }, [sortType, searchInput]);

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

  const handleSelectSort = (selected: string) => {
    setSortType(selected);
  };

  return (
    <SafeView>
      <Header title="Your Projects">
        {{
          rightChild: (
            <AntDesign
              name="swap"
              size={24}
              color={activedColors.text}
              style={{transform: [{rotateZ: '90deg'}]}}
              onPress={() => setActiveSort(true)}
            />
          ),
        }}
      </Header>
      <View style={{flex: 1, width: '100%'}}>
        <UInput
          style={[styles.searchButton]}
          value={searchInput}
          onChangeText={setSearchInput}
          placeholder="Search project...">
          {{
            leftChild: (
              <Ionicons
                name="search"
                size={22}
                color={activedColors.textSec}
                style={{marginRight: 8}}
              />
            ),
            rightChild: searchInput != '' && (
              <Text
                style={[common.text, {color: activedColors.error}]}
                onPress={() => setSearchInput('')}>
                Cancel
              </Text>
            ),
          }}
        </UInput>
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
          data={projectsShow}
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
        <SelectRadioModal
          visible={activeSort}
          title="Sort by"
          selected={sortType}
          items={sortItems}
          onSelect={handleSelectSort}
          onClose={() => setActiveSort(false)}
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
