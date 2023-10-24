import {
  FlatList,
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
} from 'react-native';
import React from 'react';
import UModal from './UModal';
import {common} from '@/assets/styles';
import {useActivedColors, useAppSelector} from '@/hooks';
import {IProject} from '@/types';

interface IProps {
  onChooseProject: (project: IProject) => void;
  onClickOutside: () => void;
}

const SelectProjectModal: React.FC<IProps> = ({
  onChooseProject,
  onClickOutside,
}) => {
  const activedColors = useActivedColors();

  const {projects} = useAppSelector(state => state.projects);

  return (
    <UModal isMiddle visible onClickOutside={onClickOutside}>
      <View
        style={[
          common.shadow,
          {
            paddingVertical: 24,
            borderRadius: 16,
            backgroundColor: activedColors.input,
          },
        ]}>
        <Text
          style={[
            common.text,
            {paddingHorizontal: 24, color: activedColors.text},
          ]}>
          Select a project
        </Text>
        <FlatList
          keyExtractor={item => item.id}
          data={projects}
          renderItem={project => (
            <TouchableHighlight
              underlayColor={activedColors.backgroundSec}
              onPress={() => onChooseProject(project.item)}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingVertical: 10,
                  paddingHorizontal: 24,
                }}>
                <View
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: 20,
                    marginRight: 15,
                    backgroundColor: project.item.color,
                  }}
                />
                <Text style={[common.text, {color: activedColors.text}]}>
                  {project.item.name}
                </Text>
              </View>
            </TouchableHighlight>
          )}
        />
      </View>
    </UModal>
  );
};

export default SelectProjectModal;

const styles = StyleSheet.create({});
