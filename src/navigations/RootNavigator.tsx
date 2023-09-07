import React, {useEffect, useState, useCallback} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {Appearance} from 'react-native';
import {getData, useAppDispatch, useAppSelector, useProject} from '@/hooks';
import {changeTheme} from '@/store/theme.slice';
import auth from '@react-native-firebase/auth';
import {setProjects} from '@/store/projects.slice';
import NetInfo from '@react-native-community/netinfo';
import AuthNavigator from './AuthNavigator';
import AppNavigator from './AppNavigator';
import Splash from '@/screens/Splash';
import {setUser} from '@/store/user.slice';
import {getConnection} from '@/utils';

const RootNavigator: React.FC = () => {
  const theme = useAppSelector(state => state.theme.theme);
  const {user} = useAppSelector(state => state.user);
  const dispatch = useAppDispatch();

  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingData, setLoadingData] = useState(true);
  const [isOnline, setIsOnline] = useState(false);

  // Theme
  const getThemeStorage = useCallback(async () => {
    try {
      const themeStorage = await getData('theme');

      if (themeStorage) {
        dispatch(changeTheme(themeStorage));
      }
    } catch (error) {
      alert(error);
    }
  }, []);

  useEffect(() => {
    if (theme.system) {
      Appearance.addChangeListener(({colorScheme}) => {
        console.log(colorScheme);
        dispatch(changeTheme({system: true, mode: colorScheme || 'light'}));
      });
    }
  }, [theme.system]);

  // Net info
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(async state => {
      // console.log('state', state);
      setIsOnline(state.isConnected!);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // User
  // useEffect(() => {
  //   const subscriber = auth().onAuthStateChanged(user => {
  //     setHasUser(!!user);

  //     // setLoadingSplash(false);
  //   });
  //   return subscriber;
  // }, []);

  // Datas
  const initUser = useCallback(async () => {
    const userTemp = await getData('user');

    dispatch(setUser(userTemp));
    setLoadingUser(false);
  }, []);

  const getProjectsFB = useCallback(async () => {
    const {getProjects} = useProject();

    let projectsTemp = null;

    const isOnline = await getConnection();

    console.log(isOnline ? 'online' : 'offline');
    if (isOnline && auth().currentUser) {
      console.log('firebase');
      projectsTemp = await getProjects(auth().currentUser!.uid);
    } else {
      console.log('local');
      projectsTemp = await getData('projects');
    }
    dispatch(setProjects(projectsTemp));
    setLoadingData(false);
  }, []);

  useEffect(() => {
    getThemeStorage();
    initUser();
  }, []);

  // Get Data when user change
  useEffect(() => {
    if (user) getProjectsFB();
  }, [user]);

  if (loadingUser && loadingData) {
    return <Splash />;
  }

  return (
    <NavigationContainer>
      {user ? <AppNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};

export default RootNavigator;
