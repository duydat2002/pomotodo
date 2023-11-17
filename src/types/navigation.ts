import type {
  CompositeScreenProps,
  NavigatorScreenParams,
} from '@react-navigation/native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {ITask} from './task';
import {IProject} from './project';

// Auth
export type AuthStackParamList = {
  LetsIn: undefined;
  SignIn: undefined;
  SignUp: undefined;
};

export type AuthStackScreenProps<T extends keyof AuthStackParamList> =
  NativeStackScreenProps<AuthStackParamList, T>;

// App
export type AppStackParamList = {
  HomeStack: NavigatorScreenParams<HomeStackParamList>;
  ProjectsStack: NavigatorScreenParams<ProjectsStackParamList>;
  Pomodoro: {task: ITask} | undefined;
  Statistic: undefined;
  SettingStack: NavigatorScreenParams<SettingStackParamList>;
};

export type AppStackScreenProps<T extends keyof AppStackParamList> =
  NativeStackScreenProps<AppStackParamList, T>;

// Home
export type HomeStackParamList = {
  Home: undefined;
  Notification: undefined;
  Colleagues: undefined;
  JoinColleague: undefined;
};

export type HomeStackScreenProps<T extends keyof HomeStackParamList> =
  CompositeScreenProps<
    BottomTabScreenProps<HomeStackParamList, T>,
    AppStackScreenProps<keyof AppStackParamList>
  >;

// Project
export type ProjectsStackParamList = {
  Projects: undefined;
  Tasks: {projectId: string};
  CreateTask: {projectId: string; taskId: string | null};
  CreateProject: {projectId: string} | undefined;
};

export type ProjectsStackScreenProps<T extends keyof ProjectsStackParamList> =
  CompositeScreenProps<
    BottomTabScreenProps<ProjectsStackParamList, T>,
    AppStackScreenProps<keyof AppStackParamList>
  >;

// Setting
export type SettingStackParamList = {
  Setting: undefined;
  Profile: undefined;
};

export type SettingStackScreenProps<T extends keyof SettingStackParamList> =
  CompositeScreenProps<
    BottomTabScreenProps<SettingStackParamList, T>,
    AppStackScreenProps<keyof AppStackParamList>
  >;
