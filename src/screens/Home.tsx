import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {FontAwesome} from '@expo/vector-icons';
import auth from '@react-native-firebase/auth';

const Home: React.FC = () => {
  const test = async () => {
    await auth().signOut();
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
