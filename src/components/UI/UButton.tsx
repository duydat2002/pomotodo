import React, {ReactNode} from 'react';
import {StyleSheet, TouchableOpacity, ViewStyle, StyleProp} from 'react-native';
import {useActivedColors} from '@/hooks';

interface IProps {
  style?: StyleProp<ViewStyle>;
  children?: ReactNode;
  onPress?: () => void;
  primary?: boolean;
  secondary?: boolean;
  disabled?: boolean;
}

const UButton: React.FC<IProps> = ({
  style,
  children,
  onPress,
  primary,
  secondary,
  disabled,
}) => {
  const activedColors = useActivedColors();

  const buttonStyles = [
    styles.button,
    primary && {
      backgroundColor: activedColors.primary,
    },
    secondary && {
      backgroundColor: activedColors.buttonSec,
    },
    style,
  ];

  return (
    <TouchableOpacity
      onPress={onPress}
      style={buttonStyles}
      activeOpacity={0.6}
      disabled={disabled}>
      {children}
    </TouchableOpacity>
  );
};

export default UButton;

const styles = StyleSheet.create({
  button: {
    padding: 12,
    borderRadius: 16,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
