import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import LetsIn from '@/screens/Auth/LetsIn';
import SignIn from '@/screens/Auth/SignIn';
import SignUp from '@/screens/Auth/SignUp';

const Stack = createNativeStackNavigator();

const AuthNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="LetsIn"
      screenOptions={{headerShown: false, animation: 'none'}}>
      <Stack.Screen name="LetsIn" component={LetsIn} />
      <Stack.Screen name="SignIn" component={SignIn} />
      <Stack.Screen name="SignUp" component={SignUp} />
    </Stack.Navigator>
  );
};

export default AuthNavigator;
