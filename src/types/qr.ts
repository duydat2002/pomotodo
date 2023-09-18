import {IProject} from './project';
import {ITask} from './task';
import {IUser} from './user';

export interface IQR {
  id: string;
  project: IProject;
  task: ITask;
  owner: IUser;
}
