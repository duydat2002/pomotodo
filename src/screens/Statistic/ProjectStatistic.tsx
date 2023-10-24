import {StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import {common} from '@/assets/styles';
import {useActivedColors} from '@/hooks';
import ProjectChart from '@/components/Statistic/ProjectChart';
import SelectProjectModal from '@/components/Modal/SelectProjectModal';
import {IProject} from '@/types';
import {TouchableOpacity} from 'react-native-gesture-handler';

const ProjectStatistic = () => {
  const activedColors = useActivedColors();

  const [activeSelectProject, setActiveSelectProject] = useState(false);
  const [project, setProject] = useState<IProject | null>(null);

  const onChooseProject = (project: IProject) => {
    setProject(project);

    setActiveSelectProject(false);
  };

  return (
    <View
      style={{
        flex: 1,
        paddingHorizontal: 16,
      }}>
      <View style={[styles.card, {backgroundColor: activedColors.background}]}>
        <Text
          style={[
            common.text,
            styles.projectSelect,
            {
              borderBottomColor: activedColors.backgroundSec,
              color: activedColors.text,
            },
          ]}>
          Project
        </Text>
        <TouchableOpacity
          activeOpacity={0.7}
          style={{
            marginHorizontal: 16,
            padding: 10,
            borderRadius: 10,
            backgroundColor: activedColors.input,
          }}
          onPress={() => setActiveSelectProject(true)}>
          <Text style={[common.text, {color: activedColors.text}]}>
            {project ? project.name : 'Choose project'}
          </Text>
        </TouchableOpacity>
        <View style={{width: '100%', alignItems: 'center'}}>
          <ProjectChart project={project} />
        </View>
      </View>
      <View style={{position: 'absolute'}}>
        {activeSelectProject && (
          <SelectProjectModal
            onChooseProject={onChooseProject}
            onClickOutside={() => setActiveSelectProject(false)}
          />
        )}
      </View>
    </View>
  );
};

export default ProjectStatistic;

const styles = StyleSheet.create({
  card: {
    marginTop: 20,
    borderRadius: 10,
    paddingVertical: 16,
  },
  projectSelect: {
    fontWeight: '600',
    marginHorizontal: 16,
    paddingBottom: 10,
    marginBottom: 10,
    borderBottomWidth: 2,
  },
});
