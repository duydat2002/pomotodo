import React from 'react';
import {store} from '@/store';
import {Provider} from 'react-redux';
import RootNavigator from '@/navigations/RootNavigator';

const App = () => {
  return (
    <Provider store={store}>
      <RootNavigator />
    </Provider>
  );
};

export default App;
