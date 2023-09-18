import React, {useEffect, useState, useCallback} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {Appearance} from 'react-native';
import {getData, useAppDispatch, useAppSelector} from '@/hooks';
import {changeTheme} from '@/store/theme.slice';
import auth from '@react-native-firebase/auth';
import {setProjects} from '@/store/projects.slice';
import NetInfo from '@react-native-community/netinfo';
import AuthNavigator from './AuthNavigator';
import AppNavigator from './AppNavigator';
import Splash from '@/screens/Splash';
import {setUser} from '@/store/user.slice';
import {getConnection} from '@/utils';
import {COLLEAGUES, PROJECTS, TASKS} from '@/fakeData';
import {setColleagues} from '@/store/colleagues.slice';
import {setTasks} from '@/store/tasks.slice';
import {useProject} from '@/hooks/useProject';

const RootNavigator: React.FC = () => {
  const theme = useAppSelector(state => state.theme.theme);
  const {user} = useAppSelector(state => state.user);
  const dispatch = useAppDispatch();

  const {getProjectsFB} = useProject();

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

  useEffect(() => {
    getThemeStorage();
    initUser();
  }, []);

  useEffect(() => {
    // if (user) loadDatas(); // Online/Offline
    if (user) initDatas(); //Offline
  }, [user]);

  const loadDatas = useCallback(async () => {
    let projectsTemp = null,
      tasksTemp = null,
      colleaguesTemp = null;

    const isOnline = await getConnection();

    console.log(isOnline ? 'online' : 'offline');
    if (isOnline && auth().currentUser) {
      console.log('firebase');
      projectsTemp = await getProjectsFB(auth().currentUser!.uid);
    } else {
      console.log('local');
      projectsTemp = await getData('projects');
      tasksTemp = await getData('tasks');
      colleaguesTemp = await getData('colleagues');
    }

    dispatch(setProjects(projectsTemp));
    dispatch(setTasks(tasksTemp));
    setLoadingData(false);
    dispatch(setColleagues(colleaguesTemp));
  }, []);

  // Init data
  const initDatas = useCallback(async () => {
    const projectsTemp = await getData('projects');
    dispatch(setProjects(projectsTemp));

    const tasksTemp = await getData('tasks');
    dispatch(setTasks(tasksTemp));

    const colleaguesTemp = await getData('colleagues');
    dispatch(setColleagues(colleaguesTemp));

    setLoadingData(false);
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
