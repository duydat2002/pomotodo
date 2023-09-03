import React, {useState} from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import {useActivedColors} from '@/hooks';
import {FontAwesome, MaterialIcons} from '@expo/vector-icons';
import {common} from '@/assets/styles';
import {ITask} from '@/types';
import {
  ColorFormat,
  CountdownCircleTimer,
} from 'react-native-countdown-circle-timer';
import {EFontWeight} from '@/theme';
import {secondsFormat} from '@/utils';
import Header from '@/components/Header';
import SafeView from '@/components/SafeView';

const Pomodoro: React.FC = () => {
  const activedColors = useActivedColors();

  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(1500);
  const [key, setKey] = useState(0);

  let task: ITask = {
    id: 'string',
    projectId: 'string',
    name: 'Test name task',
    priority: 'none',
    isDone: false,
    totalPomodoro: 6,
    pomodoroCount: 3,
    longBreak: 1200,
    shortBreak: 300,
  };

  const resetPomodoro = () => {
    setIsPlaying(false);
    setKey(Math.random());
  };

  const playStopPomodoro = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <SafeView>
      <Header title={'Pomodoro Timer'}>
        {{
          rightChild: (
            <FontAwesome
              name="plus"
              size={20}
              style={{color: activedColors.text, padding: 8}}
            />
          ),
        }}
      </Header>
      <View style={[common.container, {justifyContent: 'space-around'}]}>
        <View style={{width: '100%', alignItems: 'center'}}>
          <Text style={[common.text, {color: activedColors.textSec}]}>
            CURRENT TASK
          </Text>
          <Text
            style={[
              common.subTitle,
              {color: activedColors.text, fontWeight: EFontWeight.bold},
            ]}>
            {task.name}
          </Text>
        </View>
        <View style={{width: '100%', alignItems: 'center'}}>
          {}
          <CountdownCircleTimer
            key={key}
            isPlaying={isPlaying}
            isGrowing
            rotation={'counterclockwise'}
            strokeWidth={16}
            size={280}
            duration={duration}
            colors={activedColors.secondary as ColorFormat}
            trailColor={activedColors.backgroundSec as ColorFormat}>
            {({remainingTime}) => (
              <View style={{alignItems: 'center'}}>
                <Text
                  style={[
                    common.title,
                    {color: activedColors.text, fontWeight: EFontWeight.bold},
                  ]}>
                  {secondsFormat(remainingTime)}
                </Text>
                <Text style={[common.text, {color: activedColors.textSec}]}>
                  {task.pomodoroCount} of {task.totalPomodoro} sessions
                </Text>
              </View>
            )}
          </CountdownCircleTimer>
        </View>
        <Text style={[common.text, {color: activedColors.textSec}]}>
          Stay forcus for 25 minutes
        </Text>
        <View style={styles.buttons}>
          <TouchableOpacity
            style={[
              styles.secondaryButton,
              {
                backgroundColor: activedColors.backgroundSec,
              },
            ]}
            activeOpacity={0.8}
            onPress={resetPomodoro}>
            <MaterialIcons name="replay" size={30} color={activedColors.text} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.primaryButton,
              {
                backgroundColor: activedColors.primary,
              },
            ]}
            activeOpacity={0.8}
            onPress={playStopPomodoro}>
            <MaterialIcons
              name={isPlaying ? 'pause' : 'play-arrow'}
              size={40}
              color="#fff"
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.secondaryButton,
              {
                backgroundColor: activedColors.backgroundSec,
              },
            ]}
            activeOpacity={0.8}>
            <MaterialIcons name="stop" size={30} color={activedColors.text} />
          </TouchableOpacity>
        </View>
      </View>
    </SafeView>
  );
};

export default Pomodoro;

const styles = StyleSheet.create({
  content: {},
  buttons: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
  },
  secondaryButton: {
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 60,
  },
  primaryButton: {
    width: 80,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 80,
    marginHorizontal: 20,
  },
});
