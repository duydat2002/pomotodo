import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import UModal from './UModal';
import {common} from '@/assets/styles';
import {useActivedColors} from '@/hooks';
import UButton from '../UI/UButton';

interface IProps {
  visible: boolean;
  title: string;
  desc: string;
  comfirmText: string;
  onConfirm: () => void;
  onClickOutside?: () => void;
  onClose: () => void;
}

const ConfirmModal: React.FC<IProps> = ({
  visible,
  title,
  desc,
  comfirmText,
  onConfirm,
  onClickOutside,
  onClose,
}) => {
  const activedColors = useActivedColors();

  return (
    <UModal
      isMiddle
      visible={visible}
      onClickOutside={onClose || onClickOutside}>
      <View
        style={[
          common.shadow,
          {
            padding: 24,
            borderRadius: 16,
            backgroundColor: activedColors.input,
          },
        ]}>
        <Text style={[common.subTitle, {marginBottom: 10}]}>{title}</Text>
        <Text style={[common.text, {marginBottom: 20}]}>{desc}</Text>
        <View style={{flexDirection: 'row', alignSelf: 'flex-end', gap: 20}}>
          <UButton style={{flex: 1, backgroundColor: '#fff'}} onPress={onClose}>
            <Text style={[common.text, {color: activedColors.error}]}>
              Cancel
            </Text>
          </UButton>
          <UButton
            primary
            style={{flex: 1, backgroundColor: activedColors.error}}
            onPress={onConfirm}>
            <Text style={[common.text, {color: '#fff'}]}>{comfirmText}</Text>
          </UButton>
        </View>
      </View>
    </UModal>
  );
};

export default ConfirmModal;

const styles = StyleSheet.create({});
