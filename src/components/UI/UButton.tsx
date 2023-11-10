import React, {ReactNode} from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
  View,
  StyleProp,
  ActivityIndicator,
} from 'react-native';
import {useActivedColors} from '@/hooks';

interface IProps {
  style?: StyleProp<ViewStyle>;
  children?: ReactNode;
  onPress?: () => void;
  primary?: boolean;
  secondary?: boolean;
  disabled?: boolean;
  loading?: boolean;
  loadingColor?: string;
  backgroundColor?: string;
}

const UButton: React.FC<IProps> = ({
  style,
  children,
  onPress,
  primary,
  secondary,
  disabled,
  loading = false,
  loadingColor,
  backgroundColor = '#fff',
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
      style={buttonStyles}
      onPress={onPress}
      activeOpacity={0.6}
      disabled={disabled || loading}>
      {loading && (
        <ActivityIndicator
          style={styles.loading}
          size={30}
          color={loadingColor || '#fff'}
        />
      )}

      <View style={[{opacity: loading ? 0 : 1}]}>{children}</View>
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
  loading: {
    position: 'absolute',
  },
});
