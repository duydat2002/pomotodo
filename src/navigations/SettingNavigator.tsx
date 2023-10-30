import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {SettingStackParamList} from '@/types';
import Setting from '@/screens/Setting/Setting';
import Profile from '@/screens/Setting/Profile';

const Stack = createNativeStackNavigator<SettingStackParamList>();

const SettingNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Setting"
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="Setting" component={Setting} />
      <Stack.Screen name="Profile" component={Profile} />
    </Stack.Navigator>
  );
};

export default SettingNavigator;

const styles = StyleSheet.create({});
