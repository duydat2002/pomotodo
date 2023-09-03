import React, {ReactNode} from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  StyleProp,
  ViewStyle,
  KeyboardTypeOptions,
} from 'react-native';
import {useActivedColors} from '@/hooks';
import {common} from '@/assets/styles';

interface IProps {
  style?: StyleProp<ViewStyle>;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  keyboardType?: KeyboardTypeOptions;
  secureTextEntry?: boolean;
  children?: {
    leftChild?: ReactNode;
    rightChild?: ReactNode;
  };
}

const UInput: React.FC<IProps> = ({
  style,
  value,
  onChangeText,
  children,
  placeholder,
  keyboardType,
  secureTextEntry,
}) => {
  const activedColors = useActivedColors();

  return (
    <View
      style={[
        style,
        styles.wrapper,
        {backgroundColor: activedColors.backgroundSec},
      ]}>
      {children?.leftChild}
      <TextInput
        style={[
          styles.input,
          common.text,
          {
            color: activedColors.text,
          },
        ]}
        secureTextEntry={secureTextEntry}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={activedColors.texSec}
        keyboardType={keyboardType}
      />
      {children?.rightChild}
    </View>
  );
};

export default UInput;

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 16,
  },
  input: {
    flex: 1,
    lineHeight: 24,
  },
});
