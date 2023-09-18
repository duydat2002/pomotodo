import React from 'react';
import {StyleSheet} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Projects from '@/screens/Projects/Projects';
import Tasks from '@/screens/Projects/Tasks';
import CreateTask from '@/screens/Projects/CreateTask';
import CreateProject from '@/screens/Projects/CreateProject';
import {ProjectsStackParamList} from '@/types';
import JoinTask from '@/screens/Projects/JoinTask';

const Stack = createNativeStackNavigator<ProjectsStackParamList>();

const ProjectNavigator = () => {
  const config = {
    animation: 'spring',
    config: {
      stiffness: 1000,
      damping: 500,
      mass: 3,
      overshootClamping: true,
      restDisplacementThreshold: 0.01,
      restSpeedThreshold: 0.01,
    },
  };
  return (
    <Stack.Navigator
      initialRouteName="Projects"
      screenOptions={{
        headerShown: false,
        transitionSpec: {
          open: config,
          close: config,
        },
      }}>
      <Stack.Screen name="Projects" component={Projects} options={{}} />
      <Stack.Screen name="Tasks" component={Tasks} />
      <Stack.Screen name="CreateTask" component={CreateTask} />
      <Stack.Screen name="CreateProject" component={CreateProject} />
      <Stack.Screen name="JoinTask" component={JoinTask} />
    </Stack.Navigator>
  );
};

export default ProjectNavigator;

const styles = StyleSheet.create({});
