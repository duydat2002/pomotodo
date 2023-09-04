import React from 'react';
import {KeyboardAvoidingView} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import LetsIn from '@/screens/Auth/LetsIn';
import SignIn from '@/screens/Auth/SignIn';
import SignUp from '@/screens/Auth/SignUp';

const Stack = createNativeStackNavigator();

const AuthNavigator: React.FC = () => {
  return (
    <KeyboardAvoidingView style={{flex: 1}} behavior="height" enabled={false}>
      <Stack.Navigator
        initialRouteName="LetsIn"
        screenOptions={{headerShown: false, animation: 'none'}}>
        <Stack.Screen name="LetsIn" component={LetsIn} />
        <Stack.Screen name="SignIn" component={SignIn} />
        <Stack.Screen name="SignUp" component={SignUp} />
      </Stack.Navigator>
    </KeyboardAvoidingView>
  );
};

export default AuthNavigator;
