import React from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import {useActivedColors} from '@/hooks';
import {common} from '@/assets/styles';
import UModal from './UModal';
import UButton from '../UI/UButton';

interface IItemProps {
  key: string;
  value: any;
}

interface IProps {
  visible: boolean;
  title: string;
  selected: string;
  items: IItemProps[];
  onSelect: (key: string) => void;
  onClose: () => void;
}

const SelectRadioModal: React.FC<IProps> = ({
  visible,
  title,
  selected,
  items,
  onSelect,
  onClose,
}) => {
  const activedColors = useActivedColors();

  const Item: React.FC<{item: IItemProps}> = ({item}) => (
    <TouchableOpacity
      activeOpacity={0.8}
      style={[styles.item]}
      onPress={() => onSelect(item.key)}>
      <View
        style={[
          styles.box,
          {
            borderColor:
              item.key == selected
                ? activedColors.primary
                : activedColors.textSec,
          },
        ]}>
        <View
          style={[
            styles.innerBox,
            {
              backgroundColor:
                item.key == selected ? activedColors.primary : 'transparent',
            },
          ]}
        />
      </View>
      <Text style={[common.text, {color: activedColors.text}]}>
        {item.value}
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
          {title}
        </Text>
        <View style={{marginVertical: 20}}>
          {items.map(item => (
            <Item key={item.key} item={item} />
          ))}
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

export default SelectRadioModal;

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
