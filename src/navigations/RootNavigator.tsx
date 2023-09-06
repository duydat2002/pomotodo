import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {Appearance} from 'react-native';
import {getData, useAppDispatch, useAppSelector} from '@/hooks';
import {changeTheme} from '@/store/theme.slice';
import auth from '@react-native-firebase/auth';
import AuthNavigator from './AuthNavigator';
import AppNavigator from './AppNavigator';
import Splash from '@/screens/Splash';

const RootNavigator: React.FC = () => {
  const theme = useAppSelector(state => state.theme.theme);
  const dispatch = useAppDispatch();

  const [loadingSplash, setLoadingSplash] = useState(true);
  const [hasUser, setHasUser] = useState(false);

  const getThemeStorage = async () => {
    try {
      const themeStorage = await getData('theme');

      if (themeStorage) {
        dispatch(changeTheme(themeStorage));
      }
    } catch (error) {
      alert(error);
    }
  };

  useEffect(() => {
    getThemeStorage();
  }, []);

  useEffect(() => {
    if (theme.system) {
      Appearance.addChangeListener(({colorScheme}) => {
        console.log(colorScheme);
        dispatch(changeTheme({system: true, mode: colorScheme || 'light'}));
      });
    }
  }, [theme.system]);

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(user => {
      setHasUser(!!user);
      setLoadingSplash(false);
    });
    return subscriber;
  }, []);

  if (loadingSplash) {
    return <Splash />;
  }

  return (
    <NavigationContainer>
      {hasUser ? <AppNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};

export default RootNavigator;
