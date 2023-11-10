import {common} from '@/assets/styles';
import {useActivedColors} from '@/hooks';
import {IProject} from '@/types';
import {secondsFormatToHM} from '@/utils';
import React from 'react';
import {
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewProps,
} from 'react-native';
import AssigneesList from './AssigneesList';

interface IProps {
  project: IProject;
  onPress: (projectId: string) => void;
  style?: StyleProp<ViewProps>;
}

const ProjectItemBox: React.FC<IProps> = ({project, onPress, style}) => {
  const activedColors = useActivedColors();

  const completeRate = (project.taskComplete / project.totalTask) * 100 || 0;

  return (
    <TouchableOpacity
      style={[
        styles.box,
        style,
        {backgroundColor: activedColors.backgroundLight},
      ]}
      onPress={() => onPress(project.id)}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <View style={[styles.color, {backgroundColor: project.color}]} />
        <Text
          style={[
            common.text,
            {flex: 1, fontWeight: '600', color: activedColors.text},
          ]}
          numberOfLines={1}>
          {project.name}
        </Text>
      </View>
      <Text
        style={[common.small, {marginTop: 5, color: activedColors.textSec}]}>
        Progress
      </Text>
      <View
        style={{flexDirection: 'row', alignItems: 'center', marginBottom: 5}}>
        <View style={styles.progressContainer}>
          <View
            style={{
              width: '100%',
              height: '100%',
              backgroundColor: activedColors.backgroundSec,
            }}
          />
          <View
            style={[
              styles.process,
              {
                backgroundColor: activedColors.primary,
                width: `${completeRate}%`,
              },
            ]}
          />
        </View>
        <Text style={[common.medium, {color: activedColors.textSec}]}>
          {completeRate.toFixed(2)}%
        </Text>
      </View>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
        }}>
        <AssigneesList assigneeIds={project.team} />
        <View style={{flexDirection: 'row'}}>
          <Text style={[common.small, {color: activedColors.textSec}]}>
            {secondsFormatToHM(project.totalTime)}
          </Text>
          <Text
            style={[
              common.small,
              {color: activedColors.textSec, marginLeft: 10},
            ]}>
            {project.totalTask}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ProjectItemBox;

const styles = StyleSheet.create({
  box: {
    width: '48%',
    padding: 16,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#f1f1f1',
  },
  color: {
    width: 16,
    height: 16,
    borderRadius: 16,
    marginRight: 8,
  },
  progressContainer: {
    flex: 1,
    height: 10,
    borderRadius: 10,
    overflow: 'hidden',
    marginRight: 8,
  },
  process: {
    position: 'absolute',
    left: 0,
    height: '100%',
    borderRadius: 10,
  },
});
