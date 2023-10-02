import {useEffect} from 'react';
import {IProject, ITask} from '@/types';
import firestore from '@react-native-firebase/firestore';
import {useAppSelector, useAppDispatch} from './useStore';
import {setProjects} from '@/store/projects.slice';
import {storeData} from './useAsyncStorage';
import {setTasks} from '@/store/tasks.slice';

export const useProject = () => {
  const dispatch = useAppDispatch();
  const {projects} = useAppSelector(state => state.projects);
  const {tasks} = useAppSelector(state => state.tasks);

  const createProject = async (project: IProject) => {
    try {
      const {id, ...datas} = project;
      await createProjectLocal(project);
      await firestore().collection('projects').doc(id).set(datas);
    } catch (error) {
      console.log(error);
    }
  };

  const updateProject = async (projectId: string, datas: Partial<IProject>) => {
    try {
      const {id, ...newDatas} = datas;
      await updateProjectLocal(projectId, newDatas);
      await firestore().collection('projects').doc(projectId).update(newDatas);
    } catch (error) {
      console.log(error);
    }
  };

  const updateProjectInfo = async (projectId: string, tasks: ITask[]) => {
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

    await updateProjectLocal(projectId, {
      totalTime,
      elapsedTime,
      totalTask,
      taskComplete,
    });
    await updateProject(projectId, {
      totalTime,
      elapsedTime,
      totalTask,
      taskComplete,
    });
  };

  const deleteProject = async (projectId: string) => {
    try {
      await deleteProjectLocal(projectId);
      await deleteTasksByProjectId(projectId);
      await firestore().collection('projects').doc(projectId).delete();
    } catch (error) {
      console.log(error);
    }
  };

  const deleteTasksByProjectId = async (projectId: string) => {
    try {
      await deleteTasksByProjectIdLocal(projectId);
      const batch = firestore().batch();
      if (tasks) {
        const deleteTasks = tasks.filter(item => item.projectId == projectId);
        deleteTasks.forEach(task => {
          batch.delete(firestore().collection('tasks').doc(task.id));
        });
      }
      await batch.commit();
    } catch (error) {
      console.log(error);
    }
  };

  const getProjectsFS = async (userId: string) => {
    try {
      const querySnapshot = await firestore()
        .collection('projects')
        .where('ownerId', '==', userId)
        .orderBy('createdAt', 'asc')
        .get();

      if (querySnapshot.empty) {
        return null;
      } else {
        const projects: IProject[] = [];
        querySnapshot.forEach(doc => {
          projects.push({
            id: doc.id,
            ...doc.data(),
          } as IProject);
        });
        return projects;
      }
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  const listenProjects = (dependency?: any) => {
    useEffect(() => {
      const subscriber = firestore()
        .collection('projects')
        .orderBy('createdAt', 'asc')
        .onSnapshot(async querySnapshot => {
          if (querySnapshot) {
            const projects: IProject[] = [];
            querySnapshot.forEach(doc => {
              projects.push({
                id: doc.id,
                ...doc.data(),
              } as IProject);
            });
            dispatch(setProjects(projects));
            await storeData('projects', projects);
          }
        });

      return () => subscriber();
    }, [dependency]);
  };

  // Local
  const createProjectLocal = async (project: IProject) => {
    let updatedProjects: IProject[];

    if (projects) {
      const check = projects.findIndex(item => item.id == project.id);

      updatedProjects = check == -1 ? [...projects, project] : projects;
    } else {
      updatedProjects = [project];
    }

    dispatch(setProjects(updatedProjects));
    await storeData('projects', updatedProjects);
  };

  const updateProjectLocal = async (
    projectId: string,
    datas: Partial<IProject>,
  ) => {
    if (projects) {
      const updatedProjects: IProject[] = projects.map(item => {
        return item.id == projectId ? {...item, ...datas} : item;
      });

      dispatch(setProjects(updatedProjects));
      await storeData('projects', updatedProjects);
    }
  };

  const updateProjectInfoLocal = async (projectId: string, tasks: ITask[]) => {
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

    updateProjectLocal(projectId, {
      totalTime,
      elapsedTime,
      totalTask,
      taskComplete,
    });
  };

  const deleteProjectLocal = async (projectId: string) => {
    if (projects) {
      const newProjects = projects.filter(item => item.id != projectId);

      dispatch(setProjects(newProjects));
      await storeData('projects', newProjects);
    }
  };

  const deleteTasksByProjectIdLocal = async (projectId: string) => {
    if (tasks) {
      const newTasks = tasks.filter(task => task.projectId != projectId);
      dispatch(setTasks(newTasks));
      await storeData('tasks', newTasks);
    }
  };

  return {
    listenProjects,
    createProject,
    updateProject,
    updateProjectInfo,
    deleteProject,
    getProjectsFS,
  };
};
