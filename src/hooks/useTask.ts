import {useEffect} from 'react';
import {IProject, ITask} from '@/types';
import {useAppDispatch, useAppSelector} from './useStore';
import {setTasks} from '@/store/tasks.slice';
import {useProject} from '@/hooks/useProject';
import firestore from '@react-native-firebase/firestore';
import {storeData} from './useAsyncStorage';
import {ITaskLike} from '@/types/taskLike';

export const useTask = () => {
  const dispatch = useAppDispatch();
  const {user} = useAppSelector(state => state.user);
  const {projects} = useAppSelector(state => state.projects);
  const {tasks} = useAppSelector(state => state.tasks);
  const {updateProjectInfo} = useProject();

  // Firebase
  const getTasksByProjects = async (projects: IProject[] | null) => {
    try {
      if (projects) {
        const projectsIds = projects.map(item => item.id);

        const querySnapshot = await firestore()
          .collection('tasks')
          .where('projectId', 'in', projectsIds || [''])
          .orderBy('createdAt', 'asc')
          .get();

        if (querySnapshot.empty) {
          return null;
        } else {
          const tasks: ITask[] = [];
          querySnapshot.forEach(doc => {
            tasks.push({
              id: doc.id,
              ...doc.data(),
            } as ITask);
          });
          return tasks;
        }
      } else {
        return null;
      }
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  const getTasksByProjectId = async (projectId: string) => {
    try {
      const querySnapshot = await firestore()
        .collection('tasks')
        .where('projectId', '==', projectId)
        .orderBy('createdAt', 'asc')
        .get();

      if (querySnapshot.empty) {
        return null;
      } else {
        const tasks: ITask[] = [];
        querySnapshot.forEach(doc => {
          tasks.push({
            id: doc.id,
            ...doc.data(),
          } as ITask);
        });
        return tasks;
      }
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  const createTask = async (task: ITask) => {
    try {
      const {id, ...datas} = task;
      createTaskLocal(task);
      await firestore().collection('tasks').doc(id).set(datas);
      const newTasks = tasks ? [...tasks, task] : [task];
      updateProjectInfo(task.projectId!, newTasks!);
    } catch (error) {
      console.log(error);
    }
  };

  const createTaskLike = async (taskLike: Partial<ITaskLike>) => {
    try {
      const {id, ...datas} = taskLike;
      await firestore().collection('taskLikes').add(datas);
    } catch (error) {
      console.log(error);
    }
  };

  const getTaskLikes = async (userId: string) => {
    try {
      const querySnapshot = await firestore()
        .collection('taskLikes')
        .where('userId', '==', userId)
        .get();

      if (querySnapshot.empty) {
        return null;
      } else {
        const taskLikes: ITaskLike[] = [];
        querySnapshot.forEach(doc => {
          taskLikes.push({
            id: doc.id,
            ...doc.data(),
          } as ITaskLike);
        });
        return taskLikes;
      }
    } catch (error) {
      console.log(error);
    }
  };

  const updateTask = async (taskId: string, datas: Partial<ITask>) => {
    try {
      const {id, ...newDatas} = datas;
      const updatedTasks = updateTaskLocal(taskId, newDatas);

      if (updatedTasks) {
        await updateProjectInfo(datas.projectId!, updatedTasks);
      }
      await firestore().collection('tasks').doc(taskId).update(newDatas);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteTask = async (taskId: string) => {
    try {
      deleteTaskLocal(taskId);
      await firestore().collection('tasks').doc(taskId).delete();
    } catch (error) {
      console.log(error);
    }
  };

  const listenTasks = (dependency: any) => {
    useEffect(() => {
      if (projects) {
        let projectsIds = projects?.map(item => item.id) || null;
        projectsIds =
          projectsIds && projectsIds.length > 0 ? projectsIds : [''];

        const subscriber = firestore()
          .collection('tasks')
          .where('projectId', 'in', projectsIds)
          .orderBy('createdAt', 'asc')
          .onSnapshot(async querySnapshot => {
            if (querySnapshot) {
              const tasks: ITask[] = [];
              querySnapshot.forEach(doc => {
                tasks.push({
                  id: doc.id,
                  ...doc.data(),
                } as ITask);
              });
              dispatch(setTasks(tasks));
              await storeData('tasks', tasks);
            }
          });

        return () => subscriber();
      }
    }, [dependency]);
  };

  const listenTasksByProjectId = (projectId: string) => {
    useEffect(() => {
      const subscriber = firestore()
        .collection('tasks')
        .where('projectId', '==', projectId)
        .orderBy('createdAt', 'asc')
        .onSnapshot(async querySnapshot => {
          if (!querySnapshot) {
            console.log('no');
            return null;
          } else {
            console.log('yes');
            const tasks: ITask[] = [];
            querySnapshot.forEach(doc => {
              tasks.push({
                id: doc.id,
                ...doc.data(),
              } as ITask);
            });
            dispatch(setTasks(tasks));
            await storeData('tasks', tasks);
          }
        });

      return () => subscriber();
    }, [projectId]);
  };

  // Local
  const createTaskLocal = async (task: ITask) => {
    let updatedTasks: ITask[];

    if (tasks) {
      const check = tasks.findIndex(item => item.id == task.id);

      updatedTasks = check == -1 ? [...tasks, task] : tasks;
    } else {
      updatedTasks = [task];
    }

    dispatch(setTasks(updatedTasks));
    await storeData('tasks', updatedTasks);
  };

  const updateTaskLocal = (taskId: string, datas: Partial<ITask>) => {
    if (tasks) {
      const updatedTasks: ITask[] = tasks.map(item => {
        return item.id == taskId ? {...item, ...datas} : item;
      });

      dispatch(setTasks(updatedTasks));
      storeData('tasks', updatedTasks);
      return updatedTasks;
    } else {
      return null;
    }
  };

  const deleteTaskLocal = async (taskId: string) => {
    if (tasks) {
      const projectId = tasks.find(task => task.id == taskId)?.projectId;

      const newTasks = tasks.filter(item => item.id != taskId);

      if (projectId) {
        await updateProjectInfo(projectId, newTasks);
      }

      dispatch(setTasks(newTasks));
      await storeData('tasks', newTasks);
    }
  };

  return {
    getTasksByProjects,
    getTasksByProjectId,
    createTask,
    updateTask,
    deleteTask,
    listenTasks,
    listenTasksByProjectId,
    createTaskLike,
    getTaskLikes,
  };
};
