import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import {useActivedColors, useAppSelector} from '@/hooks';
import {FontAwesome, MaterialIcons} from '@expo/vector-icons';
import {common} from '@/assets/styles';
import {ITask} from '@/types';
import {
  ColorFormat,
  CountdownCircleTimer,
} from 'react-native-countdown-circle-timer';
import {EFontWeight} from '@/theme';
import {secondsFormat} from '@/utils';
import {useNavigation, useRoute} from '@react-navigation/native';
import {AppStackScreenProps} from '@/types';
import Header from '@/components/Layout/Header';
import SafeView from '@/components/Layout/SafeView';

const Pomodoro: React.FC = () => {
  const activedColors = useActivedColors();
  const navigation =
    useNavigation<AppStackScreenProps<'Pomodoro'>['navigation']>();
  const route = useRoute<AppStackScreenProps<'Pomodoro'>['route']>();

  const {tasks} = useAppSelector(state => state.projects);

  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(1500);
  const [key, setKey] = useState(0);

  const [task, setTask] = useState<ITask | null>(null);

  useEffect(() => {
    if (route.params?.taskId) {
      const taskTemp = tasks?.filter(item => item.id === route.params.taskId);
      setTask(!taskTemp ? null : taskTemp[0]);
      setKey(Math.random());
    }
  }, [route.params?.taskId]);

  const resetPomodoro = () => {
    setIsPlaying(false);
    setKey(Math.random());
  };

  const playStopPomodoro = () => {
    setIsPlaying(!isPlaying);
  };

  const cancelTask = () => {
    setTask(null);
    setKey(Math.random());
  };

  const chooseTask = () => {
    navigation.navigate('ProjectsStack', {screen: 'Projects'});
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
          {task ? (
            <>
              <Text style={[common.text, {color: activedColors.textSec}]}>
                CURRENT TASK
              </Text>
              <Text
                style={[
                  common.subTitle,
                  {color: activedColors.text, fontWeight: EFontWeight.bold},
                ]}>
                {task?.name}
              </Text>
            </>
          ) : (
            <>
              <Text style={[common.text, {color: activedColors.textSec}]}>
                NO TASK
              </Text>
              <Text
                style={[
                  common.subTitle,
                  {color: activedColors.text, fontWeight: EFontWeight.bold},
                ]}
                onPress={chooseTask}>
                Click to start a task
              </Text>
            </>
          )}
        </View>
        <View style={{width: '100%', alignItems: 'center'}}>
          <CountdownCircleTimer
            key={key}
            isPlaying={isPlaying}
            isGrowing
            rotation={'counterclockwise'}
            strokeWidth={16}
            size={280}
            duration={task?.longBreak || 0}
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
                  {task?.pomodoroCount || 0} of {task?.totalPomodoro || 0}{' '}
                  sessions
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
              {backgroundColor: activedColors.backgroundSec},
            ]}
            onPress={cancelTask}
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
