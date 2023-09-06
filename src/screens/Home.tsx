import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {FontAwesome} from '@expo/vector-icons';
import auth from '@react-native-firebase/auth';
import {setUser} from '@/store/user.slice';
import {deleteAllData, useAppDispatch} from '@/hooks';

const Home: React.FC = () => {
  const dispatch = useAppDispatch();

  const test = async () => {
    if (auth().currentUser) {
      await auth().signOut();
    }
    await deleteAllData(['theme', 'netInfo']);
    dispatch(setUser(null));
  };

  return (
    <View>
      <Text>Home các</Text>
      <FontAwesome name="chevron-left" />
      <Text>cac</Text>
      <Pressable onPress={test}>
        <Text>Sign out</Text>
      </Pressable>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({});
