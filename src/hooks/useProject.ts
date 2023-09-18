import {IProject, ITask} from '@/types';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {useAppSelector, useAppDispatch} from './useStore';
import {setProjects} from '@/store/projects.slice';

export const useProject = () => {
  const dispatch = useAppDispatch();
  const {projects} = useAppSelector(state => state.projects);

  const addProjectFB = async (name: string, color: string) => {
    try {
      firestore()
        .collection('projects')
        .add({
          name,
          color,
          totalTime: 0,
          elapsedTime: 0,
          totalTask: 0,
          taskComplete: 0,
          ownerId: auth().currentUser!.uid,
          createdAt: firestore.Timestamp.fromDate(new Date()),
        });
    } catch (error) {
      console.log(error);
    }
  };

  const getProjectsFB = async (userId: string) => {
    try {
      const querySnapshot = await firestore()
        .collection('projects')
        .where('ownerId', '==', userId)
        .orderBy('createdAt', 'asc')
        .get();

      if (querySnapshot.empty) {
        return null;
      } else {
        const comments: IProject[] = [];
        querySnapshot.forEach(doc => {
          comments.push({
            id: doc.id,
            ...doc.data(),
          } as IProject);
        });
        return comments;
      }
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  // Local
  const createProject = (project: IProject) => {
    let updatedProjects: IProject[];

    if (projects) {
      const check = projects.findIndex(item => item.id == project.id);

      updatedProjects = check == -1 ? [...projects, project] : projects;
    } else {
      updatedProjects = [project];
    }

    dispatch(setProjects(updatedProjects));
  };

  const updateProject = (project: IProject) => {
    if (projects) {
      const updatedProjects: IProject[] = projects.map(item => {
        return item.id == project.id ? project : item;
      });

      dispatch(setProjects(updatedProjects));
    }
  };

  const updateProjectById = (projectId: string, datas: Partial<IProject>) => {
    if (projects) {
      const updatedProjects: IProject[] = projects.map(item => {
        if (item.id == projectId) {
          return {
            ...item,
            ...datas,
          } as IProject;
        } else {
          return item;
        }
      });

      dispatch(setProjects(updatedProjects));
    }
  };

  const updateProjectInfo = (projectId: string, tasks: ITask[]) => {
    let totalTime = 0,
      elapsedTime = 0,
      totalTask = 0,
      taskComplete = 0;

    tasks.forEach(task => {
      if (task.projectId == projectId) {
        totalTime += task.totalPomodoro * task.longBreak;
        totalTask++;
        elapsedTime += task.pomodoroCount * task.longBreak;
        if (task.isDone) taskComplete++;
      }
    });

    updateProjectById(projectId, {
      totalTime,
      elapsedTime,
      totalTask,
      taskComplete,
    });
  };

  return {
    addProjectFB,
    getProjectsFB,
    createProject,
    updateProject,
    updateProjectById,
    updateProjectInfo,
  };
};
