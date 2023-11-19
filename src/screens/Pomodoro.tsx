import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ToastAndroid,
  Platform,
} from 'react-native';
import * as Device from 'expo-device';
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
import {useTask} from '@/hooks/useTask';
import * as Notifications from 'expo-notifications';
import moment from 'moment';
import {useNotification} from '@/hooks/useNotification';
import ConfirmModal from '@/components/Modal/ConfirmModal';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const Pomodoro: React.FC = () => {
  const activedColors = useActivedColors();
  const navigation =
    useNavigation<AppStackScreenProps<'Pomodoro'>['navigation']>();
  const route = useRoute<AppStackScreenProps<'Pomodoro'>['route']>();

  const {user} = useAppSelector(state => state.user);

  const {updateTask} = useTask();
  const {scheduleNotification, cancelScheduledNotification} = useNotification();

  const [isPlaying, setIsPlaying] = useState(false);
  const [isLongBreak, setIsLongBreak] = useState(true);
  const [duration, setDuration] = useState(0);
  const [remainingTime, setRemainingTime] = useState(0);
  const [key, setKey] = useState(0);
  const [activeModalStop, setActiveModalStop] = useState(false);

  const [task, setTask] = useState<ITask | null>(null);

  useEffect(() => {
    if (route.params?.task) {
      setKey(Math.random());
      setTask(route.params?.task);
      setIsPlaying(false);
      setDuration(route.params.task.longBreak);
    }
  }, [route.params?.task]);

  const resetPomodoro = () => {
    setIsPlaying(false);
    setKey(Math.random());
    cancelScheduledNotification(isLongBreak ? 'longbreak' : 'shortbreak');
  };

  const playStopPomodoro = async () => {
    setIsPlaying(!isPlaying);
    if (!isPlaying && task) {
      const date = moment().add(remainingTime, 'seconds').toDate();

      if (isLongBreak) {
        await scheduleNotification(
          'longbreak',
          {
            title: '🎉 Pomodoro completed.',
            body: 'Pomodoro completed, take a short break!',
          },
          {
            channelId: 'timer',
            date,
          },
        );
      } else {
        await scheduleNotification(
          'shortbreak',
          {
            title: '☕ Breaktime is over.',
            body: "Breaktime is over, it's time to work!",
          },
          {
            channelId: 'timer',
            date,
          },
        );
      }
    } else {
      cancelScheduledNotification(isLongBreak ? 'longbreak' : 'shortbreak');
    }
  };

  const handleConfirmStop = () => {
    setIsPlaying(false);
    setTask(null);
    setKey(Math.random());
    cancelScheduledNotification(isLongBreak ? 'longbreak' : 'shortbreak');
    setActiveModalStop(false);
  };

  const chooseTask = () => {
    navigation.navigate('ProjectsStack', {screen: 'Projects'});
  };

  const onCompleteTimer = () => {
    if (task) {
      setIsPlaying(false);

      if (isLongBreak) {
        const isDone = task.pomodoroCount + 1 >= task.totalPomodoro;

        const newTask = {
          ...task,
          isDone,
          pomodoroCount: task.pomodoroCount + 1,
          completedBy: isDone ? user!.id : null,
          completedAt: isDone ? new Date().toISOString() : '',
        };

        setTask(newTask);
        updateTask(newTask.id, newTask);

        if (isDone) {
          ToastAndroid.show('Task is done!', ToastAndroid.SHORT);
        }

        setKey(Math.random());
        setDuration(task.shortBreak);
        setIsLongBreak(false);
      } else {
        setKey(Math.random());
        setDuration(task.longBreak);
        setIsLongBreak(true);
      }
    }
  };

  return (
    <SafeView>
      <Header title={'Pomodoro Timer'} />
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
            duration={duration}
            colors={activedColors.secondary as ColorFormat}
            trailColor={activedColors.backgroundSec as ColorFormat}
            onUpdate={setRemainingTime}
            onComplete={onCompleteTimer}>
            {({remainingTime}) => (
              <View style={{alignItems: 'center'}}>
                <Text
                  style={[
                    common.title,
                    {color: activedColors.text, fontWeight: EFontWeight.bold},
                  ]}>
                  {secondsFormat(task ? remainingTime : 0)}
                </Text>
                {isLongBreak && (
                  <Text style={[common.text, {color: activedColors.textSec}]}>
                    {task?.pomodoroCount || 0} of {task?.totalPomodoro || 0}{' '}
                    sessions
                  </Text>
                )}
              </View>
            )}
          </CountdownCircleTimer>
        </View>
        <Text style={[common.text, {color: activedColors.textSec}]}>
          {isLongBreak
            ? `Stay forcus for ${
                task ? (task?.longBreak / 60).toFixed(2) : 0
              } minutes`
            : `Take a break for ${
                task ? (task?.shortBreak / 60).toFixed(2) : 0
              } minutes`}
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
            onPress={() => {
              if (task) setActiveModalStop(true);
            }}
            activeOpacity={0.8}>
            <MaterialIcons name="stop" size={30} color={activedColors.text} />
          </TouchableOpacity>
        </View>
      </View>
      <View style={{position: 'absolute'}}>
        <ConfirmModal
          visible={activeModalStop}
          title="Are you sure?"
          desc="Are you sure you want to cancel this pomodoro?"
          comfirmText="Cancel"
          onConfirm={handleConfirmStop}
          onClose={() => {
            setActiveModalStop(false);
          }}
        />
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
