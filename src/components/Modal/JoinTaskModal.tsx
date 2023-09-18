import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import UModal from './UModal';
import {common} from '@/assets/styles';
import {useActivedColors} from '@/hooks';
import UButton from '../UI/UButton';
import {IQR} from '@/types';

interface IProps {
  visible: boolean;
  value: IQR | null;
  onJoin: () => void;
  onClickOutside?: () => void;
  onClose: () => void;
}

const JoinTaskModal: React.FC<IProps> = ({
  visible,
  value,
  onJoin,
  onClickOutside,
  onClose,
}) => {
  const activedColors = useActivedColors();

  if (!value) {
    return null;
  }

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
            Do you want to participate in this project?
          </Text>
          <View style={{width: '100%', marginTop: 20}}>
            <Text
              style={[
                common.text,
                {textAlign: 'left', color: activedColors.text},
              ]}>
              Project: {value.project.name}
            </Text>
            <Text
              style={[
                common.text,
                {textAlign: 'left', color: activedColors.text},
              ]}>
              Task: {value.task.name}
            </Text>
            <Text
              style={[
                common.text,
                {textAlign: 'left', color: activedColors.text},
              ]}>
              Owner: {value.owner.username}
            </Text>
          </View>
        </View>
        <View style={{flexDirection: 'row', gap: 20, marginTop: 20}}>
          <UButton style={{flex: 1, backgroundColor: '#fff'}} onPress={onClose}>
            <Text style={[common.text, {color: activedColors.error}]}>
              Cancel
            </Text>
          </UButton>
          <UButton primary style={{flex: 1}} onPress={onJoin}>
            <Text style={[common.text, {color: '#fff'}]}>Join</Text>
          </UButton>
        </View>
      </View>
    </UModal>
  );
};

export default JoinTaskModal;

const styles = StyleSheet.create({});
