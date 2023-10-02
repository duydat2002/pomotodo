import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {FontAwesome} from '@expo/vector-icons';
import auth from '@react-native-firebase/auth';
import {setUser} from '@/store/user.slice';
import {
  deleteAllData,
  getData,
  useActivedColors,
  useAppDispatch,
} from '@/hooks';
import SafeView from '@/components/Layout/SafeView';

const Setting: React.FC = () => {
  const activedColors = useActivedColors();
  const dispatch = useAppDispatch();

  const logout = async () => {
    if (auth().currentUser) {
      await auth().signOut();
    }
    await deleteAllData(['theme', 'netInfo']);
    dispatch(setUser(null));
  };

  const reset = async () => {
    console.log('reset');
    await deleteAllData(['theme', 'netInfo']);
    dispatch(setUser(null));
  };

  const logall = async () => {
    console.log('logall');
    const [user, projects, tasks, colleagues] = await Promise.all([
      getData('user'),
      getData('projects'),
      getData('tasks'),
      getData('colleagues'),
    ]);
    console.log('user', user);
    console.log('projects', projects);
    console.log('tasks', tasks);
    console.log('colleagues', colleagues);
  };

  return (
    <SafeView>
      <Text style={{color: activedColors.text}}>Setting</Text>
      <FontAwesome name="chevron-left" />
      <Text style={{color: activedColors.text}}>cac</Text>
      <Pressable onPress={logout}>
        <Text style={{color: activedColors.text}}>Sign out</Text>
      </Pressable>
      <Pressable onPress={reset} style={{marginTop: 40}}>
        <Text style={{color: activedColors.text}}>Reset all</Text>
      </Pressable>
      <Pressable onPress={logall} style={{marginTop: 40}}>
        <Text style={{color: activedColors.text}}>Log all</Text>
      </Pressable>
    </SafeView>
  );
};

export default Setting;

const styles = StyleSheet.create({});
