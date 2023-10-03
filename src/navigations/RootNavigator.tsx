import React, {useEffect, useState, useCallback} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {Appearance} from 'react-native';
import {getData, storeData, useAppDispatch, useAppSelector} from '@/hooks';
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
import {useTask} from '@/hooks/useTask';
import {ITask} from '@/types';
import firestore from '@react-native-firebase/firestore';
import {useColleague} from '@/hooks/useColleague';
import {useNotification} from '@/hooks/useNotification';
import {setNotifications} from '@/store/notifications.slice';
import {useUser} from '@/hooks/useUser';

const RootNavigator: React.FC = () => {
  const theme = useAppSelector(state => state.theme.theme);
  const {user} = useAppSelector(state => state.user);
  const {projects} = useAppSelector(state => state.projects);
  const {tasks} = useAppSelector(state => state.tasks);
  const dispatch = useAppDispatch();

  const {getUser} = useUser();
  const {getProjectsFS, listenProjects} = useProject();
  const {getTasksByProjects, listenTasks} = useTask();
  const {getColleaguesFS, listenColleagues} = useColleague();
  const {getNotificationsFS, listenNotifications} = useNotification();

  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingData, setLoadingData] = useState(true);
  const [isOnline, setIsOnline] = useState(false);

  // Listen notifications
  listenNotifications(user);
  listenColleagues(user);
  listenProjects(user);
  listenTasks(projects);

  // useEffect(() => {
  //   console.log('chạy zo useEffect');
  //   let subscriber = () => {};
  //   if (projects) {
  //     const projectsIds = projects.map(item => item.id);

  //     subscriber = firestore()
  //       .collection('tasks')
  //       .where('projectId', 'in', projectsIds)
  //       .orderBy('createdAt', 'asc')
  //       .onSnapshot(async querySnapshot => {
  //         console.log('querySnapshot');
  //         if (querySnapshot) {
  //           console.log('changed');
  //           const tasks: ITask[] = [];
  //           querySnapshot.forEach(doc => {
  //             tasks.push({
  //               id: doc.id,
  //               ...doc.data(),
  //             } as ITask);
  //           });
  //           dispatch(setTasks(tasks));
  //           await storeData('tasks', tasks);
  //         }
  //       });
  //   }
  //   return () => subscriber();
  // }, [projects]);

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
      console.log('isConnected', state.isConnected);
      setIsOnline(state.isConnected!);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // User
  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(async user => {
      if (user) {
        const userTemp = await getUser(user?.uid);
        dispatch(setUser(userTemp));
      }
    });
    return subscriber;
  }, []);

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
    if (user) loadDatas(); // Online/Offline
    // if (user) initDatas(); //Offline
  }, [user]);

  const loadDatas = useCallback(async () => {
    let projectsTemp = null,
      tasksTemp = null,
      colleaguesTemp = null,
      notificationsTemp = null;

    const isOnline = await getConnection();

    console.log(isOnline ? 'online' : 'offline');
    if (isOnline && auth().currentUser) {
      console.log('firebase');
      colleaguesTemp = await getColleaguesFS(auth().currentUser?.uid!);
      projectsTemp = await getProjectsFS(auth().currentUser!.uid);
      tasksTemp = await getTasksByProjects(projectsTemp);
      notificationsTemp = await getNotificationsFS(auth().currentUser?.uid!);
    } else {
      console.log('local');
      colleaguesTemp = await getData('colleagues');
      projectsTemp = await getData('projects');
      tasksTemp = await getData('tasks');
      notificationsTemp = await getData('notifications');
    }

    // Redux
    dispatch(setProjects(projectsTemp));
    dispatch(setTasks(tasksTemp));
    dispatch(setColleagues(colleaguesTemp));
    dispatch(setNotifications(notificationsTemp));

    // AsyncStorage
    const promises = [];
    if (projectsTemp) promises.push(storeData('projects', projectsTemp));
    if (tasksTemp) promises.push(storeData('tasks', tasksTemp));
    if (colleaguesTemp) promises.push(storeData('colleagues', colleaguesTemp));
    if (notificationsTemp)
      promises.push(storeData('notifications', notificationsTemp));
    Promise.all(promises);

    setLoadingData(false);
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
