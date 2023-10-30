import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import UModal from './UModal';
import {common} from '@/assets/styles';
import {useActivedColors} from '@/hooks';
import UButton from '../UI/UButton';

interface IThemeItemProps {
  themeValue: 'dark' | 'light' | 'system';
}

interface IProps {
  visible: boolean;
  theme: 'dark' | 'light' | 'system';
  onSelect: (theme: 'dark' | 'light' | 'system') => void;
  onClose: () => void;
}

const SelectThemeModal: React.FC<IProps> = ({
  visible,
  theme,
  onSelect,
  onClose,
}) => {
  const activedColors = useActivedColors();

  const ThemeItem: React.FC<IThemeItemProps> = ({themeValue}) => (
    <TouchableOpacity
      activeOpacity={0.8}
      style={[styles.item]}
      onPress={() => onSelect(themeValue)}>
      <View
        style={[
          styles.box,
          {
            borderColor:
              themeValue == theme
                ? activedColors.primary
                : activedColors.textSec,
          },
        ]}>
        <View
          style={[
            styles.innerBox,
            {
              backgroundColor:
                themeValue == theme ? activedColors.primary : 'transparent',
            },
          ]}
        />
      </View>
      <Text style={[common.text, {color: activedColors.text}]}>
        {themeValue}
      </Text>
    </TouchableOpacity>
  );

  return (
    <UModal isMiddle visible={visible} onClickOutside={onClose}>
      <View
        style={[
          common.shadow,
          {
            padding: 24,
            borderRadius: 16,
            backgroundColor: activedColors.input,
          },
        ]}>
        <Text style={[common.subTitle, {color: activedColors.text}]}>
          Select theme
        </Text>
        <View style={{marginVertical: 20}}>
          <ThemeItem themeValue="light" />
          <ThemeItem themeValue="dark" />
          <ThemeItem themeValue="system" />
        </View>
        <View style={{flexDirection: 'row', alignSelf: 'flex-end', gap: 20}}>
          <UButton style={{flex: 1, backgroundColor: '#fff'}} onPress={onClose}>
            <Text style={[common.text, {color: activedColors.error}]}>
              Cancel
            </Text>
          </UButton>
        </View>
      </View>
    </UModal>
  );
};

export default SelectThemeModal;

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    gap: 20,
    paddingVertical: 10,
  },
  box: {
    width: 22,
    height: 22,
    borderRadius: 22,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerBox: {
    width: '80%',
    height: '80%',
    borderRadius: 20,
  },
});
