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
import Home from '@/screens/Home';
import Pomodoro from '@/screens/Pomodoro';
import Statistic from '@/screens/Statistic';
import Setting from '@/screens/Setting';
import ProjectNavigator from './ProjectNavigator';

const Tab = createBottomTabNavigator();

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
        name="Home"
        component={Home}
        options={{
          tabBarIcon: ({color}) => (
            <MaterialIcons name="home" size={28} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="ProjectsNav"
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
        name="Setting"
        component={Setting}
        options={{
          tabBarIcon: ({color}) => (
            <MaterialIcons name="settings" size={24} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default AppNavigator;

const styles = StyleSheet.create({});
