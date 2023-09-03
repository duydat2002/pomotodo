import React from 'react';
import {StyleSheet} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Projects from '@/screens/Projects/Projects';
import Tasks from '@/screens/Projects/Tasks';
import CreateTask from '@/screens/Projects/CreateTask';

const Stack = createNativeStackNavigator();

const ProjectNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Projects"
      screenOptions={{headerShown: false, animation: 'none'}}>
      <Stack.Screen name="Projects" component={Projects} />
      <Stack.Screen name="Tasks" component={Tasks} />
      <Stack.Screen name="CreateTask" component={CreateTask} />
    </Stack.Navigator>
  );
};

export default ProjectNavigator;

const styles = StyleSheet.create({});
