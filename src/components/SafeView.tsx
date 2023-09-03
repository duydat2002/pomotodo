import React, {ReactNode} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useActivedColors} from '@/hooks';

interface IProps {
  children: ReactNode;
}

const SafeView: React.FC<IProps> = ({children}) => {
  const activedColors = useActivedColors();
  return (
    <SafeAreaView
      style={{
        flex: 1,
        alignItems: 'center',
        backgroundColor: activedColors.background,
      }}>
      {children}
    </SafeAreaView>
  );
};

export default SafeView;
