import React, {ReactNode, useEffect} from 'react';
import {store} from '@/store';
import {Provider} from 'react-redux';
import RootNavigator from '@/navigations/RootNavigator';
import {Keyboard, TouchableWithoutFeedback} from 'react-native';

interface IChildrenProp {
  children: ReactNode;
}

const DismissKeyboard: React.FC<IChildrenProp> = ({children}) => {
  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      {children}
    </TouchableWithoutFeedback>
  );
};

const App = () => {
  return (
    <Provider store={store}>
      <DismissKeyboard>
        <RootNavigator />
      </DismissKeyboard>
    </Provider>
  );
};

export default App;
