import React, {ReactNode} from 'react';
import {TouchableWithoutFeedback, Keyboard} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useActivedColors} from '@/hooks';

interface IProps {
  children: ReactNode;
  clickOutSide?: () => void;
}

const SafeView: React.FC<IProps> = ({children, clickOutSide}) => {
  const activedColors = useActivedColors();

  const press = () => {
    Keyboard.dismiss();
    if (clickOutSide) clickOutSide();
  };

  return (
    <TouchableWithoutFeedback onPress={press}>
      <SafeAreaView
        style={{
          flex: 1,
          alignItems: 'center',
          backgroundColor: activedColors.background,
        }}>
        {children}
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default SafeView;
