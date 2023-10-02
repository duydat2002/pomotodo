import React from 'react';
import {StyleSheet, KeyboardAvoidingView} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {HomeStackParamList} from '@/types';
import Home from '@/screens/Home/Home';
import Notification from '@/screens/Home/Notification';
import Colleagues from '@/screens/Home/Colleagues';

const Stack = createNativeStackNavigator<HomeStackParamList>();

const HomeNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Notification" component={Notification} />
      <Stack.Screen name="Colleagues" component={Colleagues} />
    </Stack.Navigator>
  );
};

export default HomeNavigator;

const styles = StyleSheet.create({});
