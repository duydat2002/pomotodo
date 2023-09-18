import React, {ReactNode} from 'react';
import {
  TouchableWithoutFeedback,
  Keyboard,
  ViewStyle,
  StyleProp,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useActivedColors} from '@/hooks';

interface IProps {
  style?: StyleProp<ViewStyle>;
  children: ReactNode;
  clickOutSide?: () => void;
}

const SafeView: React.FC<IProps> = ({children, clickOutSide, style}) => {
  const activedColors = useActivedColors();

  const press = () => {
    Keyboard.dismiss();
    if (clickOutSide) clickOutSide();
  };

  return (
    <TouchableWithoutFeedback onPress={press}>
      <SafeAreaView
        style={[
          {
            flex: 1,
            alignItems: 'center',
            backgroundColor: activedColors.background,
          },
          style,
        ]}>
        {children}
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default SafeView;
