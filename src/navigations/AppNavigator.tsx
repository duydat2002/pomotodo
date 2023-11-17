import React from 'react';
import {StyleSheet} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {getFocusedRouteNameFromRoute} from '@react-navigation/native';
import {
  FontAwesome,
  MaterialIcons,
  MaterialCommunityIcons,
} from '@expo/vector-icons';
import {useActivedColors} from '@/hooks';
import {HIDDEN_BOTTOM_TAB_ROUTER} from '@/constants';
import Pomodoro from '@/screens/Pomodoro';
import Statistic from '@/screens/Statistic/Statistic';
import ProjectNavigator from './ProjectNavigator';
import {AppStackParamList} from '@/types';
import HomeNavigator from './HomeNavigator';
import SettingNavigator from './SettingNavigator';

const Tab = createBottomTabNavigator<AppStackParamList>();

const getTabBarVisibility = (route: any) => {
  const routeName = getFocusedRouteNameFromRoute(route) ?? 'Projects';

  if (HIDDEN_BOTTOM_TAB_ROUTER.includes(routeName)) {
    return 'none';
  }
  return 'flex';
};

const AppNavigator: React.FC = () => {
  const activedColors = useActivedColors();

  return (
    <Tab.Navigator
      backBehavior="initialRoute"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: activedColors.primaryDark,
        tabBarStyle: {
          backgroundColor: activedColors.background,
          paddingTop: 5,
          height: 60,
          borderTopWidth: 0,
        },
        tabBarLabelStyle: {
          paddingBottom: 5,
        },
      }}>
      <Tab.Screen
        name="HomeStack"
        component={HomeNavigator}
        options={({route}) => ({
          tabBarStyle: {
            display: getTabBarVisibility(route),
            backgroundColor: activedColors.background,
            paddingTop: 5,
            height: 60,
            borderTopWidth: 0,
          },
          tabBarLabel: 'Home',
          tabBarIcon: ({color}) => (
            <MaterialIcons name="home" size={28} color={color} />
          ),
        })}
      />
      <Tab.Screen
        name="ProjectsStack"
        component={ProjectNavigator}
        options={({route}) => ({
          tabBarStyle: {
            display: getTabBarVisibility(route),
            backgroundColor: activedColors.background,
            paddingTop: 5,
            height: 60,
            borderTopWidth: 0,
          },
          tabBarLabel: 'Projects',
          tabBarIcon: ({color}) => (
            <FontAwesome name="tasks" size={20} color={color} />
          ),
        })}
      />
      <Tab.Screen
        name="Pomodoro"
        component={Pomodoro}
        options={{
          tabBarIcon: ({color}) => (
            <MaterialCommunityIcons
              name="clock-outline"
              size={25}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Statistic"
        component={Statistic}
        options={{
          tabBarIcon: ({color}) => (
            <FontAwesome name="pie-chart" size={22} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="SettingStack"
        component={SettingNavigator}
        options={({route}) => ({
          tabBarStyle: {
            display: getTabBarVisibility(route),
            backgroundColor: activedColors.background,
            paddingTop: 5,
            height: 60,
            borderTopWidth: 0,
          },
          tabBarLabel: 'settings',
          tabBarIcon: ({color}) => (
            <MaterialIcons name="settings" size={24} color={color} />
          ),
        })}
      />
    </Tab.Navigator>
  );
};

export default AppNavigator;

const styles = StyleSheet.create({});
