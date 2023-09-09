import React, {useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {useActivedColors} from '@/hooks';
import {common} from '@/assets/styles';
import UModal from './UModal';
import {Picker} from 'react-native-wheel-pick';
import {secondsFormatToHM} from '@/utils';
import UButton from '../UI/UButton';

interface IProps {
  visible: boolean;
  onClickOutside?: () => void;
  onClose: () => void;
  onSave: (pomodoros: number, pomodoroLength: number) => void;
}

const PomodoroPicker: React.FC<IProps> = ({
  visible,
  onClickOutside,
  onClose,
  onSave,
}) => {
  const activedColors = useActivedColors();

  const pomodoros = Array.from({length: 100}, (_, i) => `${i + 1}`);
  const pomodoroLength = Array.from({length: 200}, (_, i) => {
    return {label: `${i + 1}m`, value: i + 1};
  });

  const [selectedPomodoro, setSelectedPomodoro] = useState(1);
  const [selectedPomodoroLength, setSelectedPomodoroLength] = useState(1);

  return (
    <UModal visible={visible} onClickOutside={onClickOutside}>
      <View
        style={[
          common.shadow,
          {
            padding: 24,
            borderRadius: 16,
            backgroundColor: activedColors.input,
          },
        ]}>
        <View style={{alignItems: 'center', marginBottom: 20}}>
          <Text
            style={[
              common.text,
              {fontWeight: '700', marginBottom: 4, color: activedColors.text},
            ]}>
            Pomodoro
          </Text>
          <Text style={[common.text, {color: activedColors.text}]}>
            {`Estimate pomodoro time: ${selectedPomodoro} x ${selectedPomodoroLength}m = ${secondsFormatToHM(
              selectedPomodoro * selectedPomodoroLength * 60,
            )}`}
          </Text>
        </View>
        <View style={{flexDirection: 'row', gap: 20, alignItems: 'flex-start'}}>
          <View style={{flex: 1, justifyContent: 'center'}}>
            <View
              style={{
                borderRadius: 16,
                overflow: 'hidden',
              }}>
              <Picker
                style={{backgroundColor: 'white', height: 180}}
                selectedValue={selectedPomodoro}
                pickerData={pomodoros}
                onValueChange={(value: number) => setSelectedPomodoro(value)}
                textSize={16}
                selectTextColor={activedColors.secondary}
                isShowSelectBackground={false}
                isShowSelectLine={false}
              />
            </View>
            <Text
              style={[
                {textAlign: 'center', marginTop: 8, color: activedColors.text},
              ]}>
              Estimated amount of pomodoro
            </Text>
          </View>
          <View style={{flex: 1, justifyContent: 'center'}}>
            <View
              style={{
                borderRadius: 16,
                overflow: 'hidden',
              }}>
              <Picker
                style={{
                  backgroundColor: 'white',
                  height: 180,
                }}
                selectedValue={selectedPomodoroLength}
                pickerData={pomodoroLength}
                onValueChange={(value: number) =>
                  setSelectedPomodoroLength(value)
                }
                textSize={16}
                selectTextColor={activedColors.secondary}
                isShowSelectBackground={false}
                isShowSelectLine={false}
              />
            </View>
            <Text
              style={[
                {textAlign: 'center', marginTop: 8, color: activedColors.text},
              ]}>
              Duration of one pomodoro
            </Text>
          </View>
        </View>
        <View style={{flexDirection: 'row', gap: 20, marginTop: 20}}>
          <UButton style={{flex: 1, backgroundColor: '#fff'}} onPress={onClose}>
            <Text style={[common.text, {color: activedColors.error}]}>
              Cancel
            </Text>
          </UButton>
          <UButton
            primary
            style={{flex: 1}}
            onPress={() =>
              onSave(selectedPomodoro, selectedPomodoroLength * 60)
            }>
            <Text style={[common.text, {color: '#fff'}]}>Done</Text>
          </UButton>
        </View>
      </View>
    </UModal>
  );
};

export default PomodoroPicker;

const styles = StyleSheet.create({});
