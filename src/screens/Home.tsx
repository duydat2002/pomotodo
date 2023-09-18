import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {FontAwesome} from '@expo/vector-icons';
import auth from '@react-native-firebase/auth';
import {setUser} from '@/store/user.slice';
import {deleteAllData, useActivedColors, useAppDispatch} from '@/hooks';
import SafeView from '@/components/Layout/SafeView';

const Home: React.FC = () => {
  const activedColors = useActivedColors();
  const dispatch = useAppDispatch();

  const logout = async () => {
    if (auth().currentUser) {
      await auth().signOut();
    }
    // await deleteAllData(['theme', 'netInfo']);
    dispatch(setUser(null));
  };

  const reset = async () => {
    console.log('reset');
    await deleteAllData(['theme', 'netInfo']);
    dispatch(setUser(null));
  };

  return (
    <SafeView>
      <Text style={{color: activedColors.text}}>Home</Text>
      <FontAwesome name="chevron-left" />
      <Text style={{color: activedColors.text}}>cac</Text>
      <Pressable onPress={logout}>
        <Text style={{color: activedColors.text}}>Sign out</Text>
      </Pressable>
      <Pressable onPress={reset} style={{marginTop: 40}}>
        <Text style={{color: activedColors.text}}>Reset all</Text>
      </Pressable>
    </SafeView>
  );
};

export default Home;

const styles = StyleSheet.create({});
