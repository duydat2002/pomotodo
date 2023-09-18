import type {
  CompositeScreenProps,
  NavigatorScreenParams,
} from '@react-navigation/native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {ITask} from './task';

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
  Home: undefined;
  ProjectsStack: NavigatorScreenParams<ProjectsStackParamList>;
  Pomodoro: {task: ITask} | undefined;
  Statistic: undefined;
  Setting: undefined;
};

export type AppStackScreenProps<T extends keyof AppStackParamList> =
  NativeStackScreenProps<AppStackParamList, T>;

// Project
export type ProjectsStackParamList = {
  Projects: undefined;
  Tasks: {projectId: string};
  CreateTask: {projectId: string; task: ITask | null};
  CreateProject: undefined;
  JoinTask: undefined;
};

export type ProjectsStackScreenProps<T extends keyof ProjectsStackParamList> =
  CompositeScreenProps<
    BottomTabScreenProps<ProjectsStackParamList, T>,
    AppStackScreenProps<keyof AppStackParamList>
  >;
