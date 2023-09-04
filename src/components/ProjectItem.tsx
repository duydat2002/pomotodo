import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {useActivedColors} from '@/hooks';
import {common} from '@/assets/styles';
import {secondsFormatToHM} from '@/utils';

interface IProps {
  color?: string;
  name: string;
  totalTime: number;
  totalTask: number;
}

const ProjectItem: React.FC<IProps> = ({color, name, totalTask, totalTime}) => {
  const activedColors = useActivedColors();

  return (
    <View style={styles.item}>
      <View style={[styles.color, {backgroundColor: color}]} />
      <Text style={[common.text, {color: activedColors.text, flex: 1}]}>
        {name}
      </Text>
      <Text style={[common.small, {color: activedColors.textSec}]}>
        {secondsFormatToHM(totalTime)}
      </Text>
      <Text
        style={[common.small, {color: activedColors.textSec, marginLeft: 10}]}>
        {totalTask}
      </Text>
    </View>
  );
};

export default ProjectItem;

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 50,
  },
  color: {
    width: 16,
    height: 16,
    borderRadius: 16,
    marginRight: 8,
  },
});
