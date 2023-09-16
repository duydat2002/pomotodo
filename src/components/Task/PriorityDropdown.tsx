import React, {useState} from 'react';
import {
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {PRIORITY_COLORS} from '@/constants';
import {common} from '@/assets/styles';
import {useActivedColors} from '@/hooks';
import {IPriority} from '@/types';
import UDropdown from '../UI/UDropdown';

interface IProps {
  activePriority: boolean;
  setActivePriority: (value: boolean) => void;
  priority: IPriority;
  setPriority: (value: IPriority) => void;
  style?: StyleProp<ViewStyle>;
}

const PriorityDropdown: React.FC<IProps> = ({
  activePriority,
  setActivePriority,
  priority,
  setPriority,
  style,
}) => {
  const activedColors = useActivedColors();

  const prioritys: IPriority[] = ['high', 'medium', 'low', 'none'];

  return (
    <UDropdown
      active={activePriority}
      style={[{right: 0, zIndex: 1000}, style]}>
      {{
        header: (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setActivePriority(!activePriority)}>
            <Ionicons
              name="flag"
              size={24}
              color={PRIORITY_COLORS[priority].default}
            />
          </TouchableOpacity>
        ),
        dropdown: (
          <View
            style={[
              common.shadow,
              {
                width: 200,
                backgroundColor: activedColors.modal,
                alignItems: 'center',
                borderRadius: 8,
              },
            ]}>
            {prioritys.map(level => (
              <TouchableOpacity
                key={level}
                activeOpacity={0.7}
                onPress={() => setPriority(level)}
                style={{
                  flexDirection: 'row',
                  width: '100%',
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                }}>
                <Ionicons
                  name="flag"
                  size={24}
                  color={PRIORITY_COLORS[level].default}
                />
                <Text
                  numberOfLines={1}
                  style={[
                    common.text,
                    {
                      color: PRIORITY_COLORS[level].default,
                      textTransform: 'capitalize',
                      marginLeft: 10,
                    },
                  ]}>
                  {level} Priority
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        ),
      }}
    </UDropdown>
  );
};

export default PriorityDropdown;

const styles = StyleSheet.create({});
