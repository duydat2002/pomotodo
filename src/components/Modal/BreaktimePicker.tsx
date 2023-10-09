import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import UModal from './UModal';
import {common} from '@/assets/styles';
import {useActivedColors} from '@/hooks';
import {Picker} from 'react-native-wheel-pick';
import UButton from '../UI/UButton';

interface IProps {
  initShortBreak: number;
  onClickOutside?: () => void;
  onClose: () => void;
  onSave: (breakLength: number) => void;
}

const BreaktimePicker: React.FC<IProps> = ({
  initShortBreak,
  onClickOutside,
  onClose,
  onSave,
}) => {
  const activedColors = useActivedColors();

  const breakLengths = Array.from({length: 200}, (_, i) => {
    return {label: `${i + 1}m`, value: i + 1};
  });

  const [selectedBreakLength, setSelectedBreakLength] =
    useState(initShortBreak);

  useEffect(() => {
    setSelectedBreakLength(initShortBreak);
  }, [initShortBreak]);

  return (
    <UModal visible onClickOutside={onClickOutside}>
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
            Breaktime
          </Text>
          <Text style={[common.text, {color: activedColors.text}]}>
            Choose the amount of rest time
          </Text>
        </View>
        <View style={{}}>
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
              selectedValue={selectedBreakLength}
              pickerData={breakLengths}
              onValueChange={(value: number) => setSelectedBreakLength(value)}
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
            Duration of one breaktime
          </Text>
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
            onPress={() => onSave(selectedBreakLength * 60)}>
            <Text style={[common.text, {color: '#fff'}]}>Done</Text>
          </UButton>
        </View>
      </View>
    </UModal>
  );
};

export default BreaktimePicker;

const styles = StyleSheet.create({});
