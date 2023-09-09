import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {useActivedColors} from '@/hooks';
import {secondsToHM} from '@/utils';

interface INumberItemProps {
  label?: string;
  number: number;
}

const NumberItem: React.FC<INumberItemProps> = ({label = '', number}) => {
  const activedColors = useActivedColors();

  return (
    <View style={{alignItems: 'center'}}>
      <Text style={{fontSize: 9, color: activedColors.textSec}}>{label}</Text>
      <Text
        style={[
          {
            color: activedColors.secondary,
            fontSize: 24,
            fontWeight: '700',
            lineHeight: 26,
          },
        ]}>
        {number < 10 ? '0' + number : number}
      </Text>
    </View>
  );
};

interface IProps {
  title: string;
  time?: number;
  number?: number;
}

const ProjectInfoCard: React.FC<IProps> = ({title, time, number = 0}) => {
  const activedColors = useActivedColors();

  const {hours, minutes} = secondsToHM(time || 0);

  return (
    <View
      style={{justifyContent: 'center', alignItems: 'center', width: '23%'}}>
      <View style={styles.timeWraper}>
        {time != null ? (
          <>
            <NumberItem label="HH" number={hours} />
            <Text
              style={[
                {
                  color: activedColors.secondary,
                  fontSize: 20,
                  fontWeight: '700',
                },
              ]}>
              :
            </Text>
            <NumberItem label="MM" number={minutes} />
          </>
        ) : (
          <NumberItem number={number} />
        )}
      </View>
      <Text style={[styles.title, {color: activedColors.textSec}]}>
        {title}
      </Text>
    </View>
  );
};

export default ProjectInfoCard;

const styles = StyleSheet.create({
  timeWraper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  title: {
    height: 25,
    fontSize: 11,
    lineHeight: 11,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
});
