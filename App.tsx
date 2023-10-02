import React from 'react';
import {store} from '@/store';
import {Provider} from 'react-redux';
import RootNavigator from '@/navigations/RootNavigator';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

const App = () => {
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <Provider store={store}>
        <RootNavigator />
      </Provider>
    </GestureHandlerRootView>
  );
};

export default App;
