import React, {ReactNode} from 'react';
import {store} from '@/store';
import {Provider} from 'react-redux';
import RootNavigator from '@/navigations/RootNavigator';
import {
  Keyboard,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
} from 'react-native';

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
        <KeyboardAvoidingView
          style={{flex: 1}}
          behavior="height"
          enabled={false}>
          <RootNavigator />
        </KeyboardAvoidingView>
      </DismissKeyboard>
    </Provider>
  );
};

export default App;
